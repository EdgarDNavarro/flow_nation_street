import { Model, DataTypes, ForeignKey } from "sequelize";
import db from ".";
import Order from "./Orders";
import Product from "./Products";
import ProductVariant from "./ProductVariant";

class OrderDetail extends Model {
  declare id: number;
  declare orderId: ForeignKey<number>;
  declare productVariantId: ForeignKey<number>;
  declare quantity: number;
  declare price: number
}

OrderDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
    },
    productVariantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductVariant, // Debe coincidir con la tabla de productos
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
  },
  {
    sequelize: db,
    tableName: "order_details",
    timestamps: true,
  }
);

OrderDetail.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(OrderDetail, { foreignKey: "orderId" });

OrderDetail.belongsTo(ProductVariant, { foreignKey: "productVariantId" });
ProductVariant.hasMany(OrderDetail, { foreignKey: "productVariantId" });

export default OrderDetail;
