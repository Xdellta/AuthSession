import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import appCfg from './src/config/app.config';
import corsCfg from './src/config/cors.config';
import router from './src/routes/api.route';
import loggerMdw from './src/middleware/logger.middleware';

const app: Application = express();

app.use(express.json());
app.use(cors(corsCfg));
app.use(cookieParser());
app.use('/api', router);
app.use(loggerMdw);

app.listen(appCfg.port, () => {
  console.log(`Server is running on: ${appCfg.protocol}://${appCfg.domain}:${appCfg.port}`);
});