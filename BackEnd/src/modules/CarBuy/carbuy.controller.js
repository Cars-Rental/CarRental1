import { carbuymodel } from "../../DB/model/carBuy.model.js";
import cloudinary from "../../utlis/cloudinary/cloudinary.js";
import { createNotification } from "../../services/notification.service.js";
import { NOTIFICATION_TYPES, ENTITY_TYPES } from "../../constants/notification.types.js";

const POPULATE_OWNER = "userName email phone role";

export const addcarTobuy = async (req, res, next) => {
  try {
    const {
      carbrand,
      carmodel,
      year,
      location,
      carname,
      carprice,
      distance,
      fuel,
      seatCount,
      Body_Type,
      Transmission,
    } = req.body;

    const ownerId = req.user?.id || req.user?._id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user not found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one car image is required",
      });
    }

    const carImages = await Promise.all(
      req.files.map(async (file) => {
        const uploaded = await cloudinary.uploader.upload(file.path);

        return {
          secure_url: uploaded.secure_url,
          public_id: uploaded.public_id,
        };
      }),
    );

    const addedcar = await carbuymodel.create({
      carbrand,
      carmodel,
      year,
      location,
      carname,
      carprice,
      distance,
      fuel,
      seatCount,
      Body_Type,
      Transmission,
      owner: ownerId,
      carimage: carImages,
    });

    const populatedCar = await addedcar.populate("owner", POPULATE_OWNER);

    await createNotification({
      recipientId: ownerId,
      senderId: ownerId,
      type: NOTIFICATION_TYPES.CAR_BUY_ADDED,
      title: "تمت إضافة سيارة للبيع",
      message: "تمت إضافة السيارة بنجاح وسيتم عرضها للمستخدمين",
      entityType: ENTITY_TYPES.CAR,
      entityId: addedcar._id,
      metadata: { carId: addedcar._id.toString() },
    });

    return res.status(201).json({
      success: true,
      message: "Car added for sale successfully",
      data: populatedCar,
    });
  } catch (error) {
    next(error);
  }
};
export const deletecar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const car = await carbuymodel.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car.owner.toString() !== (req.user?.id || req.user?._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this car",
      });
    }

    if (car.carimage?.length) {
      for (const image of car.carimage) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    await carbuymodel.findByIdAndDelete(id);

    await createNotification({
      recipientId: car.owner,
      senderId: car.owner,
      type: NOTIFICATION_TYPES.CAR_BUY_DELETED,
      title: "تم حذف السيارة للبيع",
      message: "تم حذف السيارة بنجاح",
      entityType: ENTITY_TYPES.CAR,
      entityId: car._id,
      metadata: { carId: car._id.toString() },
    });

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getcaralls = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalCars = await carbuymodel.countDocuments();

    const cars = await carbuymodel
      .find()
      .populate("owner", POPULATE_OWNER)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "All cars fetched successfully",
      totalCars,
      totalPages: Math.ceil(totalCars / limit),
      currentPage: page,
      limit,
      data: cars,
    });
  } catch (error) {
    next(error);
  }
};

export const updatecarbyid = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      carbrand,
      carmodel,
      year,
      location,
      carname,
      carprice,
      distance,
      fuel,
      seatCount,
      Body_Type,
      Transmission,
    } = req.body;

    const car = await carbuymodel.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car.owner.toString() !== (req.user?.id || req.user?._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this car",
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

    const updatedcar = await carbuymodel
      .findByIdAndUpdate(
        id,
        {
          carbrand,
          carmodel,
          year,
          location,
          carname,
          carprice,
          distance,
          fuel,
          seatCount,
          Body_Type,
          Transmission,
          carimage: imageData,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .populate("owner", POPULATE_OWNER);

    return res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: updatedcar,
    });
  } catch (error) {
    next(error);
  }
};

export const getcarbyID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const car = await carbuymodel
      .findById(id)
      .populate("owner", POPULATE_OWNER);

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
