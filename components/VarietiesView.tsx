
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
// FIX: Replaced non-existent 'Virus' icon with 'Biohazard' from lucide-react as 'Virus' is not an exported member.
import { Search, Mountain, MapPin, ShieldCheck, Sparkles, PlusCircle, BookText, Activity, ChefHat, Shield, ChevronRight, Filter, XCircle, ArrowLeft, Bug, Sun, Snowflake, Biohazard, ShieldAlert } from 'lucide-react';

const varietiesData = [
    {
        name: "Papa Huayro",
        scientific: "Solanum tuberosum group Andigenum",
        color: "Amarillo",
        colorClass: "bg-yellow-500",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqb1la-DElINrRE-NB3IFVyuoTXZ_gCohCsA&s",
        altitude: "3200-3800 msnm",
        regions: "Cusco, Puno, Apurímac",
        resistance: "Resistente a heladas",
        soilType: "Franco-arenoso",
        specificResistance: ["Tizón tardío (moderada)", "Nematodo del quiste"],
        resistanceIcon: <ShieldCheck className="w-4 h-4 text-green-600" strokeWidth={1.5} />,
        tags: [
            { text: "Alta resistencia", class: "bg-green-100 text-green-800" },
            { text: "Tradicional", class: "bg-blue-100 text-blue-800" }
        ],
        history: "Variedad ancestral de los Andes centrales, cultivada por más de 1000 años. Su nombre en quechua alude a su textura harinosa, ideal para guisos y sopas espesas.",
        nutrition: {
            macros: [
                { name: "Carbohidratos", value: "25g" },
                { name: "Proteínas", value: "2g" },
                { name: "Grasas", value: "0.1g" }
            ],
            micros: [
                { name: "Vitamina C", value: "45% VDR" },
                { name: "Hierro", value: "1.5mg" },
                { name: "Potasio", value: "429mg" }
            ]
        },
        culinaryUses: ["Pachamanca", "Guisos y estofados", "Purés rústicos", "Frituras"],
        conservation: {
            status: "Bajo Riesgo",
            statusClass: "bg-green-100 text-green-800",
            efforts: "Ampliamente cultivada y conservada en bancos de germoplasma del CIP."
        }
    },
    {
        name: "Papa Ccompis",
        scientific: "Solanum tuberosum",
        color: "Rojo",
        colorClass: "bg-red-500",
        image: "https://plazavea.vteximg.com.br/arquivos/ids/518600-512-512/20171835.jpg",
        altitude: "3500-4000 msnm",
        regions: "Cusco, Huancavelica",
        resistance: "Resistente a sequía",
        soilType: "Suelos sueltos",
        specificResistance: ["Sequía (alta)", "Heladas (moderada)"],
        resistanceIcon: <ShieldCheck className="w-4 h-4 text-green-600" strokeWidth={1.5} />,
        tags: [
            { text: "Media resistencia", class: "bg-yellow-100 text-yellow-800" },
            { text: "Ancestral", class: "bg-purple-100 text-purple-800" }
        ],
        history: "Originaria de las zonas altas de Cusco, es valorada por su resistencia y sabor. Su nombre describe su forma redonda y compacta.",
        nutrition: {
            macros: [
                { name: "Carbohidratos", value: "22g" },
                { name: "Proteínas", value: "2.5g" },
                { name: "Grasas", value: "0.2g" }
            ],
            micros: [
                { name: "Zinc", value: "0.3mg" },
                { name: "Fósforo", value: "60mg" },
                { name: "Vitamina B6", value: "15% VDR" }
            ]
        },
        culinaryUses: ["Chairo (sopa andina)", "Asada con cáscara (huatia)", "Caldo de cordero"],
        conservation: {
            status: "Vulnerable",
            statusClass: "bg-yellow-100 text-yellow-800",
            efforts: "Conservada por comunidades locales y programas de recuperación de germoplasma."
        }
    },
    {
        name: "Papa Negra Andina",
        scientific: "Solanum tuberosum ssp. andigena",
        color: "Morado",
        colorClass: "bg-purple-900",
        image: "https://aceleralastatic.nyc3.cdn.digitaloceanspaces.com/files/uploads/1499/1603307195-95-img-9146-jpg.jpg",
        altitude: "2800-3600 msnm",
        regions: "Junín, Ayacucho",
        resistance: "Alto en antioxidantes",
        soilType: "Franco orgánico",
        specificResistance: ["Virus del enrollamiento de la hoja", "Sarna común"],
        resistanceIcon: <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={1.5} />,
        tags: [
            { text: "Alta resistencia", class: "bg-green-100 text-green-800" },
            { text: "Nutricional", class: "bg-amber-100 text-amber-800" }
        ],
        history: "Conocida como 'la joya de los Andes', esta variedad era consumida por la nobleza inca por sus propiedades nutricionales y su color distintivo.",
        nutrition: {
            macros: [
                { name: "Carbohidratos", value: "20g" },
                { name: "Proteínas", value: "3g" },
                { name: "Grasas", value: "0.1g" }
            ],
            micros: [
                { name: "Antocianinas", value: "Alto contenido" },
                { name: "Hierro", value: "1.1mg" },
                { name: "Magnesio", value: "23mg" }
            ]
        },
        culinaryUses: ["Ensaladas gourmet", "Chips de colores", "Causa morada", "Guarniciones sofisticadas"],
        conservation: {
            status: "En Peligro",
            statusClass: "bg-red-100 text-red-800",
            efforts: "Proyectos específicos del CIP para su reintroducción y valoración en mercados gourmet."
        }
    }
];

type Variety = typeof varietiesData[0];

const initialFilters = {
    searchTerm: '',
    colors: [] as string[],
    altitudes: [] as string[],
    soilTypes: [] as string[],
    resistances: [] as string[],
    culinaryUses: [] as string[],
    regions: [] as string[],
};

const altitudeOptions = ['2000-2800 msnm', '2800-3500 msnm', '3500-4200 msnm'];

interface FilterButtonProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${isSelected ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'}`}
    >
        {label}
    </button>
);

const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    return (
        <details open className="border-b border-neutral-200 py-4 group last:border-b-0">
            <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="text-sm font-semibold text-neutral-800">{title}</span>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="pt-3 flex flex-wrap gap-2">
                {children}
            </div>
        </details>
    );
};

const GoogleMapsEmbed: React.FC<{ regions: string }> = ({ regions }) => {
    const query = regions.split(',').map(r => `${r.trim()}, Peru`).join(' | ');
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=6&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-200 overflow-hidden">
            <iframe
                width="100%"
                height="300"
                src={mapSrc}
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                title={`Mapa de ${regions}`}
                className="rounded-md"
            ></iframe>
        </div>
    );
};

const getResistanceIcon = (resistance: string) => {
    const lowerRes = resistance.toLowerCase();
    if (lowerRes.includes('nematodo') || lowerRes.includes('polilla') || lowerRes.includes('gorgojo')) {
        return <Bug className="w-5 h-5 text-red-600 flex-shrink-0" strokeWidth={1.5} />;
    }
    if (lowerRes.includes('sequía')) {
        return <Sun className="w-5 h-5 text-orange-500 flex-shrink-0" strokeWidth={1.5} />;
    }
    if (lowerRes.includes('helada')) {
        return <Snowflake className="w-5 h-5 text-blue-500 flex-shrink-0" strokeWidth={1.5} />;
    }
    if (lowerRes.includes('virus')) {
        // FIX: Replaced non-existent 'Virus' icon with 'Biohazard'.
        return <Biohazard className="w-5 h-5 text-purple-600 flex-shrink-0" strokeWidth={1.5} />;
    }
     if (lowerRes.includes('tizón') || lowerRes.includes('sarna')) {
        return <ShieldAlert className="w-5 h-5 text-green-700 flex-shrink-0" strokeWidth={1.5} />;
    }
    return <ShieldCheck className="w-5 h-5 text-gray-500 flex-shrink-0" strokeWidth={1.5} />;
};

const VarietyDetailView: React.FC<{ variety: Variety; onBack: () => void }> = ({ variety, onBack }) => {
    return (
        <div className="max-w-5xl mx-auto animate-[varietyDetailEnter_0.5s_ease-out]">
            <button onClick={onBack} className="flex items-center gap-2 mb-6 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Volver al listado
            </button>
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <img src={variety.image} alt={variety.name} className="w-full h-64 md:h-full object-cover" />
                    <div className="p-8">
                        <span className={`px-3 py-1 ${variety.colorClass} text-white text-xs font-semibold rounded-full inline-block mb-3`}>{variety.color}</span>
                        <h1 className="text-4xl font-bold tracking-tight">{variety.name}</h1>
                        <p className="text-md text-neutral-500 italic mt-1 mb-4">{variety.scientific}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {variety.tags.map((tag, i) => (
                                <span key={i} className={`px-3 py-1 ${tag.class} text-xs font-medium rounded-full`}>{tag.text}</span>
                            ))}
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Mountain className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                <div><strong className="font-semibold text-neutral-800">Altitud:</strong> {variety.altitude}</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                <div><strong className="font-semibold text-neutral-800">Regiones:</strong> {variety.regions}</div>
                            </div>
                            <div className="flex items-start gap-3">
                                {variety.resistanceIcon}
                                <div><strong className="font-semibold text-neutral-800">Resistencia Clave:</strong> {variety.resistance}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-8">
                    <div>
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-neutral-800 mb-3">
                            <BookText className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                            Historia y Origen
                        </h4>
                        <p className="text-md text-neutral-600 leading-relaxed">{variety.history}</p>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-neutral-800 mb-3">
                            <MapPin className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                            Principales Regiones de Cultivo
                        </h4>
                        <GoogleMapsEmbed regions={variety.regions} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-neutral-800 mb-3">
                                <Activity className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                                Perfil Nutricional
                            </h4>
                            <div className="text-sm text-neutral-600 space-y-3 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                                <div>
                                    <h5 className="font-semibold text-neutral-700 mb-2">Macronutrientes (por 100g)</h5>
                                    <ul className="space-y-1">
                                        {variety.nutrition.macros.map(macro => (
                                            <li key={macro.name} className="flex justify-between">
                                                <span>{macro.name}</span>
                                                <span className="font-medium text-neutral-800">{macro.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-neutral-700 mt-3 mb-2">Micronutrientes Clave</h5>
                                    <ul className="space-y-1">
                                        {variety.nutrition.micros.map(micro => (
                                            <li key={micro.name} className="flex justify-between">
                                                <span>{micro.name}</span>
                                                <span className="font-medium text-neutral-800">{micro.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-neutral-800 mb-3">
                                <ChefHat className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                                Usos Culinarios
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {variety.culinaryUses.map(use => (
                                    <span key={use} className="px-3 py-1.5 bg-amber-100 text-amber-800 text-sm font-medium rounded-md">{use}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-neutral-800 mb-3">
                            <Shield className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                            Resistencias Específicas
                        </h4>
                        <div className="space-y-2">
                            {variety.specificResistance.map(res => (
                                <div key={res} className="flex items-center gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                                    {getResistanceIcon(res)}
                                    <span className="text-md text-neutral-700">{res}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-lg font-semibold text-neutral-800 mb-3">
                            <Shield className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
                            Estado de Conservación
                        </h4>
                        <div className="flex items-start gap-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                            <span className={`px-3 py-1 ${variety.conservation.statusClass} text-sm font-medium rounded-full flex-shrink-0`}>{variety.conservation.status}</span>
                            <p className="text-md text-neutral-600 flex-1">{variety.conservation.efforts}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VarietiesView: React.FC = () => {
    const [selectedVariety, setSelectedVariety] = useState<Variety | null>(null);
    const [filters, setFilters] = useState(initialFilters);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

    const searchContainerRef = useRef<HTMLDivElement>(null);

    const handleFilterChange = (category: string, value: string) => {
        setFilters(prev => {
            const currentValues = prev[category as keyof typeof initialFilters];
            if (!Array.isArray(currentValues)) {
                return prev;
            }
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [category]: newValues };
        });
    };
    
     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setSuggestionsVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const resetFilters = () => {
        setFilters(initialFilters);
        setInputValue('');
    };

    const allSearchableTerms = useMemo(() => {
        const terms = new Set<string>();
        varietiesData.forEach(v => {
            terms.add(v.name);
            terms.add(v.color);
            v.regions.split(',').forEach(r => terms.add(r.trim()));
        });
        return Array.from(terms);
    }, []);

    useEffect(() => {
        if (inputValue.length > 1) {
            const lowerCaseInput = inputValue.toLowerCase();
            const filteredSuggestions = allSearchableTerms.filter(term =>
                term.toLowerCase().includes(lowerCaseInput)
            );
            setSuggestions(filteredSuggestions.slice(0, 5)); // Limit suggestions
        } else {
            setSuggestions([]);
        }
    }, [inputValue, allSearchableTerms]);
    
    // Debounce search term update
    useEffect(() => {
        const handler = setTimeout(() => {
            setFilters(prev => ({ ...prev, searchTerm: inputValue }));
        }, 300); // 300ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue]);


    const { uniqueColors, uniqueSoilTypes, uniqueResistances, uniqueCulinaryUses, uniqueRegions } = useMemo(() => {
        const colors = new Set<string>();
        const soilTypes = new Set<string>();
        const resistances = new Set<string>();
        const culinaryUses = new Set<string>();
        const regions = new Set<string>();

        varietiesData.forEach(v => {
            colors.add(v.color);
            soilTypes.add(v.soilType);
            v.culinaryUses.forEach(use => culinaryUses.add(use));
            v.regions.split(',').forEach(r => regions.add(r.trim()));
            v.specificResistance.forEach(res => resistances.add(res.replace(/\s*\(.*\)$/, '').trim()));
        });

        return {
            uniqueColors: Array.from(colors).sort(),
            uniqueSoilTypes: Array.from(soilTypes).sort(),
            uniqueResistances: Array.from(resistances).sort(),
            uniqueCulinaryUses: Array.from(culinaryUses).sort(),
            uniqueRegions: Array.from(regions).sort(),
        };
    }, []);
    
    const parseRange = (rangeStr: string): [number, number] | null => {
        const numbers = rangeStr.match(/\d+/g);
        if (!numbers || numbers.length < 2) return null;
        return [parseInt(numbers[0], 10), parseInt(numbers[1], 10)];
    };

    const filteredVarieties = useMemo(() => {
        return varietiesData.filter(variety => {
            const searchKeywords = filters.searchTerm.toLowerCase().split(' ').filter(Boolean);
            const searchableString = [
                variety.name,
                variety.scientific,
                variety.regions,
                variety.color,
                variety.soilType,
                ...variety.culinaryUses,
                ...variety.specificResistance
            ].join(' ').toLowerCase();

            const searchTermMatch = searchKeywords.length === 0 || searchKeywords.every(keyword => searchableString.includes(keyword));

            const colorMatch = filters.colors.length === 0 || filters.colors.includes(variety.color);
            const soilTypeMatch = filters.soilTypes.length === 0 || filters.soilTypes.includes(variety.soilType);
            
            const varietyRegions = variety.regions.split(',').map(r => r.trim());
            const regionMatch = filters.regions.length === 0 || filters.regions.some(r => varietyRegions.includes(r));
            
            const culinaryUsesMatch = filters.culinaryUses.length === 0 || filters.culinaryUses.some(use => variety.culinaryUses.includes(use));
            
            const resistanceMatch = filters.resistances.length === 0 || filters.resistances.some(res => 
                variety.specificResistance.some(vr => vr.toLowerCase().includes(res.toLowerCase()))
            );

            const altitudeMatch = filters.altitudes.length === 0 || filters.altitudes.some(selectedRangeStr => {
                const selectedRange = parseRange(selectedRangeStr);
                const varietyRange = parseRange(variety.altitude);
                if (!selectedRange || !varietyRange) return false;
                return Math.max(selectedRange[0], varietyRange[0]) <= Math.min(selectedRange[1], varietyRange[1]);
            });

            return searchTermMatch && colorMatch && soilTypeMatch && regionMatch && culinaryUsesMatch && resistanceMatch && altitudeMatch;
        });
    }, [filters]);
    
    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        setFilters(prev => ({ ...prev, searchTerm: suggestion }));
        setSuggestionsVisible(false);
    };

    if (selectedVariety) {
        return (
            <>
                <section className="py-12 bg-white">
                    <VarietyDetailView variety={selectedVariety} onBack={() => setSelectedVariety(null)} />
                </section>
                <style>{`
                  @keyframes varietyDetailEnter {
                    from { 
                      opacity: 0; 
                      transform: translateY(20px);
                    }
                    to { 
                      opacity: 1; 
                      transform: translateY(0);
                    }
                  }
                `}</style>
            </>
        )
    }

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-3">Variedades de Papa Nativa</h1>
                    <p className="text-lg text-neutral-600">Explora las 47 variedades documentadas con información científica y ancestral</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h3 className="text-lg font-semibold mb-4">Filtros</h3>
                            <div className="space-y-4">
                                <div className="relative" ref={searchContainerRef}>
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" strokeWidth={1.5} />
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}
                                        onFocus={() => setSuggestionsVisible(true)}
                                        placeholder="Buscar 'papa amarilla de cusco'..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-neutral-400"
                                        aria-autocomplete="list"
                                        aria-controls="autocomplete-list"
                                    />
                                     {isSuggestionsVisible && suggestions.length > 0 && (
                                        <ul 
                                          id="autocomplete-list"
                                          className="absolute z-10 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg overflow-hidden"
                                        >
                                            {suggestions.map((suggestion, index) => (
                                                <li 
                                                    key={index}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 cursor-pointer"
                                                    role="option"
                                                    aria-selected="false"
                                                >
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                                    {[
                                      {title: "Color", key: "colors", options: uniqueColors},
                                      {title: "Región", key: "regions", options: uniqueRegions},
                                      {title: "Tipo de Suelo", key: "soilTypes", options: uniqueSoilTypes},
                                      {title: "Resistencia a", key: "resistances", options: uniqueResistances},
                                      {title: "Uso Culinario", key: "culinaryUses", options: uniqueCulinaryUses},
                                      {title: "Altitud (msnm)", key: "altitudes", options: altitudeOptions}
                                    ].map(group => (
                                         <FilterGroup key={group.key} title={group.title}>
                                            {group.options.map(option => (
                                                <FilterButton 
                                                    key={option}
                                                    label={option}
                                                    isSelected={(filters[group.key as keyof typeof filters] as string[]).includes(option)}
                                                    onClick={() => handleFilterChange(group.key, option)}
                                                />
                                            ))}
                                        </FilterGroup>
                                    ))}
                                </div>
                                <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-all">
                                    <XCircle className="w-4 h-4" />
                                    Limpiar Filtros
                                </button>
                            </div>
                        </div>
                    </aside>

                    <div className="lg:col-span-3">
                        <div className="mb-6">
                            <p className="text-sm text-neutral-600 font-medium">
                                Mostrando <span className="text-amber-700 font-bold">{filteredVarieties.length}</span> de <span className="font-bold">{varietiesData.length}</span> variedades
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredVarieties.length > 0 ? filteredVarieties.map((variety) => (
                                <div key={variety.name} className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img src={variety.image} alt={variety.name} className="w-full h-full object-cover" />
                                        <div className={`absolute top-3 right-3 px-2 py-1 ${variety.colorClass} text-white text-xs font-medium rounded-full`}>
                                            {variety.color}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-xl font-semibold mb-2">{variety.name}</h3>
                                        <p className="text-sm text-neutral-600 mb-3 italic">{variety.scientific}</p>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mountain className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                                                <span className="text-neutral-700">{variety.altitude}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                                                <span className="text-neutral-700">{variety.regions}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                {variety.resistanceIcon}
                                                <span className="text-neutral-700">{variety.resistance}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mb-4">
                                            {variety.tags.map((tag, i) => (
                                                <span key={i} className={`px-3 py-1 ${tag.class} text-xs font-medium rounded-full`}>{tag.text}</span>
                                            ))}
                                        </div>
                                        <div className="mt-auto">
                                            <button onClick={() => setSelectedVariety(variety)} className="w-full mt-2 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all flex items-center justify-center gap-2">
                                                <span>Ver ficha completa</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="md:col-span-2 text-center py-12 bg-neutral-50 rounded-xl">
                                    <Search className="w-12 h-12 text-neutral-400 mx-auto mb-3" strokeWidth={1} />
                                    <p className="text-neutral-600 font-medium">No se encontraron variedades</p>
                                    <p className="text-sm text-neutral-500">Intenta ajustar o limpiar los filtros.</p>
                                </div>
                            )}
                             <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                <PlusCircle className="w-12 h-12 text-neutral-400 mb-3" strokeWidth={1.5} />
                                <p className="text-neutral-600 font-medium mb-2">+44 variedades más</p>
                                <p className="text-sm text-neutral-500">Sistema en construcción</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VarietiesView;
