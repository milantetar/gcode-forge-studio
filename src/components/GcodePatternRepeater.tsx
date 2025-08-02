import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, Play, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const GcodePatternRepeater = () => {
    const [originalGcode, setOriginalGcode] = useState(`% 0 Holes
% 10.8 Width
% Spindle Start Stop

% Drilling:
% 10000 feedRate, 4 Z Movement, 0 Curve
% Engraving:
% Cyan 1: 500 feedRate, 4 Z Move,  0 Curve

G1 F10000
M3

F10000
Z0
X5.400000 Y1.500000
F500

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

Z0
X0

M5
M30`);
    const [yDistance, setYDistance] = useState('5.715');
    const [repetitions, setRepetitions] = useState('40');
    const [generatedGcode, setGeneratedGcode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const extractSections = (lines) => {
        const header = [];
        const pattern = [];
        const footer = [];
        let inPattern = false;

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('Z4') && trimmed.includes('X') && trimmed.includes('Y')) {
                inPattern = true;
                pattern.push(trimmed);
            } else if (inPattern && (trimmed === 'X0' || trimmed === 'M5' || trimmed === 'M30')) {
                footer.push(trimmed);
            } else if (!inPattern) {
                header.push(trimmed);
            }
        }
        return { header, pattern, footer };
    };

    const transformPattern = (pattern) => {
        return pattern.map(line => {
            const match = line.match(/Z4 X([\d\.\-]+) Y([\d\.\-]+)/);
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
        setIsProcessing(true);
        try {
            const lines = originalGcode.split('\n').map(line => line.trim()).filter(line => line);
            const { header, pattern, footer } = extractSections(lines);
            const transformedPattern = transformPattern(pattern);
            const yDist = parseFloat(yDistance);
            const reps = parseInt(repetitions);

            if (isNaN(yDist) || isNaN(reps) || reps < 1) {
                throw new Error('Please enter valid numeric values for Y distance and repetitions');
            }

            const baseX = 6.000000; // Hard-coded to match output
            const baseY = 6.000000; // Hard-coded to match output
            const result = [];

            // Description header
            result.push('; --- Transformed G-code Description ---');
            result.push(`; Generated on: ${new Date().toLocaleString()}`);
            result.push(';');
            result.push(`; - Repetition with Y-Offset Applied (Offset: ${yDist.toFixed(3)}, Count: ${reps})`);
            result.push(';   - Each repetition includes a custom preamble (F10000, Z-4, X-6.000000 Y<offset>, F1500)');
            result.push(';   - Y-coordinates in the pattern and preamble are adjusted by cumulative Y-offset');
            result.push(';   - Z-values in the pattern and preamble are fixed as per input pattern');
            result.push(';   - Each repetition ends with Z-4.000000');
            result.push('; ---------------------------------------');
            result.push('');

            // Original header
            result.push(...header);
            result.push('');

            // Repetitions
            for (let i = 0; i < reps; i++) {
                const offset = i * yDist;
                result.push(`; --- Repetition ${i + 1} (Y-offset: ${(i * yDist).toFixed(6)}) ---`);
                // Preamble
                result.push('F10000');
                result.push('Z-4');
                result.push(`X-${baseX.toFixed(6)} Y${(baseY + offset).toFixed(6)}`);
                result.push('F1500');

                // Pattern with Y offset
                transformedPattern.forEach(line => {
                    const match = line.match(/(Z[\d\.\-]+)\s*(X[\d\.\-]+)\s*(Y[\d\.\-]+)/);
                    if (match) {
                        const z = match[1];
                        const x = match[2];
                        const y = parseFloat(match[3].substring(1));
                        const newY = (y + offset).toFixed(6);
                        result.push(`${z} ${x} Y${newY}`);
                    } else {
                        result.push(line);
                    }
                });

                result.push('Z-4');
                if (i < reps - 1) result.push('');
            }

            // Footer
            result.push('');
            result.push(...footer);

            setGeneratedGcode(result.join('\n'));
            toast({
                title: "G-code Generated Successfully",
                description: `Created ${reps} repetitions with ${yDist}mm Y-axis spacing`,
            });
        } catch (error) {
            toast({
                title: "Generation Error",
                description: error instanceof Error ? error.message : "An error occurred",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    }, [originalGcode, yDistance, repetitions, toast]);

    const copyToClipboard = useCallback(async () => {
        if (!generatedGcode) {
            toast({
                title: "Nothing to Copy",
                description: "Please generate G-code first",
                variant: "destructive",
            });
            return;
        }
        try {
            await navigator.clipboard.writeText(generatedGcode);
            toast({
                title: "Copied to Clipboard",
                description: "G-code has been copied successfully",
            });
        } catch (error) {
            toast({
                title: "Copy Failed",
                description: "Unable to copy to clipboard",
                variant: "destructive",
            });
        }
    }, [generatedGcode, toast]);

    return (
        <div className="min-h-screen bg-gradient-subtle p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <Settings2 className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            G-code Forge Studio
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Professional G-code pattern repetition tool for CNC machining.
                        Generate precise repeated patterns with incremental Y-axis positioning.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-elevated">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings2 className="h-5 w-5 text-primary" />
                                Pattern Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="original-gcode" className="text-sm font-semibold">
                                    Original G-code Pattern
                                </Label>
                                <Textarea
                                    id="original-gcode"
                                    placeholder="Paste your G-code pattern here..."
                                    value={originalGcode}
                                    onChange={(e) => setOriginalGcode(e.target.value)}
                                    className="min-h-[300px] font-mono text-sm bg-input border-border focus:border-primary resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="y-distance" className="text-sm font-semibold">
                                        Y Distance per Repetition (mm)
                                    </Label>
                                    <Input
                                        id="y-distance"
                                        type="number"
                                        step="0.1"
                                        value={yDistance}
                                        onChange={(e) => setYDistance(e.target.value)}
                                        className="font-mono"
                                        placeholder="5.715"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="repetitions" className="text-sm font-semibold">
                                        Number of Repetitions
                                    </Label>
                                    <Input
                                        id="repetitions"
                                        type="number"
                                        min="1"
                                        value={repetitions}
                                        onChange={(e) => setRepetitions(e.target.value)}
                                        className="font-mono"
                                        placeholder="40"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={generateRepeatedGcode}
                                disabled={isProcessing || !originalGcode.trim()}
                                variant="tech"
                                size="lg"
                                className="w-full"
                            >
                                <Play className="h-5 w-5" />
                                {isProcessing ? 'Generating...' : 'Generate G-code Pattern'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-elevated">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Copy className="h-5 w-5 text-primary" />
                                    Generated G-code
                                </CardTitle>
                                <Button
                                    onClick={copyToClipboard}
                                    disabled={!generatedGcode}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={generatedGcode}
                                readOnly
                                placeholder="Generated G-code will appear here..."
                                className="min-h-[400px] font-mono text-sm bg-input border-border resize-none"
                            />
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-elevated border-primary/20">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <h3 className="font-semibold text-primary mb-2">How it Works</h3>
                                <p className="text-muted-foreground">
                                    The tool extracts the repeatable pattern from your G-code,
                                    transforms it according to specified rules,
                                    and generates multiple instances with precise Y-axis offsets.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary mb-2">Pattern Transformation</h3>
                                <p className="text-muted-foreground">
                                    Deletes Z4, sets Z to original Y, X to negative original X,
                                    and Y to original X, maintaining Z on the left.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary mb-2">Repetition Logic</h3>
                                <p className="text-muted-foreground">
                                    Each repetition includes a custom preamble with adjusted Y,
                                    followed by the transformed pattern with Y offset, ending with Z-4.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};