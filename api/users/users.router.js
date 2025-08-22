const express = require("express");
const usersController = require("./users.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

// Routes publiques (sans auth)
router.post("/", usersController.create);  // Création d'utilisateur

// Routes protégées (avec auth)
router.get("/", auth, usersController.getAll);
router.get("/:id", auth, usersController.getById);
router.put("/:id", auth, usersController.update);
router.delete("/:id", auth, usersController.delete);

module.exports = router;