"use client"

import { useState, useEffect } from "react"
import type {
  Livre,
  Emprunt,
  PredictionResponse,
  NouveauLivre,
  NouvelEmprunt,
  Statistiques,
  Auteur,
  Editeur,
  Categorie,
  ApiResponse,
} from "../types/api"

const API_BASE_URL = "http://localhost:8000"

export function useLivres() {
  const [livres, setLivres] = useState<Livre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLivres = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/livres/details`)
      if (!response.ok) throw new Error("Erreur lors du chargement des livres")
      const result: ApiResponse<Livre[]> = await response.json()
      setLivres(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLivres()
  }, [])

  return { livres, loading, error, refetch: fetchLivres }
}

export function useEmprunts() {
  const [emprunts, setEmprunts] = useState<Emprunt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmprunts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/emprunts`)
      if (!response.ok) throw new Error("Erreur lors du chargement des emprunts")
      const result: ApiResponse<Emprunt[]> = await response.json()
      setEmprunts(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmprunts()
  }, [])

  return { emprunts, loading, error, refetch: fetchEmprunts }
}

export function useAuteurs() {
  const [auteurs, setAuteurs] = useState<Auteur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAuteurs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/auteurs`)
      if (!response.ok) throw new Error("Erreur lors du chargement des auteurs")
      const result: ApiResponse<Auteur[]> = await response.json()
      setAuteurs(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuteurs()
  }, [])

  return { auteurs, loading, error, refetch: fetchAuteurs }
}

export function useEditeurs() {
  const [editeurs, setEditeurs] = useState<Editeur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEditeurs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/editeurs`)
      if (!response.ok) throw new Error("Erreur lors du chargement des éditeurs")
      const result: ApiResponse<Editeur[]> = await response.json()
      setEditeurs(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEditeurs()
  }, [])

  return { editeurs, loading, error, refetch: fetchEditeurs }
}

export function useCategories() {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) throw new Error("Erreur lors du chargement des catégories")
      const result: ApiResponse<Categorie[]> = await response.json()
      setCategories(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, loading, error, refetch: fetchCategories }
}

export function usePrediction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = async (value: number): Promise<PredictionResponse | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/predict?val=${value}`)
      if (!response.ok) throw new Error("Erreur lors de la prédiction")
      const data: PredictionResponse = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { predict, loading, error }
}

export function useAjouterLivre() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ajouterLivre = async (livre: NouveauLivre): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/livres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(livre),
      })
      if (!response.ok) throw new Error("Erreur lors de l'ajout du livre")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { ajouterLivre, loading, error }
}

export function useEmprunterLivre() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emprunterLivre = async (emprunt: NouvelEmprunt): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/emprunts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emprunt),
      })
      if (!response.ok) throw new Error("Erreur lors de l'emprunt")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { emprunterLivre, loading, error }
}

export function useRetournerLivre() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const retournerLivre = async (empruntId: number): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/emprunts/${empruntId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Erreur lors du retour")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { retournerLivre, loading, error }
}

export function useStatistiques() {
  const [stats, setStats] = useState<Statistiques | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/stats`)
      if (!response.ok) throw new Error("Erreur lors du chargement des statistiques")
      const result: ApiResponse<Statistiques> = await response.json()
      setStats(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}

// Hooks pour ajouter des entités
export function useAjouterAuteur() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ajouterAuteur = async (auteur: Omit<Auteur, "id">): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/auteurs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auteur),
      })
      if (!response.ok) throw new Error("Erreur lors de l'ajout de l'auteur")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { ajouterAuteur, loading, error }
}

export function useAjouterEditeur() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ajouterEditeur = async (editeur: Omit<Editeur, "id">): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/editeurs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editeur),
      })
      if (!response.ok) throw new Error("Erreur lors de l'ajout de l'éditeur")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { ajouterEditeur, loading, error }
}

export function useAjouterCategorie() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ajouterCategorie = async (categorie: Omit<Categorie, "id">): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categorie),
      })
      if (!response.ok) throw new Error("Erreur lors de l'ajout de la catégorie")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { ajouterCategorie, loading, error }
}
