import { Router } from 'express';
import auth from './auth.route';

const router: Router = Router();

router.use('/auth', auth);

export default router;