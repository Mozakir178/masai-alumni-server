const  express  = require("express");
const { ensureAuth, ensureAdminAuth } = require("../middlewares/auth.middleware");
const {SpotlightController} = require("../controllers/spotLight.controller");

const router = express.Router();
const path = "/spotlight";

// Public route
router.get(`${path}/:id`, ensureAuth, SpotlightController.getSpotlightById );
router.delete(`${path}/:id`, ensureAdminAuth, SpotlightController.deleteSpotlight);
router.post(path, ensureAdminAuth, SpotlightController.createSpotlight);
router.get(path, ensureAuth, SpotlightController.getAllSpotlights);
router.put(`${path}/:id`, ensureAdminAuth, SpotlightController.updateSpotlight);

module.exports = router;
