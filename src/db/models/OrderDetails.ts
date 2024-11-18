import { Model, DataTypes, ForeignKey } from "sequelize";
import db from ".";
import Order from "./Orders";
import Product from "./Products";

class OrderDetail extends Model {
  declare id: number;
  declare orderId: ForeignKey<number>;
  declare productId: ForeignKey<number>;
  declare quantity: number;
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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

OrderDetail.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderDetail, { foreignKey: "productId" });

export default OrderDetail;
