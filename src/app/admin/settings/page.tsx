export default function SettingsPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Paramètres</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Configuration Générale</h2>
                <form className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nom du site</label>
                        <input type="text" defaultValue="Tchokoss" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Devise</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border">
                            <option>FCFA</option>
                            <option>EUR</option>
                            <option>USD</option>
                        </select>
                    </div>
                    <button type="button" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Sauvegarder</button>
                </form>
            </div>
        </div>
    );
}
