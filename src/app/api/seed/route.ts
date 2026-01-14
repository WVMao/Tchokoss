import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    await dbConnect();

    const initialProducts = [
        // Flash Sales
        {
            name: "Escarpins Nubuck African",
            price: 25000,
            category: "Chaussures",
            image: "/shoe_luxury.png",
            description: "Escarpins de luxe avec motifs africains subtils. Idéal pour les soirées.",
            stock: 10
        },
        {
            name: "Sac à main Wax Premium",
            price: 40000,
            category: "Accessoires",
            image: "/bag_wax.png",
            description: "Sac à main élégant mêlant cuir véritable et tissu Wax coloré.",
            stock: 5
        },
        {
            name: "Parure de Draps 3D",
            price: 15000,
            category: "Maison",
            image: "/bed_sheets.png",
            description: "Parure de lit complète avec motifs géométriques 3D confortables.",
            stock: 20
        },
        {
            name: "Montre Gold Luxury",
            price: 18000,
            category: "Accessoires",
            image: "/watch_luxury.png",
            description: "Montre dorée minimaliste avec une touche de luxe africain.",
            stock: 8
        },
        // Best Sellers & New Arrivals
        {
            name: "Mocassins Dorés",
            price: 30000,
            category: "Chaussures",
            image: "/shoe_luxury.png",
            description: "Mocassins confortables et brillants pour un style unique.",
            stock: 15
        },
        {
            name: "Rideaux Salon",
            price: 15000,
            category: "Décoration",
            image: "/bed_sheets.png",
            description: "Rideaux assortis pour un salon chaleureux.",
            stock: 12
        }
    ];

    try {
        // Clear existing products to avoid duplicates during dev
        await Product.deleteMany({});

        // Insert new products
        await Product.insertMany(initialProducts);

        return NextResponse.json({ message: "Database seeded successfully", count: initialProducts.length });
    } catch (error) {
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}
