import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { CustomerController } from "../controller/CustomerController";

const router = Router()

router.post('/',
    body('name').notEmpty().isString().withMessage("name is required"),
    body('email').isEmail().withMessage("this email is not valid"),
    body('password').notEmpty().isStrongPassword().withMessage("It has to be a strong password"),
    handleInputErrors,
    CustomerController.createCustomer
)

export default router