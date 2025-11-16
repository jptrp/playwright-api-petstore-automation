import { z } from 'zod';

/**
 * Zod schemas for Petstore API response validation
 */

// Category schema
export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});

// Tag schema
export const TagSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});

// Pet schema
export const PetSchema = z.object({
  id: z.number().optional(),
  category: CategorySchema.optional(),
  name: z.string(),
  photoUrls: z.array(z.string()),
  tags: z.array(TagSchema).optional(),
  status: z.enum(['available', 'pending', 'sold']).optional(),
});

// API Response schema
export const ApiResponseSchema = z.object({
  code: z.number().optional(),
  type: z.string().optional(),
  message: z.string().optional(),
});

// Pet array schema
export const PetArraySchema = z.array(PetSchema);

/**
 * Validate data against a schema
 */
export const validateSchema = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: boolean; data?: T; errors?: z.ZodError } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
};

/**
 * Assert that data matches schema (throws on failure)
 */
export const assertSchema = <T>(data: unknown, schema: z.ZodSchema<T>): T => {
  return schema.parse(data);
};

// Export types
export type Category = z.infer<typeof CategorySchema>;
export type Tag = z.infer<typeof TagSchema>;
export type Pet = z.infer<typeof PetSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
