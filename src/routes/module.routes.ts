import { Router } from 'express';
import * as ModuleController from '../controllers/module.controller';

const router = Router();

router.post('/', ModuleController.createModule);
router.get('/', ModuleController.getModules);
router.get('/:id', ModuleController.getModuleById);
router.put('/:id', ModuleController.updateModule);
router.delete('/:id', ModuleController.deleteModule);

export default router;
