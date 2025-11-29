
import React from 'react';
import { Leaf, Sprout, Shuffle, Sparkles, Droplet, Repeat, ChevronRight, Star, BookOpen, Clock, ClipboardList } from 'lucide-react';

const TechniquesView: React.FC = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-3">Técnicas de Cultivo</h1>
                    <p className="text-lg text-neutral-600">28 técnicas orgánicas, culturales e integradas para el manejo sostenible de papa nativa</p>
                </div>

                {/* Growth Time Card */}
                <div className="mb-12 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 items-center">
                        <div className="p-8 order-2 md:order-1">
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-neutral-800 mb-4">
                                <Clock className="w-7 h-7 text-amber-600" strokeWidth={2} />
                                <span>Tiempo de Crecimiento</span>
                            </h2>
                            <div className="space-y-4 text-neutral-600 leading-relaxed">
                                <p>
                                    El tiempo típico de crecimiento de la papa oscila entre <strong>90 y 120 días</strong> para la mayoría de las variedades. La variedad a cultivar dependerá de la duración de la temporada de cultivo en su región.
                                </p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li><strong>Variedades de temporada temprana:</strong> 60-80 días.</li>
                                    <li><strong>Variedades de mediados de temporada:</strong> 80-100 días.</li>
                                    <li><strong>Variedades de temporada tardía:</strong> 100-130 días.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="h-64 md:h-full order-1 md:order-2">
                            <img 
                                src="https://eos.com/wp-content/uploads/2024/04/how-long-to-grow-potato-es.png.webp" 
                                alt="Infografía del tiempo de crecimiento de la papa" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </div>
                </div>

                {/* Cultivation Conditions Card */}
                <div className="mb-12 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 items-center">
                        <div className="h-64 md:h-full">
                            <img 
                                src="https://eos.com/wp-content/uploads/2023/12/growing-potatoes-planting-in-a-row.jpg.webp" 
                                alt="Campo de cultivo de papas en hileras" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="p-8">
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-neutral-800 mb-4">
                                <ClipboardList className="w-7 h-7 text-green-600" strokeWidth={2} />
                                <span>Condiciones de Cultivo</span>
                            </h2>
                            <div className="space-y-4 text-neutral-600 leading-relaxed">
                                <p>
                                    Elegir un campo con condiciones favorables desde el principio ayudará al agricultor a ahorrar tiempo y recursos.
                                </p>
                                <div>
                                    <h3 className="font-semibold text-lg text-neutral-700 mb-2">Requisitos de Suelo</h3>
                                    <ul className="space-y-2 list-disc list-inside text-sm">
                                        <li>Prefiere suelos <strong>francos arenosos</strong>, sueltos y bien drenados.</li>
                                        <li>El <strong>pH ideal es de 5,5 a 6,0</strong> para evitar la sarna común.</li>
                                        <li>Suelos mal drenados y arcillosos pueden deformar los tubérculos.</li>
                                        <li>Se recomienda analizar el suelo antes de plantar.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-neutral-700 mb-2">Temperatura y Sol</h3>
                                     <ul className="space-y-2 list-disc list-inside text-sm">
                                        <li>Temperatura diurna: <strong>18-29°C</strong>.</li>
                                        <li>Temperatura nocturna: <strong>13-18°C</strong>.</li>
                                        <li>Requiere al menos <strong>6 horas de sol directo</strong> al día para un buen rendimiento.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seed Preparation Card */}
                <div className="mb-12 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 items-center">
                        <div className="p-8 order-2 md:order-1">
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-neutral-800 mb-4">
                                <Sprout className="w-7 h-7 text-purple-600" strokeWidth={2} />
                                <span>Preparación de las Semillas</span>
                            </h2>
                            <div className="space-y-4 text-neutral-600 leading-relaxed">
                                <p>
                                    Las semillas de la papa son tubérculos para plantar, especialmente seleccionados y preparados. Cortar las papas es un procedimiento habitual. Los diminutos brotes de los trozos, también conocidos como <strong>"ojos"</strong>, son el punto de partida de los tallos y raíces.
                                </p>
                                <p>
                                    A veces, los agricultores cortan las semillas para ayudarlas a superar condiciones desfavorables. Para ello, los tubérculos se calientan, se cortan y se enfrían a una temperatura de <strong>7-10°C</strong>. Este proceso envejece la semilla, por lo que solo debe hacerse con semillas jóvenes.
                                </p>
                            </div>
                        </div>
                        <div className="h-64 md:h-full order-1 md:order-2">
                             <img 
                                src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070&auto=format&fit=crop" 
                                alt="Manos plantando una papa con brotes" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-8 grid md:grid-cols-4 gap-4">
                    {/* Categories */}
                    <button className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-left hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-green-700" strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="font-semibold text-neutral-900">Control Orgánico</div>
                                <div className="text-xs text-neutral-600">12 técnicas</div>
                            </div>
                        </div>
                    </button>
                    <button className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-left hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Sprout className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="font-semibold text-neutral-900">Control Cultural</div>
                                <div className="text-xs text-neutral-600">8 técnicas</div>
                            </div>
                        </div>
                    </button>
                    <button className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-left hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shuffle className="w-5 h-5 text-blue-700" strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="font-semibold text-neutral-900">Manejo Integrado</div>
                                <div className="text-xs text-neutral-600">5 técnicas</div>
                            </div>
                        </div>
                    </button>
                    <button className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl text-left hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-purple-700" strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="font-semibold text-neutral-900">Ancestral</div>
                                <div className="text-xs text-neutral-600">3 técnicas</div>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Technique 1 */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Droplet className="w-8 h-8 text-green-700" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 mb-1">Caldo Bordelés</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">Orgánico</span>
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Preventivo</span>
                                            <span className="text-xs text-neutral-600">Dificultad: Fácil</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-600">
                                        <Star className="w-4 h-4 fill-amber-600" strokeWidth={1.5} />
                                        <span className="text-sm font-semibold">4.8</span>
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-600 mb-3">Fungicida orgánico tradicional efectivo contra hongos. Mezcla de sulfato de cobre y cal que forma una película protectora.</p>
                                <button className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1">
                                    Ver instrucciones detalladas
                                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Technique 2 */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Repeat className="w-8 h-8 text-amber-700" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 mb-1">Rotación de Cultivos</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Cultural</span>
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Ancestral</span>
                                            <span className="text-xs text-neutral-600">Dificultad: Media</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-600">
                                        <Star className="w-4 h-4 fill-amber-600" strokeWidth={1.5} />
                                        <span className="text-sm font-semibold">4.9</span>
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-600 mb-3">Sistema tradicional andino de rotación que rompe ciclos de plagas, mejora fertilidad y reduce enfermedades del suelo.</p>
                                <button className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1">
                                    Ver guía completa de implementación
                                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Placeholder */}
                    <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
                        <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-neutral-600 font-medium mb-1">+26 técnicas adicionales documentadas</p>
                        <p className="text-sm text-neutral-500">Control biológico, MIP, técnicas ancestrales y más</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechniquesView;
