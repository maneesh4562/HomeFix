"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderServices = exports.deleteService = exports.updateService = exports.getServiceById = exports.getServices = exports.createService = void 0;
const Service_1 = require("../models/Service");
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = new Service_1.Service(Object.assign(Object.assign({}, req.body), { provider: req?.user?.id }));
        yield service.save();
        res.status(201).json(service);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createService = createService;
const getServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, emergency, minPrice, maxPrice } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (emergency)
            filter.isEmergency = emergency === 'true';
        if (minPrice)
            filter.basePrice = { $gte: Number(minPrice) };
        if (maxPrice) {
            filter.basePrice = Object.assign(Object.assign({}, filter.basePrice), { $lte: Number(maxPrice) });
        }
        const services = yield Service_1.Service.find(filter)
            .populate('provider', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getServices = getServices;
const getServiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield Service_1.Service.findById(req.params.id)
            .populate('provider', 'firstName lastName phoneNumber')
            .populate('reviews');
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getServiceById = getServiceById;
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield Service_1.Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        if (service.provider.toString() !== req?.user?.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        Object.assign(service, req.body);
        yield service.save();
        res.json(service);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateService = updateService;
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield Service_1.Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        if (service.provider.toString() !== req?.user?.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        yield service.remove();
        res.json({ message: 'Service deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteService = deleteService;
const getProviderServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield Service_1.Service.find({ provider: req?.user?.id })
            .populate('reviews')
            .sort({ createdAt: -1 });
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProviderServices = getProviderServices;
