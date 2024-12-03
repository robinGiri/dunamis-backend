import { Request, Response } from 'express';
import * as UserService from '../services/user.service';
import { getErrorMessage } from '../utils/errorHandler';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserService.deleteUser(req.params.id);
    if (user) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};
