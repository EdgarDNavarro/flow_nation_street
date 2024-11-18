import { Model, DataTypes } from "sequelize";
import db from ".";

export interface ICategory {
  id: number;
  name: string;
}

class Category extends Model<ICategory> implements ICategory {
  declare id: ICategory['id'];
  declare name: ICategory['name'];
}

Category.init(
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
      unique: true,
    },
  },
  {
    sequelize: db,
    tableName: "categories", 
    timestamps: false, 
  }
);

export default Category;