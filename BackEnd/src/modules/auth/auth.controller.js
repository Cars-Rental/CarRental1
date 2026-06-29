import { customAlphabet } from "nanoid";
import { userModel } from "../../DB/model/user.model.js";
import bcrypt from "bcrypt";
import { emailEvent } from "../../utlis/events/email.event.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { userName, email, password, phone, role, gender } = req.body;

  const hashedpassword = await bcrypt.hash(password, Number(process.env.SALT));

  const otp = customAlphabet("0123456789", 6)();

  const user = await userModel.create({
    userName,
    email,
    password: hashedpassword,
    phone,
    otp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    role,
    gender,
  });

  emailEvent.emit("sendConfirmationEmail", {
    email,
    otp,
  });

  return res.status(201).json({
    success: true,
    message:
      "User registered successfully. Verification code has been sent to your email.",
    data: {
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        confirmEmail: user.confirmEmail,
      },
    },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Validation error",
      errors: [
        {
          field: "email",
          message: "Email not found",
        },
      ],
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Validation error",
      errors: [
        {
          field: "password",
          message: "Password mismatch",
        },
      ],
    });
  }

  if (!user.confirmEmail) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: [
        {
          field: "email",
          message: "Please verify your email first",
        },
      ],
      code: "EMAIL_NOT_VERIFIED",
    });
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" },
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
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        confirmEmail: user.confirmEmail,
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
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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
    });
  }
};
export const VerifyEmail = async (req, res, next) => {
  const { email, otp, type } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (type === "register" && user.confirmEmail) {
    return res.status(400).json({
      success: false,
      message: "Email already verified",
    });
  }

  if (!user.otp || user.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  if (user.otpExpires < new Date()) {
    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }
  if (type === "register") {
    user.confirmEmail = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: null,
    });
  }

  if (type === "reset") {
    return res.status(200).json({
      success: true,
      message: "Reset code verified successfully",
      data: null,
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid verification type",
  });
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const otp = customAlphabet("0123456789", 6)();

  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  emailEvent.emit("sendConfirmationEmail", {
    email,
    otp,
  });

  return res.status(200).json({
    success: true,
    message: "Verification code has been sent to your email.",
    data: null,
  });
};
export const resetpassword = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password do not match",
    });
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

  user.password = hashedPassword;
  user.otp = null;
  user.otpExpires = null;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
};
export const updatePassword = async (req, res, next) => {
  const userId = req.user.id;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
  const user = await userModel.findByIdAndUpdate(
    userId,
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
  });
};

export const googleRedirect = (req, res) => {
  res.redirect("/auth/profile");
};

export const getProfile = (req, res) => {
  res.send(`
        <h2>✅ Welcome ${req.user.displayName}</h2>
        <a href="/auth/logout">🚪 Logout</a>
    `);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.redirect("/");

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
};

export const resendOtp = async (req, res) => {
  const { email, type } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (type === "register") {
    if (user.confirmEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }
  } else if (type === "reset") {
    if (!user.confirmEmail) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid type",
    });
  }

  const otp = customAlphabet("0123456789", 6)();

  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  emailEvent.emit("sendConfirmationEmail", {
    email,
    otp,
  });

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
};
export const logoutt = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
};

export const getProfilee = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("_id userName email phone gender role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updateProfiles = async (req, res) => {
  try {
    const { phone, gender, userName } = req.body;
    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.userId,
        {
          phone,
          gender,
          userName,
        },
        {
          new: true,
        },
      )
      .select("_id userName email phone gender role");
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
