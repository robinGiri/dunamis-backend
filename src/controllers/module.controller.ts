import { Request, Response } from 'express';
import * as ModuleService from '../services/module.service';
import { getErrorMessage } from '../utils/errorHandler';

export const createModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const module = await ModuleService.createModule(req.body);
    res.status(201).json(module);
  } catch (err) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const getModules = async (_req: Request, res: Response): Promise<void> => {
  try {
    const modules = await ModuleService.getModules();
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};

export const getModuleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const module = await ModuleService.getModuleById(req.params.id);
    if (module) {
      res.status(200).json(module);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};

export const updateModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const module = await ModuleService.updateModule(req.params.id, req.body);
    if (module) {
      res.status(200).json(module);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (err) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const deleteModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const module = await ModuleService.deleteModule(req.params.id);
    if (module) {
      res.status(200).json({ message: 'Module deleted successfully' });
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};
