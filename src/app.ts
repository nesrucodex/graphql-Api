import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import db from "./libs/prisma-client";

// Dynamically import the file directly from the file system
const { ruruHTML } = require(path.join(
  process.cwd(),
  "node_modules/ruru/dist/server.js"
));

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
      posts: [Post]!
   }

   type Post {
      id: Int!
      title: String!
      body: String!
      createdAt: String!
      likes: [User!]!
      comments: [Comment!]!
   }

   type Comment {
      id: Int!
      user: User!
      message: String!
      createdAt: String!
   }
`);

const rootResolver = {
  users: async () => {
    const users = await db.user.findMany();

    return users;
  },
  user: async ({ id }: { id: number }) => {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  },
  posts: async () => {
    const posts = await db.post.findMany({
      include: {
        likes: {
          include: { comments: true, posts: true },
        },
        comments: {
          include: {
            user: true,
            post: true,
          },
        },
      },
    });

    return posts;
  },
  post: async ({ id }: { id: number }) => {
    const post = await db.post.findUnique({
      where: { id },
    });
    return post;
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

app.post("/graphql", createHandler({ schema, rootValue: rootResolver }));

export default app;
