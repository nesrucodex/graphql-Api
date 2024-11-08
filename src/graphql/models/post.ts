import db from "../../libs/prisma-client";

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

  Mutation: {
    createPost: async (
      _: any,
      dto: {
        data: {
          authorId: number;
          title: string;
          body: string;
        };
      }
    ) => {
      const { data } = dto;
      const user = await db.user.findUnique({
        where: {
          id: data.authorId,
        },
      });
      if (!user)
        throw new Error("Author with the provide author ID not found!");
      const post = await db.post.create({
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
      }
    ) => {
      const { id, data } = dto;
      const updatePost = await db.post.update({
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
    deletePost: async (_: any, dto: { id: number }) => {
      const deletedPost = await db.post.delete({
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
      }
    ) => {
      const { userId, postId } = dto;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new Error("User not found with the provide Id!");

      const post = await db.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            create: {
              name: user.name,
            },
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
      }
    ) => {
      const { userId, postId } = dto;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new Error("User not found with the provide Id!");

      const post = await db.post.update({
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
