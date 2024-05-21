module.exports = {
    apps: [
      {
        name: "api",
        script: "index.js",
        instances: 'MAX',     
        max_memory_restart: "250M",
        env: {
          NODE_ENV: "development" 
        },
        env_production: {
          NODE_ENV: "production"
        }
      }
    ]
  };
  