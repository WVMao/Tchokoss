export default function OrdersPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestion des Commandes</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-64 text-gray-400">
                <p className="text-lg">Aucune commande pour le moment.</p>
                <p className="text-sm">Les commandes WhatsApp apparaîtront ici prochainement.</p>
            </div>
        </div>
    );
}
