const { sql } = require("../database/config");

const requireUserOrAdmin = async (req, res, next) => {
  const user = req.user;
  const id = Number(req.params.id);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  if (user.isAdmin) return next();

  try {
    const items = await sql`
      SELECT user_id FROM items WHERE id = ${id}
    `;

    if (items.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const ownerId = Number(items[0].user_id);

    if (ownerId !== Number(user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { requireUserOrAdmin };
