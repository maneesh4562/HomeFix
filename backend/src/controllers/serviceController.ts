import { Request, Response } from 'express';
import { Service } from '../models/Service';
import { User } from '../models/User';

export const createService = async (req: Request, res: Response) => {
  try {
    const service = new Service({
      ...req.body,
      provider: req?.user?.id,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, emergency, minPrice, maxPrice } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (emergency) filter.isEmergency = emergency === 'true';
    if (minPrice) filter.basePrice = { $gte: Number(minPrice) };
    if (maxPrice) {
      filter.basePrice = { ...filter.basePrice, $lte: Number(maxPrice) };
    }

    const services = await Service.find(filter)
      .populate('provider', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'firstName lastName phoneNumber')
      .populate('reviews');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.provider.toString() !== req?.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(service, req.body);
    await service.save();

    res.json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.provider.toString() !== req?.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProviderServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ provider: req?.user?.id })
      .populate('reviews')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 