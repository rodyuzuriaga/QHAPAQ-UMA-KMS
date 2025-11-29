import React, { useState, useCallback, useRef, ChangeEvent, useEffect } from 'react';
import type { ChatMessage, DiagnosisResult } from '../types';
import { Sparkles, MessageCircle, ScanLine, Bot, User, Send, UploadCloud, Camera, AlertTriangle, ExternalLink, Mic, MicOff, BrainCircuit, BookOpen, Volume2, Loader2 } from 'lucide-react';
import { getChatResponse, getVisualDiagnosis, fileToBase64, getComplexResponse, ai, decodeAudioData, decode, createBlob, getTextToSpeech } from '../services/geminiService';
import { LiveServerMessage, Modality } from '@google/genai';

// Helper function to parse simple markdown to HTML
const parseSimpleMarkdown = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\n/g, '<br />'); // New lines
};

interface AssistantViewProps {
    initialQuery?: string | null;
    clearInitialQuery?: (() => void) | null;
}

const AssistantView: React.FC<AssistantViewProps> = ({ initialQuery, clearInitialQuery }) => {
    const [activeTab, setActiveTab] = useState<'chat' | 'vision' | 'voice'>('chat');
    
    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "¡Hola! Soy **QHAPAQ UMA**, tu asistente experto en papa nativa del Perú. 🥔\n\nPuedo ayudarte con:\n• Información sobre variedades nativas\n• Identificación y control de plagas\n• Técnicas de cultivo orgánico\n• Conocimiento ancestral andino" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [thinkingMode, setThinkingMode] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [audioLoading, setAudioLoading] = useState<Record<number, boolean>>({});
    const ttsAudioContextRef = useRef<AudioContext | null>(null);

    // Vision state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
    const [isVisionLoading, setIsVisionLoading] = useState(false);
    const [visionError, setVisionError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Voice Chat State
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState('inactivo');
    const [transcriptions, setTranscriptions] = useState<ChatMessage[]>([]);
    const sessionPromiseRef = useRef<any>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    
    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim() || isChatLoading) return;

        setChatMessages(prev => [...prev, { role: 'user', content: message }]);
        setIsChatLoading(true);

        const responsePromise = thinkingMode ? getComplexResponse(message) : getChatResponse(message);
        const { text, sources } = await responsePromise;

        setChatMessages(prev => [...prev, { role: 'model', content: text, sources }]);
        setIsChatLoading(false);

        setTimeout(() => {
            chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }, 100);
    }, [isChatLoading, thinkingMode]);

    const handleSendMessage = () => {
        sendMessage(userInput);
        setUserInput('');
    };
    
    useEffect(() => {
        if (initialQuery && clearInitialQuery) {
            sendMessage(initialQuery);
            clearInitialQuery();
        }
    }, [initialQuery, clearInitialQuery, sendMessage]);

    const handlePlayAudio = async (text: string, index: number) => {
        if (audioLoading[index]) return;

        setAudioLoading(prev => ({ ...prev, [index]: true }));

        try {
            // Strip markdown for cleaner speech
            const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\n/g, ' ');
            const base64Audio = await getTextToSpeech(cleanText);
            
            if (base64Audio) {
                if (!ttsAudioContextRef.current) {
                    ttsAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const audioCtx = ttsAudioContextRef.current;
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                source.start();
            }
        } catch (error) {
            console.error("Error playing audio:", error);
        } finally {
            setAudioLoading(prev => ({ ...prev, [index]: false }));
        }
    };
    
    // Voice Chat Logic
    const toggleVoiceSession = async () => {
        if (isSessionActive) {
            setVoiceStatus('deteniendo');
            if (sessionPromiseRef.current) {
                const session = await sessionPromiseRef.current;
                session.close();
                sessionPromiseRef.current = null;
            } else {
                 // Fallback cleanup if session promise wasn't there
                setIsSessionActive(false);
                setVoiceStatus('inactivo');
                 if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                }
                if (scriptProcessorRef.current) {
                    scriptProcessorRef.current.disconnect();
                }
            }
        } else {
            setVoiceStatus('conectando');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaStreamRef.current = stream;
                
                inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                nextStartTimeRef.current = 0;
                audioSourcesRef.current.clear();
                
                let currentInputTranscription = '';
                let currentOutputTranscription = '';

                sessionPromiseRef.current = ai.live.connect({
                    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                    callbacks: {
                        onopen: () => {
                            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                            scriptProcessorRef.current = scriptProcessor;
                            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                                const pcmBlob = createBlob(inputData);
                                sessionPromiseRef.current.then((session: any) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            };
                            source.connect(scriptProcessor);
                            scriptProcessor.connect(inputAudioContextRef.current!.destination);
                            setIsSessionActive(true);
                            setVoiceStatus('activo');
                        },
                        onmessage: async (message: LiveServerMessage) => {
                           if (message.serverContent?.inputTranscription) {
                                currentInputTranscription += message.serverContent.inputTranscription.text;
                            }
                            if (message.serverContent?.outputTranscription) {
                                currentOutputTranscription += message.serverContent.outputTranscription.text;
                            }

                            if (message.serverContent?.turnComplete) {
                                const fullInput = currentInputTranscription.trim();
                                const fullOutput = currentOutputTranscription.trim();
                                if (fullInput) setTranscriptions(prev => [...prev, { role: 'user', content: `Tú: ${fullInput}` }]);
                                if (fullOutput) setTranscriptions(prev => [...prev, { role: 'model', content: `UMA: ${fullOutput}` }]);
                                currentInputTranscription = '';
                                currentOutputTranscription = '';
                            }

                            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                            if (audioData && outputAudioContextRef.current) {
                                const outputCtx = outputAudioContextRef.current;
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                                const audioBuffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
                                const source = outputCtx.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(outputCtx.destination);
                                source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
                                source.start(nextStartTimeRef.current);
                                nextStartTimeRef.current += audioBuffer.duration;
                                audioSourcesRef.current.add(source);
                            }
                        },
                        onerror: (e: ErrorEvent) => {
                            console.error('Live session error:', e);
                            setVoiceStatus('error');
                            toggleVoiceSession();
                        },
                        onclose: () => {
                           if (isSessionActive) {
                                setIsSessionActive(false);
                                setVoiceStatus('inactivo');
                                if (mediaStreamRef.current) {
                                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                                }
                                if (scriptProcessorRef.current) {
                                    scriptProcessorRef.current.disconnect();
                                }
                                console.log("Voice session closed and resources cleaned up.");
                            }
                        },
                    },
                    config: {
                        responseModalities: [Modality.AUDIO],
                        inputAudioTranscription: {},
                        outputAudioTranscription: {},
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                        systemInstruction: 'Eres QHAPAQ UMA, un asistente experto en papa nativa. Sé conciso y amigable en tus respuestas de voz.'
                    },
                });
            } catch (error) {
                console.error("Failed to start voice session:", error);
                setVoiceStatus('error');
            }
        }
    };
    
    useEffect(() => {
      // Cleanup on unmount
      return () => {
        if (isSessionActive) {
          toggleVoiceSession();
        }
      }
    }, [isSessionActive]);


    // Vision Logic
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setDiagnosis(null);
            setVisionError(null);
            handleDiagnose(file);
        }
    };

    const handleDiagnose = useCallback(async (file: File) => {
        if (!file) return;

        setIsVisionLoading(true);
        setVisionError(null);
        setDiagnosis(null);
        try {
            const base64Image = await fileToBase64(file);
            const result = await getVisualDiagnosis(base64Image, file.type);
            setDiagnosis(result);
        } catch (error) {
            setVisionError(error instanceof Error ? error.message : "Ocurrió un error desconocido.");
        } finally {
            setIsVisionLoading(false);
        }
    }, []);

    const handleUploadClick = () => fileInputRef.current?.click();
    
    const VoiceStatusIndicator = () => {
        switch (voiceStatus) {
            case 'activo': return <span className="text-green-500">Conectado. ¡Habla ahora!</span>;
            case 'conectando': return <span className="text-amber-500">Conectando...</span>;
            case 'deteniendo': return <span className="text-neutral-500">Deteniendo...</span>;
            case 'error': return <span className="text-red-500">Error. Reintenta.</span>;
            default: return <span className="text-neutral-500">Inactivo</span>;
        }
    }

    return (
        <section className="mt-12 bg-gradient-to-b from-white to-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full mb-4">
                        <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                        Potenciado por Google Gemini AI
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-3">QHAPAQ UMA - Asistente Inteligente</h1>
                    <p className="text-lg text-neutral-600">Consulta conocimiento ancestral y científico con IA generativa</p>
                </div>

                <div className="mb-6 flex justify-center">
                    <div className="inline-flex bg-white border border-neutral-200 rounded-xl p-1">
                        <button onClick={() => setActiveTab('chat')} className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-amber-100 text-amber-900' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                            <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4" strokeWidth={1.5} /> Chat de Texto</div>
                        </button>
                        <button onClick={() => setActiveTab('voice')} className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'voice' ? 'bg-amber-100 text-amber-900' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                            <div className="flex items-center gap-2"><Mic className="w-4 h-4" strokeWidth={1.5} /> Chat de Voz</div>
                        </button>
                        <button onClick={() => setActiveTab('vision')} className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'vision' ? 'bg-amber-100 text-amber-900' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                             <div className="flex items-center gap-2"><ScanLine className="w-4 h-4" strokeWidth={1.5} /> Diagnóstico Visual</div>
                        </button>
                    </div>
                </div>

                {activeTab === 'chat' && (
                     <div className="max-w-5xl mx-auto">
                        <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden">
                            <div ref={chatContainerRef} className="h-[500px] overflow-y-auto p-6 space-y-4 bg-neutral-50">
                                {chatMessages.map((msg, index) => (
                                    <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                        {msg.role === 'model' && (
                                            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-5 h-5 text-white" strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div className="flex-1 max-w-md">
                                            <div className={`prose prose-sm rounded-2xl p-4 relative ${msg.role === 'user' ? 'bg-amber-600 text-white rounded-tr-none' : 'bg-white border border-neutral-200 rounded-tl-none'}`}>
                                                <div dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(msg.content) }} />
                                                {msg.role === 'model' && (
                                                    <button 
                                                        onClick={() => handlePlayAudio(msg.content, index)}
                                                        disabled={audioLoading[index]}
                                                        className="absolute bottom-2 right-2 w-7 h-7 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-700 hover:bg-amber-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                        aria-label="Leer en voz alta"
                                                    >
                                                        {audioLoading[index] ? 
                                                            <Loader2 className="w-4 h-4 animate-spin" /> : 
                                                            <Volume2 className="w-4 h-4" />}
                                                    </button>
                                                )}
                                            </div>
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="mt-2 ml-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                                    <h4 className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Fuentes:</h4>
                                                    <ul className="space-y-1">
                                                        {msg.sources.map((source, i) => (
                                                            <li key={i}><a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-700 hover:underline truncate block">{source.title}</a></li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        {msg.role === 'user' && (
                                             <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="flex justify-start items-center p-4 gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-5 h-5 text-white" strokeWidth={1.5} />
                                        </div>
                                        <div className="animate-pulse flex space-x-2">
                                            <div className="rounded-full bg-neutral-300 h-2 w-2"></div>
                                            <div className="rounded-full bg-neutral-300 h-2 w-2"></div>
                                            <div className="rounded-full bg-neutral-300 h-2 w-2"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-neutral-800 p-4 bg-neutral-900">
                                <div className="flex gap-3">
                                    <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Pregunta sobre variedades, plagas, técnicas..." className="flex-1 px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-neutral-400 text-sm" />
                                    <button onClick={handleSendMessage} disabled={isChatLoading} className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium hover:from-amber-700 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50">
                                        <span>Enviar</span>
                                        <Send className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <label htmlFor="thinking-mode" className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                                        <BrainCircuit className="w-5 h-5 text-purple-500" />
                                        Modo Pensamiento Profundo
                                    </label>
                                    <input id="thinking-mode" type="checkbox" checked={thinkingMode} onChange={() => setThinkingMode(!thinkingMode)} className="toggle-switch" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'voice' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden p-8 flex flex-col items-center">
                            <h3 className="text-2xl font-semibold mb-2">Chat de Voz con UMA</h3>
                            <p className="text-neutral-600 mb-6 text-center">Habla directamente con el asistente para una consulta más rápida y natural.</p>
                            <button onClick={toggleVoiceSession} disabled={voiceStatus === 'conectando' || voiceStatus === 'deteniendo'} className={`w-24 h-24 rounded-full flex items-center justify-center transition-all text-white shadow-lg ${isSessionActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                {isSessionActive ? <MicOff size={40} /> : <Mic size={40} />}
                            </button>
                            <div className="mt-4 text-sm font-medium h-5"><VoiceStatusIndicator /></div>
                            <div className="w-full h-[300px] bg-neutral-50 border border-neutral-200 rounded-lg mt-6 p-4 overflow-y-auto space-y-2">
                                {transcriptions.length === 0 && <p className="text-sm text-neutral-400 text-center pt-2">La transcripción aparecerá aquí...</p>}
                                {transcriptions.map((msg, index) => (
                                    <p key={index} className={`text-sm ${msg.role === 'user' ? 'text-neutral-800' : 'text-amber-800 font-medium'}`}>{msg.content}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'vision' && (
                   /* Vision content remains the same */
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden p-8">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Camera className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2">Diagnóstico Visual con IA</h3>
                                <p className="text-neutral-600">Sube una foto de tu planta y obtén un diagnóstico instantáneo</p>
                            </div>
                            
                            {!imagePreview && (
                                <>
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg" className="hidden" />
                                    <div onClick={handleUploadClick} className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-amber-400 transition-all cursor-pointer mb-6">
                                        <UploadCloud className="w-16 h-16 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
                                        <p className="text-neutral-700 font-medium mb-2">Arrastra una imagen o haz clic para seleccionar</p>
                                        <p className="text-sm text-neutral-500">PNG, JPG hasta 10MB</p>
                                        <button className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all">Seleccionar imagen</button>
                                    </div>
                                </>
                            )}
                            
                            {(isVisionLoading || diagnosis || visionError || imagePreview) && (
                                 <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 mb-6">
                                     <div className="flex items-start gap-4">
                                         <div className="flex-shrink-0">
                                             {imagePreview && <img src={imagePreview} alt="Análisis" className="w-32 h-32 object-cover rounded-lg" />}
                                         </div>
                                         <div className="flex-1">
                                             {isVisionLoading && <div className="text-sm font-medium text-amber-700">Analizando...</div>}
                                             {visionError && <div className="text-sm font-medium text-red-700">{visionError}</div>}
                                             {diagnosis && (
                                                <>
                                                    <h4 className="font-semibold text-lg mb-2">Diagnóstico: {diagnosis.diagnosis}</h4>
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">Confianza: {(diagnosis.confidence * 100).toFixed(0)}%</span>
                                                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">Severidad: {diagnosis.severity}</span>
                                                    </div>
                                                    <p className="text-sm text-neutral-700">{diagnosis.reasoning}</p>
                                                </>
                                             )}
                                         </div>
                                     </div>
                                 </div>
                            )}

                            {diagnosis && (
                                <div className="space-y-4">
                                    <div className="bg-white border border-neutral-200 rounded-xl p-5">
                                        <h5 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                                            Recomendaciones Inmediatas
                                        </h5>
                                        <ol className="space-y-2 text-sm text-neutral-700 list-decimal list-inside">
                                            {diagnosis.recommendations.map((rec, i) => (
                                                <li key={i}>{rec}</li>
                                            ))}
                                        </ol>
                                    </div>
                                    <button onClick={() => { setImagePreview(null); setDiagnosis(null); }} className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-all flex items-center justify-center gap-2">
                                        Analizar otra imagen
                                        <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AssistantView;