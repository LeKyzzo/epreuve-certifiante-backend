import { z } from 'zod';

const baseProduit = {
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  reference: z.string().min(2, 'La référence doit contenir au moins 2 caractères.'),
  warehouseId: z.number({ invalid_type_error: 'warehouseId doit être un nombre.' }).int('warehouseId doit être un entier.').nonnegative('warehouseId doit être positif.')
};

export const schemaCreationProduit = z.object({
  body: z.object({
    ...baseProduit,
    quantity: z
      .number({ invalid_type_error: 'La quantité doit être un nombre.' })
      .int('La quantité doit être un entier.')
      .nonnegative('La quantité doit être positive.')
      .default(0)
  })
});

export const schemaMiseAJourProduit = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Identifiant invalide.')
  }),
  body: z.object({
    ...baseProduit,
    quantity: z
      .number({ invalid_type_error: 'La quantité doit être un nombre.' })
      .int('La quantité doit être un entier.')
      .nonnegative('La quantité doit être positive.')
  })
});

export const schemaSuppressionProduit = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Identifiant invalide.')
  })
});
