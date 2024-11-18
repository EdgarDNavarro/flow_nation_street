import type { NextFunction, Request, Response } from "express"
import Category from "../db/models/Categories"
import { respError, respOk } from "../utils/responses"
import Product from "../db/models/Products"

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
        res.json(respOk(req.product))
    }

    static getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await Product.findAll()
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
            const { name, description, price, categoryId, stock, discount } = req.body
            req.product.set({ name, description, price, categoryId, stock, discount })
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