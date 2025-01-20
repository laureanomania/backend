import { Router } from "express";
import { cartService } from "../services/cart.service.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const cart = await cartService.create();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartService.getById({ id: cid });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  res.status(200).json(cart.products);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartService.addProduct({ cartId: cid, productId: pid });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
