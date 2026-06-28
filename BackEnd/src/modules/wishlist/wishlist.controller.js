import { wishlistModel } from "../../DB/wishlist.model.js";
import { carbuymodel } from "../../DB/model/carBuy.model.js";
import { carModel } from "../../DB/model/carRent.model.js";

const formatWishlist = (wishlist) => {
  return wishlist.cars.map((item) => ({
    id: item.car._id,
    title: `${item.car.carbrand} ${item.car.carmodel} ${item.car.year}`,
    brand: item.car.carbrand,
    model: item.car.carmodel,
    name: item.car.carname,
    year: item.car.year,
    image: item.car.carimage?.[0]?.secure_url || null,
    location: item.car.location,
    price: item.car.carprice,
    type: item.carModel === "carRent" ? "rent" : "buy",
  }));
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { carId, carModel: modelName } = req.body;

    const Model = modelName === "carRent" ? carModel : carbuymodel;

    const car = await Model.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    let wishlist = await wishlistModel.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await wishlistModel.create({
        user: req.user.id,
        cars: [{ car: carId, carModel: modelName }],
      });
    } else {
      const exists = wishlist.cars.some(
        (item) => item.car.toString() === carId && item.carModel === modelName,
      );

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Car already exists in wishlist",
        });
      }

      wishlist.cars.push({
        car: carId,
        carModel: modelName,
      });

      await wishlist.save();
    }

    // IMPORTANT: correct populate (NO model array needed)
    await wishlist.populate("cars.car");

    return res.status(200).json({
      success: true,
      message: "Car added to wishlist",
      wishlist: formatWishlist(wishlist),
    });
  } catch (err) {
    next(err);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await wishlistModel
      .findOne({ user: req.user.id })
      .populate("cars.car");

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: [],
      });
    }

    return res.status(200).json({
      success: true,
      wishlist: formatWishlist(wishlist),
    });
  } catch (err) {
    next(err);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const wishlist = await wishlistModel.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const exists = wishlist.cars.some((item) => item.car.toString() === carId);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Car not found in wishlist",
      });
    }

    wishlist.cars = wishlist.cars.filter(
      (item) => item.car.toString() !== carId,
    );

    await wishlist.save();

    await wishlist.populate("cars.car");

    return res.status(200).json({
      success: true,
      message: "Car removed from wishlist",
      wishlist: formatWishlist(wishlist),
    });
  } catch (err) {
    next(err);
  }
};
