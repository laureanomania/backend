import fs from "fs";
import { v4 as uuid } from "uuid";
import { productService } from "./product.service.js";

class CartService {
  constructor({ path }) {
    this.path = path;
    this.carts = fs.existsSync(path)
      ? JSON.parse(fs.readFileSync(path, "utf-8"))
      : [];
  }

  async create() {
    const id = uuid();
    const cart = { id, products: [] };
    this.carts.push(cart);
    await this.saveOnFile();
    return cart;
  }

  async getById({ id }) {
    return this.carts.find((cart) => cart.id === id);
  }

  async addProduct({ cartId, productId }) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) return null;
    const product = cart.products.find((product) => product.id === productId);
    if (product) {
      product.quantity += 1;
    } else {
      cart.products.push({ id: productId, quantity: 1 });
    }
    await this.saveOnFile();
    return cart;
  }

  async saveOnFile() {
    fs.promises.writeFile(this.path, JSON.stringify(this.carts));
  }
}

export const cartService = new CartService({ path: "./src/db/carts.json" });
