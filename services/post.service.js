// services/postService.js

const { PostModel } = require("../models/post.model");
//const { Post } = require("@interfaces/posts.interface");
const { CommentModel } = require("../models/comment.model");
const { LikeModel } = require("../models/like.model");
const { UserModel } = require("../models/user.model");
const HttpException  = require("../exceptions/HttpException");

const PostService = {
  createPost: async (postData) => {
    try {
      const newPost = await PostModel.create(postData);
      const createdPost = await PostModel.findByPk(newPost.id, {
        include: [
          {
            model: CommentModel,
            as: "comments",
            include: [
              {
                model: UserModel,
                as: "commented_by",
              },
            ],
          },
          {
            model: LikeModel,
            as: "likes",
            include: [
              {
                model: UserModel,
                as: "liked_by",
              },
            ],
          },
          {
            model: UserModel,
            as: "posted_by",
          },
        ],
      });

      return createdPost;
    } catch (error) {
      console.log(error.message)
      throw new HttpException(500, "Unable to fetch post");
    }
  },

  getAllPosts: async () => {
    try {
      const posts = await PostModel.findAll({
        include: [
          {
            model: CommentModel,
            as: "comments",
            include: [
              {
                model: UserModel,
                as: "commented_by",
              },
            ],
          },
          {
            model: LikeModel,
            as: "likes",
            include: [
              {
                model: UserModel,
                as: "liked_by",
              },
            ],
          },
          {
            model: UserModel,
            as: "posted_by",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return posts;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch post");
    }
  },

  getPostById: async (postId) => {
    try {
      const post = await PostModel.findByPk(postId, {
        include: [
          {
            model: CommentModel,
            as: "comments",
            include: [
              {
                model: UserModel,
                as: "commented_by",
              },
            ],
          },
          {
            model: LikeModel,
            as: "likes",
            include: [
              {
                model: UserModel,
                as: "liked_by",
              },
            ],
          },
          {
            model: UserModel,
            as: "posted_by",
          },
        ],
      });

      return post || null;
    } catch (error) {
      throw new HttpException(500, "Error fetching post");
    }
  },

  updatePost: async (userId, postId, updatedData) => {
    try {
      const post = await PostModel.findOne({ where: { id: postId } });

      if (!post) {
        throw new HttpException(404, "Post not found");
      }

      if (post.dataValues.created_by !== userId) {
        throw new HttpException(
          403,
          "You are not authorized to update this post"
        );
      }

      const [updatedRowsCount, updatedPosts] = await PostModel.update(
        updatedData,
        {
          where: { id: postId },
          returning: true,
        }
      );

      return [updatedRowsCount, updatedPosts];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to update post");
      }
    }
  },

  deletePost: async (userId, postId) => {
    try {
      const post = await PostModel.findOne({ where: { id: postId } });

      if (!post) {
        throw new HttpException(404, "Post not found");
      }

      if (post.dataValues.created_by !== userId) {
        throw new HttpException(
          403,
          "You are not authorized to delete this post"
        );
      }

      const deletedRowsCount = await PostModel.destroy({
        where: { id: postId },
      });

      return deletedRowsCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to delete post");
      }
    }
  },

  likePost: async (postId, userId) => {
    try {
      const existingLike = await LikeModel.findOne({
        where: {
          postedId: postId,
          userId: userId,
        },
      });

      if (existingLike) {
        throw new HttpException(400, "You have already liked this post");
      }
      await LikeModel.create({
        postedId: postId,
        userId: userId,
      });

      const updatedPost = await PostModel.findByPk(postId, {
        include: [
          {
            model: CommentModel,
            as: "comments",
            include: [
              {
                model: UserModel,
                as: "commented_by",
              },
            ],
          },
          {
            model: LikeModel,
            as: "likes",
            include: [
              {
                model: UserModel,
                as: "liked_by",
              },
            ],
          },
          {
            model: UserModel,
            as: "posted_by",
          },
        ],
      });

      return updatedPost || null;
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  },

  unlikePost: async (postId, likeId) => {
    try {
      const deletedLike = await LikeModel.findByPk(likeId);
      if (deletedLike) {
        await deletedLike.destroy();
      }

      const updatedPost = await PostModel.findByPk(postId, {
        include: [
          {
            model: CommentModel,
            as: "comments",
            include: [
              {
                model: UserModel,
                as: "commented_by",
              },
            ],
          },
          {
            model: LikeModel,
            as: "likes",
            include: [
              {
                model: UserModel,
                as: "liked_by",
              },
            ],
          },
          {
            model: UserModel,
            as: "posted_by",
          },
        ],
      });

      return updatedPost || null;
    } catch (error) {
      throw new HttpException(500, "Error while unliking post");
    }
  },

  createComment: async (postId, userId, body) => {
    try {
      await CommentModel.create({
        postId: postId,
        userId: userId,
        body: body,
      });

      const updatedPost = await PostModel.findByPk(postId, {
        include: [
          {
            model: CommentModel,
            as: "comments",
            include: [
              {
                model: UserModel,
                as: "commented_by",
              },
            ],
          },
          {
            model: LikeModel,
            as: "likes",
            include: [
              {
                model: UserModel,
                as: "liked_by",
              },
            ],
          },
          {
            model: UserModel,
            as: "posted_by",
          },
        ],
      });

      return updatedPost || null;
    } catch (error) {
      throw new HttpException(500, "Error while creating comment");
    }
  },

  deleteComment: async (userId, commentId, postId) => {
    try {
      const deletedComment = await CommentModel.findByPk(commentId);
      if (!deletedComment) {
        throw new HttpException(404, "Comment not found");
      }

      if (deletedComment.dataValues.userId !== userId) {
        throw new HttpException(
          403,
          "You are not authorized to delete this comment"
        );
      }

      await deletedComment.destroy();

      const updatedPost = await PostModel.findByPk(postId, {
        include: [
          {
            model: CommentModel,
            as: "comments",
            include: [
              {
                model: UserModel,
                as: "commented_by",
              },
            ],
          },
          {
            model: LikeModel,
            as: "likes",
            include: [
              {
                model: UserModel,
                as: "liked_by",
              },
            ],
          },
          {
            model: UserModel,
            as: "posted_by",
          },
        ],
      });

      return updatedPost || null;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Error while deleting comment");
      }
    }
  },
};

module.exports = { PostService };
