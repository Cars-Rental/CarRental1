import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "No token provided",
      error: {},
      stack: "Missing Authorization header",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      error,
      stack: error.stack,
    });
  }
};
