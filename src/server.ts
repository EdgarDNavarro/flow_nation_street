import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
// import { corsConfig } from './config/cors'
import db from "./db/models/index"
import colors from 'colors'
import { respError } from './utils/responses'
import productRoutes from './routes/productsRoutes'

dotenv.config()

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.bold.magenta('DB conectada'))
        console.log(colors.bold.magenta('------------------------------'))
    } catch (error) { 
        console.log(error);
        console.log(colors.red.bold("Hubo un error al conectarr con la BD"));
    }
}
connectDB()
const app = express()
app.use(express.static(path.join(__dirname, '/uploads')));
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/product', productRoutes)


app.use((err: Error, _req: Request, res: Response, next: NextFunction): void => {
    console.error(err); 

    if (res.headersSent) {
        return next(err); 
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(409).json(respError({
            message: 'Foreign key constraint failed.',
            details: err.message,
        }));
        return
    }

    res.status(500).json(respError({
        msg: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    }));
    
})

export default app