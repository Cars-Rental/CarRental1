import mongoose from "mongoose";
import { userModel } from "../../DB/model/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res
      .status(200)
      .json({ success: true, message: "request successful", data: users });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong", error: err });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "invalid user id format",
      });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "user found", data: user });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong", error: err });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid user id format" });
    }

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
    }

    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
      data: user,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong", error: err });
  }
};
