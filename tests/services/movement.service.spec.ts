import MovementService from '../../src/services/movement.service';
import pool from '../../src/config/postgresClient';

type MockablePool = {
  query: jest.Mock;
  connect: jest.Mock;
};

type MockClient = {
  query: jest.Mock;
  release: jest.Mock;
};

jest.mock('../../src/config/postgresClient', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    connect: jest.fn()
  }
}));

describe('MovementService.creerMouvement', () => {
  const service = new MovementService();
  const poolMock = pool as unknown as MockablePool;
  const clientMock: MockClient = {
    query: jest.fn(),
    release: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    clientMock.query.mockReset();
    clientMock.release.mockReset();
    poolMock.connect.mockReset();
    poolMock.query.mockReset();
    poolMock.connect.mockResolvedValue(clientMock);
  });

  it('augmente le stock lors d\'un mouvement entrant', async () => {
    const maintenant = new Date();

    clientMock.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ quantity: 5 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            id: 42,
            productId: 7,
            quantity: 3,
            type: 'IN',
            createdAt: maintenant
          }
        ]
      })
      .mockResolvedValueOnce({});

    const resultat = await service.creerMouvement({ productId: 7, quantity: 3, type: 'IN' });

    expect(resultat).not.toBeNull();
    expect(resultat?.stock).toBe(8);
    expect(resultat?.mouvement).toMatchObject({ id: 42, productId: 7, quantity: 3, type: 'IN' });
    expect(clientMock.query).toHaveBeenNthCalledWith(3, 'UPDATE products SET quantity = $1 WHERE id = $2', [8, 7]);
    expect(clientMock.query).toHaveBeenNthCalledWith(5, 'COMMIT');
    expect(clientMock.release).toHaveBeenCalledTimes(1);
  });

  it('rejette et annule la transaction si le stock devient négatif', async () => {
    clientMock.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ quantity: 2 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    await expect(
      service.creerMouvement({ productId: 5, quantity: 5, type: 'OUT' })
    ).rejects.toThrow('STOCK_NEGATIF');

    expect(clientMock.query).toHaveBeenNthCalledWith(3, 'ROLLBACK');
    expect(clientMock.query).toHaveBeenNthCalledWith(4, 'ROLLBACK');
    expect(clientMock.release).toHaveBeenCalledTimes(1);
  });

  it('retourne null si le produit est introuvable', async () => {
    clientMock.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rowCount: 0, rows: [] })
      .mockResolvedValueOnce({});

    const resultat = await service.creerMouvement({ productId: 99, quantity: 1, type: 'IN' });

    expect(resultat).toBeNull();
    expect(clientMock.query).toHaveBeenCalledWith('ROLLBACK');
    expect(clientMock.release).toHaveBeenCalledTimes(1);
  });
});
