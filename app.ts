import express, { Application } from 'express';
import cors from 'cors';
import 'dotenv/config';

import appCfg from './src/config/app.config';
import corsCfg from './src/config/cors.config';
import session from './src/middleware/session.middleware';
import router from './src/routes/api.route';
import errHandler from './src/middleware/errHandler.middleware';

const app: Application = express();

app.use(express.json());
app.use(cors(corsCfg));
app.use(session);
app.use('/api', router);
app.use(errHandler);

app.listen(appCfg.port, () => {
  console.log(`Server is running on: ${appCfg.protocol}://${appCfg.domain}:${appCfg.port}`);
});