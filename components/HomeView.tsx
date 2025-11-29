import React from 'react';
import type { ViewName } from '../types';
import { Sparkles, Search, MessageCircle, Database, Brain, Leaf, MessageSquare, ScanLine, Network, MapPin, UserPlus, Github } from 'lucide-react';

interface HomeViewProps {
    setView: (view: ViewName) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setView }) => {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-8">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 via-orange-50/30 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                                Potenciado por IA Generativa (RAG + Visión)
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                                Preservando el
                                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Conocimiento Andino </span>
                                de la Papa
                            </h1>
                            <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
                                Sistema inteligente que integra <strong>conocimiento científico y ancestral</strong> sobre 47 variedades nativas, 32 plagas documentadas y técnicas de cultivo sostenible del Perú.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <button onClick={() => setView('varieties')} className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg">
                                    <Search className="w-4 h-4" strokeWidth={2} />
                                    Explorar Variedades
                                </button>
                                <button onClick={() => setView('assistant')} className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-neutral-900 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all">
                                    <MessageCircle className="w-4 h-4" strokeWidth={2} />
                                    Consultar IA
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-200">
                                <div>
                                    <div className="text-3xl font-bold text-amber-700">47</div>
                                    <div className="text-sm text-neutral-600 mt-1">Variedades Nativas</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-orange-700">32+</div>
                                    <div className="text-sm text-neutral-600 mt-1">Plagas Documentadas</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-amber-700">28</div>
                                    <div className="text-sm text-neutral-600 mt-1">Técnicas de Cultivo</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative aspect-square max-w-lg mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-3xl blur-3xl"></div>
                                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxBQPvGwfpmHVG8Drg2JgK-u9s42hVZAWdeg&s" alt="Papa Huayro" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                                            <Database className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.5} />
                                            Grafo de Conocimiento
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                                            <Brain className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.5} />
                                            RAG AI Assistant
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Leaf className="w-6 h-6 text-amber-700" strokeWidth={1.5} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm text-neutral-900">Papa Huayro</h3>
                                                <p className="text-xs text-neutral-600 mt-0.5">Resistente a heladas • 3200-3800 msnm</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Alta resistencia</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white border-t border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold tracking-tight mb-4">Capacidades del Sistema</h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Tecnología avanzada al servicio del conocimiento tradicional y científico</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer" onClick={() => setView('assistant')}>
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                                <MessageSquare className="w-6 h-6 text-white" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Chat RAG con IA</h3>
                            <p className="text-sm text-neutral-600">Asistente inteligente que responde consultas usando Gemini y documentos técnicos indexados.</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer" onClick={() => setView('assistant')}>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                                <ScanLine className="w-6 h-6 text-white" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Diagnóstico Visual</h3>
                            <p className="text-sm text-neutral-600">Análisis de imágenes con Gemini Vision para identificar plagas y enfermedades.</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer" onClick={() => setView('graph')}>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                <Network className="w-6 h-6 text-white" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Grafo de Conocimiento</h3>
                            <p className="text-sm text-neutral-600">Visualización interactiva de relaciones entre variedades, plagas y técnicas en Neo4j.</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer" onClick={() => setView('map')}>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6 text-white" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Mapa en Tiempo Real</h3>
                            <p className="text-sm text-neutral-600">Reportes georreferenciados de plagas con alertas automáticas por región.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-amber-100 to-orange-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold tracking-tight mb-4">¿Listo para comenzar?</h2>
                    <p className="text-lg text-neutral-700 mb-8">Únete a la comunidad de agricultores, investigadores y expertos en papa nativa del Perú.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg">
                            <UserPlus className="w-5 h-5" strokeWidth={1.5} />
                            Crear Cuenta
                        </button>
                        <button className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-neutral-900 bg-white border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all">
                            <Github className="w-5 h-5" strokeWidth={1.5} />
                            Ver en GitHub
                        </button>
                    </div>
                    <p className="text-sm text-neutral-600 mt-6">Desarrollado en colaboración con el Centro Internacional de la Papa (CIP)</p>
                </div>
            </section>
        </div>
    );
};

export default HomeView;
