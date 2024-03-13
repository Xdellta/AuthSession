interface AppOptions {
  protocol: string;
  domain: string;
  port: number;
  session?: {
    duration: number;
  };
}

const appCfg: AppOptions = {
  protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  domain: process.env.DOMAIN || 'localhost',
  port: parseInt(process.env.PORT || '3000', 10),

  session: {
    duration: 28800000, // 8 hours in milliseconds
  },
};

export default appCfg;