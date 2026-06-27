export const isTrader = (req, res, next) => {
  if (req.user.role !== "Trader") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Traders only.",
      data: null,
    });
  }
  next();
};