import * as restify from "restify";
import { EventEmitter } from "events";

export abstract class Router extends EventEmitter {
  abstract applyRoutes(application: restify.Server);

  render(resp: restify.Response, next: restify.Next) {
    return document => {
      if (document) {
        this.emit("beforeResponse", document);
        resp.json(document);
        return next();
      }

      resp.send(404);
      return next();
    };
  }
}
