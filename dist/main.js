"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const server = new server_1.Server();
server
    .bootstrap([users_router_1.usersRouter])
    .then(server => {
    console.log("====================================");
    console.log(`Server its running on port: ${server.application.address().port}`);
    console.log("====================================");
})
    .catch(error => {
    console.log("====================================");
    console.log("Server failed to start");
    console.log("====================================");
    console.error(error);
    process.exit(1);
});
