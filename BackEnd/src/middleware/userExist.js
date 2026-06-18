import { userModel } from "../DB/model/user.model.js";

export const emailExist = async (req, res, next) => {
  const { email } = req.body;
  const emailE = await userModel.findOne({ email });
  if (emailE) {
    res
      .status(403)
      .json({ message: "email exist please signup with anthor email" });
  }
  next();
};
