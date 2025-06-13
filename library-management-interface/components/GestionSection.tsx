"use client"

import type React from "react"

import { useState } from "react"
import {
  useAuteurs,
  useEditeurs,
  useCategories,
  useAjouterAuteur,
  useAjouterEditeur,
  useAjouterCategorie,
} from "../hooks/useApi"
import { Users, Building, Tag, Plus } from "lucide-react"
import type { Auteur, Editeur, Categorie } from "../types/api"

export default function GestionSection() {
  const [activeTab, setActiveTab] = useState<"auteurs" | "editeurs" | "categories">("auteurs")

  const { auteurs, loading: loadingAuteurs, refetch: refetchAuteurs } = useAuteurs()
  const { editeurs, loading: loadingEditeurs, refetch: refetchEditeurs } = useEditeurs()
  const { categories, loading: loadingCategories, refetch: refetchCategories } = useCategories()

  const tabs = [
    { id: "auteurs" as const, label: "Auteurs", icon: Users, count: auteurs.length },
    { id: "editeurs" as const, label: "Éditeurs", icon: Building, count: editeurs.length },
    { id: "categories" as const, label: "Catégories", icon: Tag, count: categories.length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Données</h2>
      </div>

      {/* Sous-navigation */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{tab.count}</span>
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {activeTab === "auteurs" && (
            <AuteursTab auteurs={auteurs} loading={loadingAuteurs} onRefresh={refetchAuteurs} />
          )}
          {activeTab === "editeurs" && (
            <EditeursTab editeurs={editeurs} loading={loadingEditeurs} onRefresh={refetchEditeurs} />
          )}
          {activeTab === "categories" && (
            <CategoriesTab categories={categories} loading={loadingCategories} onRefresh={refetchCategories} />
          )}
        </div>
      </div>
    </div>
  )
}

function AuteursTab({ auteurs, loading, onRefresh }: { auteurs: Auteur[]; loading: boolean; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nom: "", nationalite: "", naissance: new Date().getFullYear() })
  const { ajouterAuteur, loading: ajoutLoading, error } = useAjouterAuteur()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await ajouterAuteur(formData)
    if (success) {
      setFormData({ nom: "", nationalite: "", naissance: new Date().getFullYear() })
      setShowForm(false)
      onRefresh()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Auteurs</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un auteur
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nom de l'auteur"
              value={formData.nom}
              onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Nationalité"
              value={formData.nationalite}
              onChange={(e) => setFormData((prev) => ({ ...prev, nationalite: e.target.value }))}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Année de naissance"
              value={formData.naissance}
              onChange={(e) => setFormData((prev) => ({ ...prev, naissance: Number.parseInt(e.target.value) }))}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={ajoutLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              {ajoutLoading ? "Ajout..." : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
            >
              Annuler
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auteurs.map((auteur, index) => (
          <div key={auteur.id || index} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{auteur.nom}</h4>
            <p className="text-sm text-gray-600">{auteur.nationalite}</p>
            <p className="text-sm text-gray-500">Né en {auteur.naissance}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EditeursTab({
  editeurs,
  loading,
  onRefresh,
}: { editeurs: Editeur[]; loading: boolean; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nom: "", pays: "" })
  const { ajouterEditeur, loading: ajoutLoading, error } = useAjouterEditeur()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await ajouterEditeur(formData)
    if (success) {
      setFormData({ nom: "", pays: "" })
      setShowForm(false)
      onRefresh()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Éditeurs</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un éditeur
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nom de l'éditeur"
              value={formData.nom}
              onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Pays"
              value={formData.pays}
              onChange={(e) => setFormData((prev) => ({ ...prev, pays: e.target.value }))}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={ajoutLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              {ajoutLoading ? "Ajout..." : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
            >
              Annuler
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {editeurs.map((editeur, index) => (
          <div key={editeur.id || index} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{editeur.nom}</h4>
            <p className="text-sm text-gray-600">{editeur.pays}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoriesTab({
  categories,
  loading,
  onRefresh,
}: { categories: Categorie[]; loading: boolean; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nom: "" })
  const { ajouterCategorie, loading: ajoutLoading, error } = useAjouterCategorie()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await ajouterCategorie(formData)
    if (success) {
      setFormData({ nom: "" })
      setShowForm(false)
      onRefresh()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Catégories</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une catégorie
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={formData.nom}
            onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={ajoutLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              {ajoutLoading ? "Ajout..." : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
            >
              Annuler
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((categorie, index) => (
          <div key={categorie.id || index} className="bg-gray-50 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-gray-900">{categorie.nom}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}
