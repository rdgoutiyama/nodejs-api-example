"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const users_model_1 = require("./users.model");
class UserRouter extends router_1.Router {
    constructor() {
        super();
        this.on("beforeResponse", document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get("/users", (req, resp, next) => {
            users_model_1.User.find().then(this.render(resp, next));
        });
        application.get("/users/:id", (req, resp, next) => {
            users_model_1.User.findById(req.params.id).then(this.render(resp, next));
        });
        application.post("/users", (req, resp, next) => {
            let user = new users_model_1.User(req.body);
            user.save().then(this.render(resp, next), e => {
                resp.send(500);
                return next(e.message);
            });
        });
        application.put("/users/:id", (req, resp, next) => {
            const options = { overwrite: true };
            users_model_1.User.update({ _id: req.params.id }, req.body, options)
                .exec()
                .then(result => {
                if (result.n) {
                    return users_model_1.User.findById(req.params.id);
                }
                resp.send(404);
            })
                .then(this.render(resp, next));
        });
        application.patch("/users/:id", (req, resp, next) => {
            const options = { new: true };
            users_model_1.User.findByIdAndUpdate({ _id: req.params.id }, req.body, options).then(this.render(resp, next));
        });
        application.del("/users/:id", (req, resp, next) => {
            users_model_1.User.remove({ _id: req.params.id })
                .exec()
                .then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                    return next();
                }
                resp.send(404);
                return next();
            });
        });
    }
}
exports.usersRouter = new UserRouter();
