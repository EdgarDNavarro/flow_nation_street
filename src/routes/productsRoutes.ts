import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { ProductController } from "../controller/ProductController";
import { productExists } from "../middleware/products";
import { categoryExists } from "../middleware/categories";
import { CategoriesController } from "../controller/CategoriesController";

const router = Router()

router.post('/', 
    body("name").notEmpty().withMessage("name is required").isString(),
    body("description").notEmpty().withMessage("description is required").isString(),
    body("price")
        .notEmpty().withMessage("price is required")
        .isFloat({ min: 0 }).withMessage("price must be a positive number")
        .customSanitizer(value => parseFloat(parseFloat(value).toFixed(2))),
    body("categoryId").notEmpty().withMessage("name is required").isInt(),
    body("stock").notEmpty().withMessage("stock is required").isInt(),
    handleInputErrors, 
    ProductController.createProduct
)

router.get('/productId/:productId', 
    param('productId').isInt().withMessage("id not valid"),
    handleInputErrors,
    productExists,
    ProductController.getProductById
)

router.get('/', ProductController.getAllProducts)

router.get('/categoryId/:categoryId', 
    param('categoryId').isInt().withMessage("id not valid"),
    handleInputErrors,
    ProductController.getProductsByCategoryId
)

router.put('/productId/:productId', 
    param('productId').isInt().withMessage("id not valid"),
    body("name").notEmpty().withMessage("name is required").isString(),
    body("description").notEmpty().withMessage("description is required").isString(),
    body("price")
        .notEmpty().withMessage("price is required")
        .isFloat({ min: 0 }).withMessage("price must be a positive number")
        .customSanitizer(value => parseFloat(parseFloat(value).toFixed(2))),
    body("categoryId").notEmpty().withMessage("name is required").isInt(),
    body("stock").notEmpty().withMessage("stock is required").isInt(),
    body("discount")
        .notEmpty().withMessage("discount is required")
        .isFloat({ min: 0 }).withMessage("discount must be a positive number")
        .customSanitizer(value => parseFloat(parseFloat(value).toFixed(2))),
    handleInputErrors,
    productExists,
    ProductController.updateProduct
)

router.delete('/productId/:productId', 
    param('productId').isInt().withMessage("id not valid"),
    handleInputErrors,
    productExists,
    ProductController.removeProduct
)

router.post('/categories', 
    body("name").notEmpty().withMessage("name is required").isString(),
    handleInputErrors,
    CategoriesController.createCategory
)

router.get('/categories', CategoriesController.getAllcategories)

router.put('/categories/:categoryId', 
    param('categoryId').isInt().withMessage("id not valid"),
    body("name").notEmpty().withMessage("name is required").isString(),
    handleInputErrors,
    categoryExists,
    CategoriesController.updateCategories
)

router.delete('/categories/:categoryId', 
    param('categoryId').isInt().withMessage("id not valid"),
    handleInputErrors,
    categoryExists,
    CategoriesController.removeCategories
)

export default router