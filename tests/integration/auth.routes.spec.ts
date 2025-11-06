import request from 'supertest';

import app from '../../src/app';
import AuthService from '../../src/services/auth.service';

describe('POST /api/auth/login (integration)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renvoie un token et les informations utilisateur lorsque les identifiants sont valides', async () => {
    const connecterSpy = jest.spyOn(AuthService.prototype, 'connecter').mockResolvedValue({
      utilisateur: { id: 1, username: 'jean', role: 'admin', password: 'hash' },
      token: 'jwt-token-test'
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'jean', password: 'secret' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      utilisateur: { id: 1, username: 'jean', role: 'admin' },
      token: 'jwt-token-test'
    });
    expect(connecterSpy).toHaveBeenCalledWith('jean', 'secret');
  });

  it('renvoie 401 lorsque les identifiants sont invalides', async () => {
    const connecterSpy = jest.spyOn(AuthService.prototype, 'connecter').mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'jean', password: 'mauvais' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Identifiants invalides.' });
    expect(connecterSpy).toHaveBeenCalledWith('jean', 'mauvais');
  });
});
