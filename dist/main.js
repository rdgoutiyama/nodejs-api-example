"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const server = new server_1.Server();
server
    .bootstrap()
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
