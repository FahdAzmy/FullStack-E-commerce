const asyncHandler = require("express-async-handler");
const factory = require("./handlerFactory");
const ApiError = require("../utils/apierror");
const productModel = require("../models/productModel");
const cartModel = require("../models/curtMdoel");
const orderModel = require("../models/orderModel");

const getStripe = () => {
  if (!process.env.stipe_secret) {
    throw new ApiError("Stripe secret key is not configured", 500);
  }
  return require("stripe")(process.env.stipe_secret);
};

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getDocument(model, id) {
  return model.findById(id);
}

function getCartPrice(cart) {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cartPrice = Number(
    cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalCartPrice
  );
  return cartPrice + shippingPrice + taxPrice;
}

function updateQuntityAndProductSold(cart) {
  return cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));
}

async function clearCart(cartId) {
  await cartModel.findByIdAndDelete(cartId);
}

// ── Cash Order ────────────────────────────────────────────────────────────────

// POST /orders/:cartId
exports.createCahOrder = asyncHandler(async (req, res, next) => {
  const cart = await getDocument(cartModel, req.params.cartId);
  if (!cart) return next(new ApiError("Cart is empty", 404));

  const totalPrice = getCartPrice(cart);

  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: totalPrice,
  });

  if (order) {
    await productModel.bulkWrite(updateQuntityAndProductSold(cart), {});
    await clearCart(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

// ── Order Queries ─────────────────────────────────────────────────────────────

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

exports.getOrders = factory.getAll(orderModel);
exports.getSpacificOrder = factory.getOne(orderModel);

// ── Admin Status Updates ──────────────────────────────────────────────────────

exports.updateOrderStutusToPaid = asyncHandler(async (req, res, next) => {
  const order = await getDocument(orderModel, req.params.id);
  if (!order) return next(new ApiError("No order found", 404));
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

exports.updateOrderStutusToDailvered = asyncHandler(async (req, res, next) => {
  const order = await getDocument(orderModel, req.params.id);
  if (!order) return next(new ApiError("No order found", 404));
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "Delivered", data: updatedOrder });
});

// ── Stripe Checkout Session ───────────────────────────────────────────────────

// POST /orders/chekout-session/:cartId
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const cart = await getDocument(cartModel, req.params.cartId);
  if (!cart) return next(new ApiError("Cart is empty", 404));

  const totalPrice = getCartPrice(cart);

  const session = await getStripe().checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(totalPrice * 100), // ensure it's an integer
          product_data: { name: req.user.name },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders/confirmation`,
    cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  res.status(200).json({ status: "success", session });
});
