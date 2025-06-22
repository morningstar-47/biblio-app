# backend/train_model.py
import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import os

def create_sample_data():
    """
    Charge les données du fichier CSV pour entraîner le modèle.
    Utilise les budgets publicitaires comme variables d'entrée et les ventes comme cible.
    """
    print("📊 Chargement des données réelles d'entraînement...")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "..", "data", "Advertising_Budget_and_Sales.csv")

    data_f = pd.read_csv(data_path)

    X = data_f[["TV Ad Budget ($)", "Radio Ad Budget ($)", "Newspaper Ad Budget ($)"]].values
    y = data_f["Sales ($)"].values

    return X, y

def train_and_save_model():
    """
    Entraîne un modèle de régression linéaire et le sauvegarde.
    """
    print("🤖 Création du modèle de Machine Learning...")

    X, y = create_sample_data()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"\n📈 Performance du modèle:")
    print(f"   - R² Score: {r2:.3f}")
    print(f"   - MSE: {mse:.3f}")
    print(f"   - Coefficients: {model.coef_}")
    print(f"   - Intercept: {model.intercept_:.3f}")

    model_path = "/data/pretrained_model.pkl"
    # model_path = os.path.join(os.path.dirname(__file__), "pretrained_model.pkl")
  
    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    print(f"💾 Modèle sauvegardé dans: {model_path}")

    # Tests du modèle
    print("\n🧪 Tests du modèle avec valeurs fictives:")
    test_values = [10, 25, 50, 75, 90]
    for val in test_values:
        input_data = np.array([[val, val, val]])
        prediction = model.predict(input_data)[0]
        print(f"   Input (TV=Radio=News={val:5.1f}) → Prediction: {prediction:7.2f}")

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

        test_input = np.array([[42.0, 42.0, 42.0]])
        prediction = model.predict(test_input)[0]

        print(f"✅ Modèle vérifié - Test avec [42, 42, 42] → {prediction:.2f}")
        return True

    except Exception as e:
        print(f"❌ Erreur lors de la vérification: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Génération du modèle ML pour les prédictions de ventes")
    print("=" * 60)

    model = train_and_save_model()

    print("\n🔍 Vérification du modèle sauvegardé...")
    verify_model()

    print("\n✅ Processus terminé avec succès!")
    print("\n📡 Modèle prêt pour intégration dans une API.")
