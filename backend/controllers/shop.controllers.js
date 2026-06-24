import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
  try {
    let image;
    const { name, city, state, address } = req.body;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      const shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      const shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          image,
          owner: req.userId,
        },
        { new: true },
      );
    }
    await shop.populate("owner");
    res.status(201).json({ shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return null;
    }
    await shop.populate({
      path: "items",
      options: { sort: { UpdatedAt: -1 } },
    });
    res.status(200).json({ shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");
    if (!shops) {
      return res.status(404).json({ error: "No shops found in this city" });
    }
    res.status(200).json({ shops });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
