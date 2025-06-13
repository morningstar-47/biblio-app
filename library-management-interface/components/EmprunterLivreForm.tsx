"use client"

import type React from "react"

import { useState } from "react"
import { useEmprunterLivre, useLivres } from "../hooks/useApi"
import { BookOpen, Plus, X } from "lucide-react"
import type { NouvelEmprunt } from "../types/api"

interface Props {
  onSuccess: () => void
}

export default function EmprunterLivreForm({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<NouvelEmprunt>({
    emprunteur: "",
    livre_id: 0,
  })

  const { emprunterLivre, loading, error } = useEmprunterLivre()
  const { livres } = useLivres()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await emprunterLivre(formData)
    if (success) {
      setFormData({ emprunteur: "", livre_id: 0 })
      setIsOpen(false)
      onSuccess()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "livre_id" ? Number.parseInt(value) : value,
    }))
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Nouvel emprunt
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Emprunter un livre</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="emprunteur" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de l'emprunteur *
          </label>
          <input
            type="text"
            id="emprunteur"
            name="emprunteur"
            required
            value={formData.emprunteur}
            onChange={handleChange}
            placeholder="Entrez le nom complet"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="livre_id" className="block text-sm font-medium text-gray-700 mb-1">
            Livre à emprunter *
          </label>
          <select
            id="livre_id"
            name="livre_id"
            required
            value={formData.livre_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value={0}>Sélectionner un livre</option>
            {livres.map((livre) => (
              <option key={livre.id} value={livre.id}>
                {livre.titre} - {livre.auteur}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Emprunt en cours...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                Emprunter
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
