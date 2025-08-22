const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticlesController {
  
  // Créer un article (utilisateur connecté requis)
  async create(req, res, next) {
    try {
      // L'utilisateur est récupéré par le middleware auth
      const userId = req.user._id;
      const article = await articlesService.create(req.body, userId);
      
      // Temps réel avec Socket.IO
      req.io.emit("article:create", article);
      
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  // Mettre à jour un article (admin uniquement)
  async update(req, res, next) {
    try {
      // Vérifier que l'utilisateur est admin
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Seuls les administrateurs peuvent modifier les articles");
      }

      const id = req.params.id;
      const data = req.body;
      const articleModified = await articlesService.update(id, data);
      
      if (!articleModified) {
        throw new NotFoundError("Article non trouvé");
      }

      // Temps réel avec Socket.IO
      req.io.emit("article:update", articleModified);
      
      res.json(articleModified);
    } catch (err) {
      next(err);
    }
  }

  // Supprimer un article (admin uniquement)
  async delete(req, res, next) {
    try {
      // Vérifier que l'utilisateur est admin
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Seuls les administrateurs peuvent supprimer les articles");
      }

      const id = req.params.id;
      const result = await articlesService.delete(id);
      
      if (result.deletedCount === 0) {
        throw new NotFoundError("Article non trouvé");
      }

      // Temps réel avec Socket.IO
      req.io.emit("article:delete", { id });
      
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  // Optionnel : récupérer tous les articles (pour debug)
  async getAll(req, res, next) {
    try {
      const articles = await articlesService.getAll();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

  // Optionnel : récupérer un article par ID
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const article = await articlesService.get(id);
      if (!article) {
        throw new NotFoundError("Article non trouvé");
      }
      res.json(article);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();