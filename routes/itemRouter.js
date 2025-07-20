//importing necessary modules
const express = require("express");
const { getAllItems, getItemById, addItem, UpdateItem, deleteItem } = require('../controllers/items');

//middleware for admin authentication
const {requireAdmin} = require('../middlewares/requireAdmin');
const {requireAuth} = require('../middlewares/requireAuth');
const  {requireUserOrAdmin} = require('../middlewares/requireUserOrAdmin');


//setting up the router
const itemRouter = express.Router();

//defining the routes
// GET all items
itemRouter.get("/", async (req, res) => {
    const items = await getAllItems(req);
    if (items.length > 0) {
        res.status(200).json(items);
    } else {
        res.status(404).json({ message: "No items found" });
    }
});

//getting item by id
itemRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const item = await getItemById(id);
    if (item.length > 0) {
        res.status(200).json(item[0]);
    } else {
        res.status(404).json({ message: `Item with id ${id} not found` });
    }
});

//adding a new item
itemRouter.post("/",requireAuth, async (req, res) => {
    const newItem = req.body;
    if(!newItem.title || !newItem.category || !newItem.description || !newItem.status || !newItem.location || !newItem.date || !newItem.contact_info) {
        return res.status(400).json({ message: "All fields are required" });
    }
    newItem.user_id = req.user.id;
    newItem.image_url = newItem.image_url || "https://media.istockphoto.com/id/1271880340/vector/lost-items-line-vector-icon-unidentified-items-outline-isolated-icon.jpg?s=612x612&w=0&k=20&c=d2kHGEmowThp_UrqIPfhxibstH6Sq5yDZJ41NetzVaA="; 
    const result = await addItem(newItem);
    if (result) {
        res.status(201).json({ message: "Item added successfully", item: result[0] });
    } else {
        res.status(500).json({ message: "Error adding item" });
    }
});

//updating an existing item
itemRouter.put("/:id",requireAuth, requireUserOrAdmin, async (req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    if(!updatedItem.title || !updatedItem.category || !updatedItem.description || !updatedItem.status || !updatedItem.location || !updatedItem.date || !updatedItem.contact_info) {
        return res.status(400).json({ message: "All fields are required" });
    }
    updatedItem.image_url = updatedItem.image_url || "https://media.istockphoto.com/id/1271880340/vector/lost-items-line-vector-icon-unidentified-items-outline-isolated-icon.jpg?s=612x612&w=0&k=20&c=d2kHGEmowThp_UrqIPfhxibstH6Sq5yDZJ41NetzVaA=";
    const result = await UpdateItem(id, updatedItem);
    if (result) {
        res.status(200).json({ message: "Item updated successfully", item: result });
    } else {
        res.status(500).json({ message: "Error updating item" });
    }
});

//deleting an item
itemRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
    const id = req.params.id;
    const result = await deleteItem(id);
    if (result) {
        res.status(200).json({ message: "Item deleted successfully" });
    } else {
        res.status(500).json({ message: "Error deleting item" });
    }
});

module.exports = { itemRouter };