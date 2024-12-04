import Module, { IModule } from '../models/module.model';

export const createModule = async (data: Partial<IModule>): Promise<IModule> => {
  return Module.create(data);
};

export const getModules = async (): Promise<IModule[]> => {
  return Module.find();
};

export const getModuleById = async (id: string): Promise<IModule | null> => {
  return Module.findById(id);
};

export const updateModule = async (id: string, data: Partial<IModule>): Promise<IModule | null> => {
  return Module.findByIdAndUpdate(id, data, { new: true });
};

export const deleteModule = async (id: string): Promise<IModule | null> => {
  return Module.findByIdAndDelete(id);
};
