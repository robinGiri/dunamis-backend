import User, { IUser } from '../models/user.model';

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  return User.create(data);
};

export const getUsers = async (): Promise<IUser[]> => {
  return User.find();
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

export const updateUser = async (id: string, data: Partial<IUser>): Promise<IUser | null> => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  return User.findByIdAndDelete(id);
};
