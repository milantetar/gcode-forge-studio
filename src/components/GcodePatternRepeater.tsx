import React, { useState, useCallback, FC, ReactNode, useEffect } from 'react';
import { Copy, Play } from 'lucide-react';

// --- UI Component Definitions (Styled for the new theme) ---

const Button: FC<{
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'lg' | 'default';
    className?: string;
}> = ({ children, onClick, disabled, variant = 'primary', size = 'default', className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] disabled:pointer-events-none disabled:opacity-50
      ${variant === 'primary' ? 'bg-cyan-500 text-gray-900 hover:bg-cyan-600' : 'border border-[#30363d] bg-[#21262d] text-gray-300 hover:bg-gray-800'}
      ${size === 'sm' ? 'h-9 px-3' : size === 'lg' ? 'h-11 px-8 text-base' : 'h-10 px-4 py-2'}
      ${className}`}
    >
        {children}
    </button>
);

const Textarea: FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
    <textarea
        className={`flex w-full h-full rounded-md border-2 border-transparent bg-gray-900 p-4 text-sm text-gray-300 font-mono placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`}
        {...props}
    />
);

const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`rounded-lg border border-[#30363d] bg-[#161b22] text-gray-300 shadow-md flex flex-col ${className}`}>{children}</div>
);

const CardHeader: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`flex items-center justify-between p-4 border-b border-[#30363d] ${className}`}>{children}</div>
);

const CardTitle: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight text-cyan-400 ${className}`}>{children}</h3>
);

const CardContent: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`flex-grow p-0 ${className}`}>{children}</div>
);

const Alert: FC<{ children: ReactNode; variant?: 'destructive'; className?: string }> = ({ children, variant, className }) => (
    <div
        role="alert"
        className={`relative w-full rounded-lg border p-4 text-white
      ${variant === 'destructive' ? 'border-red-500/50 bg-red-900/50 text-red-300' : ''}
      ${className}`}
    >
        {children}
    </div>
);

const AlertDescription: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`text-sm ${className}`}>{children}</div>
);

const Input: FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
    <input
        className={`flex h-10 w-full rounded-md border border-[#30363d] bg-gray-900 px-3 py-2 text-sm text-gray-300 ring-offset-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

const Label: FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
    <label className={`text-sm font-medium leading-none text-gray-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />
);

// --- Custom Toast Hook Implementation ---

interface ToastProps {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
}

interface ToastState extends ToastProps {
    id: number;
}

let toastId = 0;
const listeners: Array<(toasts: ToastState[]) => void> = [];
let toasts: ToastState[] = [];

const toast = (props: ToastProps) => {
    const id = toastId++;
    toasts = [...toasts, { ...props, id }];
    listeners.forEach(listener => listener(toasts));
    setTimeout(() => {
        toasts = toasts.filter(t => t.id !== id);
        listeners.forEach(listener => listener(toasts));
    }, 5000);
};

const useToast = () => {
    const [state, setState] = useState(toasts);
    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);
    return { toasts: state, toast };
};

const Toaster: FC = () => {
    const { toasts: toastMessages } = useToast();
    return (
        <div className="fixed top-0 right-0 z-[100] p-4 space-y-2">
            {toastMessages.map(({ id, title, description, variant }) => (
                <Alert key={id} variant={variant as 'destructive' | undefined} className="bg-[#161b22] border-[#30363d] shadow-lg">
                    <h3 className="text-base text-white font-semibold mb-1">{title}</h3>
                    <AlertDescription className="text-gray-400">{description}</AlertDescription>
                </Alert>
            ))}
        </div>
    );
};


// Initial G-code for the input field
const initialGCode = `% 0 Holes
% 10.8 Width
% Spindle Start Stop

% Drilling:
% 10000 feedRate, 4 Z Movement, 0 Curve
% Engraving:
% Cyan 1: 500 feedRate, 4 Z Move,  0 Curve

G1 F10000
M3

F10000
Z0
X5.400000 Y1.500000
F1500

Z4 X5.400000 Y1.500000
Z4 X5.289498 Y1.330155
Z4 X5.173894 Y1.164085
Z4 X5.053302 Y1.001904
Z4 X4.927834 Y0.843726
Z4 X4.797601 Y0.689665
Z4 X4.662718 Y0.539833
Z4 X4.523296 Y0.394344
Z4 X4.379448 Y0.253312
Z4 X4.231286 Y0.116851
Z4 X4.078922 Y-0.014926
Z4 X3.922470 Y-0.141905
Z4 X3.762041 Y-0.263973
Z4 X3.597748 Y-0.381017
Z4 X3.429704 Y-0.492922
Z4 X3.258020 Y-0.599575
Z4 X3.082810 Y-0.700863
Z4 X2.904186 Y-0.796671
Z4 X2.722261 Y-0.886887
Z4 X2.537147 Y-0.971397
Z4 X2.348955 Y-1.050088
Z4 X2.157800 Y-1.122844
Z4 X1.963793 Y-1.189554
Z4 X1.767046 Y-1.250104
Z4 X1.567673 Y-1.304380
Z4 X1.365786 Y-1.352268
Z4 X1.161497 Y-1.393655
Z4 X0.954918 Y-1.428427
Z4 X0.746163 Y-1.456471
Z4 X0.535343 Y-1.477673
Z4 X0.322571 Y-1.491920
Z4 X0.107960 Y-1.499097
Z4 X-0.107960 Y-1.499097
Z4 X-0.322571 Y-1.491920
Z4 X-0.535343 Y-1.477673
Z4 X-0.746163 Y-1.456471
Z4 X-0.954918 Y-1.428427
Z4 X-1.161497 Y-1.393655
Z4 X-1.365786 Y-1.352268
Z4 X-1.567673 Y-1.304380
Z4 X-1.767046 Y-1.250104
Z4 X-1.963793 Y-1.189554
Z4 X-2.157800 Y-1.122844
Z4 X-2.348955 Y-1.050088
Z4 X-2.537147 Y-0.971397
Z4 X-2.722261 Y-0.886887
Z4 X-2.904186 Y-0.796671
Z4 X-3.082810 Y-0.700863
Z4 X-3.258020 Y-0.599575
Z4 X-3.429704 Y-0.492922
Z4 X-3.597748 Y-0.381017
Z4 X-3.762041 Y-0.263973
Z4 X-3.922470 Y-0.141905
Z4 X-4.078922 Y-0.014926
Z4 X-4.231286 Y0.116851
Z4 X-4.379448 Y0.253312
Z4 X-4.523296 Y0.394344
Z4 X-4.662718 Y0.539833
Z4 X-4.797601 Y0.689665
Z4 X-4.927834 Y0.843726
Z4 X-5.053302 Y1.001904
Z4 X-5.173894 Y1.164085
Z4 X-5.289498 Y1.330155
Z4 X-5.400000 Y1.500000

X0
M5
M30`;

const GcodePatternRepeater: FC = () => {
    const [originalGcode, setOriginalGcode] = useState(initialGCode);
    const [generatedGcode, setGeneratedGcode] = useState('');
    const [error, setError] = useState('');
    const [repetitions, setRepetitions] = useState(1);
    const [yDistance, setYDistance] = useState(0);

    const extractSections = (lines: string[]) => {
        const header: string[] = [];
        const pattern: string[] = [];
        const footer: string[] = [];
        let inPattern = false;
        let inFooter = false;

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed === 'M5' || trimmed === 'M30' || (trimmed.startsWith('X') && trimmed.includes('0') && !trimmed.includes('Y'))) {
                inFooter = true;
            }
            if (!inPattern && !inFooter && (trimmed.startsWith('%') || trimmed.startsWith('G1') || trimmed.startsWith('M3') || trimmed === '')) {
                header.push(line);
                if (trimmed.startsWith('M3')) inPattern = true;
            } else if (inFooter) {
                footer.push(line);
            } else if (inPattern && !inFooter) {
                if (trimmed.startsWith('Z4') && trimmed.includes('X') && trimmed.includes('Y')) {
                    pattern.push(trimmed);
                }
            }
        }
        return { header, pattern, footer };
    };

    const transformPattern = (pattern: string[]): string[] => {
        return pattern.map(line => {
            const match = line.match(/Z4 X([-\d.]+) Y([-\d.]+)/);
            if (match) {
                const x = parseFloat(match[1]);
                const y = parseFloat(match[2]);
                const newZ = y.toFixed(6);
                const newX = (-x).toFixed(6);
                const newY = x.toFixed(6);
                return `Z${newZ} X${newX} Y${newY}`;
            }
            return line;
        });
    };

    const generateRepeatedGcode = useCallback(() => {
        try {
            setError('');
            const lines = originalGcode.split('\n').map(line => line.trim()).filter(line => line);
            const { header, pattern, footer } = extractSections(lines);

            if (pattern.length === 0) {
                throw new Error("No pattern found. Ensure some lines start with 'Z4' and contain X/Y coordinates.");
            }

            const transformedPattern = transformPattern(pattern);
            const reps = Math.max(1, parseInt(repetitions.toString(), 10));
            const yDist = parseFloat(yDistance.toString());

            if (isNaN(yDist) || isNaN(reps)) {
                throw new Error('Please enter valid numeric values for Y distance and repetitions.');
            }

            const result: string[] = [];
            result.push(...header.filter(line => line.startsWith('%') || line.startsWith('G1') || line.startsWith('M3')), '');

            for (let i = 0; i < reps; i++) {
                const offset = i * yDist;
                result.push(`; --- Repetition ${i + 1} (Y-offset: ${offset.toFixed(6)}) ---`);

                if (i === 0) {
                    result.push('F10000');
                    result.push('Z-4');
                    result.push('Z-4.000000 X0.000000 Y0.000000');
                    result.push('F1500');
                    result.push(...transformedPattern);
                } else {
                    result.push('F10000');
                    result.push('Z-4');
                    const baseY = 6.000000;
                    result.push(`X-6.000000 Y${(baseY + offset).toFixed(6)}`);
                    result.push('F1500');
                    transformedPattern.forEach(line => {
                        const match = line.match(/(Z[-\d.]+)\s*(X[-\d.]+)\s*(Y[-\d.]+)/);
                        if (match) {
                            const z = match[1];
                            const x = match[2];
                            const y = parseFloat(match[3].substring(1));
                            const newY = (y + offset).toFixed(6);
                            result.push(`${z} ${x} Y${newY}`);
                        }
                    });
                }
                result.push('Z-4');
                if (i < reps - 1) result.push('');
            }

            result.push('', ...footer);
            setGeneratedGcode(result.join('\n'));
            toast({
                title: "G-code Generated",
                description: `Created ${reps} repetitions successfully.`,
            });
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(errorMessage);
            toast({
                title: "Generation Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }, [originalGcode, repetitions, yDistance]);

    const copyToClipboard = async () => {
        if (!generatedGcode) return;
        try {
            await navigator.clipboard.writeText(generatedGcode);
            toast({
                title: "Copied to Clipboard",
                description: "The generated G-code has been copied.",
            });
        } catch (err) {
            toast({
                title: "Copy Failed",
                description: "Could not copy G-code to clipboard.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <style>{`
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #0d1117;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #2c333a;
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: #3a424a;
                }
            `}</style>
            <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans p-6 sm:p-8">
                <Toaster />
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">
                            G-code Pattern Repeater
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            A tool to generate repeated, transformed G-code patterns with incremental Y-axis positioning for CNC machining.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ minHeight: '450px' }}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Input G-Code</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={originalGcode}
                                    onChange={(e) => setOriginalGcode(e.target.value)}
                                    placeholder="Paste your G-code here..."
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Generated G-Code</CardTitle>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    disabled={!generatedGcode}
                                    className="gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={generatedGcode}
                                    readOnly
                                    placeholder="Generated code will appear here..."
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-white">Pattern Repeater Controls</CardTitle>
                        </CardHeader>
                        <div className="p-6 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
                                <div className="space-y-2 text-center w-full max-w-xs">
                                    <Label htmlFor="repetitions">
                                        Number of Repetitions
                                    </Label>
                                    <Input
                                        id="repetitions"
                                        type="number"
                                        min="40"
                                        value={repetitions}
                                        onChange={(e) => setRepetitions(Math.max(1, parseInt(e.target.value)))}
                                    />
                                </div>
                                <div className="space-y-2 text-center w-full max-w-xs">
                                    <Label htmlFor="yDistance">
                                        Y Distance Between Patterns
                                    </Label>
                                    <Input
                                        id="yDistance"
                                        type="number"
                                        step="5.715"
                                        value={yDistance}
                                        onChange={(e) => setYDistance(parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="text-center space-y-4">
                        <Button
                            onClick={generateRepeatedGcode}
                            size="lg"
                            className="gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Generate Pattern
                        </Button>
                        {error && (
                            <Alert variant="destructive" className="max-w-md mx-auto">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GcodePatternRepeater;
