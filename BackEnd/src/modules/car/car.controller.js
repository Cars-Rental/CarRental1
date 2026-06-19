import { carModel } from "../../DB/model/car.model.js";
import cloudinary from "../../utlis/cloudinary/cloudinary.js";

export const addcar = async (req, res, next) => {
  try {
    const { carbrand, carname, carprice } = req.body;

    const uploadedImage = await cloudinary.uploader.upload(req.file.path);

    const addedcar = await carModel.create({
      carbrand,
      carname,
      carprice,
      owner: req.user.id,
      carimage: [
        {
          secure_url: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
        },
      ],
    });

    await addedcar.populate("owner", "userName email role phone");

    return res.status(201).json({
      success: true,
      message: "Car added successfully",
      data: addedcar,
    });
  } catch (error) {
    next(error);
  }
};

export const deletecar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const car = await carModel.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car.carimage?.length) {
      for (const image of car.carimage) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    await carModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getallcar = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalCars = await carModel.countDocuments();

    const cars = await carModel.find().skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      message: "All cars",
      totalCars,
      page,
      limit,
      data: cars,
    });
  } catch (error) {
    next(error);
  }
};

export const updatecar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { carbrand, carname, carprice } = req.body;

    const car = await carModel.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    let imageData = car.carimage;

    if (req.file) {
      if (car.carimage?.length) {
        for (const image of car.carimage) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }

      const uploadedImage = await cloudinary.uploader.upload(req.file.path);

      imageData = [
        {
          secure_url: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
        },
      ];
    }

    const updatedcar = await carModel.findByIdAndUpdate(
      id,
      {
        carbrand,
        carname,
        carprice,
        carimage: imageData,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: updatedcar,
    });
  } catch (error) {
    next(error);
  }
};

export const getbyid = async (req, res, next) => {
  try {
    const { id } = req.params;

    const car = await carModel.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car fetched successfully",
      data: car,
    });
  } catch (error) {
    next(error);
  }
};
