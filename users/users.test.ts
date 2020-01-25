import "jest";
import * as request from "supertest";
import { Server } from "../server/server";
import { environment } from "../common/environment";
import { usersRouter } from "./users.router";
import { User } from "./users.model";

let server: Server;
let address: string = (<any>global).address;

test("primeiro teste", () => {});

test("get /users", () => {
  return request(address)
    .get("/users")
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    })
    .catch(fail);
});

test("post /users", () => {
  return request(address)
    .post("/users")
    .send({
      name: "usuario1",
      email: "usuario1@email.com",
      password: "123456",
      cpf: "590.071.150-14"
    })
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe("usuario1");
      expect(response.body.email).toBe("usuario1@email.com");
      expect(response.body.cpf).toBe("590.071.150-14");
      expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});

test("get /users/aaa", () => {
  return request(address)
    .get("/users/aaaa")
    .then(response => {
      expect(response.status).toEqual(404);
    });
});

test("patch /users/:id", () => {
  return request(address)
    .post("/users")
    .send({
      name: "usuario2",
      email: "usuario2@email.com",
      password: "1234566"
    })
    .then(response =>
      request(address)
        .patch(`/users/${response.body._id}`)
        .send({
          name: "usuario3-patch"
        })
    )
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe("usuario3-patch");
      expect(response.body.email).toBe("usuario2@email.com");
      expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});
