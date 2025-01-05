import { z } from 'zod';

export const memberSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  belt: z.string().optional(),
  stripes: z.number().min(0).max(4).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  }).optional(),
  medicalInfo: z.object({
    conditions: z.array(z.string()),
    allergies: z.array(z.string()),
    medications: z.array(z.string()),
  }).optional(),
});

export type MemberSchema = z.infer<typeof memberSchema>;