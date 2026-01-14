import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { PromoSection } from "@/components/promo-section";
import { ProductGrid } from "@/components/product-grid";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <div id="promo">
        <PromoSection />
      </div>
      <div id="shop">
        {/* Main Product Grid */}
        <ProductGrid
          title=""
          subtitle="Explorez notre collection complète"
          limit={10}
          filterType="all"
          showTabs={true}
          enableLoadMore={true}
        />
      </div>
      <Testimonials />

      {/* Simple Footer Placeholder */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center text-sm">
        <p className="mb-4">&copy; 2026 Tchokoss. Tous droits réservés.</p>
        <p className="mb-8 italic">"C'est difficile mais c'est possible."</p>

        <div className="flex justify-center">
          <a
            href="/admin"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors border border-gray-700 flex items-center gap-2"
          >
            🔒 Espace Administrateur
          </a>
        </div>
      </footer>
    </main>
  );
}
