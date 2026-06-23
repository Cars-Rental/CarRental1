import mongoose from "mongoose";
import { reviewModel } from "../../DB/model/review.model.js";


// get all reviews 
export const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await reviewModel.find();
        res.status(200).json({ message: "all reviews", data: reviews });
    } catch (error) {
        next(error);
    }
}

// get reviews by id to car
export const getReviewById = async (req,res,next) =>{
    try{
        const {id} = req.params;
        const reviews = await reviewModel.find({carId:id});
        res.status(200).json({message:"reviews by id",data:reviews});
    }catch(error){
        next(error);
    }
}


// create review 
export const createReview = async (req, res, next) => {
    try {
        const { userId, carId, comment, rating } = req.body;
        const review = await reviewModel.create({
            userId,
            carId,
            comment,
            rating,
        });
        res.status(200).json({ message: "review added", review });
    } catch (error) {
        next(error);
    }
};

// delete review 
export const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await reviewModel.findByIdAndDelete(id);
        res.status(200).json({ message: "review deleted", review });
    } catch (error) {
        next(error);
    }
};