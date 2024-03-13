import { CorsOptions } from 'cors';
import appCfg from './app.config';

const corsCfg: CorsOptions = {
  origin: `${appCfg.protocol}://${appCfg.domain}:${appCfg.port}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204,
};

export default corsCfg;