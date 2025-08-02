import React, { useState, useCallback } from 'react';

// Main GcodeTwoAxisConverter Component
export default function GcodeTwoAxisConverter() {
    const initialInput = `% 0 Holes 
% 4 Width 
% Spindle Start Stop 

% Drilling: 
% 10000 feedRate, 4 Z Movement, 0 Curve 
% Engraving: 
% Cyan 1: 1500 feedRate, 4 Z Move,  0 Curve 

G1 F10000
M3

F10000
Z0
X0.000000 Y2.000000
F1500

Z4 X0.000000 Y2.000000
Z4 X0.103710 Y1.997356
Z4 X0.206048 Y1.989510
Z4 X0.306886 Y1.976591
Z4 X0.406095 Y1.958728
Z4 X0.503547 Y1.936049
Z4 X0.599111 Y1.908684
Z4 X0.692661 Y1.876760
Z4 X0.784066 Y1.840407
Z4 X0.873199 Y1.799753
Z4 X0.959930 Y1.754927
Z4 X1.044131 Y1.706059
Z4 X1.125673 Y1.653275
Z4 X1.204427 Y1.596707
Z4 X1.280264 Y1.536481
Z4 X1.353056 Y1.472727
Z4 X1.422674 Y1.405574
Z4 X1.488990 Y1.335151
Z4 X1.551873 Y1.261585
Z4 X1.611197 Y1.185006
Z4 X1.666831 Y1.105543
Z4 X1.718648 Y1.023325
Z4 X1.766518 Y0.938479
Z4 X1.810313 Y0.851136
Z4 X1.849903 Y0.761423
Z4 X1.885161 Y0.669470
Z4 X1.915957 Y0.575404
Z4 X1.942164 Y0.479356
Z4 X1.963651 Y0.381453
Z4 X1.980290 Y0.281825
Z4 X1.991953 Y0.180599
Z4 X1.998510 Y0.077906
Z4 X1.999834 Y-0.026049
Z4 X1.995877 Y-0.129428
Z4 X1.986751 Y-0.231403
Z4 X1.972584 Y-0.331846
Z4 X1.953505 Y-0.430628
Z4 X1.929642 Y-0.527620
Z4 X1.901125 Y-0.622693
Z4 X1.868082 Y-0.715718
Z4 X1.830641 Y-0.806568
Z4 X1.788933 Y-0.895112
Z4 X1.743084 Y-0.981222
Z4 X1.693225 Y-1.064771
Z4 X1.639483 Y-1.145627
Z4 X1.581988 Y-1.223664
Z4 X1.520868 Y-1.298753
Z4 X1.456253 Y-1.370763
Z4 X1.388270 Y-1.439568
Z4 X1.317049 Y-1.505037
Z4 X1.242718 Y-1.567043
Z4 X1.165406 Y-1.625456
Z4 X1.085242 Y-1.680148
Z4 X1.002355 Y-1.730990
Z4 X0.916873 Y-1.777854
Z4 X0.828925 Y-1.820609
Z4 X0.738640 Y-1.859129
Z4 X0.646146 Y-1.893284
Z4 X0.551573 Y-1.922944
Z4 X0.455049 Y-1.947983
Z4 X0.356703 Y-1.968270
Z4 X0.256663 Y-1.983677
Z4 X0.155059 Y-1.994075
Z4 X0.052018 Y-1.999336
Z4 X-0.052018 Y-1.999336
Z4 X-0.155059 Y-1.994075
Z4 X-0.256663 Y-1.983677
Z4 X-0.356703 Y-1.968270
Z4 X-0.455049 Y-1.947983
Z4 X-0.551573 Y-1.922944
Z4 X-0.646146 Y-1.893284
Z4 X-0.738640 Y-1.859129
Z4 X-0.828925 Y-1.820609
Z4 X-0.916873 Y-1.777854
Z4 X-1.002355 Y-1.730990
Z4 X-1.085242 Y-1.680148
Z4 X-1.165406 Y-1.625456
Z4 X-1.242718 Y-1.567043
Z4 X-1.317049 Y-1.505037
Z4 X-1.388270 Y-1.439568
Z4 X-1.456253 Y-1.370763
Z4 X-1.520868 Y-1.298753
Z4 X-1.581988 Y-1.223664
Z4 X-1.639483 Y-1.145627
Z4 X-1.693225 Y-1.064771
Z4 X-1.743084 Y-0.981222
Z4 X-1.788933 Y-0.895112
Z4 X-1.830641 Y-0.806568
Z4 X-1.868082 Y-0.715718
Z4 X-1.901125 Y-0.622693
Z4 X-1.929642 Y-0.527620
Z4 X-1.953505 Y-0.430628
Z4 X-1.972584 Y-0.331846
Z4 X-1.986751 Y-0.231403
Z4 X-1.995877 Y-0.129428
Z4 X-1.999834 Y-0.026049
Z4 X-1.998510 Y0.077906
Z4 X-1.991953 Y0.180599
Z4 X-1.980290 Y0.281825
Z4 X-1.963651 Y0.381453
Z4 X-1.942164 Y0.479356
Z4 X-1.915957 Y0.575404
Z4 X-1.885161 Y0.669470
Z4 X-1.849903 Y0.761423
Z4 X-1.810313 Y0.851136
Z4 X-1.766518 Y0.938479
Z4 X-1.718648 Y1.023325
Z4 X-1.666831 Y1.105543
Z4 X-1.611197 Y1.185006
Z4 X-1.551873 Y1.261585
Z4 X-1.488990 Y1.335151
Z4 X-1.422674 Y1.405574
Z4 X-1.353056 Y1.472727
Z4 X-1.280264 Y1.536481
Z4 X-1.204427 Y1.596707
Z4 X-1.125673 Y1.653275
Z4 X-1.044131 Y1.706059
Z4 X-0.959930 Y1.754927
Z4 X-0.873199 Y1.799753
Z4 X-0.784066 Y1.840407
Z4 X-0.692661 Y1.876760
Z4 X-0.599111 Y1.908684
Z4 X-0.503547 Y1.936049
Z4 X-0.406095 Y1.958728
Z4 X-0.306886 Y1.976591
Z4 X-0.206048 Y1.989510
Z4 X-0.103710 Y1.997356
Z4 X0.000000 Y2.000000

Z0
X0

M5
M30`;
    const [inputGCode, setInputGCode] = useState<string>(initialInput);
    const [outputGCode, setOutputGCode] = useState<string>('');
    const [repeatCount, setRepeatCount] = useState<number>(2);
    const [bIncrement, setBIncrement] = useState<number>(8.16);
    const [rapidFeedrate, setRapidFeedrate] = useState<number>(10000);
    const [engravingFeedrate, setEngravingFeedrate] = useState<number>(1500);
    const [error, setError] = useState<string>('');

    const handleConvert = useCallback(() => {
        setError('');
        setOutputGCode('');
        try {
            const lines = inputGCode.split('\n');
            const headerEndMarker = 'M3';
            const headerEndIndex = lines.findIndex(line => line.trim() === headerEndMarker);

            if (headerEndIndex === -1) {
                setError('Could not find header end marker (M3). The header should end with M3 on its own line.');
                return;
            }
            const header = lines.slice(0, headerEndIndex + 1).join('\n');

            let lastZ4Index = -1;
            for (let i = lines.length - 1; i > headerEndIndex; i--) {
                if (lines[i].trim().startsWith('Z4')) {
                    lastZ4Index = i;
                    break;
                }
            }
            if (lastZ4Index === -1) {
                setError('Could not find any "Z4" coordinate lines in the input G-code.');
                return;
            }
            const footer = lines.slice(lastZ4Index + 1).join('\n');
            const repeatableBlockTemplateLines = lines.slice(headerEndIndex + 1, lastZ4Index + 1)
                .filter(line => line.trim().length > 0);

            if (repeatableBlockTemplateLines.length === 0) {
                setError('No repeatable block found between the header (ending in M3) and the footer.');
                return;
            }

            let generatedBlocks: string[] = [];
            const bIncrementValue = Number(bIncrement) || 0;

            for (let i = 0; i < repeatCount; i++) {
                const currentBValue = (i * bIncrementValue).toFixed(6);
                let fCommandCount = 0;
                const newBlock = repeatableBlockTemplateLines.map(line => {
                    let processedLine = line.trim();
                    if (processedLine.startsWith('F')) {
                        fCommandCount++;
                        if (fCommandCount === 1) {
                            processedLine = `F${rapidFeedrate}`;
                        } else if (fCommandCount >= 2) {
                            processedLine = `F${engravingFeedrate}`;
                        }
                        return processedLine;
                    }
                    if (processedLine.includes('X') && processedLine.includes('Y')) {
                        return `${processedLine} B${currentBValue}`;
                    }
                    return processedLine;
                }).join('\n');
                generatedBlocks.push(newBlock);
            }

            const finalGCode = [
                header,
                ...generatedBlocks,
                footer
            ].join('\n\n');
            setOutputGCode(finalGCode);
        } catch (e) {
            console.error(e);
            setError('An unexpected error occurred. Please check the console for details.');
        }
    }, [inputGCode, repeatCount, bIncrement, rapidFeedrate, engravingFeedrate]);

    // Modern clipboard API
    const copyToClipboard = useCallback(() => {
        if (!outputGCode) return;
        navigator.clipboard.writeText(outputGCode).catch(err => {
            setError('Failed to copy text to clipboard.');
            console.error('Clipboard error:', err);
        });
    }, [outputGCode]);

    // Input validation helpers
    const handleRepeatCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(e.target.value, 10));
        setRepeatCount(value);
    };
    const handleBIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBIncrement(parseFloat(e.target.value));
    };
    const handleRapidFeedrateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRapidFeedrate(Math.max(0, parseInt(e.target.value, 10)));
    };
    const handleEngravingFeedrateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEngravingFeedrate(Math.max(0, parseInt(e.target.value, 10) ));
    };

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">G-Code Processor</h1>
                    <p className="mt-2 text-lg text-gray-400">Paste your G-code, set parameters, and generate the output.</p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col space-y-6">
                        <div>
                            <label htmlFor="input-gcode" className="block text-sm font-medium text-gray-400 mb-2">Input G-Code</label>
                            <textarea
                                id="input-gcode"
                                value={inputGCode}
                                onChange={e => setInputGCode(e.target.value)}
                                className="w-full h-96 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm font-mono"
                                placeholder="Paste your G-code here..."
                                aria-label="Input G-Code"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="output-gcode" className="block text-sm font-medium text-gray-400">Output G-Code</label>
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!outputGCode}
                                    className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Copy Output G-Code"
                                >
                                    Copy
                                </button>
                            </div>
                            <textarea
                                id="output-gcode"
                                value={error || outputGCode}
                                readOnly
                                className={`w-full h-96 p-4 bg-gray-800 border rounded-lg shadow-sm text-sm font-mono ${error ? 'border-red-500 text-red-400' : 'border-gray-700'}`}
                                placeholder="Generated G-code will appear here..."
                                aria-label="Output G-Code"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4 sticky top-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <label htmlFor="repeat-count" className="text-sm font-medium text-gray-300">Repeat Block:</label>
                                    <input
                                        id="repeat-count"
                                        type="number"
                                        value={repeatCount}
                                        onChange={handleRepeatCountChange}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-center focus:ring-2 focus:ring-cyan-500"
                                        min="1"
                                        aria-label="Repeat Block Count"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="b-increment" className="text-sm font-medium text-gray-300">B Increment:</label>
                                    <input
                                        id="b-increment"
                                        type="number"
                                        value={bIncrement}
                                        onChange={handleBIncrementChange}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-center focus:ring-2 focus:ring-cyan-500"
                                        step="0.01"
                                        aria-label="B Axis Increment"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="rapid-feedrate" className="text-sm font-medium text-gray-300">Rapid Feedrate:</label>
                                    <input
                                        id="rapid-feedrate"
                                        type="number"
                                        value={rapidFeedrate}
                                        onChange={handleRapidFeedrateChange}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-center focus:ring-2 focus:ring-cyan-500"
                                        min="0"
                                        aria-label="Rapid Feedrate"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="engraving-feedrate" className="text-sm font-medium text-gray-300">Engraving Feedrate:</label>
                                    <input
                                        id="engraving-feedrate"
                                        type="number"
                                        value={engravingFeedrate}
                                        onChange={handleEngravingFeedrateChange}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-center focus:ring-2 focus:ring-cyan-500"
                                        min="0"
                                        aria-label="Engraving Feedrate"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleConvert}
                                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
                                disabled={!inputGCode.trim()}
                                aria-label="Generate Output G-Code"
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}