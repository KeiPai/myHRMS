/**
 * Auth Controller for Hrm API
 * Handles HTTP requests for token exchange
 * Delegates business logic to AuthService
 */

import { controller, post, BaseController, inject, HTTP } from '@venizia/ignis';
import type { Context } from 'hono';
import { AuthService } from '../services/auth.service';
import { AppError, ErrorCode } from '../errors/app.errors';
import { validateBody, zEmail } from '../utils/validation';
import { createRequestLogger } from '../utils/logger';
import { z } from 'zod';

const BASE_URL = '/auth';

const tokenExchangeBodySchema = z.object({
  keycloakToken: z.string().min(1, 'Keycloak token is required'),
});

const loginBodySchema = z.object({
  email: zEmail('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const requestPasswordResetBodySchema = z.object({
  email: zEmail('Invalid email address'),
});

const confirmPasswordResetBodySchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Auth Controller
 * Handles authentication and token exchange
 */
@controller({ path: BASE_URL })
export class AuthController extends BaseController {
  constructor(
    @inject({ key: 'services.AuthService' })
    private authService: AuthService,
  ) {
    super({ scope: AuthController.name, path: BASE_URL });
  }

  override binding(): void {
    // Route bindings are handled by decorators
  }

  /**
   * POST /api/auth/exchange
   * Exchange Keycloak token for Hrm JWT token
   * Hrm generates its own JWT token based on Keycloak token verification
   */
  @post({
    configs: {
      path: '/exchange',
      method: 'post',
      request: {
        body: {
          content: {
            'application/json': {
              schema: tokenExchangeBodySchema,
            },
          },
          required: true,
        },
      },
      responses: {
        [HTTP.ResultCodes.RS_2.Ok]: {
          description: 'Token exchanged successfully',
          content: {
            'application/json': {
              schema: z.object({
                access_token: z.string(),
                expires_in: z.number(),
                token_type: z.string(),
              }),
            },
          },
        },
        [HTTP.ResultCodes.RS_4.Unauthorized]: {
          description: 'Token exchange failed',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
                message: z.string().optional(),
              }),
            },
          },
        },
      },
    },
  })
  async exchangeToken(c: Context) {
    const logger = createRequestLogger(AuthController.name, c);
    
    try {
      // Validate request body
      const body = await validateBody<{ keycloakToken: string }>(c, tokenExchangeBodySchema);
      
      logger.info('[AuthController] Token exchange requested', {
        hasKeycloakToken: !!body.keycloakToken,
        tokenLength: body.keycloakToken.length,
      });

      // Exchange token: verify Keycloak locally and issue Hrm JWT (no Shell call)
      const result = await this.authService.exchangeTokenFromKeycloak(body.keycloakToken);

      return c.json(result);
    } catch (error: any) {
      logger.error('[AuthController] Token exchange error', {
        error: error.message,
        stack: error.stack,
      });
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        ErrorCode.AUTHENTICATION_ERROR,
        'Failed to exchange token: ' + (error.message || 'Unknown error'),
        401
      );
    }
  }

  /**
   * POST /api/auth/login
   * Local login with email and password
   * Proxies to Shell API /api/auth/local-login
   */
  @post({
    configs: {
      path: '/login',
      request: {
        body: {
          content: {
            'application/json': {
              schema: loginBodySchema,
            },
          },
          required: true,
        },
      },
      responses: {
        [HTTP.ResultCodes.RS_2.Ok]: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: z.object({
                accessToken: z.string(),
                refreshToken: z.string(),
                expiresIn: z.number(),
                tokenType: z.string(),
                user: z.object({
                  id: z.string(),
                  email: z.string(),
                  name: z.string().optional(),
                }),
              }),
            },
          },
        },
        [HTTP.ResultCodes.RS_4.Unauthorized]: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: z.object({
                error: z.object({
                  code: z.string(),
                  message: z.string(),
                }),
              }),
            },
          },
        },
      },
    },
  })
  async login(c: Context) {
    const logger = createRequestLogger(AuthController.name, c);

    try {
      const body = await validateBody(c, loginBodySchema);

      logger.info('[AuthController] Login requested', { email: body.email });

      const result = await this.authService.login(body.email, body.password);

      return c.json(result);
    } catch (error: any) {
      logger.error('[AuthController] Login error', { error: error.message });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ErrorCode.AUTHENTICATION_ERROR,
        error.message || 'Login failed',
        401
      );
    }
  }

  /**
   * POST /api/auth/request-password-reset
   * Request password reset (forgot password)
   */
  @post({
    configs: {
      path: '/request-password-reset',
      request: {
        body: {
          content: {
            'application/json': {
              schema: requestPasswordResetBodySchema,
            },
          },
          required: true,
        },
      },
      responses: {
        [HTTP.ResultCodes.RS_2.Ok]: {
          description: 'Password reset requested successfully',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean() }),
            },
          },
        },
        [HTTP.ResultCodes.RS_4.BadRequest]: {
          description: 'Invalid email',
          content: {
            'application/json': {
              schema: z.object({
                error: z.object({
                  code: z.string(),
                  message: z.string(),
                }),
              }),
            },
          },
        },
      },
    },
  })
  async requestPasswordReset(c: Context) {
    const logger = createRequestLogger(AuthController.name, c);

    try {
      const body = await validateBody(c, requestPasswordResetBodySchema);

      logger.info('[AuthController] Password reset requested', { email: body.email });

      await this.authService.requestPasswordReset(body.email);

      return c.json({ success: true });
    } catch (error: any) {
      logger.error('[AuthController] Password reset error', { error: error.message });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ErrorCode.BAD_REQUEST,
        error.message || 'Failed to request password reset',
        400
      );
    }
  }

  /**
   * POST /api/auth/confirm-password-reset
   * Confirm password reset with token
   */
  @post({
    configs: {
      path: '/confirm-password-reset',
      request: {
        body: {
          content: {
            'application/json': {
              schema: confirmPasswordResetBodySchema,
            },
          },
          required: true,
        },
      },
      responses: {
        [HTTP.ResultCodes.RS_2.Ok]: {
          description: 'Password reset confirmed',
          content: {
            'application/json': {
              schema: z.object({ success: z.boolean() }),
            },
          },
        },
        [HTTP.ResultCodes.RS_4.BadRequest]: {
          description: 'Invalid or expired token',
          content: {
            'application/json': {
              schema: z.object({
                error: z.object({
                  code: z.string(),
                  message: z.string(),
                }),
              }),
            },
          },
        },
      },
    },
  })
  async confirmPasswordReset(c: Context) {
    const logger = createRequestLogger(AuthController.name, c);

    try {
      const body = await validateBody(c, confirmPasswordResetBodySchema);

      logger.info('[AuthController] Password reset confirmation requested');

      await this.authService.confirmPasswordReset(body.token, body.newPassword);

      return c.json({ success: true });
    } catch (error: any) {
      logger.error('[AuthController] Password reset confirmation error', { error: error.message });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ErrorCode.BAD_REQUEST,
        error.message || 'Failed to confirm password reset',
        400
      );
    }
  }
}
