import * as restify from "restify";
import * as mongoose from "mongoose";
import { Review } from "./review.model";
import { ModelRouter } from "../common/model.router";
import { authorize } from "../security/authz.handler";

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  envelope(document: any): any {
    const resource = super.envelope(document);
    const restId = document.restaurant._id
      ? document.restaurant._id
      : document.retaurant;
    resource._links.restaurant = `/restaurants/${restId}`;
    return resource;
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<Review, Review>
  ): mongoose.DocumentQuery<Review, Review> {
    return query.populate("user", "name").populate("restaurant", "name");
  }

  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, this.findAll);

    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);

    application.post(`${this.basePath}`, [
      authorize("user", "admin"),
      this.save
    ]);
  }
}

export const reviewsRouter = new ReviewsRouter();
