interface Config {
    apiUrl: string;
  }
  
  const config: { [key: string]: Config } = {
    development: {
      apiUrl: 'http://localhost:5000/api',
    },
    production: {
      apiUrl: 'https://api.example.com',
    },
  };
  
  export default config[process.env.NODE_ENV || 'development'];
  