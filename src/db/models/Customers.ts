import { Model, DataTypes } from "sequelize";
import db from ".";
import bcrypt from "bcrypt";

class Customer extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone: string | null;
  declare token: string | null;
  declare address: string | null;

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: "customers", 
    timestamps: true, 
    hooks: {
      beforeCreate: async function (customer: Customer) {
        const salt = await bcrypt.genSalt(10);
        customer.password = await bcrypt.hash(customer.password, salt);
      },
    },
  }
);

export default Customer;