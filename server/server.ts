import * as restify from "restify";
import * as mongoose from "mongoose";
import { environment } from "../common/environment";
import { Router } from "../common/router";
import { mergePatchBodyParser } from "./merge-patch.parser";

export class Server {
  application: restify.Server;

  initializeDb() {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(environment.db.url, {});
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "hello-api",
          version: "1.0.0"
        });

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);

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
    return this.initializeDb().then(() =>
      this.initRoutes(routers).then(() => this)
    );
  }
}
