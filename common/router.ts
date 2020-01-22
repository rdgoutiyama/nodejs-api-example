import * as restify from "restify";
import { EventEmitter } from "events";

export abstract class Router extends EventEmitter {
  abstract applyRoutes(application: restify.Server);

  envelope(document) {
    return document;
  }

  envelopeAll(documents, options) {
    return documents;
  }

  render(resp: restify.Response, next: restify.Next) {
    return document => {
      if (document) {
        this.emit("beforeResponse", document);
        resp.json(this.envelope(document));
        return next();
      }

      resp.send(404);
      return next();
    };
  }

  renderAll(resp: restify.Response, next: restify.Next, options: any = {}) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((document, index, arr) => {
          this.emit("beforeResponse", document);
          arr[index] = this.envelope(document);
        });
        resp.json(this.envelopeAll(documents, options));
      } else {
        resp.json([]);
      }

      return next();
    };
  }
}
