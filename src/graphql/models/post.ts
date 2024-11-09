import { GraphQLError } from "graphql";
import { GraphQLContext } from "../context";

const typeDefs = /* GraphQL */ `
  type Query {
    posts: [Post!]
    post(id: Int!): Post
  }

  type Mutation {
    createPost(data: CreatePostDTO!): Post!
    updatePost(id: Int!, data: UpdatePostDTO): Post!
    deletePost(id: Int!): Post!
    likePost(postId: Int!): Post!
    dislikePost(postId: Int!): Post!
  }

  type Post {
    id: Int!
    title: String!
    author: User!
    body: String!
    createdAt: String!
    likes: [User!]!
    comments: [Comment!]!
  }

  input CreatePostDTO {
    authorId: Int!
    title: String!
    body: String!
  }
  input UpdatePostDTO {
    title: String
    body: String
  }
`;

const resolvers = {
  Query: {
    posts: async (_: unknown, __: {}, ctx: GraphQLContext) => {
      const posts = await ctx.prisma.post.findMany({
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
    post: async (_: unknown, args: { id: number }, ctx: GraphQLContext) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: args.id },
      });
      return post;
    },
  },

  Mutation: {
    createPost: async (
      _: any,
      dto: {
        data: {
          title: string;
          body: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      if (!ctx.user)
        throw new GraphQLError("User isn't authorized to create a post.");
      const { data } = dto;
      const author = ctx.user;
      const post = await ctx.prisma.post.create({
        data: {
          body: data.body,
          title: data.title,
          authorId: author.id,
        },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });

      return post;
    },
    updatePost: async (
      _: any,
      dto: {
        id: number;
        data: {
          title: string;
          body: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      if (!ctx.user)
        throw new GraphQLError("User isn't authorized to update a post.");
      const { id, data } = dto;
      const updatePost = await ctx.prisma.post.update({
        where: {
          id,
        },
        data,
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });

      if (!updatePost) throw new Error("Post not found with the provided Id!");

      return updatePost;
    },
    deletePost: async (_: any, dto: { id: number }, ctx: GraphQLContext) => {
      if (!ctx.user)
        throw new GraphQLError("User isn't authorized to delete a post.");
      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: dto.id,
        },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });

      if (!deletedPost)
        throw new GraphQLError("Post with the provide not found!");

      return deletedPost;
    },
    likePost: async (
      _: any,
      dto: {
        postId: number;
      },
      ctx: GraphQLContext
    ) => {
      const { postId } = dto;
      const user = ctx.user;
      if (!user)
        throw new GraphQLError("User isn't authorized to delete a post.");

      const post = await ctx.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            connect: user,
          },
        },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });

      return post;
    },
    dislikePost: async (
      _: any,
      dto: {
        postId: number;
      },
      ctx: GraphQLContext
    ) => {
      const { postId } = dto;
      const user = ctx.user;
      if (!user)
        throw new GraphQLError("User isn't authorized to delete a post.");

      const post = await ctx.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            delete: user,
          },
        },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });

      return post;
    },
  },
};

export default { typeDefs, resolvers };
