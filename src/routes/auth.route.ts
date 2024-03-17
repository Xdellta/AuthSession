import { Router } from 'express';
import sessionMdw from '../middleware/session.middleware'
import login from '../controllers/auth.controller/login.controller';
import register from '../controllers/auth.controller/register.controller';
import logout from '../controllers/auth.controller/logout.controller';

const router: Router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', sessionMdw, logout);

export default router;