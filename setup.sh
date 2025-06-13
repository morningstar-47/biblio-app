# #!/bin/bash
# # setup.sh - Script de configuration du backend

# echo "🚀 Configuration du backend Biblio API"

# # Créer la structure des dossiers
# echo "📁 Création de la structure des dossiers..."
# mkdir -p backend
# mkdir -p data
# mkdir -p mongodb

# # Créer le modèle ML
# echo "🤖 Génération du modèle ML..."
# cd backend
# python3 train_model.py
# mv pretrained_model.pkl ../data/
# cd ..

# # Construire et démarrer les services
# echo "🐳 Construction et démarrage des conteneurs Docker..."
# docker-compose down
# docker-compose build
# docker-compose up -d

# # Attendre que MongoDB soit prêt
# echo "⏳ Attente du démarrage de MongoDB..."
# sleep 10

# # Initialiser la base de données
# echo "💾 Initialisation de la base de données..."
# docker exec -it mongo_biblio mongosh biblio --eval "
# db.auteurs.insertMany([
#     {_id: 1, nom: 'George Orwell', nationalite: 'Britannique', naissance: 1903},
#     {_id: 2, nom: 'Ray Bradbury', nationalite: 'Américain', naissance: 1920},
#     {_id: 3, nom: 'Margaret Atwood', nationalite: 'Canadienne', naissance: 1939}
# ]);

# db.editeurs.insertMany([
#     {_id: 1000, nom: 'Secker & Warburg', pays: 'UK'},
#     {_id: 1001, nom: 'Ballantine Books', pays: 'USA'},
#     {_id: 1002, nom: 'McClelland & Stewart', pays: 'Canada'}
# ]);

# db.categories.insertMany([
#     {_id: 10, nom: 'Science-fiction'},
#     {_id: 11, nom: 'Dystopie'},
#     {_id: 12, nom: 'Anticipation'}
# ]);

# db.livres.insertMany([
#     {_id: 101, titre: '1984', auteur_id: 1, categorie_id: 11, editeur_id: 1000, annee: 1949},
#     {_id: 102, titre: 'Fahrenheit 451', auteur_id: 2, categorie_id: 10, editeur_id: 1001, annee: 1953},
#     {_id: 103, titre: 'The Handmaids Tale', auteur_id: 3, categorie_id: 12, editeur_id: 1002, annee: 1985}
# ]);

# db.emprunts.insertMany([
#     {_id: 9000, livre_id: 101, emprunteur: 'Alice', date_emprunt: '2024-06-01'},
#     {_id: 9001, livre_id: 103, emprunteur: 'Bob', date_emprunt: '2024-06-05'}
# ]);
# "

# echo "✅ Configuration terminée!"
# echo ""
# echo "🌐 Services disponibles:"
# echo "  - API Backend: http://localhost:8000"
# echo "  - Documentation API: http://localhost:8000/docs"
# echo "  - MongoDB: localhost:27017"
# echo ""
# echo "📚 Endpoints principaux:"
# echo "  - GET /livres/details - Liste des livres avec détails"
# echo "  - GET /emprunts - Liste des emprunts"
# echo "  - GET /stats - Statistiques de la bibliothèque"
# echo "  - POST /livres - Ajouter un livre"
# echo "  - POST /emprunts - Emprunter un livre"
# echo ""
# echo "🔧 Pour arrêter les services: docker-compose down"
# echo "🔄 Pour redémarrer: docker-compose restart"


#!/bin/bash
# setup.sh - Script de configuration complet du backend

echo "🚀 Configuration du backend Biblio API"
echo "======================================"

# Vérifier que Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Créer la structure des dossiers
echo "📁 Création de la structure des dossiers..."
mkdir -p backend
mkdir -p data
mkdir -p mongodb

# Installer les dépendances Python localement pour générer le modèle
echo "🐍 Installation des dépendances Python..."
pip3 install scikit-learn numpy pandas --quiet

# Créer et entraîner le modèle ML
echo "🤖 Génération du modèle de Machine Learning..."
cd backend

# Exécuter le script de génération du modèle
python3 train_model.py

# Déplacer le modèle dans le dossier data
if [ -f "pretrained_model.pkl" ]; then
    mv pretrained_model.pkl ../data/
    echo "✅ Modèle ML généré et déplacé vers /data/"
else
    echo "❌ Erreur lors de la génération du modèle"
    exit 1
fi

cd ..

# Vérifier que le modèle existe
if [ ! -f "data/pretrained_model.pkl" ]; then
    echo "❌ Le modèle ML n'a pas été créé correctement"
    exit 1
fi

echo "📏 Taille du modèle: $(ls -lh data/pretrained_model.pkl | awk '{print $5}')"

# Arrêter les conteneurs existants s'ils existent
echo "🧹 Nettoyage des conteneurs existants..."
docker-compose down 2>/dev/null || true

# Construire les images Docker
echo "🐳 Construction des images Docker..."
docker-compose build --no-cache

# Démarrer les services
echo "🚀 Démarrage des services..."
docker-compose up -d

# Attendre que MongoDB soit prêt
echo "⏳ Attente du démarrage de MongoDB..."
for i in {1..30}; do
    if docker exec mongo_biblio mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
        echo "✅ MongoDB est prêt!"
        break
    fi
    echo "   Tentative $i/30..."
    sleep 2
done

# Vérifier que le backend est prêt
echo "⏳ Attente du démarrage du backend..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        echo "✅ Backend est prêt!"
        break
    fi
    echo "   Tentative $i/30..."
    sleep 2
done

# Initialiser la base de données avec des données de test
echo "💾 Initialisation de la base de données..."

# Script d'initialisation MongoDB
docker exec mongo_biblio mongosh biblio --eval "
// Nettoyer les collections existantes
db.auteurs.deleteMany({});
db.editeurs.deleteMany({});
db.categories.deleteMany({});
db.livres.deleteMany({});
db.emprunts.deleteMany({});

// Insérer les auteurs
db.auteurs.insertMany([
    {_id: 1, nom: 'George Orwell', nationalite: 'Britannique', naissance: 1903},
    {_id: 2, nom: 'Ray Bradbury', nationalite: 'Américain', naissance: 1920},
    {_id: 3, nom: 'Margaret Atwood', nationalite: 'Canadienne', naissance: 1939},
    {_id: 4, nom: 'Isaac Asimov', nationalite: 'Américain', naissance: 1920},
    {_id: 5, nom: 'Philip K. Dick', nationalite: 'Américain', naissance: 1928}
]);

// Insérer les éditeurs
db.editeurs.insertMany([
    {_id: 1000, nom: 'Secker & Warburg', pays: 'UK'},
    {_id: 1001, nom: 'Ballantine Books', pays: 'USA'},
    {_id: 1002, nom: 'McClelland & Stewart', pays: 'Canada'},
    {_id: 1003, nom: 'Gnome Press', pays: 'USA'},
    {_id: 1004, nom: 'Palmer Eldritch', pays: 'USA'}
]);

// Insérer les catégories
db.categories.insertMany([
    {_id: 10, nom: 'Science-fiction'},
    {_id: 11, nom: 'Dystopie'},
    {_id: 12, nom: 'Anticipation'},
    {_id: 13, nom: 'Robot'},
    {_id: 14, nom: 'Cyberpunk'}
]);

// Insérer les livres
db.livres.insertMany([
    {_id: 101, titre: '1984', auteur_id: 1, categorie_id: 11, editeur_id: 1000, annee: 1949},
    {_id: 102, titre: 'Fahrenheit 451', auteur_id: 2, categorie_id: 10, editeur_id: 1001, annee: 1953},
    {_id: 103, titre: 'The Handmaids Tale', auteur_id: 3, categorie_id: 12, editeur_id: 1002, annee: 1985},
    {_id: 104, titre: 'Foundation', auteur_id: 4, categorie_id: 13, editeur_id: 1003, annee: 1951},
    {_id: 105, titre: 'Do Androids Dream of Electric Sheep?', auteur_id: 5, categorie_id: 14, editeur_id: 1004, annee: 1968}
]);

// Insérer les emprunts
db.emprunts.insertMany([
    {_id: 9000, livre_id: 101, emprunteur: 'Alice', date_emprunt: '2024-06-01'},
    {_id: 9001, livre_id: 103, emprunteur: 'Bob', date_emprunt: '2024-06-05'}
]);

print('✅ Base de données initialisée avec succès!');
"

# Tester l'API
echo "🧪 Tests de l'API..."

# Test de santé
health_response=$(curl -s http://localhost:8000/health)
if echo "$health_response" | grep -q "healthy"; then
    echo "✅ API Health Check: OK"
else
    echo "❌ API Health Check: FAILED"
fi

# Test du modèle ML
ml_response=$(curl -s "http://localhost:8000/predict?val=50")
if echo "$ml_response" | grep -q "prediction"; then
    echo "✅ Machine Learning: OK"
else
    echo "❌ Machine Learning: FAILED"
fi

# Test des données
data_response=$(curl -s http://localhost:8000/livres)
if echo "$data_response" | grep -q "success"; then
    echo "✅ Base de données: OK"
else
    echo "❌ Base de données: FAILED"
fi

echo ""
echo "🎉 Configuration terminée avec succès!"
echo "======================================"
echo ""
echo "🌐 Services disponibles:"
echo "  📡 API Backend: http://localhost:8000"
echo "  📚 Documentation: http://localhost:8000/docs"
echo "  💾 MongoDB: localhost:27017"
echo ""
echo "📊 Données chargées:"
echo "  📖 5 livres de science-fiction"
echo "  👤 5 auteurs célèbres"
echo "  🏢 5 éditeurs"
echo "  📂 5 catégories"
echo "  📋 2 emprunts actifs"
echo ""
echo "🔧 Commandes utiles:"
echo "  docker-compose logs backend  # Voir les logs"
echo "  docker-compose down          # Arrêter les services"
echo "  docker-compose restart       # Redémarrer"
echo ""
echo "🧪 Test rapide:"
echo "  curl http://localhost:8000/livres/details"
echo "  curl http://localhost:8000/stats"
echo "  curl 'http://localhost:8000/predict?val=42'"