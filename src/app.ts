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

const TITLES =
  `HTTP 415 status code means Unsupported Media Type, which typically occurs when the server doesn't recognize the content type of the request`
    .split(" ")
    .map((title) => title.toUpperCase());

const USERS = `Build and Deploy a GraphQL API using NodeJS`
  .split(" ")
  .map((user, index) => ({ name: user.toUpperCase(), id: index + 1 }));

const COMMENTS = Array.from({ length: 3 }, (_, i) => i + 1).map((id) => ({
  id,
  user: USERS.at(Math.round(Math.random() * USERS.length)),
  message: TITLES.slice(
    Math.round(Math.random() * TITLES.length),
    Math.round(Math.random() * TITLES.length)
  ).join(" "),
  createdAt: Date.now().toLocaleString(),
}));

const POSTS = Array.from({ length: 3 }, (_, i) => i + 1).map((id) => ({
  id,
  title: TITLES[id],
  body: TITLES.join(" "),
  likes: USERS.slice(
    Math.round(Math.random() * USERS.length),
    Math.round(Math.random() * USERS.length)
  ),
  createdAt: Date.now().toLocaleString(),
  comments: COMMENTS.slice(
    Math.round(Math.random() * COMMENTS.length),
    Math.round(Math.random() * COMMENTS.length)
  ),
}));
const schema = buildSchema(`
   type Query {
      users: [User!]
      user(id: Int!): User
      posts: [Post!]
      post(id: Int!): Post
   }

   type User {
      id: Int!
      name: String!
   }

   type Post {
      id: Int!
      title: String!
      body: String!
      createdAt: String!
      likes: [User]
      comments: [Comment]
   }

   type Comment {
      id: Int!
      user: User!
      message: String!
      createdAt: String!
   }
`);

const rootResolver = {
  users: () => USERS,
  user: ({ id }: { id: Number }) => {
    return USERS.find((user) => user.id === id);
  },
  posts: () => POSTS,
  post: ({ id }: { id: Number }) => POSTS.find((post) => post.id === id),
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

app.post("/graphql", createHandler({ schema, rootValue: rootResolver }));

export default app;
