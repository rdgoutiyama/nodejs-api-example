import { Router } from "../common/router";
import { User } from "./users.model";

class UserRouter extends Router {
  applyRoutes(application: any) {
    application.get("/users", (req, resp, next) => {
      User.findAll().then(users => {
        resp.json(users);
        return next();
      });
    });

    application.get("/users/:id", (req, resp, next) => {
      User.findById(req.params.id).then(user => {
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

export const usersRouter = new UserRouter();
