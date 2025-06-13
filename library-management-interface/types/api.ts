// Structures de réponse API
export interface ApiResponse<T> {
  status: string
  data: T
  count?: number
}

// Entités principales
export interface Livre {
  id: number
  titre: string
  annee: number
  auteur: string
  auteur_nationalite: string
  categorie: string
  editeur: string
  editeur_pays: string
}

export interface LivreSimple {
  titre: string
  auteur_id: number
  categorie_id: number
  editeur_id: number
  annee: number
}

export interface Emprunt {
  id: number
  emprunteur: string
  date_emprunt: string
  livre_id: number
  titre: string
  annee: number
}

export interface Auteur {
  id?: number
  nom: string
  nationalite: string
  naissance: number
}

export interface Editeur {
  id?: number
  nom: string
  pays: string
}

export interface Categorie {
  id?: number
  nom: string
}

// Formulaires
export interface NouveauLivre {
  titre: string
  auteur_id: number
  categorie_id: number
  editeur_id: number
  annee: number
}

export interface NouvelEmprunt {
  livre_id: number
  emprunteur: string
  date_emprunt?: string
}

export interface PredictionResponse {
  status: string
  input_value: number
  prediction: number
  model_info: string
}

export interface Statistiques {
  nombre_livres: number
  nombre_auteurs: number
  nombre_editeurs: number
  nombre_categories: number
  nombre_emprunts_actifs: number
  livres_par_categorie: Array<{
    _id: string
    count: number
  }>
}
