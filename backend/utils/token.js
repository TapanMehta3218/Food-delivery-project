import jwt from "jsonwebtoken";
const genToken = async (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.error("Error in genToken function:", error);
    throw new Error("Failed to generate token");
  }
};
export default genToken;
