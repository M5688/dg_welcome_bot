module.exports = {
  apps: [{
    name: 'dg_welcome_bot',
    script: 'bot.js',
    cwd: '/tmp/dg_welcome_bot',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 3000,
    env: {
      NODE_ENV: 'production'
    }
  }]
};
