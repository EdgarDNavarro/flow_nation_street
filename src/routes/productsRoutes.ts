import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { ProductController } from "../controller/ProductController";
import { productExists } from "../middleware/products";
import { categoryExists } from "../middleware/categories";
import { CategoriesController } from "../controller/CategoriesController";
import { productStatus } from "../db/models/Products";
import { productVariantColors, productVariantSizes } from "../db/models/ProductVariant";
import { ProductVariantController } from "../controller/ProductVariantController";
import { variantExists } from "../middleware/productVariant";
import { productImageExists } from "../middleware/productimage";

const router = Router()

//** CATEGORIES */
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

//** PRODUCTS */
router.post('/', 
    body("name").notEmpty().withMessage("name is required").isString(),
    body("description").notEmpty().withMessage("description is required").isString(),
    body("collection").isString().withMessage("collection is required"),
    body("status")
        .custom(status => {
            if (!Object.values(productStatus).includes(status)) {
                throw new Error("Incorrect type status. Correct values are 'published', 'inactive', and 'scheduled'");
            }
            return true;
        }),
    body("categoryId").notEmpty().withMessage("name is required").isInt(),
    handleInputErrors, 
    ProductController.createProduct
)

router.get('/productId/:productId', 
    param('productId').isInt().withMessage("id not valid"),
    handleInputErrors,
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
    body("categoryId").notEmpty().withMessage("name is required").isInt(),
    body("collection").notEmpty().withMessage("collection is required").isString(),
    body("status")
        .custom(status => {
            if (!Object.values(productStatus).includes(status)) {
                throw new Error("Incorrect type status. Correct values are 'published', 'inactive', and 'scheduled'");
            }
            return true;
        }),
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

//** VARIANT */
router.post('/productId/:productId/variant', 
    param('productId').isInt().withMessage("id not valid"),
    body("size")
        .toUpperCase()
        .custom(size => {
            if (!Object.values(productVariantSizes).includes(size)) {
                throw new Error("Incorrect type size.");
            }
            return true;
        }),
    body("color")
        .toLowerCase()
        .custom(color => {
            if (!Object.values(productVariantColors).includes(color)) {
                throw new Error("Incorrect type color.");
            }
            return true;
        }),
    body("price")
        .notEmpty().withMessage("price is required")
        .isFloat({ min: 0 }).withMessage("price must be a positive number")
        .customSanitizer(value => parseFloat(parseFloat(value).toFixed(2))),
    body("discount").notEmpty().withMessage("discount is required").isInt({min: 0, max: 100}),
    body("stock").notEmpty().withMessage("stock is required").isInt({min: 0}),
    handleInputErrors,
    productExists,
    ProductVariantController.createProductVariant
)

router.get('/variant/:variantId', 
    param('variantId').isInt().withMessage("id not valid"),
    handleInputErrors,
    variantExists,
    ProductVariantController.getVariantById
)

router.put('/variant/:variantId', 
    param('variantId').isInt().withMessage("id not valid"),
    body('productId').isInt().withMessage("productId not valid"),
    body("size")
        .toUpperCase()
        .custom(size => {
            if (!Object.values(productVariantSizes).includes(size)) {
                throw new Error("Incorrect type size.");
            }
            return true;
        }),
    body("color")
        .toLowerCase()
        .custom(color => {
            if (!Object.values(productVariantColors).includes(color)) {
                throw new Error("Incorrect type color.");
            }
            return true;
        }),
    body("price")
        .notEmpty().withMessage("price is required")
        .isFloat({ min: 0 }).withMessage("price must be a positive number")
        .customSanitizer(value => parseFloat(parseFloat(value).toFixed(2))),
    body("discount").notEmpty().withMessage("discount is required").isInt({min: 0, max: 100}),
    body("stock").notEmpty().withMessage("stock is required").isInt({min: 0}),
    handleInputErrors,
    variantExists,
    ProductVariantController.updateVariante
)

router.delete('/variant/:variantId', 
    param('variantId').isInt().withMessage("id not valid"),
    handleInputErrors,
    variantExists,
    ProductVariantController.removeVariant
)

//** IMAGES */

router.post('/variant/:variantId/image',
    param('variantId').isInt().withMessage("id not valid"),
    body('is_main').isBoolean(),
    body('position').isInt(),
    handleInputErrors,
    variantExists,
    ProductVariantController.uploadImage,
    ProductVariantController.createProductImage
)

router.put('/variant/image/:productImageId',
    param('productImageId').isInt().withMessage("id not valid"),
    handleInputErrors,
    productImageExists,
    ProductVariantController.uploadImage,
    ProductVariantController.updateProductImage
)

router.patch('/variant/image/:productImageId/is_main',
    param('productImageId').isInt().withMessage("id not valid"),
    handleInputErrors,
    productImageExists,
    ProductVariantController.updateProductImage
)

router.patch('/variant/image/:productImageId/position',
    param('productImageId').isInt().withMessage("id not valid"),
    body('position').isInt(),
    handleInputErrors,
    productImageExists,
    ProductVariantController.updateProductImage
)

export default router