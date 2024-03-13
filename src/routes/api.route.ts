import { Router } from 'express';
import sessionMdw from '../middleware/session1.middleware';
import login from '../controllers/login.controller';
import logout from '../controllers/logout.controller';

const router: Router = Router();

router.post('/login', login);
router.post('/logout', sessionMdw.authorize(['user', 'administrator']), logout);

export default router;