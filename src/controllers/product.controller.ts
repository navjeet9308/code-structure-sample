import 'reflect-metadata'; // mandatory for injection
import { NextFunction, Request, Response } from 'express';
import { Product } from '@my-app/common/src/candidate/product.interface';
import ProductService from '../services/product.service';
import { Service } from "typedi";
@Service()
class ProductController {
  constructor(private readonly productService: ProductService) { }
  public getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllProductData: Product[] = await this.productService.findAllProduct();
      res.status(200).json({ data: findAllProductData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId: string = req.params.id;
      const findOneProductData: Product = await this.productService.findProductById(productId);
      res.status(200).json({ data: findOneProductData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productData: any = req.body;
      const createProductData: Product = await this.productService.createProduct(productData);
      res.status(201).json({ data: createProductData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId: string = req.params.id;
      const productData: any = req.body;
      const updateProductData: Product = await this.productService.updateProduct(productId, productData);
      res.status(200).json({ data: updateProductData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId: string = req.params.id;
      const deleteProductData: Product = await this.productService.deleteProduct(productId);
      res.status(200).json({ data: deleteProductData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
