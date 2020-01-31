"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model.router");
const auth_handler_1 = require("../security/auth.handler");
const authz_handler_1 = require("../security/authz.handler");
class UserRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        // envelope(document) {
        //   const resource = super.envelope(document);
        //   return resource;
        // }
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(users => (users ? [users] : []))
                    .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on("beforeResponse", document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get({ version: "2.0.0", path: `${this.basePath}` }, [
            authz_handler_1.authorize("admin"),
            this.findByEmail,
            this.findAll
        ]);
        application.get({ version: "1.0.0", path: `${this.basePath}` }, this.findAll);
        application.get(`${this.basePath}/:id`, [
            authz_handler_1.authorize("admin"),
            this.validateId,
            this.findById
        ]);
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
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.usersRouter = new UserRouter();
