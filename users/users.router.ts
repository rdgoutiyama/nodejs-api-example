import { User } from "./users.model";
import * as restify from "restify";
import { ModelRouter } from "../common/model.router";
import { authenticate } from "../security/auth.handler";
import { authorize } from "../security/authz.handler";

class UserRouter extends ModelRouter<User> {
  constructor() {
    super(User);

    this.on("beforeResponse", document => {
      document.password = undefined;
    });
  }

  // envelope(document) {
  //   const resource = super.envelope(document);
  //   return resource;
  // }

  findByEmail = (req, resp, next) => {
    if (req.query.email) {
      User.findByEmail(req.query.email)
        .then(users => (users ? [users] : []))
        .then(
          this.renderAll(resp, next, {
            pageSize: this.pageSize,
            url: req.url
          })
        )
        .catch(next);
    } else {
      next();
    }
  };

  applyRoutes(application: restify.Server) {
    application.get({ version: "2.0.0", path: `${this.basePath}` }, [
      authorize("admin"),
      this.findByEmail,
      this.findAll
    ]);

    application.get(
      { version: "1.0.0", path: `${this.basePath}` },
      this.findAll
    );

    application.get(`${this.basePath}/:id`, [
      authorize("admin"),
      this.validateId,
      this.findById
    ]);

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

    application.post(`${this.basePath}/authenticate`, authenticate);
  }
}

export const usersRouter = new UserRouter();
