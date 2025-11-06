import swaggerJsdoc from 'swagger-jsdoc';

import env from './env';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'StockLink Pro API',
    version: '1.0.0',
    description:
      "API de gestion d'entrepôts, de produits et des mouvements StockLink Pro. Les routes protégées nécessitent un token JWT via le schéma Bearer."
  },
  servers: [
    {
      url: `http://localhost:${env.port}/api`,
      description: 'Serveur local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      AuthCredentials: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'demo' },
          password: { type: 'string', example: 'secret123' }
        }
      },
      Utilisateur: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'demo' },
          role: { type: 'string', enum: ['utilisateur', 'admin'], example: 'admin' }
        }
      },
      Produit: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 42 },
          name: { type: 'string', example: 'Palette Europe' },
          reference: { type: 'string', example: 'PAL-EU-001' },
          quantity: { type: 'integer', example: 120 },
          warehouse_id: { type: 'integer', example: 3 }
        }
      },
      Mouvement: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 10 },
          product_id: { type: 'integer', example: 42 },
          quantity: { type: 'integer', example: 15 },
          type: { type: 'string', enum: ['IN', 'OUT'], example: 'IN' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      Entrepot: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 5 },
          name: { type: 'string', example: 'Principal Sud' },
          location: { type: 'string', example: 'Marseille' }
        }
      },
      PlanEntrepot: {
        type: 'object',
        properties: {
          warehouseId: { type: 'integer', example: 5 },
          code: { type: 'string', example: 'PLAN-SUD-01' },
          layout: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                aisle: { type: 'string', example: 'A' },
                racks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      rack: { type: 'string', example: 'A1' },
                      levels: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            level: { type: 'integer', example: 1 },
                            bins: {
                              type: 'array',
                              items: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          metadata: {
            type: 'object',
            additionalProperties: true
          }
        }
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'Gestion de l’authentification et des utilisateurs' },
    { name: 'Produits', description: 'CRUD sur les produits' },
    { name: 'Entrepôts', description: 'Gestion des entrepôts et plans' },
    { name: 'Mouvements', description: 'Historique des mouvements de stock' },
    { name: 'Localisations', description: 'Contrôle des emplacements disponibles' }
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Créer un compte utilisateur',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/AuthCredentials' },
                  {
                    type: 'object',
                    properties: {
                      role: { type: 'string', enum: ['utilisateur', 'admin'] }
                    }
                  }
                ]
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Utilisateur créé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Utilisateur' }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authentifier un utilisateur',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthCredentials' }
            }
          }
        },
        responses: {
          200: {
            description: 'Authentification réussie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    utilisateur: { $ref: '#/components/schemas/Utilisateur' },
                    token: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/products': {
      get: {
        tags: ['Produits'],
        summary: 'Lister les produits',
        responses: {
          200: {
            description: 'Liste des produits',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Produit' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Produits'],
        summary: 'Créer un produit',
        security: [{ bearerAuth: [] }],
        responses: {
          201: {
            description: 'Produit créé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Produit' }
              }
            }
          }
        }
      }
    },
    '/products/{id}': {
      put: {
        tags: ['Produits'],
        summary: 'Mettre à jour un produit',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Produit mis à jour' } }
      },
      delete: {
        tags: ['Produits'],
        summary: 'Supprimer un produit',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Produit supprimé' } }
      }
    },
    '/warehouses': {
      get: {
        tags: ['Entrepôts'],
        summary: 'Lister les entrepôts',
        responses: {
          200: {
            description: 'Liste des entrepôts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Entrepot' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Entrepôts'],
        summary: "Créer un entrepôt",
        security: [{ bearerAuth: [] }],
        responses: {
          201: {
            description: 'Entrepôt créé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Entrepot' }
              }
            }
          }
        }
      }
    },
    '/warehouses/{id}/locations': {
      get: {
        tags: ['Entrepôts'],
        summary: 'Récupérer le plan de localisation',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: {
            description: 'Plan de localisation',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PlanEntrepot' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Entrepôts'],
        summary: 'Créer un plan de localisation',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          201: {
            description: 'Plan créé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PlanEntrepot' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Entrepôts'],
        summary: 'Mettre à jour un plan de localisation',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: {
            description: 'Plan mis à jour',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PlanEntrepot' }
              }
            }
          }
        }
      }
    },
    '/movements': {
      get: {
        tags: ['Mouvements'],
        summary: 'Lister les mouvements',
        responses: {
          200: {
            description: 'Liste des mouvements',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Mouvement' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Mouvements'],
        summary: 'Créer un mouvement',
        security: [{ bearerAuth: [] }],
        responses: {
          201: {
            description: 'Mouvement créé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Mouvement' }
              }
            }
          }
        }
      }
    },
    '/locations/{binCode}/exists': {
      get: {
        tags: ['Localisations'],
        summary: 'Vérifier la disponibilité dune localisation',
        parameters: [{ name: 'binCode', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Statut de la localisation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    existe: { type: 'boolean' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: []
});

export default swaggerSpec;
