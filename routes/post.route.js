const express = require("express");
const { ensureAuth, ensureAdminAuth } = require("../middlewares/auth.middleware");
const { PostController } = require("../controllers/post.controller");

const router = express.Router();
const path = "/posts";

router.post(`${path}/create`,ensureAdminAuth, PostController.createPost);
router.get(`${path}/:id`, ensureAuth, PostController.getPostById);
router.delete(`${path}/:id`, ensureAdminAuth, PostController.deletePost);
router.get(path, ensureAuth, PostController.getAllPosts);
router.put(`${path}/:id`, ensureAdminAuth, PostController.updatePost);

router.post(`${path}/like`, ensureAuth, PostController.likePost);
router.post(`${path}/unlike`, ensureAuth, PostController.unlikePost);

router.post(`${path}/addComment`, ensureAuth, PostController.createComment);
router.post(`${path}/deleteComment`, ensureAuth, PostController.deleteComment);

module.exports = router;
