"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.reviewSchema = new mongoose.Schema({
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
exports.Review = mongoose.model("Review", exports.reviewSchema);
