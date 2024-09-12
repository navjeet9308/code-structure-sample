import mongoose from "mongoose";
import BaseSchema from "./base.model";
const productSchema = new mongoose.Schema(
  {
    ...BaseSchema.obj,
    title: {type: String},
    last_used: { type: Date}
  },
  {
      timestamps: true,
  }
);

/**
 * @typedef ProductModel
 */
const ProductModel = mongoose.model("Product", productSchema, "products");

export default ProductModel;