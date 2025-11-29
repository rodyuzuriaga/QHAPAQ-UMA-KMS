
import React, { useState, useCallback } from 'react';
import type { ViewName } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import VarietiesView from './components/VarietiesView';
import HealthView from './components/HealthView';
import TechniquesView from './components/TechniquesView';
import AssistantView from './components/AssistantView';
import GraphView from './components/GraphView';
import MapView from './components/MapView';
import ContributionsView from './components/ContributionsView';
import DashboardView from './components/DashboardView';
import ProductionStatsView from './components/ProductionStatsView';

const App: React.FC = () => {
    const [view, setView] = useState<ViewName>('home');
    const [animationKey, setAnimationKey] = useState(0);
    const [initialAssistantQuery, setInitialAssistantQuery] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSetView = useCallback((newView: ViewName) => {
        setView(newView);
        setAnimationKey(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsSidebarOpen(false); // Close sidebar on navigation
    }, []);

    const handleSearchSubmit = useCallback((query: string) => {
        setInitialAssistantQuery(query);
        handleSetView('assistant');
    }, [handleSetView]);

    const renderView = () => {
        switch (view) {
            case 'home':
                return <HomeView setView={handleSetView} />;
            case 'dashboard':
                return <DashboardView setView={handleSetView} />;
            case 'production':
                return <ProductionStatsView onBack={() => handleSetView('dashboard')} />;
            case 'varieties':
                return <VarietiesView />;
            case 'health':
                return <HealthView />;
            case 'techniques':
                return <TechniquesView />;
            case 'assistant':
                return <AssistantView initialQuery={initialAssistantQuery} clearInitialQuery={() => setInitialAssistantQuery(null)} />;
            case 'graph':
                return <GraphView />;
            case 'map':
                return <MapView />;
            case 'contributions':
                return <ContributionsView />;
            default:
                return <HomeView setView={handleSetView} />;
        }
    };
    
    const animationClass = "animate-[fadeIn_0.5s_ease-in-out]";

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar 
                    setView={handleSetView} 
                    currentView={view} 
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header 
                        setView={handleSetView} 
                        onSearchSubmit={handleSearchSubmit} 
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />
                    <main id="main-content" key={animationKey} className={`${animationClass} flex-grow bg-gradient-to-b from-amber-50 to-white`}>
                        {renderView()}
                    </main>
                    <Footer />
                </div>
                {isSidebarOpen && (
                    <div 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/50 z-[2000] transition-opacity"
                        aria-hidden="true"
                    ></div>
                )}
            </div>
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
        </>
    );
};

export default App;
