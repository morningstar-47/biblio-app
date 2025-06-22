# backend/train_model.py
import pickle
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import os

def create_sample_data():
    """
    Génère des données d'exemple pour entraîner le modèle.
    Dans un contexte réel, ces données pourraient représenter :
    - Prédiction du nombre d'emprunts basé sur l'année de publication
    - Estimation de la popularité d'un livre
    - Prédiction de la demande future
    """
    print("📊 Génération des données d'entraînement...")
    
    # Générer des données synthétiques
    np.random.seed(42)  # Pour la reproductibilité
    
    # Variable indépendante (ex: années depuis publication, popularité, etc.)
    X = np.random.rand(200, 1) * 100  # Valeurs entre 0 et 100
    
    # Variable dépendante avec une relation linéaire + bruit
    # Formule: y = 3 * x + 5 + bruit
    noise = np.random.randn(200) * 10  # Bruit gaussien
    y = 3 * X.squeeze() + 5 + noise
    
    return X, y

def train_and_save_model():
    """
    Entraîne un modèle de régression linéaire et le sauvegarde.
    """
    print("🤖 Création du modèle de Machine Learning...")
    
    # Générer les données
    X, y = create_sample_data()
    
    # Diviser en ensembles d'entraînement et de test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Créer et entraîner le modèle
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Évaluer le modèle
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"📈 Performance du modèle:")
    print(f"   - R² Score: {r2:.3f}")
    print(f"   - MSE: {mse:.3f}")
    print(f"   - Coefficient: {model.coef_[0]:.3f}")
    print(f"   - Intercept: {model.intercept_:.3f}")
    
    # Sauvegarder le modèle
    model_path = "pretrained_model.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
    
    print(f"💾 Modèle sauvegardé dans: {model_path}")
    
    # Tester le modèle avec quelques exemples
    test_values = [10, 25, 50, 75, 90]
    print("\n🧪 Tests du modèle:")
    for val in test_values:
        prediction = model.predict(np.array([[val]]))[0]
        print(f"   Input: {val:5.1f} → Prediction: {prediction:7.2f}")
    
    return model

def verify_model(model_path="pretrained_model.pkl"):
    """
    Vérifie que le modèle sauvegardé fonctionne correctement.
    """
    if not os.path.exists(model_path):
        print(f"❌ Modèle non trouvé: {model_path}")
        return False
    
    try:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        
        # Test simple
        test_input = np.array([[42.0]])
        prediction = model.predict(test_input)[0]
        
        print(f"✅ Modèle vérifié - Test: 42.0 → {prediction:.2f}")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la vérification: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Génération du modèle ML pour Biblio API")
    print("=" * 50)
    
    # Entraîner et sauvegarder le modèle
    model = train_and_save_model()
    
    # Vérifier le modèle
    print("\n🔍 Vérification du modèle...")
    verify_model()
    
    print("\n✅ Processus terminé avec succès!")
    print("\nℹ️  Ce modèle peut être utilisé pour:")
    print("   - Prédire la popularité d'un livre")
    print("   - Estimer le nombre d'emprunts futurs")
    print("   - Analyser les tendances de lecture")
    print("\n📡 Accessible via: GET /predict?val=<valeur>")