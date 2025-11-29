
import React from 'react';
import { FlaskConical, Sprout, Eye, Heart, Paperclip, Info } from 'lucide-react';

const ContributionsView: React.FC = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-3">Sistema de Contribuciones</h1>
                    <p className="text-lg text-neutral-600">Comparte tu conocimiento y experiencia con la comunidad</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-lg">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-neutral-900 mb-2">Tipo de Contribución</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button className="p-4 border-2 border-amber-600 bg-amber-50 rounded-lg text-center">
                                <FlaskConical className="w-6 h-6 text-amber-600 mx-auto mb-2" strokeWidth={1.5} />
                                <div className="text-xs font-medium">Investigación</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-200 rounded-lg text-center hover:border-amber-400">
                                <Sprout className="w-6 h-6 text-neutral-400 mx-auto mb-2" strokeWidth={1.5} />
                                <div className="text-xs font-medium text-neutral-600">Técnica</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-200 rounded-lg text-center hover:border-amber-400">
                                <Eye className="w-6 h-6 text-neutral-400 mx-auto mb-2" strokeWidth={1.5} />
                                <div className="text-xs font-medium text-neutral-600">Observación</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-200 rounded-lg text-center hover:border-amber-400">
                                <Heart className="w-6 h-6 text-neutral-400 mx-auto mb-2" strokeWidth={1.5} />
                                <div className="text-xs font-medium text-neutral-600">Remedio</div>
                            </button>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-900 mb-2">Título</label>
                            <input type="text" className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ej: Nueva técnica de control orgánico para polilla" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-900 mb-2">Descripción</label>
                            <textarea rows={6} className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Describe tu contribución en detalle..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-900 mb-2">Adjuntar Archivos (opcional)</label>
                            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-amber-400 transition-all cursor-pointer">
                                <Paperclip className="w-12 h-12 text-neutral-400 mx-auto mb-3" strokeWidth={1.5} />
                                <p className="text-sm text-neutral-600">Arrastra archivos o haz clic para seleccionar</p>
                                <p className="text-xs text-neutral-500 mt-1">PDF, imágenes, documentos hasta 20MB</p>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-md">
                                Enviar Contribución
                            </button>
                            <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-all">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Info className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-2">Proceso de Moderación</h4>
                            <p className="text-sm text-blue-800">Todas las contribuciones son revisadas por nuestro equipo de expertos antes de ser publicadas. Este proceso toma entre 24-48 horas. Recibirás una notificación cuando tu contribución sea aprobada.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContributionsView;
