# backend/routes.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List, Optional
import pickle
import numpy as np
import os
from datetime import datetime

router = APIRouter()

# Configuration MongoDB
client = MongoClient("mongodb://mongo:27017")
db = client["biblio"]

# Modèles Pydantic pour la validation des données
class Livre(BaseModel):
    titre: str
    auteur_id: int
    categorie_id: int
    editeur_id: int
    annee: int

class Emprunt(BaseModel):
    livre_id: int
    emprunteur: str
    date_emprunt: Optional[str] = None

class Auteur(BaseModel):
    nom: str
    nationalite: str
    naissance: int

class Editeur(BaseModel):
    nom: str
    pays: str

class Categorie(BaseModel):
    nom: str

# Charger le modèle ML (avec gestion d'erreur améliorée)
model = None

def load_model():
    """Charge le modèle ML avec une gestion d'erreur robuste"""
    global model
    try:
        # Vérifier que numpy fonctionne
        import numpy as np
        test_array = np.array([1, 2, 3])
        
        model_path = "/app/data/pretrained_model.pkl"
        if os.path.exists(model_path):
            with open(model_path, "rb") as f:
                model = pickle.load(f)
            print("✅ Modèle ML chargé avec succès")
            
            # Test simple du modèle
            test_pred = model.predict(np.array([[1.0]]))[0]
            print(f"✅ Test du modèle: input=1.0, output={test_pred:.2f}")
            
        else:
            print("⚠️  Modèle ML non trouvé, fonctionnalité de prédiction désactivée")
    except ImportError as e:
        print(f"⚠️  Dépendances manquantes: {e}")
    except Exception as e:
        print(f"⚠️  Erreur lors du chargement du modèle: {e}")
        model = None

# Charger le modèle au démarrage
load_model()

# Routes pour les livres
@router.get("/livres", tags=["Livres"])
def get_livres():
    """Récupérer tous les livres"""
    try:
        livres = list(db.livres.find({}, {"_id": 0}))
        return {"status": "success", "data": livres, "count": len(livres)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des livres: {str(e)}")

@router.get("/livres/details", tags=["Livres"])
def livres_details():
    """Récupérer les livres avec les détails des auteurs, catégories et éditeurs"""
    try:
        pipeline = [
            {"$lookup": {
                "from": "auteurs",
                "localField": "auteur_id",
                "foreignField": "_id",
                "as": "auteur"
            }},
            {"$unwind": "$auteur"},
            {"$lookup": {
                "from": "categories",
                "localField": "categorie_id",
                "foreignField": "_id",
                "as": "categorie"
            }},
            {"$unwind": "$categorie"},
            {"$lookup": {
                "from": "editeurs",
                "localField": "editeur_id",
                "foreignField": "_id",
                "as": "editeur"
            }},
            {"$unwind": "$editeur"},
            {"$project": {
                "_id": 0,
                "id": "$_id",
                "titre": 1,
                "annee": 1,
                "auteur": "$auteur.nom",
                "auteur_nationalite": "$auteur.nationalite",
                "categorie": "$categorie.nom",
                "editeur": "$editeur.nom",
                "editeur_pays": "$editeur.pays"
            }}
        ]
        livres = list(db.livres.aggregate(pipeline))
        return {"status": "success", "data": livres, "count": len(livres)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des détails: {str(e)}")

@router.post("/livres", tags=["Livres"])
def ajouter_livre(livre: Livre):
    """Ajouter un nouveau livre"""
    try:
        # Générer un nouvel ID
        dernier_livre = db.livres.find_one(sort=[("_id", -1)])
        nouvel_id = (dernier_livre["_id"] + 1) if dernier_livre else 1
        
        livre_data = livre.dict()
        livre_data["_id"] = nouvel_id
        
        result = db.livres.insert_one(livre_data)
        return {"status": "success", "message": "Livre ajouté avec succès", "id": nouvel_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'ajout du livre: {str(e)}")

# Routes pour les emprunts
@router.get("/emprunts", tags=["Emprunts"])
def get_emprunts():
    """Récupérer tous les emprunts avec les détails des livres"""
    try:
        pipeline = [
            {"$lookup": {
                "from": "livres",
                "localField": "livre_id",
                "foreignField": "_id",
                "as": "livre"
            }},
            {"$unwind": "$livre"},
            {"$project": {
                "_id": 0,
                "id": "$_id",
                "emprunteur": 1,
                "date_emprunt": 1,
                "livre_id": 1,
                "titre": "$livre.titre",
                "annee": "$livre.annee"
            }}
        ]
        emprunts = list(db.emprunts.aggregate(pipeline))
        return {"status": "success", "data": emprunts, "count": len(emprunts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des emprunts: {str(e)}")

@router.post("/emprunts", tags=["Emprunts"])
def ajouter_emprunt(emprunt: Emprunt):
    """Ajouter un nouvel emprunt"""
    try:
        # Vérifier que le livre existe
        livre = db.livres.find_one({"_id": emprunt.livre_id})
        if not livre:
            raise HTTPException(status_code=404, detail="Livre non trouvé")
        
        # Vérifier que le livre n'est pas déjà emprunté
        emprunt_existant = db.emprunts.find_one({"livre_id": emprunt.livre_id})
        if emprunt_existant:
            raise HTTPException(status_code=400, detail="Ce livre est déjà emprunté")
        
        # Générer un nouvel ID
        dernier_emprunt = db.emprunts.find_one(sort=[("_id", -1)])
        nouvel_id = (dernier_emprunt["_id"] + 1) if dernier_emprunt else 1
        
        emprunt_data = emprunt.dict()
        emprunt_data["_id"] = nouvel_id
        emprunt_data["date_emprunt"] = emprunt_data.get("date_emprunt") or datetime.now().strftime("%Y-%m-%d")
        
        result = db.emprunts.insert_one(emprunt_data)
        return {"status": "success", "message": "Emprunt ajouté avec succès", "id": nouvel_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'ajout de l'emprunt: {str(e)}")

@router.delete("/emprunts/{emprunt_id}", tags=["Emprunts"])
def retourner_livre(emprunt_id: int):
    """Retourner un livre (supprimer l'emprunt)"""
    try:
        result = db.emprunts.delete_one({"_id": emprunt_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Emprunt non trouvé")
        return {"status": "success", "message": "Livre retourné avec succès"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du retour du livre: {str(e)}")

# Routes pour les auteurs
@router.get("/auteurs", tags=["Auteurs"])
def get_auteurs():
    """Récupérer tous les auteurs"""
    try:
        auteurs = list(db.auteurs.find({}, {"_id": 0}))
        return {"status": "success", "data": auteurs, "count": len(auteurs)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des auteurs: {str(e)}")

@router.post("/auteurs", tags=["Auteurs"])
def ajouter_auteur(auteur: Auteur):
    """Ajouter un nouvel auteur"""
    try:
        dernier_auteur = db.auteurs.find_one(sort=[("_id", -1)])
        nouvel_id = (dernier_auteur["_id"] + 1) if dernier_auteur else 1
        
        auteur_data = auteur.dict()
        auteur_data["_id"] = nouvel_id
        
        result = db.auteurs.insert_one(auteur_data)
        return {"status": "success", "message": "Auteur ajouté avec succès", "id": nouvel_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'ajout de l'auteur: {str(e)}")

# Routes pour les éditeurs
@router.get("/editeurs", tags=["Éditeurs"])
def get_editeurs():
    """Récupérer tous les éditeurs"""
    try:
        editeurs = list(db.editeurs.find({}, {"_id": 0}))
        return {"status": "success", "data": editeurs, "count": len(editeurs)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des éditeurs: {str(e)}")

@router.post("/editeurs", tags=["Éditeurs"])
def ajouter_editeur(editeur: Editeur):
    """Ajouter un nouvel éditeur"""
    try:
        dernier_editeur = db.editeurs.find_one(sort=[("_id", -1)])
        nouvel_id = (dernier_editeur["_id"] + 1) if dernier_editeur else 1000
        
        editeur_data = editeur.dict()
        editeur_data["_id"] = nouvel_id
        
        result = db.editeurs.insert_one(editeur_data)
        return {"status": "success", "message": "Éditeur ajouté avec succès", "id": nouvel_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'ajout de l'éditeur: {str(e)}")

# Routes pour les catégories
@router.get("/categories", tags=["Catégories"])
def get_categories():
    """Récupérer toutes les catégories"""
    try:
        categories = list(db.categories.find({}, {"_id": 0}))
        return {"status": "success", "data": categories, "count": len(categories)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des catégories: {str(e)}")

@router.post("/categories", tags=["Catégories"])
def ajouter_categorie(categorie: Categorie):
    """Ajouter une nouvelle catégorie"""
    try:
        derniere_categorie = db.categories.find_one(sort=[("_id", -1)])
        nouvel_id = (derniere_categorie["_id"] + 1) if derniere_categorie else 1
        
        categorie_data = categorie.dict()
        categorie_data["_id"] = nouvel_id
        
        result = db.categories.insert_one(categorie_data)
        return {"status": "success", "message": "Catégorie ajoutée avec succès", "id": nouvel_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'ajout de la catégorie: {str(e)}")

# Route pour les statistiques
@router.get("/stats", tags=["Statistiques"])
def get_statistiques():
    """Récupérer les statistiques de la bibliothèque"""
    try:
        stats = {
            "nombre_livres": db.livres.count_documents({}),
            "nombre_auteurs": db.auteurs.count_documents({}),
            "nombre_editeurs": db.editeurs.count_documents({}),
            "nombre_categories": db.categories.count_documents({}),
            "nombre_emprunts_actifs": db.emprunts.count_documents({}),
            "livres_par_categorie": list(db.livres.aggregate([
                {"$lookup": {
                    "from": "categories",
                    "localField": "categorie_id",
                    "foreignField": "_id",
                    "as": "categorie"
                }},
                {"$unwind": "$categorie"},
                {"$group": {
                    "_id": "$categorie.nom",
                    "count": {"$sum": 1}
                }},
                {"$sort": {"count": -1}}
            ]))
        }
        return {"status": "success", "data": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du calcul des statistiques: {str(e)}")

# Route pour la prédiction ML (si le modèle est disponible)
@router.get("/predict", tags=["ML"])
def predict(val: float):
    """Faire une prédiction avec le modèle ML"""
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle ML non disponible")
    
    try:
        pred = model.predict(np.array([[val]]))[0]
        return {
            "status": "success",
            "input_value": val,
            "prediction": float(pred),
            "model_info": "Linear Regression Model"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la prédiction: {str(e)}")