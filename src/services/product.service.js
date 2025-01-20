let products = [];

export const productService = {
  getAll: async () => {
    return products;
  },
  getById: async ({ id }) => {
    return products.find((product) => product.id === parseInt(id));
  },
  create: async (product) => {
    product.id = products.length + 1;
    products.push(product);
    return product;
  },
  update: async ({
    id,
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  }) => {
    const product = products.find((product) => product.id === parseInt(id));
    if (product) {
      product.title = title;
      product.description = description;
      product.code = code;
      product.price = price;
      product.stock = stock;
      product.category = category;
      product.thumbnails = thumbnails;
      return product;
    }
    return null;
  },
  delete: async ({ id }) => {
    const index = products.findIndex((product) => product.id === parseInt(id));
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1);
      return deletedProduct[0];
    }
    return null;
  },
};
