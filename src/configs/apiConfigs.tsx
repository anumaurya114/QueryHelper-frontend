interface Config {
  baseUrl: string;
  }
  
  const config: { [key: string]: Config } = {
    development: {
      baseUrl: 'http://localhost:8000',
    },
    production: {
      baseUrl: 'https://api.example.com',
    },
  };
  
  export default config[process.env.NODE_ENV || 'development'];
  