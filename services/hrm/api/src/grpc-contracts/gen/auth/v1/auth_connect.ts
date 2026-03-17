// @generated from auth/v1/auth.proto - AuthService Connect definition
// Embedded in remote app - sync with packages/grpc-contracts when proto changes

import { ExchangeTokenRequest, ExchangeTokenResponse, VerifyTokenRequest, VerifyTokenResponse } from "./auth_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

export const AuthService = {
  typeName: "auth.v1.AuthService",
  methods: {
    exchangeToken: {
      name: "ExchangeToken",
      I: ExchangeTokenRequest,
      O: ExchangeTokenResponse,
      kind: MethodKind.Unary,
    },
    verifyToken: {
      name: "VerifyToken",
      I: VerifyTokenRequest,
      O: VerifyTokenResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
