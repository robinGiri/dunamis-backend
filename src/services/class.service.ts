import Class, { IClass } from '../models/class.model';

export const createClass = async (data: Partial<IClass>): Promise<IClass> => {
  return Class.create(data);
};

export const getClassById = async (id: string): Promise<IClass | null> => {
  return Class.findById(id);
};

export const updateClass = async (id: string, data: Partial<IClass>): Promise<IClass | null> => {
  return Class.findByIdAndUpdate(id, data, { new: true });
};

export const deleteClass = async (id: string): Promise<IClass | null> => {
  return Class.findByIdAndDelete(id);
};
