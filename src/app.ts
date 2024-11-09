import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { createYoga } from "graphql-yoga";
import GraphQL from "./graphql";
import createContext from "./graphql/context";

// Dynamically import the file directly from the file system
const { ruruHTML } = require(path.join(
  process.cwd(),
  "node_modules/ruru/dist/server.js"
));

const yoga = createYoga({
  schema: GraphQL.schema,
  context: createContext,
});

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
// ts-ignore
app.post("/graphql", yoga);

export default app;
