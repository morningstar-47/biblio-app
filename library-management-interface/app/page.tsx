"use client"

import { useState } from "react"
import { Book, Brain, BookOpen, BarChart3, Users } from "lucide-react"
import LivresSection from "../components/LivresSection"
import PredictionSection from "../components/PredictionSection"
import EmpruntsSection from "../components/EmpruntsSection"
import StatistiquesSection from "../components/StatistiquesSection"
import GestionSection from "../components/GestionSection"

type TabType = "livres" | "prediction" | "emprunts" | "statistiques" | "gestion"

export default function LibraryManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("livres")

  const tabs = [
    {
      id: "livres" as TabType,
      label: "Catalogue",
      icon: Book,
      component: LivresSection,
    },
    {
      id: "prediction" as TabType,
      label: "Prédiction IA",
      icon: Brain,
      component: PredictionSection,
    },
    {
      id: "emprunts" as TabType,
      label: "Emprunts",
      icon: BookOpen,
      component: EmpruntsSection,
    },
    {
      id: "statistiques" as TabType,
      label: "Statistiques",
      icon: BarChart3,
      component: StatistiquesSection,
    },
    {
      id: "gestion" as TabType,
      label: "Gestion",
      icon: Users,
      component: GestionSection,
    },
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || LivresSection

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Book className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Gestion de Bibliothèque</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveComponent />
      </main>
    </div>
  )
}
