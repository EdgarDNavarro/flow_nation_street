import { Model, DataTypes, ForeignKey } from "sequelize";
import db from ".";
import Category from "./Categories";

export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  categoryId: ForeignKey<number>;
  stock: number;
  discount: number;
  img: string | null;
}

class Product extends Model<IProduct> implements IProduct {
  declare id: IProduct['id'];
  declare name: IProduct['name'];
  declare description: IProduct['description'];
  declare price: IProduct['price'];
  declare categoryId: IProduct['categoryId'];
  declare stock: IProduct['stock'];
  declare discount: IProduct['discount'];
  declare img: IProduct['img'];
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category, 
        key: "id",
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0, 
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
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