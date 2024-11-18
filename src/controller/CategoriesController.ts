import type { NextFunction, Request, Response } from "express"
import Category from "../db/models/Categories"
import { respError, respOk } from "../utils/responses"

export class CategoriesController {

    static createCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const existedCategoryName = await Category.findOne({where: {name: req.body.name}})
            if(existedCategoryName) {
                const error = new Error("There is already a category with that name")
                res.status(409).json(respError({message: error.message}))
                return
            }

            const category = await Category.create(req.body)
            await category.save()
            res.status(201).send("Category created successfully")
        } catch (error) {
            next(error)
        }
    }

    static getAllcategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await Category.findAll()
            res.status(200).json(respOk(categories))
        } catch (error) {
            next(error)
        }
    }

    static updateCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.category.name = req.body.name
            await req.category.save()
            res.send("Update success")
        } catch (error) {
            next(error)
        }
    }

    static removeCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await req.category.destroy()
            res.send("Delete success")
        } catch (error) {
            next(error)
        }
    }
}