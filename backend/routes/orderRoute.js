const express = require("express");
const Authservices = require("../services/authService");
const router = express.Router();
const {
  createCahOrder,
  getOrders,
  filterOrderForLoggedUser,
  getSpacificOrder,
  updateOrderStutusToPaid,
  updateOrderStutusToDailvered,
  checkoutSession,
} = require("../services/orderServices");
router.use(Authservices.protect);
router
  .route("/:cartId")
  .post(Authservices.allowTo("user"), createCahOrder);
router.get("/", filterOrderForLoggedUser, getOrders);
router.route("/:id").get(getSpacificOrder);
router.put(
  "/:id/pay",
  Authservices.allowTo("admin"),
  updateOrderStutusToPaid
);
router.put(
  "/:id/dilvered",
  Authservices.allowTo("admin"),
  updateOrderStutusToDailvered
);
router.post(
  "/chekout-session/:cartId",
  Authservices.allowTo("user"),
  checkoutSession
);
module.exports = router;
