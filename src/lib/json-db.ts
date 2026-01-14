import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string | number;
    category: string;
    image: string;
    images?: string[];
    stock: number;
    createdAt?: string;
    updatedAt?: string;
    badge?: string;
    // New Carousel Fields
    isFeatured?: boolean;
    carouselImage?: string;
    carouselTitle?: string;
    carouselSubtitle?: string;
    carouselDescription?: string;
}

function ensureDataDirectory() {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, '[]', 'utf8');
    }
}

export async function getProducts(): Promise<Product[]> {
    ensureDataDirectory();
    try {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export async function saveProduct(product: Product): Promise<Product> {
    const products = await getProducts();
    const newProduct = { ...product, id: Date.now().toString(), createdAt: new Date().toISOString() };
    products.unshift(newProduct); // Add to beginning
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
    return newProduct;
}

export async function updateProduct(updatedProduct: Product): Promise<Product | null> {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);

    if (index === -1) return null;

    products[index] = { ...products[index], ...updatedProduct, updatedAt: new Date().toISOString() };
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
    return products[index];
}

export async function deleteProduct(id: string): Promise<void> {
    const products = await getProducts();
    const targetId = String(id).trim();
    const filtered = products.filter(p => String(p.id).trim() !== targetId);

    // Log for debugging
    if (products.length === filtered.length) {
        console.warn(`[JsonDB] Warning: ID ${targetId} not found for deletion.`);
    } else {
        console.log(`[JsonDB] Deleted product ${targetId}. Count: ${products.length} -> ${filtered.length}`);
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(filtered, null, 2), 'utf8');
}
