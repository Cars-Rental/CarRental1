import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).json({ message: "No token provided" });
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    req.userid = decoded.id;
    req.userid = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: error.message, error, stack: error.stack });
  }
};
