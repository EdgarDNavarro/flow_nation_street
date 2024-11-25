import type { NextFunction, Request, Response } from "express"
import { respError, respOk } from "../utils/responses"
import Product from "../db/models/Products"
import ProductVariant from "../db/models/ProductVariant"
import ProductImage from "../db/models/ProductImage"
import Category from "../db/models/Categories"

export class ProductController {
    static createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Product.create(req.body)
            res.status(201).send("Product created successfully")
        } catch (error) {
            next(error)
        }
    }

    static getProductById = async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params

        try {
            const product = await Product.findByPk(productId, {
                include: [{
                    model: ProductVariant,
                    include: [{ model: ProductImage }]
                }]
            })
        
            if(!product) {
                const error = new Error("Product not found")
                res.status(404).json(respError({message: error.message}))
                return
            }
    
            res.json(respOk(product))
        } catch (error) {
            next(error)
        }
    }

    static getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: ProductVariant,
                        include: [{
                            model: ProductImage,
                            where: { is_main: true },
                            required: true 
                        }]
                    },
                    {
                        model: Category
                    }
                ]
            });            
            res.json(respOk(products))
        } catch (error) {
            next(error)
        }
    }

    static getProductsByCategoryId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await Product.findAll({where: {categoryId: req.params.categoryId}})
            res.json(respOk(products))
        } catch (error) {
            next(error)
        }
    }

    static updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, description, status, categoryId, collection } = req.body
            req.product.set({ name, description, categoryId, status, collection  })
            await req.product.save()
            res.send("Update success")
        } catch (error) {
            next(error)
        }
    }

    static removeProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await req.product.destroy()
            res.send("Delete success")
        } catch (error) {
            next(error)
        }
    }
}