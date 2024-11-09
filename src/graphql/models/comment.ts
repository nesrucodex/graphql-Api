import { GraphQLError } from "graphql";
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
          postId: number;
          message: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      if (!ctx.user)
        throw new GraphQLError("You aren't authorized to comment on a post.");
      const { message, postId } = dto.data;
      if (!message || !message.trim())
        throw new Error("Message field is required to create a comment.");

      const post = await ctx.prisma.post.update({
        where: { id: postId },
        data: {
          comments: {
            create: {
              userId: ctx.user.id,
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
      if (!ctx.user)
        throw new GraphQLError("You aren't authorized to delete a comment.");
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
