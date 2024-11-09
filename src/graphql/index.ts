import { createSchema } from "graphql-yoga";
import User from "./models/user";
import Post from "./models/post";
import Comment from "./models/comment";
import Auth from "./models/auth";

import { merge } from "lodash";

const schema = createSchema({
  typeDefs: [User.typeDefs, Post.typeDefs, Comment.typeDefs, Auth.typeDefs],
  resolvers: merge(
    User.resolvers,
    Post.resolvers,
    Comment.resolvers,
    Auth.resolvers
  ),
});

export default { schema };
