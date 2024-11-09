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
    likePost(userId: Int!, postId: Int!): Post!
    dislikePost(userId: Int!, postId: Int!): Post!
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
    posts: async (parent: unknown, args: {}, ctx: GraphQLContext) => {
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
    post: async (
      parent: unknown,
      args: { id: number },
      ctx: GraphQLContext
    ) => {
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
          authorId: number;
          title: string;
          body: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      const { data } = dto;
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: data.authorId,
        },
      });
      if (!user)
        throw new Error("Author with the provide author ID not found!");
      const post = await ctx.prisma.post.create({
        data: {
          body: data.body,
          title: data.title,
          authorId: data.authorId,
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

      if (!deletedPost) throw new Error("Post with the provide not found!");

      return deletedPost;
    },
    likePost: async (
      _: any,
      dto: {
        userId: number;
        postId: number;
      },
      ctx: GraphQLContext
    ) => {
      const { userId, postId } = dto;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new Error("User not found with the provide Id!");

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
        userId: number;
        postId: number;
      },
      ctx: GraphQLContext
    ) => {
      const { userId, postId } = dto;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new Error("User not found with the provide Id!");

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
