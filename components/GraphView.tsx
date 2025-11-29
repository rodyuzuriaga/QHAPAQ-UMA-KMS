
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GitGraph, ZoomIn, ZoomOut, RefreshCw, List, Network, Move, ExternalLink } from 'lucide-react';

// --- DATA ---
const GRAPH_DATA = {
    nodes: [
        { id: "Papa", type: "core", label: "Papa Nativa" },
        // Clusters Principales (Nivel 1)
        { id: "Variedades", type: "category", label: "Variedades", parent: "Papa" },
        { id: "Plagas", type: "category", label: "Plagas y Enf.", parent: "Papa" },
        { id: "Cultivo", type: "category", label: "Agronomía", parent: "Papa" },
        { id: "Valor", type: "category", label: "Valor Agregado", parent: "Papa" },
        { id: "Historia", type: "category", label: "Historia", parent: "Papa" },
        
        // Nodos Hoja (Nivel 2) - Variedades
        { id: "Huayro", type: "variety", label: "Huayro", parent: "Variedades" },
        { id: "Amarilla", type: "variety", label: "Amarilla", parent: "Variedades" },
        { id: "Canchan", type: "variety", label: "Canchan", parent: "Variedades" },
        { id: "Peruanita", type: "variety", label: "Peruanita", parent: "Variedades" },
        { id: "Púrpura", type: "variety", label: "Púrpura", parent: "Variedades" },
        { id: "Negra", type: "variety", label: "Negra Andina", parent: "Variedades" },

        // Nodos Hoja (Nivel 2) - Plagas
        { id: "Rancha", type: "pest", label: "Tizón Tardío", parent: "Plagas" },
        { id: "Gorgojo", type: "pest", label: "Gorgojo Andes", parent: "Plagas" },
        { id: "VirusY", type: "pest", label: "Virus PVY", parent: "Plagas" },
        { id: "Nematodo", type: "pest", label: "Nematodo Quiste", parent: "Plagas" },

        // Nodos Hoja (Nivel 2) - Cultivo
        { id: "Siembra", type: "agronomy", label: "Siembra", parent: "Cultivo" },
        { id: "Riego", type: "agronomy", label: "Riego", parent: "Cultivo" },
        { id: "Aporque", type: "agronomy", label: "Aporque", parent: "Cultivo" },
        { id: "ControlBio", type: "agronomy", label: "Control Bio", parent: "Cultivo" },
        { id: "Suelo", type: "agronomy", label: "Suelo Franco", parent: "Cultivo" },

        // Nodos Hoja (Nivel 2) - Valor / Usos
        { id: "Nutricion", type: "value", label: "Nutrición", parent: "Valor" },
        { id: "Chuno", type: "value", label: "Chuño/Tunta", parent: "Valor" },
        { id: "Gastronomia", type: "value", label: "Gastronomía", parent: "Valor" },
        { id: "Chips", type: "value", label: "Procesados", parent: "Valor" },

        // Nodos Hoja (Nivel 2) - Historia
        { id: "Origen", type: "history", label: "Andes Centrales", parent: "Historia" },
        { id: "Domesticacion", type: "history", label: "8000 Años", parent: "Historia" },
        { id: "Expansion", type: "history", label: "Global", parent: "Historia" },
    ]
};

const COLOR_MAP: Record<string, string> = {
    core: "#d97706",      // Amber 600
    category: "#4b5563",  // Gray 600
    variety: "#db2777",   // Pink 600
    pest: "#dc2626",      // Red 600
    agronomy: "#16a34a",  // Green 600
    value: "#2563eb",     // Blue 600
    history: "#7c3aed"    // Violet 600
};

// --- LAYOUT ENGINE ---
const CANVAS_SIZE = 1200;
const CENTER = CANVAS_SIZE / 2;
const R1 = 200;
const R2 = 400;

const calculateLayout = () => {
    const nodes = [...GRAPH_DATA.nodes];
    const links: { source: any, target: any }[] = [];
    const nodeMap = new Map();

    const centerNode = nodes.find(n => n.type === 'core');
    if (centerNode) {
        Object.assign(centerNode, { x: CENTER, y: CENTER });
        nodeMap.set(centerNode.id, centerNode);
    }

    const categories = nodes.filter(n => n.type === 'category');
    const angleStep = (2 * Math.PI) / categories.length;

    categories.forEach((cat, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = CENTER + R1 * Math.cos(angle);
        const y = CENTER + R1 * Math.sin(angle);
        Object.assign(cat, { x, y, angle });
        nodeMap.set(cat.id, cat);
        if (centerNode) links.push({ source: centerNode, target: cat });
    });

    categories.forEach((cat: any) => {
        const children = nodes.filter(n => n.parent === cat.id);
        if (children.length === 0) return;
        const spreadAngle = Math.PI / 3.5;
        const startAngle = cat.angle - spreadAngle / 2;
        const childStep = spreadAngle / (children.length > 1 ? children.length - 1 : 1);

        children.forEach((child, index) => {
            const angle = children.length > 1 ? startAngle + index * childStep : cat.angle;
            const x = CENTER + R2 * Math.cos(angle);
            const y = CENTER + R2 * Math.sin(angle);
            Object.assign(child, { x, y });
            nodeMap.set(child.id, child);
            links.push({ source: cat, target: child });
        });
    });

    return { nodes, links };
};

const GraphView: React.FC = () => {
    const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.7 }); // Default zoom out slightly
    const [isDragging, setIsDragging] = useState(false);
    // Usamos refs para valores que cambian rápido durante eventos para evitar re-renders innecesarios o closures viejos
    const dragStartRef = useRef({ x: 0, y: 0 });
    const transformRef = useRef(transform);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    // Update ref when state changes
    useEffect(() => {
        transformRef.current = transform;
    }, [transform]);

    const { nodes, links } = useMemo(() => calculateLayout(), []);

    // --- ROBUST DRAG HANDLING ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Solo click izquierdo
        e.preventDefault();
        e.stopPropagation();
        
        setIsDragging(true);
        // Guardamos la posición inicial del mouse relativa a la transformación actual
        dragStartRef.current = { 
            x: e.clientX - transformRef.current.x, 
            y: e.clientY - transformRef.current.y 
        };
    };

    // Attach listeners to window to prevent losing drag when moving fast
    useEffect(() => {
        const handleWindowMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const newX = e.clientX - dragStartRef.current.x;
            const newY = e.clientY - dragStartRef.current.y;
            
            setTransform(prev => ({ ...prev, x: newX, y: newY }));
        };

        const handleWindowMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleWindowMouseMove);
            window.addEventListener('mouseup', handleWindowMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [isDragging]);

    const handleWheel = (e: React.WheelEvent) => {
        // Simple zoom logic
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.2, transform.k + scaleAmount), 3);
        setTransform(prev => ({ ...prev, k: newScale }));
    };

    const zoomIn = () => setTransform(prev => ({ ...prev, k: Math.min(prev.k * 1.2, 3) }));
    const zoomOut = () => setTransform(prev => ({ ...prev, k: Math.max(prev.k / 1.2, 0.2) }));
    const resetView = () => setTransform({ x: 0, y: 0, k: 0.7 });

    return (
        <section className="h-[calc(100vh-64px)] flex flex-col bg-neutral-50 overflow-hidden select-none">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg text-white">
                        <GitGraph className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-800">Grafo de Conocimiento</h1>
                        <p className="text-xs text-neutral-500 hidden sm:block">Explora las conexiones entre variedades, plagas y técnicas</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-neutral-100 rounded-lg p-1 border border-neutral-200">
                        <button 
                            onClick={() => setViewMode('graph')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'graph' ? 'bg-white shadow-sm text-amber-700' : 'text-neutral-600 hover:text-neutral-900'}`}
                        >
                            <div className="flex items-center gap-2"><Network className="w-4 h-4" /> Gráfico</div>
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-amber-700' : 'text-neutral-600 hover:text-neutral-900'}`}
                        >
                            <div className="flex items-center gap-2"><List className="w-4 h-4" /> Lista</div>
                        </button>
                    </div>

                    {viewMode === 'graph' && (
                        <div className="flex bg-neutral-100 rounded-lg p-1 border border-neutral-200 ml-2">
                            <button onClick={zoomIn} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-neutral-600" title="Acercar"><ZoomIn className="w-4 h-4" /></button>
                            <button onClick={zoomOut} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-neutral-600" title="Alejar"><ZoomOut className="w-4 h-4" /></button>
                            <button onClick={resetView} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-neutral-600" title="Centrar"><RefreshCw className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative bg-slate-50 overflow-hidden">
                
                {viewMode === 'graph' ? (
                    <div 
                        className="w-full h-full relative"
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        onMouseDown={handleMouseDown}
                        onWheel={handleWheel}
                    >
                        {/* Static Grid Background */}
                        <div className="absolute inset-0 pointer-events-none opacity-10" 
                             style={{ 
                                 backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
                                 backgroundSize: '20px 20px',
                                 // Opcional: mover el grid con el drag para sensación de movimiento
                                 backgroundPosition: `${transform.x}px ${transform.y}px` 
                             }}>
                        </div>

                        {/* Interactive Layer */}
                        <div 
                            style={{ 
                                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
                                transformOrigin: 'center center',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // Disable transition during drag for direct feedback
                                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                                willChange: 'transform'
                            }}
                        >
                            <svg 
                                width={CANVAS_SIZE} 
                                height={CANVAS_SIZE} 
                                viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
                                style={{ overflow: 'visible', pointerEvents: 'none' }} 
                            >
                                <g style={{ pointerEvents: 'auto' }}>
                                    {/* Links */}
                                    {links.map((link, i) => (
                                        <line
                                            key={i}
                                            x1={link.source.x}
                                            y1={link.source.y}
                                            x2={link.target.x}
                                            y2={link.target.y}
                                            stroke="#cbd5e1"
                                            strokeWidth="2"
                                            strokeOpacity="0.8"
                                        />
                                    ))}

                                    {/* Nodes */}
                                    {nodes.map((node) => {
                                        const isHovered = hoveredNode === node.id;
                                        const radius = node.type === 'core' ? 45 : node.type === 'category' ? 35 : 18;
                                        
                                        return (
                                            <g 
                                                key={node.id} 
                                                transform={`translate(${node.x},${node.y})`}
                                                onMouseEnter={() => setHoveredNode(node.id)}
                                                onMouseLeave={() => setHoveredNode(null)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <circle
                                                    r={isHovered ? radius + 5 : radius}
                                                    fill={COLOR_MAP[node.type] || '#9ca3af'}
                                                    stroke="white"
                                                    strokeWidth={isHovered ? 4 : 2}
                                                    className="transition-all duration-200"
                                                    filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.1))"
                                                />
                                                {(node.type !== 'variety' && node.type !== 'pest' && node.type !== 'agronomy' && node.type !== 'value' && node.type !== 'history') || isHovered ? (
                                                    <text
                                                        dy={radius + 20}
                                                        textAnchor="middle"
                                                        className="text-xs font-bold fill-slate-700 pointer-events-none select-none bg-white/80"
                                                        style={{ 
                                                            textShadow: '0px 0px 4px white, 0px 0px 4px white',
                                                            fontSize: node.type === 'core' ? '16px' : '12px'
                                                        }}
                                                    >
                                                        {node.label}
                                                    </text>
                                                ) : null}
                                            </g>
                                        );
                                    })}
                                </g>
                            </svg>
                        </div>
                        
                        {/* Help Overlay */}
                        <div className="absolute bottom-6 right-6 pointer-events-none">
                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-3 text-xs text-neutral-500">
                                <Move className="w-4 h-4" />
                                <span>Arrastra para mover • Rueda para zoom</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- FALLBACK LIST VIEW ---
                    <div className="w-full h-full overflow-y-auto p-8">
                         <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
                            {nodes.filter(n => n.type === 'category').map(category => (
                                <div key={category.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="p-4 border-b border-neutral-100 flex items-center gap-3" style={{ borderLeft: `4px solid ${COLOR_MAP[category.type]}`}}>
                                        <h3 className="font-bold text-neutral-800">{category.label}</h3>
                                    </div>
                                    <ul className="p-4 space-y-2">
                                        {nodes.filter(n => n.parent === category.id).map(child => (
                                            <li key={child.id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg group cursor-default">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_MAP[child.type] }}></div>
                                                <span className="text-sm text-neutral-600 font-medium group-hover:text-neutral-900">{child.label}</span>
                                                <ExternalLink className="w-3 h-3 text-neutral-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GraphView;
