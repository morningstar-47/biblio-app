"use client"

import { useEmprunts, useRetournerLivre } from "../hooks/useApi"
import { BookOpen, User, Calendar, RotateCcw } from "lucide-react"
import EmprunterLivreForm from "./EmprunterLivreForm"

export default function EmpruntsSection() {
  const { emprunts, loading, error, refetch } = useEmprunts()
  const { retournerLivre, loading: loadingRetour } = useRetournerLivre()

  const handleRetour = async (empruntId: number) => {
    if (confirm("Êtes-vous sûr de vouloir retourner ce livre ?")) {
      const success = await retournerLivre(empruntId)
      if (success) {
        refetch()
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Liste des Emprunts</h2>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {emprunts.length} emprunt{emprunts.length > 1 ? "s" : ""}
        </span>
      </div>

      <EmprunterLivreForm onSuccess={refetch} />

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {emprunts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emprunteur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'emprunt
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {emprunts.map((emprunt, index) => (
                  <tr key={emprunt.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{emprunt.emprunteur}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{emprunt.titre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{formatDate(emprunt.date_emprunt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRetour(emprunt.id)}
                        disabled={loadingRetour}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200 flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Retourner
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun emprunt en cours.</p>
          </div>
        )}
      </div>
    </div>
  )
}
