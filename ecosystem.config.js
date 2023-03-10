module.exports = {
    apps: [
      {
        name: 'laclasse-api-new',
        script: './app.js',
        instances: 1,
        exec_mode: 'cluster',
        watch: true,
        env: {
          NODE_ENV: 'production',
          PORT: '9099'
        }
      }
    ]
  };
