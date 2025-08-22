const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

// Mock du middleware auth
jest.mock("../middlewares/auth", () => {
  return (req, res, next) => {
    req.user = {
      _id: "507f1f77bcf86cd799439011",
      name: "Admin Test",
      email: "admin@test.com", 
      role: "admin"
    };
    next();
  };
});

describe("tester API articles", () => {
  const USER_ID = "507f1f77bcf86cd799439011";
  const ARTICLE_ID = "507f1f77bcf86cd799439012";
  
  const MOCK_ARTICLE_DATA = {
    _id: ARTICLE_ID,
    title: "Article de test",
    content: "Contenu de test",
    status: "draft",
    user: USER_ID
  };

  const MOCK_ARTICLE_CREATE = {
    title: "Nouvel article",
    content: "Contenu du nouvel article", 
    status: "published"
  };

  const MOCK_ARTICLE_UPDATE = {
    title: "Article modifié",
    content: "Contenu modifié",
    status: "published"
  };

  beforeEach(() => {
    // Mocks pour Article
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATE, "save");
    mockingoose(Article).toReturn({ ...MOCK_ARTICLE_DATA, ...MOCK_ARTICLE_UPDATE }, "findOneAndUpdate");
    mockingoose(Article).toReturn({ deletedCount: 1 }, "deleteOne");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATE)
      .set("x-access-token", "fake-token");
    
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATE.title);
    expect(res.body.content).toBe(MOCK_ARTICLE_CREATE.content);
    expect(res.body.status).toBe(MOCK_ARTICLE_CREATE.status);
  });

  test("[Articles] Update Article (Admin only)", async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(MOCK_ARTICLE_UPDATE)
      .set("x-access-token", "fake-token");
    
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_ARTICLE_UPDATE.title);
    expect(res.body.content).toBe(MOCK_ARTICLE_UPDATE.content);
    expect(res.body.status).toBe(MOCK_ARTICLE_UPDATE.status);
  });

  test("[Articles] Delete Article (Admin only)", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", "fake-token");
    
    expect(res.status).toBe(204);
  });

  test("[Articles] Create Article - Service method called", async () => {
    const spy = jest
      .spyOn(articlesService, "create")
      .mockImplementation(() => MOCK_ARTICLE_CREATE);
    
    await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATE)
      .set("x-access-token", "fake-token");
    
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(MOCK_ARTICLE_CREATE, USER_ID);
  });

  test("[Articles] Update Article - Service method called", async () => {
    const spy = jest
      .spyOn(articlesService, "update")
      .mockImplementation(() => ({ ...MOCK_ARTICLE_DATA, ...MOCK_ARTICLE_UPDATE }));
    
    await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(MOCK_ARTICLE_UPDATE)
      .set("x-access-token", "fake-token");
    
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ARTICLE_ID, MOCK_ARTICLE_UPDATE);
  });

  test("[Articles] Delete Article - Service method called", async () => {
    const spy = jest
      .spyOn(articlesService, "delete")
      .mockImplementation(() => ({ deletedCount: 1 }));
    
    await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", "fake-token");
    
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ARTICLE_ID);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
});