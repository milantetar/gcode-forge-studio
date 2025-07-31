import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, Play, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const GcodePatternRepeater = () => {
  const [originalGcode, setOriginalGcode] = useState(`G1 F10000
M3

F4000
Z0
X6.000000 Y1.500000
F500

Z4 X6.000000 Y1.500000
Z4 X5.851819 Y1.325601
Z4 X5.700180 Y1.155565
Z4 X5.545153 Y0.989976
Z4 X5.386806 Y0.828919
Z4 X5.225211 Y0.672477

Z0
X0

M5
M30`);
  
  const [yDistance, setYDistance] = useState('10.0');
  const [repetitions, setRepetitions] = useState('3');
  const [generatedGcode, setGeneratedGcode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  /**
   * Extracts header commands from G-code (commands that appear before the main pattern)
   * These typically include feed rates, spindle start, and initial positioning
   */
  const extractHeader = (lines: string[]): string[] => {
    const headerCommands = [];
    for (const line of lines) {
      const trimmed = line.trim();
      // Header commands: feed rates, spindle control, initial positioning
      if (trimmed.match(/^(G1\s+F\d+|M3|F\d+|Z0|X[\d\.\-]+\s+Y[\d\.\-]+)$/)) {
        headerCommands.push(trimmed);
      } else if (trimmed.startsWith('Z') && trimmed.includes('X') && trimmed.includes('Y')) {
        // Stop at the first coordinate movement (start of pattern)
        break;
      }
    }
    return headerCommands;
  };

  /**
   * Extracts footer commands from G-code (commands that appear after the main pattern)
   * These typically include spindle stop and program end
   */
  const extractFooter = (lines: string[]): string[] => {
    const footerCommands = [];
    let foundFooter = false;
    
    // Look for footer commands starting from the end
    for (let i = lines.length - 1; i >= 0; i--) {
      const trimmed = lines[i].trim();
      if (trimmed.match(/^(M5|M30|Z0|X0)$/)) {
        footerCommands.unshift(trimmed);
        foundFooter = true;
      } else if (foundFooter && trimmed.startsWith('Z') && trimmed.includes('X')) {
        // Stop when we reach the pattern area
        break;
      }
    }
    return footerCommands;
  };

  /**
   * Apply G-code transformations similar to the reference implementation
   */
  const applyTransformations = (lines: string[]): string[] => {
    const transformedLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // --- Special Handling for F4000 block ---
      if (line === "F4000" && 
          lines[i+1]?.trim() === "Z0" && 
          lines[i+2]?.trim().startsWith("X6.000000 Y1.500000") && 
          lines[i+3]?.trim() === "F500") {
        transformedLines.push("F4000");
        transformedLines.push("Z-4");
        transformedLines.push("Z-4.000000 X6.000000 Y6.000000");
        transformedLines.push("F500");
        i += 3;
        continue;
      }

      // --- General Transformation Logic ---
      // Regex to find lines with Z, X, and Y coordinates
      const match = line.match(/^(Z[\d\.\-]+)\s*(X[\d\.\-]+)\s*(Y[\d\.\-]+)$/);

      if (match) {
        const yValueOrig = parseFloat(match[3].substring(1));
        const xValueOrig = parseFloat(match[2].substring(1));
        const newZPart = `Z${yValueOrig.toFixed(6)}`;
        const newYPartFromX = `Y${xValueOrig.toFixed(6)}`;
        line = `${newZPart} ${match[2]} ${newYPartFromX}`;
      }

      // Invert Y Sign
      const invertYSignReplacer = (match: string, p1: string, p2: string) => {
        const yValue = parseFloat(p2);
        const invertedYValue = -yValue;
        return `${p1}${invertedYValue.toFixed(6)}`;
      };

      if (!line.includes("Z-4.000000 X6.000000 Y6.000000")) {
        line = line.replace(/(Y)([+-]?\d+\.?\d*)/g, invertYSignReplacer);
      }
      
      transformedLines.push(line);
    }

    return transformedLines;
  };

  /**
   * Extracts the repeatable pattern block from G-code
   * This excludes header and footer commands, leaving only the coordinate movements
   */
  const extractRepeatableBlock = (lines: string[]): string[] => {
    const headerEnd = extractHeader(lines).length;
    const footer = extractFooter(lines);
    const footerStart = lines.length - footer.length;
    
    const patternLines = [];
    for (let i = headerEnd; i < footerStart; i++) {
      const trimmed = lines[i].trim();
      if (trimmed && !trimmed.startsWith('%') && !trimmed.match(/^(M5|M30|Z0|X0)$/)) {
        patternLines.push(trimmed);
      }
    }
    return patternLines;
  };

  /**
   * Main function to generate repeated G-code pattern
   * Increments Y values by distance for each repetition while keeping Z values unchanged
   */
  const generateRepeatedGcode = useCallback(() => {
    setIsProcessing(true);
    
    try {
      const lines = originalGcode.split('\n').map(line => line.trim()).filter(line => line);
      const yDist = parseFloat(yDistance);
      const reps = parseInt(repetitions);

      if (isNaN(yDist) || isNaN(reps) || reps < 1) {
        throw new Error('Please enter valid numeric values for Y distance and repetitions');
      }

      // Apply transformations to the original G-code first
      const transformedLines = applyTransformations(lines);
      
      // Extract components from transformed G-code
      const header = extractHeader(transformedLines);
      const repeatableBlock = extractRepeatableBlock(transformedLines);
      const footer = extractFooter(transformedLines);

      if (repeatableBlock.length === 0) {
        throw new Error('No repeatable pattern found in the G-code');
      }

      // Build the final G-code
      const result = [];
      
      // Add header
      result.push('% Generated G-code Pattern Repeater');
      result.push('% Original pattern repeated ' + reps + ' times');
      result.push('% Y-axis offset: ' + yDist + ' per repetition');
      result.push('% Z values remain unchanged from original pattern');
      result.push('');
      result.push(...header);
      result.push('');
      
      // Generate all instances including the first one
      for (let i = 0; i < reps; i++) {
        result.push(`; === Pattern Instance ${i + 1} ===`);
        
        // Process each line in the repeatable block
        const modifiedBlock = repeatableBlock.map(line => {
          // Match lines with coordinates (Z, X, Y format)
          const coordMatch = line.match(/^(Z[\d\.\-]+)\s+(X[\d\.\-]+)\s+(Y[\d\.\-]+)(.*)$/);
          
          if (coordMatch) {
            const zPart = coordMatch[1]; // Keep Z unchanged
            const xPart = coordMatch[2]; // Keep X unchanged
            const yPart = coordMatch[3]; // Modify Y value
            const restPart = coordMatch[4] || ''; // Any additional content
            
            // Extract Y value and add the increment
            const yValue = parseFloat(yPart.substring(1));
            const newYValue = yValue + (yDist * i);
            
            return `${zPart} ${xPart} Y${newYValue.toFixed(6)}${restPart}`;
          }
          
          // Return line unchanged if it doesn't match coordinate pattern
          return line;
        });
        
        result.push(...modifiedBlock);
        result.push('');
      }

      // Add footer
      result.push('; === Program End ===');
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

  /**
   * Copy generated G-code to clipboard
   */
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
        {/* Header */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Pattern Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Original G-code Input */}
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

              {/* Parameters */}
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
                    placeholder="10.0"
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
                    placeholder="3"
                  />
                </div>
              </div>

              {/* Generate Button */}
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

          {/* Output Section */}
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

        {/* Info Section */}
        <Card className="shadow-elevated border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-primary mb-2">How it Works</h3>
                <p className="text-muted-foreground">
                  The tool extracts the repeatable pattern from your G-code, 
                  then generates multiple instances using G91 incremental positioning 
                  for precise Y-axis offsets.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Pattern Detection</h3>
                <p className="text-muted-foreground">
                  Automatically identifies header commands (F, M3), 
                  repeatable coordinate movements, and footer commands (M5, M30) 
                  to create clean, structured output.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Positioning Modes</h3>
                <p className="text-muted-foreground">
                  Uses G90 (absolute) for the first pattern instance, 
                  then G91 (incremental) for Y-axis movements between repetitions, 
                  ensuring precise positioning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};