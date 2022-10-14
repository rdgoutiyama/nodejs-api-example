import { Server } from "./server/server";
import { usersRouter } from "./users/users.router";
import { restaurantsRouter } from "./restaurants/restaurants.router";
import { reviewsRouter } from "./reviews/reviews.router";

const server = new Server();

server
  .bootstrap([usersRouter, restaurantsRouter, reviewsRouter])
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
