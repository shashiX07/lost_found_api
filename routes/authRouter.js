const express = require("express");
const { sql } = require("../database/config");
const { adminLogin, signup, login } = require("../controllers/auth");

const authRouter = express.Router();

authRouter.post("/admin", async (req, res) => {
  const { mail, pass } = req.body;
  const response = await adminLogin(mail, pass);
  if (response.token) {
    res.status(200).json(response);
  } else {
    res.status(401).json(response);
  }
});

authRouter.post("/u/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing required fields" });
  const result = await signup(name, email, password);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
});

authRouter.post("/u/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing required fields" });
  const result = await login(email, password);
  if (result.error) return res.status(400).json(result);
  res.status(200).json(result);
});

module.exports = { authRouter };    
