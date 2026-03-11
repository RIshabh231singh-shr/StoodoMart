const express = require("express");
const NewsletterRouter = express.Router();
const { subscribe } = require("../controllers/newsletterController");

// Public route — anyone can subscribe
NewsletterRouter.post("/subscribe", subscribe);

module.exports = NewsletterRouter;
