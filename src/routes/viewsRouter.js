import { Router } from "express";
import { productService } from "../services/product.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productService.getAll();
    res.render("home", { title: "Lista de Productos", products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/realtime-products", async (req, res) => {
  try {
    const products = await productService.getAll();
    res.render("realtimeProducts", {
      title: "Productos en Tiempo Real",
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
