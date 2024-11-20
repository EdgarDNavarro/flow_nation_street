import { Model, DataTypes } from "sequelize";
import db from ".";

class Customer extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare phone: string | null;
  declare token: string | null;

}

Customer.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: "customers", 
    timestamps: true
  }
);

export default Customer;