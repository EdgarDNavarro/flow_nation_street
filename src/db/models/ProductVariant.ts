import { Model, DataTypes, ForeignKey } from "sequelize";
import db from ".";
import Product from "./Products";

export const productVariantColors = {
  RED: "red",
  BLUE: "blue",
  WHITE: "white",
  BLACK: "black",
  PURPLE: "purple",
  GREEN: "green",
} as const;
export type ProductVariantColor = typeof productVariantColors[keyof typeof productVariantColors];

export const productVariantSizes = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
  U: "U"
} as const;
export type ProductVariantSize = typeof productVariantSizes[keyof typeof productVariantSizes];

class ProductVariant extends Model {
  declare id: number;
  declare size: ProductVariantSize;
  declare color: ProductVariantColor;
  declare stock: number;
  declare price: number; 
  declare discount: number; 
  declare productId: ForeignKey<number>;
  declare sku: string;
}

ProductVariant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, 
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Product, 
          key: "id",
        },
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db, 
    tableName: "product_variants",
    timestamps: true,
  }
);

ProductVariant.belongsTo(Product, { foreignKey: "productId"});
Product.hasMany(ProductVariant, { foreignKey: "productId"});

export default ProductVariant;