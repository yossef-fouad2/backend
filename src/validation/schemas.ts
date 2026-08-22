import { z } from "zod";

// --- Auth ---
export const signupSchema = z.object({
  email: z.email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export const loginSchema = z.object({
  email: z.email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

// --- Drugs ---
export const createDrugSchema = z.object({
  commercialNameEn: z.string().min(1, "Commercial name (EN) is required"),
  commercialNameAr: z.string().default("N/A"),
  scientificName: z.string().default("N/A"),
  manufacturer: z.string().default("N/A"),
  drugClass: z.string().default("N/A"),
  route: z.string().default("N/A"),
  priceEgp: z.number().positive("Price must be positive"),
});

// --- Inventory ---
export const createInventorySchema = z.object({
  drugId: z.number().int().positive(),
  quantity: z.number().int().min(0).default(0),
  batchNumber: z.string().default("N/A"),
  expiryDate: z.iso.date("Must be a valid date (YYYY-MM-DD)"),
  purchasePrice: z.number().positive(),
  sellingPrice: z.number().positive(),
});

// --- Sales ---
export const createSaleSchema = z.object({
  userId: z.number().int().positive(),
  totalAmount: z.number().positive(),
  paymentMethod: z.enum(["cash", "card", "insurance"]).default("cash"),
  items: z
    .array(
      z.object({
        drugId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        priceAtSale: z.number().positive(),
      }),
    )
    .min(1, "At least one sale item is required"),
});

// --- Courses ---
export const listCoursesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().trim().min(1).optional(),
});

// --- Inferred TypeScript types ---
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateDrugInput = z.infer<typeof createDrugSchema>;
export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type ListCoursesQueryInput = z.infer<typeof listCoursesQuerySchema>;
