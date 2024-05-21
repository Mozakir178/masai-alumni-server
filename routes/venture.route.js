const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const { VentureController } = require("../controllers/venture.controller");

const router = express.Router();
const path = "/ventures";
router.post(path, ensureAuth, VentureController.createVenture);

router.get(`${path}/:id`, ensureAuth,VentureController.getVentureById);
router.delete(`${path}/:id`, ensureAuth, VentureController.deleteVenture);
router.get(path, ensureAuth, VentureController.getAllVentures);
router.patch(`${path}/:id`, ensureAuth, VentureController.updateVenture);

router.patch(`${path}/acceptVentureRequest/:id`, ensureAuth, VentureController.acceptVentureRequest);
router.delete(`${path}/rejectVentureRequest/:id`, ensureAuth, VentureController.rejectVentureRequest);


module.exports = router;
