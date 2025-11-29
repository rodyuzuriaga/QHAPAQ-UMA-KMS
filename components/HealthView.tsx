
import React from 'react';
import { Search, AlertTriangle, Eye, Shield, AlertCircle, Bookmark, Bug } from 'lucide-react';

const HealthView: React.FC = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-3">Plagas y Enfermedades</h1>
                    <p className="text-lg text-neutral-600">Base de conocimiento de 32+ amenazas documentadas con tratamientos y prevención</p>
                </div>

                <div className="mb-8 flex gap-2 border-b border-neutral-200">
                    <button className="px-4 py-3 text-sm font-medium text-amber-700 border-b-2 border-amber-600">Todas</button>
                    <button className="px-4 py-3 text-sm font-medium text-neutral-600 hover:text-amber-700">Hongos</button>
                    <button className="px-4 py-3 text-sm font-medium text-neutral-600 hover:text-amber-700">Bacterias</button>
                    <button className="px-4 py-3 text-sm font-medium text-neutral-600 hover:text-amber-700">Virus</button>
                    <button className="px-4 py-3 text-sm font-medium text-neutral-600 hover:text-amber-700">Plagas</button>
                </div>

                <div className="mb-8">
                    <div className="relative max-w-xl">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                        <input type="text" placeholder="Buscar por nombre, síntomas, tratamiento..." className="w-full pl-10 pr-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-neutral-400" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Issue Card 1 */}
                    <div className="bg-white border border-red-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 border-b border-red-100">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full mb-2">HONGO</span>
                                    <h3 className="text-2xl font-semibold text-neutral-900">Rancha (Tizón tardío)</h3>
                                    <p className="text-sm text-neutral-600 italic mt-1">Phytophthora infestans</p>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
                                    <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
                                    CRÍTICO
                                </div>
                            </div>
                            <p className="text-sm text-neutral-700">Enfermedad fúngica devastadora que puede destruir cultivos enteros en días. Principal amenaza histórica.</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                                        Síntomas Principales
                                    </h4>
                                    <ul className="space-y-1 text-sm text-neutral-600 list-disc list-inside">
                                        <li>Manchas oscuras en hojas con borde amarillento</li>
                                        <li>Moho blanco en envés de hojas</li>
                                        <li>Pudrición de tubérculos</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-600" strokeWidth={1.5} />
                                        Prevención
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">Rotación de cultivos</span>
                                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">Variedades resistentes</span>
                                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">Espaciamiento adecuado</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 py-2 text-sm font-medium text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-all">Ver tratamientos</button>
                                    <button className="px-4 py-2 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all">
                                        <Bookmark className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issue Card 2 */}
                    <div className="bg-white border border-orange-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 border-b border-orange-100">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full mb-2">PLAGA</span>
                                    <h3 className="text-2xl font-semibold text-neutral-900">Gorgojo de los Andes</h3>
                                    <p className="text-sm text-neutral-600 italic mt-1">Premnotrypes spp.</p>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-lg">
                                    <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
                                    ALTO
                                </div>
                            </div>
                            <p className="text-sm text-neutral-700">Insecto nativo que causa pérdidas significativas en almacenamiento y campo. Plaga endémica de los Andes.</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                                        Síntomas Principales
                                    </h4>
                                    <ul className="space-y-1 text-sm text-neutral-600 list-disc list-inside">
                                        <li>Perforaciones en tubérculos</li>
                                        <li>Galerías internas en papas</li>
                                        <li>Presencia de larvas blancas</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-600" strokeWidth={1.5} />
                                        Control Integrado
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">Trampas de luz</span>
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">Control biológico</span>
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">Aporque alto</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 py-2 text-sm font-medium text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-all">Ver tratamientos</button>
                                    <button className="px-4 py-2 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all">
                                        <Bookmark className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl p-12 flex flex-col items-center justify-center text-center md:col-span-2">
                        <Bug className="w-16 h-16 text-neutral-400 mb-4" strokeWidth={1.5} />
                        <p className="text-neutral-600 font-medium mb-2 text-lg">+30 plagas y enfermedades más documentadas</p>
                        <p className="text-sm text-neutral-500">Base de conocimiento en expansión continua</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HealthView;