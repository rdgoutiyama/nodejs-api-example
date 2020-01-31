"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restaurants_model_1 = require("./restaurants.model");
const model_router_1 = require("../common/model.router");
const restify_errors_1 = require("restify-errors");
const authz_handler_1 = require("../security/authz.handler");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
    }
    envelope(document) {
        const resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    findMenu(req, resp, next) {
        restaurants_model_1.Restaurant.findById(req.params.id, "+menu")
            .then(restaurant => {
            if (!restaurant) {
                throw new restify_errors_1.NotFoundError("Restaurant not found");
            }
            resp.json(restaurant.menu);
            return next();
        })
            .catch(next);
    }
    replaceMenu(req, resp, next) {
        restaurants_model_1.Restaurant.findById(req.params.id)
            .then(restaurant => {
            if (!restaurant) {
                throw new restify_errors_1.NotFoundError("Restaurant not found");
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
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize("admin"), this.save]);
        application.put(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.replace
        ]);
        application.patch(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.update
        ]);
        application.del(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.delete
        ]);
        application.put(`${this.basePath}/:id/menu`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.replaceMenu
        ]);
        application.get(`${this.basePath}/:id/menu`, [
            this.validateId,
            this.findMenu
        ]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
