import { type Request, type Response } from 'express';

import LocationService from '../services/location.service';

export default class LocationController {
  constructor(private readonly service = new LocationService()) {}

  verifier = async (req: Request, res: Response): Promise<void> => {
    const { binCode } = req.params;

    try {
      const resultat = await this.service.verifierBac(binCode);
      res.json(resultat);
    } catch (_erreur) {
      res.status(500).json({ message: 'Recherche du bac impossible.' });
    }
  };
}
