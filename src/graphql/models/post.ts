import db from "../../libs/prisma-client";

const typeDefs = /* GraphQL */ `
  type Query {
    posts: [Post!]
    post(id: Int!): Post
  }

  type Post {
    id: Int!
    title: String!
    body: String!
    createdAt: String!
    likes: [User!]!
    comments: [Comment!]!
  }
`;

const resolvers = {
  Query: {
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
  },
};

export default { typeDefs, resolvers };
