
import React from 'react';
import { Wheat } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-neutral-900 text-neutral-400 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                                <Wheat className="w-5 h-5 text-white" strokeWidth={1.5} />
                            </div>
                            <span className="text-white font-semibold">QHAPAQ</span>
                        </div>
                        <p className="text-sm">Sistema de Gestión del Conocimiento para Papa Nativa del Perú</p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3 text-sm">Proyecto</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Equipo</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Instituciones</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3 text-sm">Recursos</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contribuir</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3 text-sm">Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Email</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-8 pt-8 text-sm text-center">
                    <p className="italic mb-2">Hanaq pachapiqa uchuyllam kanchik, kaypiñataqmi yachasqanchik kanchik</p>
                    <p>© 2025 QHAPAQ. Preservando el conocimiento ancestral de la papa nativa.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
