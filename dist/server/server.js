"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const environment_1 = require("../common/environment");
class Server {
    initRoutes(routers) {
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
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initRoutes(routers).then(() => this);
    }
}
exports.Server = Server;
