import { reviewModel } from "../../DB/model/review.model.js";
import { createReviewSchema, updateReviewSchema } from "./review.validation.js";


export const createReview = async (req, res) => {
  try {
    const { error, value } = createReviewSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    
    const existingReview = await reviewModel.findOne({
      user: req.user._id,
      carRent: value.carRent,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: " أنت بالفعل عملت review لهذه السيارة",
      });
    }

    const newReview = new reviewModel({
      user: req.user._id,
      carRent: value.carRent,
      rating: value.rating,
      comment: value.comment,
    });

    await newReview.save();
    await newReview.populate("user", "username email");
    await newReview.populate("carRent", "carbrand carmodel carname carprice");

    res.status(201).json({
      success: true,
      message: " Review تم إضافته بنجاح",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: " خطأ في سيرفر",
      error: error.message,
    });
  }
};


export const getReviewsByCar = async (req, res) => {
  try {
    const { carRentId } = req.params;

    const reviews = await reviewModel
      .find({ carRent: carRentId })
      .populate("user", "username email")
      .populate("carRent", "carbrand carmodel carname carprice")
      .sort({ createdAt: -1 });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: " لا توجد reviews لهذه السيارة",
      });
    }

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    res.status(200).json({
      success: true,
      data: {
        total: reviews.length,
        averageRating: averageRating.toFixed(2),
        reviews: reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: " خطأ في سيرفر",
      error: error.message,
    });
  }
};


export const getUserReviews = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({ user: req.user._id })
      .populate("carRent", "carbrand carmodel carname carprice location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: " خطأ في سيرفر",
      error: error.message,
    });
  }
};


export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel
      .findById(reviewId)
      .populate("user", "username email")
      .populate("carRent", "carbrand carmodel carname carprice");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: " Review غير موجود",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: " خطأ في سيرفر",
      error: error.message,
    });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { error, value } = updateReviewSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: " Review غير موجود",
      });
    }

 
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: " أنت لا تملك صلاحية تعديل هذا Review",
      });
    }

    
    if (value.rating) review.rating = value.rating;
    if (value.comment !== undefined) review.comment = value.comment;

    await review.save();
    await review.populate("user", "username email");
    await review.populate("carRent", "carbrand carmodel carname carprice");

    res.status(200).json({
      success: true,
      message: " Review تم تحديثه بنجاح",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: " خطأ في سيرفر",
      error: error.message,
    });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: " Review غير موجود",
      });
    }

  
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: " أنت لا تملك صلاحية حذف هذا Review",
      });
    }

    await reviewModel.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: " Review تم حذفه بنجاح",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: " خطأ في سيرفر",
      error: error.message,
    });
  }
};