import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";

// Dynamically import the file directly from the file system
const { ruruHTML } = require(path.join(
  process.cwd(),
  "node_modules/ruru/dist/server.js"
));

const USERS = `Build and Deploy a GraphQL API using NodeJS`
  .split(" ")
  .map((user, index) => ({ name: user, id: index + 1 }));

const schema = buildSchema(`
   type Query {
      users: [User!]
      user(id: Int!): User
   }

   type User {
      id: Int!
      name: String!
   }
`);

const rootResolver = {
  users: () => USERS,
  user: (args: { id: Number }) => {
    console.log({ args });
    return USERS.find((user) => user.id === args.id);
  },
};

// Init App
const app = express();

// Registering middlewares
app.use(cors());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.type("html");
  res.end(
    ruruHTML({
      endpoint: "/graphql",
    })
  );
});

app.all("/graphql", createHandler({ schema, rootValue: rootResolver }));

export default app;
