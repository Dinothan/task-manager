const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Unauthorized } = require("http-errors");

const auth = async (req, res, next) => {
  try {
    // Extract the token from the Cookie header
    const cookieHeader = req.header("Cookie");

    if (!cookieHeader) {
      throw new Error("Cookie header is missing");
    }

    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

    const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwtToken="));
    if (!jwtCookie) {
      throw new Error("JWT token is missing in cookies");
    }

    const token = jwtCookie.split("=")[1];

    // Verify the token and decode it using the secret key
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Find the user by ID
    const user = await User.findOne({
      _id: decoded.id,
    });

    // If user is not found or token is invalid, throw an error
    if (!user) {
      throw new Error("User not found or token is invalid");
    }

    // Set the user and token in the request object for further use
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(Unauthorized("Please authenticate"));
  }
};

module.exports = auth;
