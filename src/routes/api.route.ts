import { Router } from 'express';
import sessionMdw from '../middleware/session.middleware'
import login from '../controllers/login.controller';
import logout from '../controllers/logout.controller';

const router: Router = Router();

router.post('/login', login);
router.post('/logout', sessionMdw, logout);

export default router;