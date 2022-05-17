module.exports = {
    apps : [{
      name: "appVerificationHorus",
      script: "src/index.js",
      error_file: 'logs/app_errores.log',
      out_file: 'logs/app_consola.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
      exec_mode : "fork",
      instances: 1, 
      autorestart: true,
      watch: true,
      watch_delay: 1000,
      ignore_watch: ['logs', 'node_modules'],
      max_memory_restart: '1G',
        env: {
            PORT: 3000,
            NODE_ENV: 'production'
        }
      }
    ]
  }