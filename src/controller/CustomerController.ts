import type { NextFunction, Request, Response } from "express"
import { respError, respOk } from "../utils/responses"
import Customer from "../db/models/Customers"

export class CustomerController {
    static createCustomer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password, phone, address } = req.body
            const data = {
                name,
                email,
                password,
                phone: phone ? phone : null,
                address: address ? address : null
            }
            await Customer.create(data)
            res.status(201).send("Customer create successfully")
        } catch (error) {
            next(error)
        }
    }
}