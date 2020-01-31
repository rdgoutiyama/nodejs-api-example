import * as restify from "restify";
import { Restaurant } from "./restaurants.model";
import { ModelRouter } from "../common/model.router";
import { NotFoundError } from "restify-errors";
import { authorize } from "../security/authz.handler";

class RestaurantsRouter extends ModelRouter<Restaurant> {
  constructor() {
    super(Restaurant);
  }

  envelope(document: any): any {
    const resource = super.envelope(document);
    resource._links.menu = `${this.basePath}/${resource._id}/menu`;
    return resource;
  }

  findMenu(req: restify.Request, resp: restify.Response, next) {
    Restaurant.findById(req.params.id, "+menu")
      .then(restaurant => {
        if (!restaurant) {
          throw new NotFoundError("Restaurant not found");
        }
        resp.json(restaurant.menu);
        return next();
      })
      .catch(next);
  }

  replaceMenu(req: restify.Request, resp: restify.Response, next) {
    Restaurant.findById(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          throw new NotFoundError("Restaurant not found");
        }

        restaurant.menu = req.body;
        return restaurant.save();
      })
      .then(restaurant => {
        resp.json(restaurant.menu);
        return next();
      })
      .catch(next);
  }

  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, this.findAll);

    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);

    application.post(`${this.basePath}`, [authorize("admin"), this.save]);

    application.put(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.replace
    ]);

    application.patch(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.update
    ]);

    application.del(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.delete
    ]);

    application.put(`${this.basePath}/:id/menu`, [
      authorize("admin"),
      this.validateId,
      this.replaceMenu
    ]);

    application.get(`${this.basePath}/:id/menu`, [
      this.validateId,
      this.findMenu
    ]);
  }
}

export const restaurantsRouter = new RestaurantsRouter();
