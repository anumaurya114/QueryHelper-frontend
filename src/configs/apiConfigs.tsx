interface Config {
  baseUrl: string;
  }
  
  const config: { [key: string]: Config } = {
    development: {
      baseUrl: 'http://192.168.1.42:5025',
    },
    production: {
      baseUrl: 'http://192.168.1.42:5025',
    },
  };
  
  export default config[process.env.NODE_ENV || 'development'];
  