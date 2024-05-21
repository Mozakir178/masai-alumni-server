const express = require("express");
const { ensureAuth, ensureAdminAuth } = require("../middlewares/auth.middleware");
const { HOFController } = require("../controllers/HOF.controller"); 

const router = express.Router();
const path = "/hofs"; 

router.post(path, ensureAdminAuth, HOFController.createHOF);
router.get(path, HOFController.getAllHOFEntries);
router.get(`${path}/:id`, ensureAuth, HOFController.getHOFEntryById);
router.put(`${path}/:id`, ensureAdminAuth, HOFController.updateHOFEntry);
router.delete(`${path}/:id`, ensureAdminAuth, HOFController.deleteHOFEntry);

module.exports = router;
