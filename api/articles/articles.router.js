const express = require("express");
const articlesController = require("./articles.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes CRUD pour les articles
router.post("/", articlesController.create);           // Créer (utilisateur connecté)
router.put("/:id", articlesController.update);         // Modifier (admin uniquement)
router.delete("/:id", articlesController.delete);      // Supprimer (admin uniquement)

// Routes optionnelles pour consulter les articles
router.get("/", articlesController.getAll);            // Tous les articles
router.get("/:id", articlesController.getById);        // Un article par ID

module.exports = router;