import { Model, DataTypes, ForeignKey } from "sequelize";
import db from "."; // Importa el modelo Customer
import Customer from "./Customers";

class Order extends Model {
  declare id: number;
  declare customerId: ForeignKey<number>;
  declare date: Date;
  declare total: number;
  declare status: string;
  declare tracking_number?: string;

}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer, 
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: "orders", 
    timestamps: true, 
  }
);

// Relación con el modelo Customer
Order.belongsTo(Customer, { foreignKey: "customerId" });
Customer.hasMany(Order, { foreignKey: "customerId" });

export default Order;
