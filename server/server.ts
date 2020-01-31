import * as restify from "restify";
import * as mongoose from "mongoose";
import { environment } from "../common/environment";
import { Router } from "../common/router";
import { mergePatchBodyParser } from "./merge-patch.parser";
import { errorHandler } from "./error.handler";
import { tokenParser } from "../security/token.parser";

import * as fs from "fs";
import { logger } from "../dist/common/logger";
export class Server {
  application: restify.Server;

  initializeDb() {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(environment.db.url, {});
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const options: restify.ServerOptions = {
          name: "hello-api",
          version: "1.0.0",
          log: logger
        };

        if (environment.security.enableHTTPS) {
          options.certificate = fs.readFileSync(
            environment.security.certificate
          );
          options.key = fs.readFileSync(environment.security.key);
        }

        this.application = restify.createServer(options);

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);
        this.application.use(tokenParser);

        this.application.pre(
          restify.plugins.requestLogger({
            log: logger
          })
        );

        // this.application.get("/hello", (request, response, next) => {
        //   response.json({ message: "hello" });
        //   return next();
        // });

        routers.map(router => router.applyRoutes(this.application));

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });

        // this.application.on(
        //   "after",
        //   restify.plugins.auditLogger({
        //     log: logger,
        //     event: "after"
        //     // body: true
        //   })
        // );
        this.application.on("restifyError", errorHandler);
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

  shutdown() {
    return mongoose.disconnect().then(() => this.application.close());
  }
}
