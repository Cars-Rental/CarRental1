import { customAlphabet } from "nanoid";
import { userModel } from "../../DB/model/user.model.js";
import bcrypt from "bcrypt";
import { emailEvent } from "../../utlis/events/email.event.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { userName, email, password, phone } = req.body;

  const hashedpassword = await bcrypt.hash(password, Number(process.env.SALT));

  const otp = customAlphabet("0123456789", 6)();

  const user = await userModel.create({
    userName,
    email,
    password: hashedpassword,
    phone,
    otp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  emailEvent.emit("sendConfirmationEmail", {
    email,
    otp,
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      phone: user.phone,
    },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Email not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Password mismatch",
    });
  }

  if (!user.confirmEmail) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email first",
    });
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role.toLowerCase(),
      },
      accessToken,
      refreshToken,
    },
  });
};
