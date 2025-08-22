module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 3,  // Lancer 3 instances en parallèle
      max_memory_restart: "200M",  // Limite mémoire : 200 Mo
      error_file: "./logs/err.log",  // Fichier log d'erreur
      out_file: "./logs/out.log",   // Fichier log sortie standard (optionnel)
      log_file: "./logs/combined.log", // Fichier log combiné (optionnel)
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};