import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    oldPrice?: number;
    category: string;
    imageUrl: string;
    isNewArrival: boolean;
    isPromo: boolean;
    stock: number;
    createdAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isNewArrival: { type: Boolean, default: false },
    isPromo: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
}, {
    timestamps: true
});

// Check if model exists to prevent overwrite error in hot reload
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
