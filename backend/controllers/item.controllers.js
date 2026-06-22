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
    await shop.populate("items owner");
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
