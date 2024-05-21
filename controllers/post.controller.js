const { PostService } = require("../services/post.service");
const { NoticeService } = require("../services/notice.service");
const HttpException  = require("../exceptions/HttpException");

const PostController = {
  createPost: async (req, res, next) => {
    try {
      const { title, content, attachments, postType } = req.body;
      const id = Number(req.user.id);

      const postData = {
        title,
        content,
        attachments,
        postType,
      };

      const newPost = await PostService.createPost({
        ...postData,
        created_by: id,
      });

      if (postType === "announcement") {
        await NoticeService.createNotice({
          attachmentId: newPost.dataValues.id,
          category: "announcement",
          authorId: id,
        });
      }

      res.status(201).json({ success: true, data: newPost });
    } catch (error) {
      next(error);
    }
  },

  getAllPosts: async (req, res, next) => {
    try {
      const posts = await PostService.getAllPosts();
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      next(error);
    }
  },

  getPostById: async (req, res, next) => {
    try {
      const postId = Number(req.params.id);
      const post = await PostService.getPostById(postId);

      if (!post) {
        throw new HttpException(404, "Post not found");
      }

      res.status(200).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const userId = Number(req.user.id);
      const postId = Number(req.params.id);
      const { title, content, image } = req.body;

      if (!title || !content) {
        res
          .status(400)
          .json({ error: "Title and content are required fields" });
        return;
      }

      const postData = {
        title,
        content,
        image,
      };

      const [updatedRowsCount, updatedPosts] = await PostService.updatePost(
        userId,
        postId,
        postData
      );

      if (updatedRowsCount === 0) {
        throw new HttpException(
          404,
          "Post not found or Unauthorized: You are not the creator of this spotlight"
        );
      } else {
        res.status(200).json({ message: "Post is updated", updatedPosts });
      }
    } catch (error) {
      next(error);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const postId = Number(req.params.id);
      const deletedRowsCount = await PostService.deletePost(
        req.user.id,
        postId
      );

      if (deletedRowsCount === 0) {
        throw new HttpException(404, "Post not found");
      } else {
        await NoticeService.deleteNoticebyAttachmentID(postId, "announcement");
        res.status(200).json({
          message: "Poll deleted successfully",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  likePost: async (req, res, next) => {
    try {
      const { postId } = req.body;
      const userId = Number(req.user.id);

      const updatedPost = await PostService.likePost(postId, userId);

      if (!updatedPost) {
        throw new HttpException(404, "Post not found");
      }

      res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
      next(error);
    }
  },

  unlikePost: async (req, res, next) => {
    try {
      const { postId, likeId } = req.body;

      const updatedPost = await PostService.unlikePost(postId, likeId);

      if (!updatedPost) {
        throw new HttpException(404, "Spotlight not found");
      }

      res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
      next(error);
    }
  },

  createComment: async (req, res, next) => {
    try {
      const { postId, body } = req.body;
      const userId = Number(req.user.id);

      const updatedPost = await PostService.createComment(postId, userId, body);

      if (!updatedPost) {
        throw new HttpException(404, "Post not found");
      }

      res.status(201).json({ success: true, data: updatedPost });
    } catch (error) {
      next(error);
    }
  },

  deleteComment: async (req, res, next) => {
    try {
      const { commentId, postId } = req.body;
      const userId = Number(req.user.id);

      const updatedPost = await PostService.deleteComment(
        userId,
        commentId,
        postId
      );

      if (!updatedPost) {
        throw new HttpException(
          404,
          "Comment not found or Unauthorized: You are not the creator of this comment"
        );
      }

      res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { PostController };
