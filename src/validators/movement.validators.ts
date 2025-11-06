import { z } from 'zod';

export const schemaCreationMouvement = z.object({
  body: z.object({
    productId: z.number({ invalid_type_error: 'productId doit être un nombre.' }).int('productId doit être un entier.').positive('productId doit être positif.'),
    type: z.enum(['IN', 'OUT'], { required_error: 'Le type est obligatoire.' }),
    quantity: z
      .number({ invalid_type_error: 'La quantité doit être un nombre.' })
      .int('La quantité doit être un entier.')
      .positive('La quantité doit être supérieure à zéro.')
  })
});
