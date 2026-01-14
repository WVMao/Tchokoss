import { NextResponse } from 'next/server';
import { getProducts, saveProduct, updateProduct, deleteProduct } from '@/lib/json-db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const products = await getProducts();

        if (id) {
            const product = products.find(p => p.id === id);
            if (!product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }
            return NextResponse.json(product);
        }

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await saveProduct(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const updatedProduct = await updateProduct(body);

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id')?.trim();

        console.log('DELETE API called with ID:', id);

        if (!id) {
            console.error('DELETE Error: ID missing');
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await deleteProduct(id);
        console.log('DELETE Success for ID:', id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE API Exception:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
