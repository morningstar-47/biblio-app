from pymongo import MongoClient

client = MongoClient("mongodb://mongo:27017")
db = client["biblio"]

# Nettoyage des collections
for col in ["livres", "auteurs", "editeurs", "categories", "emprunts"]:
    db[col].delete_many({})

# Auteurs
auteurs = [
    {"_id": 1, "nom": "George Orwell", "nationalite": "Britannique", "naissance": 1903},
    {"_id": 2, "nom": "Ray Bradbury", "nationalite": "Américain", "naissance": 1920},
    {"_id": 3, "nom": "Margaret Atwood", "nationalite": "Canadienne", "naissance": 1939},
]
db.auteurs.insert_many(auteurs)

# Éditeurs
editeurs = [
    {"_id": 1000, "nom": "Secker & Warburg", "pays": "UK"},
    {"_id": 1001, "nom": "Ballantine Books", "pays": "USA"},
    {"_id": 1002, "nom": "McClelland & Stewart", "pays": "Canada"},
]
db.editeurs.insert_many(editeurs)

# Catégories
categories = [
    {"_id": 10, "nom": "Science-fiction"},
    {"_id": 11, "nom": "Dystopie"},
    {"_id": 12, "nom": "Anticipation"},
]
db.categories.insert_many(categories)

# Livres
livres = [
    {"_id": 101, "titre": "1984", "auteur_id": 1, "categorie_id": 11, "editeur_id": 1000, "annee": 1949},
    {"_id": 102, "titre": "Fahrenheit 451", "auteur_id": 2, "categorie_id": 10, "editeur_id": 1001, "annee": 1953},
    {"_id": 103, "titre": "The Handmaid's Tale", "auteur_id": 3, "categorie_id": 12, "editeur_id": 1002, "annee": 1985},
]
db.livres.insert_many(livres)

# Emprunts
emprunts = [
    {"_id": 9000, "livre_id": 101, "emprunteur": "Alice", "date_emprunt": "2024-06-01"},
    {"_id": 9001, "livre_id": 103, "emprunteur": "Bob", "date_emprunt": "2024-06-05"},
]
db.emprunts.insert_many(emprunts)

print("✔ Données insérées avec succès.")
