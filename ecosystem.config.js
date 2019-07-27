module.exports = {
  apps: [
    {
      name: 'geldstroom-api',
      script: './dist/main.js',
      instances: 'max',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
