
import React from 'react';
import { Map as MapIcon, Users, Leaf, Bug, FlaskConical, Globe, Dna, Package, CheckCircle, Tractor, ArrowRight } from 'lucide-react';
import type { ViewName } from '../types';

const KPICard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
        <p className="text-3xl font-bold mt-2 text-neutral-800">{value}</p>
    </div>
);

// --- Chart Components ---

const HorizontalBarChart: React.FC<{ data: { name: string; value: number }[]; title: string; icon: React.ReactNode; colorClass: string }> = ({ data, title, icon, colorClass }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 h-full shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-800">{icon} {title}</h3>
            <div className="space-y-3 text-sm flex-1">
                {data.map(item => (
                    <div key={item.name} className="flex items-center gap-3 group" title={`${item.name}: ${item.value.toLocaleString('es-ES')}`}>
                        <div className="w-1/3 truncate text-neutral-600" aria-label={item.name}>{item.name}</div>
                        <div className="w-2/3">
                            <div className="w-full bg-neutral-100 rounded-full h-6 relative overflow-hidden">
                                <div
                                    className={`${colorClass} h-6 rounded-full transition-all duration-500 ease-out`}
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                    role="progressbar"
                                    aria-valuenow={item.value}
                                    aria-valuemin={0}
                                    aria-valuemax={maxValue}
                                ></div>
                                <span className="absolute inset-y-0 left-2 flex items-center text-xs font-bold text-white mix-blend-hard-light drop-shadow-md">
                                    {item.value.toLocaleString('es-ES')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DonutChart: React.FC<{ data: { name: string; value: number; color: string }[]; title: string; icon: React.ReactNode; totalLabel?: string }> = ({ data, title, icon, totalLabel = "Total" }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let accumulatedPercentage = 0;

    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 h-full shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-800">{icon} {title}</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 flex-1">
                <div className="relative w-40 h-40 flex-shrink-0">
                    <svg width="100%" height="100%" viewBox="0 0 36 36" className="transform -rotate-90">
                        <circle cx="18" cy="18" r="15.9155" className="fill-transparent stroke-neutral-100" strokeWidth="3.5"></circle>
                        {data.map(item => {
                            const percentage = (item.value / total) * 100;
                            const dashArray = `${percentage} ${100 - percentage}`;
                            const offset = 100 - accumulatedPercentage;
                            accumulatedPercentage += percentage;
                            return (
                                <circle
                                    key={item.name}
                                    cx="18" cy="18" r="15.9155"
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth="3.5"
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={offset}
                                    className="transition-all duration-1000 ease-out"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-bold text-neutral-800">{total.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
                        <span className="text-xs text-neutral-500 font-medium">{totalLabel}</span>
                    </div>
                </div>
                <div className="w-full">
                    <ul className="text-sm space-y-2.5">
                        {data.map(item => (
                            <li key={item.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-neutral-600 font-medium">{item.name}</span>
                                </div>
                                <span className="font-semibold text-neutral-800 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100 group-hover:border-neutral-200 transition-colors">
                                    {item.value.toLocaleString('es-ES')}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

interface DashboardViewProps {
    setView: (view: ViewName) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setView }) => {
    // Data for Germplasm charts
    const holdingInstituteData = [
        { name: 'PER001 CIP', value: 8863 },
        { name: 'USA004 NR6', value: 4027 },
        { name: 'UKR026 IKA', value: 2361 },
        { name: 'CZE027 HBROD', value: 2250 },
        { name: 'GBR251 JHI', value: 1536 },
        { name: 'NLD037 CGN', value: 1482 },
        { name: 'POL002 IPRBON', value: 1429 },
        { name: 'Otros', value: 5881 },
    ];

    const countryData = [
        { name: 'Perú', value: 8863 },
        { name: 'EE. UU.', value: 4033 },
        { name: 'Ucrania', value: 2957 },
        { name: 'Rep. Checa', value: 2250 },
        { name: 'Polonia', value: 1930 },
        { name: 'Reino Unido', value: 1536 },
        { name: 'Países Bajos', value: 1482 },
        { name: 'Otros', value: 4187 },
    ];

    const genusData = [
        { name: 'Solanum', value: 27013, color: '#d97706' }, // amber-600
        { name: 'Ipomoea', value: 223, color: '#10b981' }, // emerald-500
        { name: 'Ipomea', value: 2, color: '#6366f1' }, // indigo-500
    ];

    const speciesData = [
        { name: 'S. tuberosum', value: 16262 },
        { name: 'S. sp.', value: 2305 },
        { name: 'S. acaule', value: 1016 },
        { name: 'S. stoloniferum', value: 678 },
        { name: 'S. brevicaule', value: 596 },
        { name: 'S. stenotomum', value: 454 },
        { name: 'Otros', value: 5917 },
    ];
    
    const germplasmStorageData = [
        { name: 'In vitro', value: 12072 },
        { name: 'Campo', value: 5147 },
        { name: 'Criopreservado', value: 4930 },
        { name: 'Semilla (Largo Plazo)', value: 4629 },
        { name: 'Semilla (Genérico)', value: 3836 },
        { name: 'Semilla (Medio Plazo)', value: 1559 },
        { name: 'Otros', value: 2866 },
    ];

    const curationData = [
        { name: 'No Especificado', value: 19512, color: '#a8a29e' },
        { name: 'Curado Completo', value: 7726, color: '#22c55e' },
    ];

    return (
        <section className="py-12 bg-neutral-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Dashboard General</h1>
                    <p className="text-lg text-neutral-600">Vista integral del conocimiento fitogenético y resumen del sistema</p>
                </div>

                {/* --- Main Stats & Access --- */}
                <div className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <KPICard title="Variedades Nativas" value="47" icon={<Leaf className="w-5 h-5 text-green-700" />} color="bg-green-100" />
                        <KPICard title="Plagas Documentadas" value="32+" icon={<Bug className="w-5 h-5 text-red-700" />} color="bg-red-100" />
                        <KPICard title="Técnicas de Cultivo" value="28" icon={<FlaskConical className="w-5 h-5 text-blue-700" />} color="bg-blue-100" />
                        <KPICard title="Total Muestras" value="27,238" icon={<Users className="w-5 h-5 text-amber-700" />} color="bg-amber-100" />
                    </div>

                    {/* Access to Production Stats */}
                    <div 
                        onClick={() => setView('production')}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all group relative overflow-hidden mb-10"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Tractor className="w-64 h-64 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                    <Tractor className="w-8 h-8" />
                                    Estadísticas de Producción Nacional (SIEA)
                                </h2>
                                <p className="text-blue-100 max-w-2xl">
                                    Accede a datos detallados sobre superficies cosechadas, calendario de siembras, ranking nacional y distribución departamental de la papa en el Perú.
                                </p>
                            </div>
                            <button className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold flex items-center gap-2 group-hover:bg-blue-50 transition-colors whitespace-nowrap">
                                Ver Reporte Completo
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4 text-neutral-800 flex items-center gap-2">
                        <Dna className="w-5 h-5 text-amber-600" />
                        Conservación de Germoplasma
                    </h2>

                    {/* Charts Grid: 2 per row consistently */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Row 1 */}
                        <HorizontalBarChart 
                            data={holdingInstituteData} 
                            title="Top Institutos Depositarios" 
                            icon={<Globe className="w-5 h-5 text-amber-600" />}
                            colorClass="bg-gradient-to-r from-amber-500 to-orange-500"
                        />
                        <HorizontalBarChart 
                            data={countryData} 
                            title="Top Países Depositarios"
                            icon={<Globe className="w-5 h-5 text-blue-600" />}
                            colorClass="bg-gradient-to-r from-blue-500 to-cyan-500"
                        />

                        {/* Row 2 */}
                        <HorizontalBarChart 
                            data={speciesData} 
                            title="Top Especies"
                            icon={<Leaf className="w-5 h-5 text-green-600" />}
                            colorClass="bg-gradient-to-r from-green-500 to-emerald-500"
                        />
                         <HorizontalBarChart 
                            data={germplasmStorageData} 
                            title="Tipo de Almacenamiento"
                            icon={<Package className="w-5 h-5 text-indigo-600" />}
                            colorClass="bg-gradient-to-r from-indigo-500 to-purple-500"
                        />

                        {/* Row 3 */}
                        <DonutChart 
                            data={genusData} 
                            title="Distribución por Género"
                            icon={<Dna className="w-5 h-5 text-emerald-600" />}
                            totalLabel="Muestras"
                        />
                        <div className="bg-white border border-neutral-200 rounded-xl p-6 h-full shadow-sm flex flex-col justify-center">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-800">
                                <CheckCircle className="w-5 h-5 text-rose-600" />
                                Estado de Curación
                            </h3>
                            <div className="space-y-4 w-full">
                                {curationData.map(item => (
                                    <div key={item.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-neutral-600 font-medium">{item.name}</span>
                                            <span className="font-bold text-neutral-800">{((item.value/27238)*100).toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-neutral-100 rounded-full h-2">
                                            <div className="h-2 rounded-full transition-all" style={{ width: `${(item.value/27238)*100}%`, backgroundColor: item.color }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardView;
