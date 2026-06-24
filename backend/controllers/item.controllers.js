import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
export const addItem = async (req, res) => {
  try {
    const { name, category, foodtype, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ error: "Shop not found for the user" });
    }
    const item = await Item.create({
      name,
      category,
      foodtype,
      price,
      image,
      shop: shop._id,
    });
    shop.items.push(item._id); //maybe yaha populate use kar sakte hai
    await shop.save();
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { UpdatedAt: -1 } },
    });

    res.status(201).json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, category, foodtype, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodtype,
        price,
        image,
      },
      { new: true },
    );
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { UpdatedAt: -1 } },
    });
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params.itemId;
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId });
    shop.items = shop.items.filter((i) => i !== itemId);

    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { UpdatedAt: -1 } },
    });
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");
    if (!shops || shops.length === 0) {
      return res.status(404).json({ error: "No shops found in this city" });
    }
    const shopIds = shops.map((shop) => shop._id);
    const items = await Item.find({ shop: { $in: shopIds } });
    return res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
