
import React, { useState } from 'react';
import { Search, BookOpen, LogIn, Menu } from 'lucide-react';
import type { ViewName } from '../types';

interface HeaderProps {
    setView: (view: ViewName) => void;
    onSearchSubmit: (query: string) => void;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, onSearchSubmit, onMenuClick }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            onSearchSubmit(searchQuery);
            setSearchQuery('');
        }
    };

    return (
        <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-[1100]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    <button 
                        onClick={onMenuClick}
                        className="lg:hidden text-neutral-600 hover:text-neutral-900"
                        aria-label="Abrir menú"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex justify-center">
                        <div className="w-full max-w-xl relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyPress={handleSearch}
                                placeholder="Consultar a QHAPAQ UMA..."
                                className="w-full pl-10 pr-4 py-2 bg-neutral-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white placeholder-neutral-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => setView('contributions')} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all">
                            <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                            Contribuir
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-sm">
                            <LogIn className="w-4 h-4" strokeWidth={1.5} />
                            Acceder
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
