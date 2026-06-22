import { customAlphabet } from "nanoid";
import { userModel } from "../../DB/model/user.model.js";
import bcrypt from "bcrypt";
import { emailEvent } from "../../utlis/events/email.event.js";
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
  const { userName, email, password, phone } = req.body;
  const hashedpassword = await bcrypt.hash(password, Number(process.env.SALT));
  const otp = customAlphabet("0123456789", 6)();
  const registeruser = await userModel.create({
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
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: registeruser,
  });
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
  const accessToken = jwt.sign(
    { id: loginuser._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const refreshToken = jwt.sign(
    { id: loginuser._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );
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

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token required",
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
      data: null,
    });
  }
};

export const VerifyEmail = async (req, res, next) => {
  const { id } = req.params;
  const { otp } = req.body;

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  }

  if (user.confirmEmail) {
    return res.status(400).json({
      success: false,
      message: "Email already verified",
      data: null,
    });
  }

  if (user.otp !== otp) {
    return res.status(401).json({
      success: false,
      message: "Invalid OTP",
      data: null,
    });
  }

  if (user.otpExpires < new Date()) {
    return res.status(401).json({
      success: false,
      message: "OTP expired",
      data: null,
    });
  }

  user.confirmEmail = true;
  user.otp = null;
  user.otpExpires = null;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: null,
  });
};

export const updatePasswordtonewONe = async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
  const user = await userModel.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true },
  );
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
    data: user,
  });
};

export const resetpassword = async (req, res, next) => {};
