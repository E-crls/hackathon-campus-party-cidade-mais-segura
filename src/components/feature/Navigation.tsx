import { useState } from 'react';
import { 
  BarChart3, 
  Map, 
  Lightbulb, 
  User, 
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  ArrowRight,
  Trello
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'intelligent-map', label: 'Mapa Inteligente', icon: Map },
  { id: 'kanban', label: 'Tarefas', icon: Trello },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export function Navigation({ currentSection, onSectionChange, onCollapseChange }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
  };

  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out bg-white border-r border-gray-200 shadow-sm',
      isCollapsed ? 'w-16' : 'w-72'
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          "flex items-center border-b border-gray-100",
          isCollapsed ? "justify-center p-4" : "justify-between p-6"
        )}>
          {!isCollapsed && (
            <div className="flex items-center">
              <img 
                src="/Logo_Orbis.svg" 
                alt="Orbis Logo" 
                className="w-20 transition-all duration-300"
              />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapseToggle}
            className={cn(
              "rounded-lg hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors",
              isCollapsed ? "w-10 h-10" : "w-8 h-8"
            )}
            title={isCollapsed ? "Expandir navegação" : "Recolher navegação"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className={cn("flex-1 overflow-y-auto", isCollapsed ? "p-2" : "p-6")}>
          <div className="h-full flex flex-col">
            {!isCollapsed && (
              <div className="mb-6 flex-shrink-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3">Navegação</p>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto">
              <nav className={cn("space-y-2", isCollapsed && "mt-6")}>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className={cn(
                        'w-full flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group',
                                              isActive
                            ? 'bg-brand-50 text-brand-700 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon 
                        className={cn(
                          'h-5 w-5 transition-colors', 
                          isCollapsed ? 'mx-auto' : 'mr-3',
                          isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'
                        )}
                      />
                      {!isCollapsed && (
                        <span>{item.label}</span>
                      )}
                      {isActive && !isCollapsed && (
                        <div className="ml-auto">
                          <ArrowRight className="h-4 w-4 text-brand-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* AI Insights Card */}
              {!isCollapsed && (
                <div className="mt-8 flex-shrink-0">
                  <div className="relative rounded-xl p-6 shadow-lg overflow-hidden" style={{ backgroundColor: '#4220F3' }}>
                    
                    <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                      <div className="flex-shrink-0">
                        <img 
                          src="/ORBIS_ICON.svg" 
                          alt="Orbis Icon" 
                          className="h-8 w-8"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white leading-tight">
                          Insights via<br />Satélites + IA
                        </h3>
                        <p className="text-xs text-white/70 mt-1">Análise de dados open-source em tempo real</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/90 hover:bg-white text-brand-700 px-6 py-2.5 h-auto rounded-full transition-all duration-200 w-full shadow-md hover:shadow-lg"
                      >
                        <span className="text-sm font-medium">Ver insights</span>
                        <ArrowRight className="h-4 w-4 ml-2 text-brand-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings & Profile Section */}
        <div className={cn("space-y-2 border-t border-gray-100 mt-auto", isCollapsed ? "p-2" : "p-6")}>

          {!isCollapsed && (
            <div className="pt-4">
              <div className="flex items-center space-x-3 px-4 py-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="relative">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-brand-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Gestor MSP
                  </p>
                  <p className="text-xs text-gray-500">
                    Ministério da Segurança
                  </p>
                </div>
              </div>
              
              <button className="w-full flex items-center rounded-lg px-4 py-3 mt-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="h-4 w-4 mr-3" />
                <span>Sair</span>
              </button>
            </div>
          )}

          {isCollapsed && (
            <div className="pt-4">
              <button 
                className="w-full flex justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                title="Gestor MSP"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-brand-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
} 