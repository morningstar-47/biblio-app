"use client"

import type React from "react"
import { useState } from "react"
import { useAjouterLivre, useAuteurs, useEditeurs, useCategories } from "../hooks/useApi"
import { Plus, X } from "lucide-react"
import type { NouveauLivre } from "../types/api"

interface Props {
  onSuccess: () => void
}

export default function AjouterLivreForm({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<NouveauLivre>({
    titre: "",
    auteur_id: 0,
    categorie_id: 0,
    editeur_id: 0,
    annee: new Date().getFullYear(),
  })

  const { ajouterLivre, loading, error } = useAjouterLivre()
  const { auteurs } = useAuteurs()
  const { editeurs } = useEditeurs()
  const { categories } = useCategories()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await ajouterLivre(formData)
    if (success) {
      setFormData({
        titre: "",
        auteur_id: 0,
        categorie_id: 0,
        editeur_id: 0,
        annee: new Date().getFullYear(),
      })
      setIsOpen(false)
      onSuccess()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "annee" || name.includes("_id") ? Number.parseInt(value) : value,
    }))
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Ajouter un livre
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Ajouter un nouveau livre</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            id="titre"
            name="titre"
            required
            value={formData.titre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="auteur_id" className="block text-sm font-medium text-gray-700 mb-1">
            Auteur *
          </label>
          <select
            id="auteur_id"
            name="auteur_id"
            required
            value={formData.auteur_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Sélectionner un auteur</option>
            {auteurs.map((auteur, index) => (
              <option key={auteur.id || index} value={auteur.id || index + 1}>
                {auteur.nom} ({auteur.nationalite})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="editeur_id" className="block text-sm font-medium text-gray-700 mb-1">
            Éditeur *
          </label>
          <select
            id="editeur_id"
            name="editeur_id"
            required
            value={formData.editeur_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Sélectionner un éditeur</option>
            {editeurs.map((editeur, index) => (
              <option key={editeur.id || index} value={editeur.id || index + 1000}>
                {editeur.nom} ({editeur.pays})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categorie_id" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie *
          </label>
          <select
            id="categorie_id"
            name="categorie_id"
            required
            value={formData.categorie_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Sélectionner une catégorie</option>
            {categories.map((categorie, index) => (
              <option key={categorie.id || index} value={categorie.id || index + 10}>
                {categorie.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="annee" className="block text-sm font-medium text-gray-700 mb-1">
            Année de publication *
          </label>
          <input
            type="number"
            id="annee"
            name="annee"
            required
            min="1000"
            max={new Date().getFullYear()}
            value={formData.annee}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Ajout en cours...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Ajouter le livre
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Annuler
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
