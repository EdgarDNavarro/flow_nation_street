import type { NextFunction, Request, Response } from "express"
import { respError, respOk } from "../utils/responses"
import Product from "../db/models/Products"
import ProductVariant from "../db/models/ProductVariant"

export class ProductVariantController {
    static createProductVariant = async (req: Request, res: Response, next: NextFunction) => {
        const { color, price, size, discount, stock } = req.body
        const { productId } = req.params
        try {
            const sku = `sku-${productId}-${color}-${size}`
            const existVariant = await ProductVariant.findOne({where: {sku}})
            if(existVariant) {
                res.status(409).json(respError({message: `sku ${sku} already exists`}))
                return
            }

            await ProductVariant.create({color, price, size, discount, stock, productId, sku})
            res.status(201).send("Product variant created successfully")
        } catch (error) {
            next(error)
        }
    }

    static getVariantById = async (req: Request, res: Response, next: NextFunction) => {
        res.json(respOk(req.productVariant))
    }

    static updateVariante = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { color, price, size, discount, stock, productId } = req.body
            const { sku } = req.productVariant

            const newSku = `sku-${productId}-${color}-${size}`
            
            if(sku !== newSku) {
                const existVariant = await ProductVariant.findOne({where: {sku: newSku}})
                if(existVariant) {
                    res.status(409).json(respError({message: `sku '${newSku}' already exists`}))
                    return
                }
            }

            req.productVariant.set({ color, price, size, discount, stock, sku: newSku })

            await req.productVariant.save()
            res.send("Update success")
        } catch (error) {
            next(error)
        }
    }

    static removeVariant = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await req.productVariant.destroy()
            res.send("Delete success")
        } catch (error) {
            next(error)
        }
    }
}