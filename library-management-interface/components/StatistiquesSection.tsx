"use client"

import { useStatistiques } from "../hooks/useApi"
import { BarChart3, BookOpen, Users, Calendar, TrendingUp } from "lucide-react"

export default function StatistiquesSection() {
  const { stats, loading, error, refetch } = useStatistiques()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Erreur : {error}</p>
        <button onClick={refetch} className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
          Réessayer
        </button>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-6 w-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
        <button
          onClick={refetch}
          className="ml-auto bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded-lg text-sm transition-colors"
        >
          Actualiser
        </button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Livres</p>
              <p className="text-2xl font-bold text-gray-900">{stats.nombre_livres}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Auteurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.nombre_auteurs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Éditeurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.nombre_editeurs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Catégories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.nombre_categories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Emprunts Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.nombre_emprunts_actifs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition par catégories */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Livres par Catégorie</h3>
        <div className="space-y-3">
          {stats.livres_par_categorie.map((item) => {
            const percentage = (item.count / stats.nombre_livres) * 100
            return (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item._id}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
