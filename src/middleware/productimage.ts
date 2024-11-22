import type { Request, Response, NextFunction } from "express"
import { respError } from "../utils/responses"
import ProductImage from "../db/models/ProductImage"


declare global {
    namespace Express {
        interface Request {
            productImage: ProductImage
        }
    }
}

export async function productImageExists(req:Request, res:Response, next:NextFunction) {
    try {
        const { productImageId } = req.params
        const image = await ProductImage.findByPk(productImageId)
        
        if(!image) {
            const error = new Error("image not found")
            res.status(404).json(respError({message: error.message}))
            return
        }
        req.productImage = image
        next()
    } catch (error) {
        next(error)
    }
}