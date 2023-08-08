module.exports = {
  apps: [
    {
      name: "Account Management",
      script: "npm run start",
      out_file: "/var/log/pm2/acc-man/log.log",
      error_file: "/var/log/pm2/acc-man/error.log",
      env: {
        ENV: "prod",
      },
    },
  ],
};
