import { useState } from 'react'
import { Navigation } from './components/feature/Navigation'
import { Dashboard } from './features/dashboard/Dashboard'
import { KanbanBoard } from './features/kanban/KanbanBoard'
import { ChatWizard } from './features/wizard/ChatWizard'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import AIInsights from './features/insights/AIInsights'
import IntelligentMap from './features/map/IntelligentMap'

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId)
  }

  const handleCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />
      case 'kanban':
        return <KanbanBoard />
      case 'intelligent-map':
        return <IntelligentMap />
      case 'insights':
        return <AIInsights />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Side Navigation */}
      <Navigation 
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        onCollapseChange={handleCollapseChange}
      />
      
      {/* Main Layout */}
      <div className={`flex min-h-screen transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-16' : 'ml-72'}`}>
        {/* Main Content */}
        <main className="flex-1 lg:mr-96">
          {renderCurrentSection()}
        </main>

        {/* Wizard Sidebar */}
                  <aside className="hidden lg:flex w-96 bg-white border-l border-gray-200 flex-col fixed right-0 top-0 bottom-0">
          <div className="flex-1">
            <ChatWizard isInSidebar={true} />
          </div>
        </aside>
      </div>

      {/* Global Loading Overlay */}
      <div 
        id="loadingOverlay" 
        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center hidden"
      >
        <LoadingSpinner message="Processando dados com IA..." />
      </div>
    </div>
  )
}

export default App
