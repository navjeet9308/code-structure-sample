/**
 * Service Methods
 */

 import { HttpException } from '../exceptions/HttpException'
 import { Product } from '@my-app/common/src/candidate/product.interface';
 import ProductModel from '../models/product.model';
 import { isEmpty } from '../utils/utility';
 import { Service } from "typedi";
 @Service()
 class ProductService {
 
   public async findAllProduct(): Promise<Product[]> {
     const products: Product[] = await ProductModel.find();
     return products;
   }
 
   public async findProductById(productId: string): Promise<Product> {
     if (isEmpty(productId)) throw new HttpException(400, "Product Id is required");
 
     const findProduct: Product | null = await ProductModel.findOne({ _id: productId }!);
     if (!findProduct) throw new HttpException(409, "Product not found");
 
     return findProduct;
   }
 
   public async createProduct(productData: Product): Promise<Product> {
     if (isEmpty(productData)) throw new HttpException(400, "Product data is required");
 
     const createProductData:any = await ProductModel.create({ ...productData });
 
     return createProductData;
   }
 
   public async updateProduct(productId: string, productData: Product): Promise<Product> {
     if (isEmpty(productData)) throw new HttpException(400, "Product data is required");
 
     const updateProductById: Product | null = await ProductModel.findByIdAndUpdate(productId, productData);
     if (!updateProductById) throw new HttpException(409, "Failed to update Product");
 
     return updateProductById;
   }
 
   public async deleteProduct(productId: string): Promise<Product> {
     const deleteProductById: Product | null = await ProductModel.findByIdAndDelete(productId);
     if (!deleteProductById) throw new HttpException(409, "Failed to delete Product");
 
     return deleteProductById;
   }
 }
 
 export default ProductService;
 
