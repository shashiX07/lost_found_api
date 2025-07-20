const { sql } = require("../database/config");
const express = require("express");

const getAllItems = async (req) => {
  try {
    const { status, category, location } = req.query;
    let conditions = [];
    if (status) {
      conditions.push(sql`status = ${status}`);
    }
    if (category) {
      conditions.push(sql`category = ${category}`);
    }
    if (location) {
      conditions.push(sql`location = ${location}`);
    }
    const where =
      conditions.length > 0
        ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
        : sql``;
    const items = await sql`
            SELECT * FROM items 
            ${where}
            ORDER BY created_at DESC
        `;
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

const getItemById = async (id) => {
  try {
    const item = await sql`SELECT * FROM items  WHERE id = ${id}`;
    return item;
  } catch (error) {
    console.error("Error fetching item:", error);
    return [];
  }
};

const addItem = async (item) => {
  try {
    const result =
      await sql`INSERT INTO items  (title, user_id, category, description, status, location, date, contact_info, image_url) VALUES (${item.title}, ${item.user_id}, ${item.category}, ${item.description}, ${item.status}, ${item.location}, ${item.date}, ${item.contact_info}, ${item.image_url}) RETURNING *`;
    return result;
  } catch (error) {
    console.error("Error adding item:", error);
    return null;
  }
};

const UpdateItem = async (id, item) => {
  try {
    const result =
      await sql`UPDATE items  SET title = ${item.title}, description = ${item.description}, status = ${item.status}, location = ${item.location}, date = ${item.date}, contact_info = ${item.contact_info}, image_url = ${item.image_url} WHERE id = ${id} RETURNING *`;
    return result;
  } catch (error) {
    console.log("Error updating item:", error);
    return null;
  }
};

const deleteItem = async (id) => {
  try {
    const result =
      await sql`DELETE FROM items  WHERE id = ${id} RETURNING *`;
    return result;
  } catch (error) {
    return null;
  }
};

module.exports = { getAllItems, getItemById, addItem, UpdateItem, deleteItem };
