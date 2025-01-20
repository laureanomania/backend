import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import * as exphbs from "express-handlebars";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = createServer(app);
export const io = new Server(server);

app.engine(
  "handlebars",
  exphbs.engine({
    layoutsDir: path.join(__dirname, "views", "layouts"),
    defaultLayout: "main",
    extname: ".handlebars",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("layouts/home", { products: productList });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("layouts/realtimeproducts", { products: productList });
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

let productList = [];

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("newProduct", (product) => {
    product.id = productList.length + 1; // Asignar ID único a cada producto
    productList.push(product);
    io.emit("productListUpdate", productList);
  });

  socket.on("deleteProduct", (productId) => {
    productList = productList.filter(
      (product) => product.id !== parseInt(productId)
    );
    io.emit("productListUpdate", productList);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
