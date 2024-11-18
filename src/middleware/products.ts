import type { Request, Response, NextFunction } from "express"
import Product from "../db/models/Products"
import { respError } from "../utils/responses"


declare global {
    namespace Express {
        interface Request {
            product: Product
        }
    }
}

export async function productExists(req:Request, res:Response, next:NextFunction) {
    try {
        const { productId } = req.params
        const product = await Product.findByPk(productId)
        
        if(!product) {
            const error = new Error("Product not found")
            res.status(404).json(respError({message: error.message}))
            return
        }
        req.product = product
        next()
    } catch (error) {
        next(error)
    }
}