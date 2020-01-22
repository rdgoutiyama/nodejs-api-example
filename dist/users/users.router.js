"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model.router");
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
                    .then(this.renderAll(resp, next))
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
            this.findByEmail,
            this.findAll
        ]);
        application.get({ version: "1.0.0", path: `${this.basePath}` }, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
    }
}
exports.usersRouter = new UserRouter();
