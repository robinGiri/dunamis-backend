import { Router } from 'express';
import * as ModuleController from '../controllers/module.controller';

const router = Router();

router.post('/', ModuleController.createClass);

export default router;
