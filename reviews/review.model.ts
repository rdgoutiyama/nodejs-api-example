import * as mongoose from "mongoose";
import { Restaurant } from "../restaurants/restaurants.model";
import { User } from "../users/users.model";

export interface Review extends mongoose.Document {
  date: Date;
  rating: number;
  comments: string;
  restaurant: mongoose.Types.ObjectId | Restaurant;
  user: mongoose.Types.ObjectId | User;
}

export const reviewSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export const Review = mongoose.model<Review>("Review", reviewSchema);
