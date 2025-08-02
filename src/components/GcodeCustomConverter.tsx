import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Default G-code for the input field
const initialGCode = `% 14 Holes 
% 28.9777 Width 
% Spindle Start Stop 

% Drilling: 
% 10000 feedRate, 4 Z Movement, 0 Curve 
% Engraving: 


G1 F10000
M3


Z0
X13.738900 Y0.016700
Z4.000000
Z0
X11.711900 Y0.787700
Z4.000000
Z0
X9.641500 Y1.433200
Z4.000000
Z0
X7.535700 Y1.951600
Z4.000000
Z0
X5.402300 Y2.341000
Z4.000000
Z0
X3.249100 Y2.600200
Z4.000000
Z0
X1.084300 Y2.729300
Z4.000000
Z0
X-1.084400 Y2.729400
Z4.000000
Z0
X-3.249200 Y2.600200
Z4.000000
Z0
X-5.402400 Y2.341100
Z4.000000
Z0
X-7.535800 Y1.951700
Z4.000000
Z0
X-9.641600 Y1.433300
Z4.000000
Z0
X-11.711900 Y0.787700
Z4.000000
Z0
X-13.738800 Y0.016800
Z4.000000

Z0
X0

M5
M30`;

export const GcodeCustomConverter = () => {
  const [inputGCode, setInputGCode] = useState(initialGCode);
  const [outputGCode, setOutputGCode] = useState('');
  const [error, setError] = useState('');

  /**
   * Main function to convert G-code based on a sequence of rules.
   */
  const handleConvert = () => {
    try {
      setError('');
      let processedCode = inputGCode;

      // Rule: Delete all 'Z0' lines
      processedCode = processedCode
        .split('\n')
        .filter(line => line.trim() !== 'Z0')
        .join('\n');

      // Rule 1: Add the last known Y value to any Z4 line
      let lines = processedCode.split('\n');
      let lastY = 0;
      let tempLines1 = [];
      for (const line of lines) {
        const trimmedLine = line.trim();
        // Regex to find Y coordinate and its value
        const yMatch = trimmedLine.match(/Y(-?\d+(\.\d+)?)/);
        if (yMatch) {
          lastY = parseFloat(yMatch[1]);
        }
        
        // If line is Z4..., add lastY to it.
        if (trimmedLine.startsWith('Z4')) {
          const newZ = 4 + lastY;
          tempLines1.push(`Z${newZ.toFixed(6)}`);
        } else {
          tempLines1.push(line);
        }
      }
      processedCode = tempLines1.join('\n');

      // Rule 2: Exchange the values of X and Y
      lines = processedCode.split('\n');
      let tempLines2 = [];
      for (const line of lines) {
        const trimmedLine = line.trim();
        // Regex to find X and Y coordinates and their values
        const xMatch = trimmedLine.match(/X(-?\d+(\.\d+)?)/);
        const yMatch = trimmedLine.match(/Y(-?\d+(\.\d+)?)/);

        if (xMatch && yMatch) {
          const xVal = xMatch[1];
          const yVal = yMatch[1];
          // Perform a safe swap
          let newLine = line.replace(xMatch[0], `X_TEMP_`);
          newLine = newLine.replace(yMatch[0], `Y${xVal}`);
          newLine = newLine.replace(`X_TEMP_`, `X${yVal}`);
          tempLines2.push(newLine);
        } else {
          tempLines2.push(line);
        }
      }
      processedCode = tempLines2.join('\n');

      // Rule 3: Make all X values 0
      lines = processedCode.split('\n');
      let tempLines3 = [];
      for (const line of lines) {
          // This regex will find X followed by a number and replace it with X0
          tempLines3.push(line.replace(/X(-?\d+(\.\d+)?)/g, 'X0'));
      }
      processedCode = tempLines3.join('\n');

      setOutputGCode(processedCode);
      toast({
        title: "Conversion Complete",
        description: "G-code has been successfully converted.",
      });
    } catch (e) {
      console.error("Conversion Error:", e);
      setError("An error occurred during conversion. Please check the input format.");
    }
  };

  /**
   * Function to copy text to the clipboard.
   */
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputGCode);
      toast({
        title: "Copied!",
        description: "G-code copied to clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback method
      const textarea = document.createElement('textarea');
      textarea.value = outputGCode;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Copied!",
          description: "G-code copied to clipboard.",
        });
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
        toast({
          title: "Copy Failed",
          description: "Unable to copy to clipboard.",
          variant: "destructive",
        });
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            G-Code Custom Converter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A specialized tool to transform G-code based on custom rules: removes Z0 lines, 
            adds Y values to Z4, exchanges X/Y coordinates, and sets all X values to 0.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="border-accent/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">Input G-Code</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputGCode}
                onChange={(e) => setInputGCode(e.target.value)}
                className="h-96 font-mono text-sm resize-none"
                placeholder="Paste your G-code here..."
              />
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-accent/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-primary">Output G-Code</CardTitle>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                disabled={!outputGCode}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={outputGCode}
                readOnly
                className="h-96 font-mono text-sm resize-none bg-muted/50"
                placeholder="Converted code will appear here..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Button and Error Message */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleConvert}
            size="lg"
            className="px-10 py-6 text-lg font-bold bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            <Zap className="w-5 h-5 mr-2" />
            Convert Code
          </Button>
          
          {error && (
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};