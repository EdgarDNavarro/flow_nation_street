import { Model, DataTypes } from "sequelize";
import db from ".";
import ProductVariant from "./ProductVariant";

class ProductImage extends Model {
  declare id: number;
  declare productVariantId: number;
  declare image_url: string;
  declare is_main: boolean;
  declare position: number | null;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    productVariantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductVariant, // Debe coincidir con la tabla de productos
        key: "id",
      },
      onDelete: "CASCADE",
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_main: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: db, // Conexión a la base de datos
    tableName: "product_images", // Nombre de la tabla
    timestamps: true
  }
);

ProductImage.belongsTo(ProductVariant, { foreignKey: "productVariantId"});
ProductVariant.hasMany(ProductImage, { foreignKey: "productVariantId"});

export default ProductImage;