import db from "../../libs/prisma-client";
import { GraphQLContext } from "../context";
import post from "./post";

const typeDefs = /* GraphQL */ `
  type Comment {
    id: Int!
    user: User!
    message: String!
    createdAt: String!
  }

  type Mutation {
    createComment(data: CreateCommentDTO): Post!
    deleteComment(id: Int!): Post!
  }

  input CreateCommentDTO {
    userId: Int!
    postId: Int!
    message: String!
  }
`;

const resolvers = {
  Query: {},
  Mutation: {
    createComment: async (
      _: any,
      dto: {
        data: {
          userId: number;
          postId: number;
          message: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      const { userId, message, postId } = dto.data;
      if (!message || !message.trim())
        throw new Error("Message field is required to create a comment.");

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new Error("User not found with the provided Id!");

      const post = await ctx.prisma.post.update({
        where: { id: postId },
        data: {
          comments: {
            create: {
              userId,
              message: message,
            },
          },
        },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });

      if (!post) throw new Error("Post not found with the provided Id!");

      return post;
    },
    deleteComment: async (
      _: any,
      dto: {
        id: number;
      },
      ctx: GraphQLContext
    ) => {
      const { id } = dto;

      const deletedPost = await ctx.prisma.post.delete({
        where: { id },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });

      if (!deletedPost) throw new Error("Post not found with the provided Id!");

      return post;
    },
  },
};

export default { typeDefs, resolvers };
