import jwt from "jsonwebtoken";

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // hardcoded admin credentials
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
    });
  }

  return res.json({
    success: false,
    message: "Invalid admin credentials",
  });
};

export { adminLogin };
