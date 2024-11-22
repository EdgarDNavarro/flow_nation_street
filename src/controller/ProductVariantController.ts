import type { NextFunction, Request, Response } from "express"
import multer, { MulterError } from "multer"
import fs from 'fs';
import path from 'path';
import shortid from "shortid"
import { respError, respOk } from "../utils/responses"
import ProductVariant from "../db/models/ProductVariant"
import ProductImage from "../db/models/ProductImage"

const multerConfig = {
    limits : { fileSize : 5000000},
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, __dirname+'../../uploads')
        },
        filename: (_req, file, cb) => {
            let extension = file.mimetype.split('/')[1];
            if(extension === 'svg+xml') {
                extension = 'svg'
            }
            cb(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(_req: Request, file: Express.Multer.File, cb: (error: Error | null, destination?: boolean) => void) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg+xml') {
            cb(null, true)
        } else {
            cb(new Error('Invalid format'))
        }
    }
}

const upload = multer(multerConfig).single('img')

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

    static uploadImage = (req: Request, res: Response, next: NextFunction) => {
        upload(req, res, (error: any) => { 
            if (error instanceof MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    res.status(413).json(respError({ message: 'The file is very large, maximum 5MB', error: error.message }));
                    return;
                }
                res.status(400).json(respError({ message: 'Multer error', error: error.message }));
                return;
            } else if (error) {
                res.status(500).json(respError({ message: 'An unexpected error occurred', error: error.message }));
                return;
            }
            next(); 
        });
    };

    static createProductImage = async (req: Request, res: Response, next: NextFunction) => {
        const { is_main, position } = req.body
        const file = req.file
        const { variantId } = req.params
        if (!file) {
            res.status(400).json(respError({ message: "No file provided" }));
            return;
        }

        try {
            await ProductImage.create({is_main, position, productVariantId: variantId, image_url: file.filename})
            res.status(201).send("Created")
        } catch (error) {
            next(error)
        }
    }

    static updateProductImage = async (req: Request, res: Response, next: NextFunction) => {
        const file = req.file
        if (!file) {
            res.status(400).json(respError({ message: "No file provided" }));
            return;
        }

        try {
            const previousImage = req.productImage.image_url;

            const previousImagePath = path.join('src/uploads/', previousImage);
            
            if (fs.existsSync(previousImagePath)) {
                fs.unlinkSync(previousImagePath);
            }

            req.productImage.image_url = file.filename
            await req.productImage.save();
            res.status(200).send("Image updated successfully")
        } catch (error) {
            next(error)
        }
    }

    static updateProductImageIsMain = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.productImage.is_main = !req.productImage.is_main
            await req.productImage.save();
            res.status(200).send("Image updated successfully")
        } catch (error) {
            next(error)
        }
    }

    static updateProductImagePosition = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.productImage.position = req.body.position
            await req.productImage.save();
            res.status(200).send("Image updated successfully")
        } catch (error) {
            next(error)
        }
    }
}