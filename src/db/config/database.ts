import 'dotenv/config'
import { Options } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const { DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT } = process.env

const config: Options = {
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  host: DB_HOST,
  dialect: "postgres",
  port: +DB_PORT,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false
    },
  },
}

export = config