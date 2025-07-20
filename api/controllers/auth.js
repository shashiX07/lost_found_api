const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const { sql } = require("../database/config");

const adminLogin = (mail, pass) => {
  const admin_email = process.env.ADMIN_MAIL;
  const admin_pass = process.env.ADMIN_PASS;

  if (mail === admin_email && pass === admin_pass) {
    const token = generateToken({ mail: mail, isAdmin: true });
    return { message: "Admin logged in successfully", token };
  } else {
    return { message: "Invalid admin credentials" };
  }
};

const signup = async (name, email, password) => {
  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${hashedPassword})
            RETURNING id, name, email, created_at
        `;
    return { user: result[0] };
  } catch (error) {
    if (error.code === "23505") {
      return { error: "Email already exists." };
    }
    console.error(error);
    return { error: "Something went wrong. Please try again later." };
  }
};


const login = async (email, password) => {
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const users = await sql`
            SELECT id, name, email, password FROM users WHERE email = ${email}
        `;

    if (users.length === 0) {
      return { error: "Invalid credentials." };
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return { error: "Invalid credentials." };
    }
    const token = generateToken({ id: user.id, email: user.email, isAdmin: false });
    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }
};

module.exports = { adminLogin, signup, login };
