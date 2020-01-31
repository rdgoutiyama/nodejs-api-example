"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const review_model_1 = require("./review.model");
const model_router_1 = require("../common/model.router");
const authz_handler_1 = require("../security/authz.handler");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(review_model_1.Review);
    }
    envelope(document) {
        const resource = super.envelope(document);
        const restId = document.restaurant._id
            ? document.restaurant._id
            : document.retaurant;
        resource._links.restaurant = `/restaurants/${restId}`;
        return resource;
    }
    prepareOne(query) {
        return query.populate("user", "name").populate("restaurant", "name");
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [
            authz_handler_1.authorize("user", "admin"),
            this.save
        ]);
    }
}
exports.reviewsRouter = new ReviewsRouter();
