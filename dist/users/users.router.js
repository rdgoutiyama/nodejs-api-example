"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const users_model_1 = require("./users.model");
class UserRouter extends router_1.Router {
    applyRoutes(application) {
        application.get("/users", (req, resp, next) => {
            users_model_1.User.findAll().then(users => {
                resp.json(users);
                return next();
            });
        });
        application.get("/users/:id", (req, resp, next) => {
            users_model_1.User.findById(req.params.id).then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                resp.send(404);
                return next();
            });
        });
    }
}
exports.usersRouter = new UserRouter();
