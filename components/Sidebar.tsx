
import React from 'react';
import { Wheat, LayoutDashboard, Search, Bug, FlaskConical, Bot, GitMerge, MapPin, X } from 'lucide-react';
import type { ViewName } from '../types';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    viewName: ViewName;
    setView: (view: ViewName) => void;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, viewName, setView, isActive }) => (
    <a 
        onClick={() => setView(viewName)} 
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
            isActive ? 'bg-amber-100 text-amber-800' : 'text-neutral-600 hover:bg-neutral-100 hover:translate-x-1'
        }`}
    >
        {icon}
        <span>{label}</span>
    </a>
);


interface SidebarProps {
    setView: (view: ViewName) => void;
    currentView: ViewName;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setView, currentView, isOpen, onClose }) => {
    const navItems = [
        { icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.5}/>, label: 'Dashboard', view: 'dashboard' as ViewName },
        { icon: <Search className="w-5 h-5" strokeWidth={1.5}/>, label: 'Variedades', view: 'varieties' as ViewName },
        { icon: <Bug className="w-5 h-5" strokeWidth={1.5}/>, label: 'Plagas', view: 'health' as ViewName },
        { icon: <FlaskConical className="w-5 h-5" strokeWidth={1.5}/>, label: 'Técnicas', view: 'techniques' as ViewName },
        { icon: <Bot className="w-5 h-5" strokeWidth={1.5}/>, label: 'Asistente IA', view: 'assistant' as ViewName },
        { icon: <GitMerge className="w-5 h-5" strokeWidth={1.5}/>, label: 'Grafo', view: 'graph' as ViewName },
        { icon: <MapPin className="w-5 h-5" strokeWidth={1.5}/>, label: 'Mapa', view: 'map' as ViewName },
    ];

    return (
        <aside 
            className={`fixed lg:sticky top-0 h-screen z-[3000] w-60 bg-white border-r border-neutral-200 p-4 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        >
            <div className="flex items-center justify-between p-2 mb-6">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                        <Wheat className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">QHAPAQ</h1>
                        <p className="text-xs text-neutral-600">Guardián del Conocimiento</p>
                    </div>
                </div>
                 <button onClick={onClose} className="lg:hidden text-neutral-500 hover:text-neutral-800" aria-label="Cerrar menú">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex flex-col gap-1">
                {navItems.map(item => (
                    <NavItem 
                        key={item.view}
                        icon={item.icon}
                        label={item.label}
                        viewName={item.view}
                        setView={setView}
                        isActive={currentView === item.view}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
