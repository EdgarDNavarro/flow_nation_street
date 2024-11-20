import { Model, DataTypes } from "sequelize";
import db from ".";
import Customer from "./Customers";

class Address extends Model {
  declare id: number;
  declare customerId: number;
  declare address_line_1: string;
  declare address_line_2: string | null;
  declare city: string;
  declare state: string;
  declare postal_code: string;
  declare country: string;
  declare is_default: boolean;
}

Address.init(
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
      onDelete: "CASCADE",
    },
    address_line_1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db, // Conexión a la base de datos
    tableName: "addresses", // Nombre de la tabla
    timestamps: true,
  }
);
Address.belongsTo(Customer, { foreignKey: "customerId" });
Customer.hasMany(Address, { foreignKey: "customerId" });

export default Address;
