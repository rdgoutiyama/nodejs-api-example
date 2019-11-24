import { Server } from "./server/server";

const server = new Server();

server
  .bootstrap()
  .then(server => {
    console.log("====================================");
    console.log(
      `Server its running on port: ${server.application.address().port}`
    );
    console.log("====================================");
  })
  .catch(error => {
    console.log("====================================");
    console.log("Server failed to start");
    console.log("====================================");
    console.error(error);
    process.exit(1);
  });
