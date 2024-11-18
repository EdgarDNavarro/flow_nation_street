import type { Request, Response, NextFunction } from "express"
import { respError } from "../utils/responses"
import Customer from "../db/models/Customers"


export async function emailExists(req:Request, res:Response, next:NextFunction) {
    try {
        const { email } = req.body
        const customer = await Customer.findOne({where: {email}})
        
        if(customer) {
            const error = new Error("That email is already in use")
            res.status(409).json(respError({message: error.message}))
            return
        }

        next()
    } catch (error) {
        next(error)
    }
}