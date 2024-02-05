interface Config {
  baseUrl: string;
  }
  
  const config: { [key: string]: Config } = {
    development: {
      baseUrl: 'http://localhost:8000',
    },
    production: {
      baseUrl: 'http://192.168.1.42:5026',
    },
  };
  
  export default config[process.env.NODE_ENV || 'development'];
  