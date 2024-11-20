import type { Request, Response, NextFunction } from "express"
import { respError } from "../utils/responses"
import ProductVariant from "../db/models/ProductVariant"


declare global {
    namespace Express {
        interface Request {
            productVariant: ProductVariant
        }
    }
}

export async function variantExists(req:Request, res:Response, next:NextFunction) {
    try {
        const { variantId } = req.params
        const variant = await ProductVariant.findByPk(variantId)
        
        if(!variant) {
            const error = new Error("Variant not found")
            res.status(404).json(respError({message: error.message}))
            return
        }
        req.productVariant = variant
        next()
    } catch (error) {
        next(error)
    }
}