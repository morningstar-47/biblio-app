"use client"

import { useState } from "react"
import { usePrediction } from "../hooks/useApi"
import { Brain, TrendingUp } from "lucide-react"

export default function PredictionSection() {
  const [inputValue, setInputValue] = useState<string>("")
  const [result, setResult] = useState<string | null>(null)
  const { predict, loading, error } = usePrediction()

  const handlePredict = async () => {
    const numValue = Number.parseFloat(inputValue)
    if (isNaN(numValue)) {
      alert("Veuillez entrer une valeur numérique valide")
      return
    }

    const response = await predict(numValue)
    if (response) {
      setResult(`Prédiction: ${response.prediction.toFixed(2)} (Modèle: ${response.model_info})`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Prédiction IA</h2>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <label htmlFor="prediction-input" className="block text-sm font-medium text-gray-700 mb-2">
              Valeur à prédire
            </label>
            <input
              id="prediction-input"
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Entrez une valeur numérique"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
          </div>

          <button
            onClick={handlePredict}
            disabled={loading || !inputValue.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Prédiction en cours...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Prédire
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-800">Résultat de la prédiction</h3>
              </div>
              <p className="text-green-700 text-lg font-semibold">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
