import Module, { IModule } from '../models/module.model';
import Class from '../models/class.model';

export const createModule = async (data: Partial<IModule>): Promise<IModule> => {
  return Module.create(data);
};

export const getModules = async (): Promise<IModule[]> => {
  return Module.find().populate('classes'); // Populate class references
};

export const getModuleById = async (id: string): Promise<IModule | null> => {
  return Module.findById(id).populate('classes'); // Populate class references
};

export const addClassToModule = async (moduleId: string, classId: string): Promise<IModule | null> => {
  return Module.findByIdAndUpdate(
    moduleId,
    { $push: { classes: classId } },
    { new: true }
  ).populate('classes');
};

export const updateModule = async (id: string, data: Partial<IModule>): Promise<IModule | null> => {
  return Module.findByIdAndUpdate(id, data, { new: true }).populate('classes'); // Populate classes for returning the full module
};

export const deleteModule = async (id: string): Promise<IModule | null> => {
  const module = await Module.findById(id);
  if (!module) {
    return null;
  }

  // Remove all associated classes
  await Class.deleteMany({ _id: { $in: module.classes } });

  // Delete the module
  return Module.findByIdAndDelete(id);
};
