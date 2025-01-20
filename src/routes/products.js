import { Router } from "express";
import { productService } from "../services/product.service.js";
import { io } from "../server.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productService.getAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getById({ id: pid });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;
    const product = await productService.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });
    io.emit("productListUpdate", await productService.getAll());
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;
    const product = await productService.update({
      id: pid,
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    io.emit("productListUpdate", await productService.getAll());
    res.status(200).json(product);
  } catch (error) {
    res.status500.json({ message: "Internal server error" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.delete({ id: pid });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    io.emit("productListUpdate", await productService.getAll());
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
