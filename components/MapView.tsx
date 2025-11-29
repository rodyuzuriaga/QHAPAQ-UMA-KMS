import React, { useState, useEffect, useRef } from 'react';
import { MapPinPlus, Map as MapIcon, Send, Compass, BookOpen, Sun, Cloud, CloudRain, CloudSnow, Zap, CloudFog, Thermometer } from 'lucide-react';
import { getGroundedMapResponse } from '../services/geminiService';
import type { GroundingSource } from '../types';

interface Coords {
    latitude: number;
    longitude: number;
}

// Declare Leaflet 'L' to TypeScript to avoid errors, as it's loaded from a script tag.
declare var L: any;

const getWeatherInfo = (code: number, isLarge: boolean = false): { icon: React.ReactNode; description: string } => {
    const size = isLarge ? "w-16 h-16" : "w-6 h-6";
    const strokeWidth = isLarge ? 1.5 : 2;

    if (code === 0) return { icon: <Sun className={`${size} text-yellow-500`} strokeWidth={strokeWidth} />, description: "Despejado" };
    if ([1, 2, 3].includes(code)) return { icon: <Cloud className={`${size} text-gray-500`} strokeWidth={strokeWidth} />, description: "Parcialmente nublado" };
    if ([45, 48].includes(code)) return { icon: <CloudFog className={`${size} text-gray-400`} strokeWidth={strokeWidth} />, description: "Niebla" };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { icon: <CloudRain className={`${size} text-blue-500`} strokeWidth={strokeWidth} />, description: "Lluvia" };
    if ([71, 73, 75, 85, 86].includes(code)) return { icon: <CloudSnow className={`${size} text-blue-200`} strokeWidth={strokeWidth} />, description: "Nieve" };
    if ([95, 96, 99].includes(code)) return { icon: <Zap className={`${size} text-yellow-600`} strokeWidth={strokeWidth} />, description: "Tormenta" };
    
    return { icon: <Cloud className={`${size} text-gray-500`} strokeWidth={strokeWidth} />, description: "Nublado" };
};

const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    // Add time zone offset to prevent day-before issues
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '').toLocaleUpperCase();
};

const MapView: React.FC = () => {
    const [coords, setCoords] = useState<Coords | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [query, setQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mapResult, setMapResult] = useState<{ text: string; sources: GroundingSource[] } | null>(null);
    const [weatherData, setWeatherData] = useState<any | null>(null);
    const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    const handleGetLocation = () => {
        setLocationError(null);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    setLocationError("No se pudo obtener la ubicación. Por favor, habilita los permisos de geolocalización en tu navegador.");
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            setLocationError("La geolocalización no es soportada por este navegador.");
        }
    };

    useEffect(() => {
        handleGetLocation();
    }, []);
    
    useEffect(() => {
        if (coords) {
            const fetchWeather = async () => {
                setIsWeatherLoading(true);
                setWeatherError(null);
                try {
                    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
                    if (!response.ok) throw new Error('Failed to fetch weather data');
                    const data = await response.json();
                    setWeatherData(data);
                } catch (error) {
                    console.error("Weather fetch error:", error);
                    setWeatherError("No se pudo cargar el pronóstico.");
                } finally {
                    setIsWeatherLoading(false);
                }
            };
            fetchWeather();
        }
    }, [coords]);

    // Leaflet Map initialization
    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            const center: [number, number] = coords 
                ? [coords.latitude, coords.longitude] 
                : [-9.19, -75.01]; // Default to center of Peru
            const zoom = coords ? 13 : 5;

            mapInstance.current = L.map(mapRef.current).setView(center, zoom);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            if (coords) {
                L.marker([coords.latitude, coords.longitude]).addTo(mapInstance.current)
                    .bindPopup('Tu ubicación actual.')
                    .openPopup();
            }
        } else if (mapRef.current && mapInstance.current && coords) {
            // If map already exists, just move to new coordinates
            const center: [number, number] = [coords.latitude, coords.longitude];
            mapInstance.current.setView(center, 13);
             L.marker(center).addTo(mapInstance.current)
                .bindPopup('Tu ubicación actual.')
                .openPopup();
        }

        // Cleanup function to remove the map on component unmount
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [coords]);

    const handleSearch = async () => {
        if (!query.trim() || !coords) {
            setLocationError("Por favor, permite el acceso a tu ubicación y escribe una consulta.");
            return;
        }
        setIsLoading(true);
        setMapResult(null);
        const result = await getGroundedMapResponse(query, coords);
        setMapResult(result);
        setIsLoading(false);
    };

    return (
        <section className="py-12 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-3">Mapa Interactivo de Conocimiento</h1>
                        <p className="text-lg text-neutral-600">Realiza consultas geográficas y obtén respuestas contextuales</p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-md flex items-center gap-2">
                        <MapPinPlus className="w-5 h-5" strokeWidth={1.5} />
                        Reportar Plaga
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-lg mb-6">
                        <div ref={mapRef} className="h-[600px] w-full bg-neutral-100" />
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {coords && (
                             <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-lg">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Thermometer className="w-5 h-5 text-blue-500"/> Pronóstico del Tiempo</h3>
                                {isWeatherLoading && <div className="text-sm text-center py-10">Cargando clima...</div>}
                                {weatherError && <div className="text-sm text-center py-10 text-red-500">{weatherError}</div>}
                                {!isWeatherLoading && !weatherError && weatherData && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                                            <div>
                                                <p className="text-5xl font-bold text-neutral-800">{Math.round(weatherData.current.temperature_2m)}°C</p>
                                                <p className="text-md text-neutral-600">{getWeatherInfo(weatherData.current.weather_code).description}</p>
                                            </div>
                                            {getWeatherInfo(weatherData.current.weather_code, true).icon}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-neutral-700">Próximos 5 días:</p>
                                            {weatherData.daily.time.slice(1, 6).map((day: string, index: number) => (
                                                <div key={day} className="flex items-center justify-between text-sm font-medium bg-neutral-50 p-2 rounded-md">
                                                    <span className="w-1/4 text-neutral-800">{getDayOfWeek(day)}</span>
                                                    <div className="w-1/4 flex justify-center">{getWeatherInfo(weatherData.daily.weather_code[index+1]).icon}</div>
                                                    <span className="w-2/4 text-right text-neutral-600">
                                                        {Math.round(weatherData.daily.temperature_2m_min[index+1])}° / <span className="text-neutral-800">{Math.round(weatherData.daily.temperature_2m_max[index+1])}°</span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                             </div>
                        )}

                        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Compass className="w-5 h-5 text-amber-600"/> Asistente de Mapa</h3>
                            
                            {!coords && (
                                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm text-amber-800 mb-3">{locationError || "Para iniciar, por favor permite el acceso a tu ubicación."}</p>
                                    <button onClick={handleGetLocation} className="text-sm font-semibold text-white bg-amber-600 px-4 py-2 rounded-lg hover:bg-amber-700">Activar Ubicación</button>
                                </div>
                            )}

                            {coords && (
                                <>
                                    <div className="flex gap-2 mb-4">
                                        <input 
                                            type="text" 
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder="Ej: ¿Restaurantes cercanos con papa nativa?"
                                            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                        />
                                        <button onClick={handleSearch} disabled={isLoading} className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-neutral-400">
                                            <Send className="w-5 h-5"/>
                                        </button>
                                    </div>
                                    
                                    <div className="h-[250px] overflow-y-auto space-y-4">
                                        {isLoading && <p className="text-sm text-neutral-500">Buscando...</p>}
                                        {mapResult && (
                                            <div className="prose prose-sm p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p dangerouslySetInnerHTML={{ __html: mapResult.text.replace(/\n/g, '<br />') }} />
                                                {mapResult.sources.length > 0 && (
                                                    <div className="mt-4 pt-2 border-t border-blue-200">
                                                         <h4 className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Lugares Relevantes:</h4>
                                                        <ul className="space-y-1">
                                                        {mapResult.sources.map((source, i) => (
                                                            <li key={i}><a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 hover:underline truncate block">{source.title}</a></li>
                                                        ))}
                                                    </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {!isLoading && !mapResult && (
                                            <div className="text-center pt-10">
                                                <p className="text-sm text-neutral-500">Realiza una consulta para ver resultados.</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapView;