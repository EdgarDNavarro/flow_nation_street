import type { Request, Response, NextFunction } from "express"
import { respError } from "../utils/responses"
import Category from "../db/models/Categories"


declare global {
    namespace Express {
        interface Request {
            category: Category
        }
    }
}

export async function categoryExists(req:Request, res:Response, next:NextFunction) {
    try {
        const { categoryId } = req.params
        const category = await Category.findByPk(categoryId)
        
        if(!category) {
            const error = new Error("Category not found")
            res.status(404).json(respError({message: error.message}))
            return
        }
        req.category = category
        next()
    } catch (error) {
        next(error)
    }
}