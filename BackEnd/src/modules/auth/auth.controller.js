import { userModel } from "../../DB/model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  const { userName, email, password, confirmPassword, phone } = req.body;
  const hashedpassword = await bcrypt.hash(password, Number(process.env.SALT));
  const registeruser = await userModel.create({
    userName: userName,
    email,
    password: hashedpassword,
    phone,
  });
  res.status(200).json({ message: "user added", registeruser });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const loginuser = await userModel.findOne({ email });

  if (!loginuser) {
    return res.status(401).json({
      message: "email not found",
    });
  }

  const passwordcompare = await bcrypt.compare(password, loginuser.password);

  if (!passwordcompare) {
    return res.status(401).json({
      message: "password mismatch",
    });
  }
  const accessToken = jwt.sign({ id: loginuser._id }, process.env.SECRET_KEY, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: loginuser._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: loginuser._id,
        userName: loginuser.userName,
        email: loginuser.email,
        role: loginuser.role.toLowerCase(),
      },
      accessToken,
      refreshToken,
    },
  });
};
