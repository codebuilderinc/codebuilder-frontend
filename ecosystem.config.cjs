module.exports = {
  apps: [{
    name: 'codebuilder-frontend',
    script: 'dist/main.js',
    env: {
      PORT: 3000,
      NODE_ENV: 'production',
    },
  }],
};
