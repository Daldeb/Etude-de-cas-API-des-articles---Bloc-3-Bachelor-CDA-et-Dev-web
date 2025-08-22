const Article = require("./articles.schema");

class ArticleService {
  
  // Créer un article (avec l'ID de l'utilisateur connecté)
  create(data, userId) {
    const article = new Article({
      ...data,
      user: userId
    });
    return article.save();
  }

  // Mettre à jour un article
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  // Supprimer un article
  delete(id) {
    return Article.deleteOne({ _id: id });
  }

  // Récupérer tous les articles d'un utilisateur (pour l'endpoint public)
  getByUserId(userId) {
    return Article.find({ user: userId }).populate({
      path: "user",
      select: "-password" // Exclure le mot de passe
    });
  }

  // Récupérer tous les articles (optionnel, pour debug)
  getAll() {
    return Article.find().populate({
      path: "user", 
      select: "-password"
    });
  }

  // Récupérer un article par ID (optionnel)
  get(id) {
    return Article.findById(id).populate({
      path: "user",
      select: "-password"
    });
  }
}

module.exports = new ArticleService();