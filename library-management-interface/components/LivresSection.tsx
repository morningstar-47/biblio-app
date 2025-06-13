import { useLivres } from "../hooks/useApi"
import { Book, User, Calendar, Tag } from "lucide-react"
import AjouterLivreForm from "./AjouterLivreForm"

export default function LivresSection() {
  const { livres, loading, error, refetch } = useLivres()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Erreur : {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Book className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Catalogue des Livres</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {livres.length} livre{livres.length > 1 ? "s" : ""}
        </span>
      </div>

      <AjouterLivreForm onSuccess={refetch} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {livres.map((livre) => (
          <div
            key={livre.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{livre.titre}</h3>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2">
                  {livre.categorie}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{livre.auteur}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">{livre.editeur}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{livre.annee}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {livres.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun livre trouvé dans le catalogue.</p>
        </div>
      )}
    </div>
  )
}
