import * as restify from "restify";
import { environment } from "../common/environment";
import { Router } from "../common/router";

export class Server {
  application: restify.Server;

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "hello-api",
          version: "1.0.0"
        });

        this.application.use(restify.plugins.queryParser());

        // this.application.get("/hello", (request, response, next) => {
        //   response.json({ message: "hello" });
        //   return next();
        // });

        routers.map(router => router.applyRoutes(this.application));

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initRoutes(routers).then(() => this);
  }
}
