
import React from 'react';
import { Map as MapIcon, Calendar, Tractor, TrendingUp, ArrowLeft } from 'lucide-react';

const KPICard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; subtext?: string }> = ({ title, value, icon, color, subtext }) => (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
        <div>
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-neutral-600">{title}</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800">{value}</p>
        </div>
        {subtext && <p className="text-xs text-neutral-400 mt-3">{subtext}</p>}
    </div>
);

const VerticalBarChart: React.FC<{ data: { name: string; value: number }[]; title: string; icon: React.ReactNode; colorClass: string; unit?: string }> = ({ data, title, icon, colorClass, unit = '' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 h-full shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-neutral-800">{icon} {title}</h3>
            <div className="flex items-end justify-between gap-2 h-64 pt-4 border-b border-neutral-100 pb-2">
                {data.map(item => (
                    <div key={item.name} className="flex flex-col items-center gap-2 flex-1 group h-full justify-end relative">
                        <div className="w-full flex items-end justify-center h-full relative px-0.5">
                             <div
                                className={`${colorClass} w-full rounded-t-md transition-all duration-500 ease-out min-w-[8px] max-w-[24px] relative group-hover:opacity-80`}
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                            >
                            </div>
                             <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-neutral-700 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-neutral-100 z-10 pointer-events-none">
                                {item.value}{unit}
                            </span>
                        </div>
                        <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">{item.name}</div>
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
        <div className="bg-white border border-neutral-200 rounded-xl p-6 h-full shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-800">{icon} {title}</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
                <div className="relative w-48 h-48 flex-shrink-0">
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
                                    className="transition-all duration-1000 ease-out hover:opacity-80"
                                >
                                    <title>{item.name}: {item.value}%</title>
                                </circle>
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-neutral-800">100</span>
                        <span className="text-xs text-neutral-500 font-medium">{totalLabel}</span>
                    </div>
                </div>
                <div className="w-full max-w-xs">
                    <ul className="text-sm space-y-3">
                        {data.map(item => (
                            <li key={item.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2.5">
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

const ProductionStatsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Data for National Production (SIEA)
    const sowingCalendarData = [
        { name: 'Ago', value: 8.0 },
        { name: 'Set', value: 13.6 },
        { name: 'Oct', value: 28.7 },
        { name: 'Nov', value: 23.0 },
        { name: 'Dic', value: 6.0 },
        { name: 'Ene', value: 1.5 },
        { name: 'Feb', value: 1.0 },
        { name: 'Mar', value: 1.2 },
        { name: 'Abr', value: 2.3 },
        { name: 'May', value: 4.3 },
        { name: 'Jun', value: 5.8 },
        { name: 'Jul', value: 4.6 },
    ];

    const regionalDistributionData = [
        { name: 'Puno', value: 18.1, color: '#1e3a8a' }, // blue-900
        { name: 'Huánuco', value: 12.5, color: '#2563eb' }, // blue-600
        { name: 'Huancavelica', value: 9.9, color: '#60a5fa' }, // blue-400
        { name: 'Cusco', value: 9.3, color: '#93c5fd' }, // blue-300
        { name: 'Otros', value: 50.2, color: '#bfdbfe' }, // blue-200
    ];

    return (
        <section className="py-12 bg-neutral-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="mb-8">
                    <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
                            <Tractor className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-900">Estadísticas de Producción Nacional</h2>
                            <p className="text-neutral-500 mt-1">Datos oficiales del Sistema Integrado de Estadística Agraria (SIEA)</p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="md:col-span-1">
                        <KPICard 
                            title="Superficie Total (ha)" 
                            value="331 584" 
                            icon={<MapIcon className="w-6 h-6 text-blue-700" />} 
                            color="bg-blue-100" 
                            subtext="* Fuente: SIEA (Periodo Ref. 2014-2019)"
                        />
                     </div>
                     <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp className="w-32 h-32 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="p-4 bg-white rounded-full shadow-md text-amber-600 border border-amber-100">
                                <TrendingUp className="w-8 h-8" strokeWidth={2} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-neutral-800 mb-1">Ranking Nacional</h4>
                                <p className="text-neutral-600 text-lg">
                                    El cultivo de papa ocupa el <span className="text-3xl font-extrabold text-amber-600 mx-1">2° Lugar</span>
                                </p>
                                <p className="text-sm text-neutral-500 font-medium">en importancia económica del PBI Agrícola Nacional.</p>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-[fadeIn_0.5s_ease-out_0.2s] fill-mode-backwards">
                    <VerticalBarChart 
                        data={sowingCalendarData}
                        title="Calendario de Siembras (%)"
                        icon={<Calendar className="w-5 h-5 text-blue-600" />}
                        colorClass="bg-gradient-to-t from-blue-600 to-cyan-400"
                        unit="%"
                    />
                    <DonutChart 
                        data={regionalDistributionData}
                        title="Distribución Dptal. de Siembras"
                        icon={<MapIcon className="w-5 h-5 text-blue-600" />}
                        totalLabel="%"
                    />
                </div>
            </div>
        </section>
    );
};

export default ProductionStatsView;
