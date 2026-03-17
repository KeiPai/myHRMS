import { z } from 'zod';

/**
 * Create a filter query schema with filter, sort, and pagination
 * @param filterSchema - Zod schema for filter parameters
 * @param sortSchema - Zod schema for sort parameters (optional, defaults to filterSchema)
 * @returns Combined schema with filter, sort, page, limit, and offset parameters
 */
export function createFilterSchema<TFilter extends z.ZodTypeAny>(
  filterSchema: TFilter,
) {
  return z.object({
    where: filterSchema.optional(),
    sort: z.object({
      field: z.string(),
      order: z.enum(['asc', 'desc']),
    }).optional(),
    page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default(1),
    limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional().default(20),
    offset: z.string().transform(Number).pipe(z.number().int().nonnegative()).optional(),
  });
}

/**
 * Type helper for filter query parameters
 */
export type TFilterQuery<TFilter extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof createFilterSchema<TFilter>>
>;

/**
 * Helper to create a filter query schema from a Zod schema
 * This allows using TFilterQuery<T> syntax by providing the schema
 */
export function getFilterQuerySchema<TFilter extends z.ZodTypeAny>(
  filterSchema: TFilter,
): ReturnType<typeof createFilterSchema<TFilter>> {
  return createFilterSchema(filterSchema);
}

/**
 * Helper type to create TFilterQuery from a TypeScript type
 * Usage: TFilterQueryFromType<T> where T is a TypeScript type
 * Note: This requires a corresponding filter schema to be created
 */
export type TFilterQueryFromType<TFilter extends z.ZodTypeAny> = TFilterQuery<TFilter>;
