#!/bin/bash
# fix_ml.sh - Script pour corriger le problème du modèle ML

echo "🔧 Correction du problème NumPy/ML..."

# Arrêter les conteneurs
echo "🛑 Arrêt des conteneurs..."
docker-compose down

# Supprimer l'ancien modèle
echo "🗑️  Suppression de l'ancien modèle..."
rm -f data/pretrained_model.pkl

# Recréer le modèle avec les bonnes versions
echo "🤖 Régénération du modèle ML..."
cd backend

# Installer les versions compatibles
pip3 install --upgrade numpy==1.26.2 scikit-learn==1.4.0 pandas

# Générer le nouveau modèle
python3 train_model.py

# Déplacer le modèle
mv pretrained_model.pkl ../data/

cd ..

# Rebuild et redémarrer avec cache nettoyé
echo "🐳 Reconstruction des conteneurs..."
docker-compose build --no-cache backend
docker-compose up -d

# Attendre le démarrage
echo "⏳ Attente du redémarrage..."
sleep 15

# Tester
echo "🧪 Test du modèle ML..."
response=$(curl -s "http://localhost:8000/predict?val=50")
if echo "$response" | grep -q "prediction"; then
    echo "✅ Modèle ML fonctionne correctement!"
    echo "Response: $response"
else
    echo "❌ Problème persistant avec le modèle ML"
    echo "Response: $response"
fi

echo "✅ Correction terminée!"