import { Model, DataTypes, ForeignKey } from "sequelize";
import db from ".";
import Category from "./Categories";

export const productStatus = {
  PUBLISHED: "published",
  INACTIVE: "inactive",
  SCHEDULED: "scheduled"
} as const
export type ProductStatus = typeof productStatus[keyof typeof productStatus]

export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  collection: string;
  status: ProductStatus;
  categoryId: ForeignKey<number>;
}

class Product extends Model<IProduct> implements IProduct {
  declare id: IProduct['id'];
  declare name: IProduct['name'];
  declare description: IProduct['description'];
  declare collection: IProduct['collection'];
  declare status: IProduct['status'];
  declare categoryId: IProduct['categoryId'];
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    collection: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category, 
        key: "id",
      },
    }
  },
  {
    sequelize: db,
    tableName: "products",
    timestamps: true, 
  }
);

Product.belongsTo(Category, { foreignKey: "categoryId"});
Category.hasMany(Product, { foreignKey: "categoryId"});

export default Product;