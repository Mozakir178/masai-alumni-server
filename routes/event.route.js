const express = require("express");
const { ensureAuth, ensureAdminAuth } = require("../middlewares/auth.middleware");
const { EventController } = require("../controllers/event.controller");

const router = express.Router();
const path = "/events";

router.get(path, ensureAuth, EventController.getAllEvent);
router.get(`${path}/:id`, ensureAuth, EventController.getEventById);
router.post(path, ensureAdminAuth, EventController.createEvent);
router.patch(`${path}/:id`, ensureAdminAuth, EventController.updateEvent);
router.delete(`${path}/:id`, ensureAdminAuth, EventController.deleteEvent);

module.exports =  router ;
