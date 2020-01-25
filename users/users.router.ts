import { User } from "./users.model";
import * as restify from "restify";
import { ModelRouter } from "../common/model.router";

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
      this.findByEmail,
      this.findAll
    ]);

    application.get(
      { version: "1.0.0", path: `${this.basePath}` },
      this.findAll
    );

    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);

    application.post(`${this.basePath}`, this.save);

    application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);

    application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);

    application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
  }
}

export const usersRouter = new UserRouter();
