import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Repeat, Settings } from 'lucide-react';

interface NavigationProps {
  currentApp: 'repeater' | 'converter';
  onAppChange: (app: 'repeater' | 'converter') => void;
}

export const Navigation = ({ currentApp, onAppChange }: NavigationProps) => {
  return (
    <Card className="p-4 mb-8 border-accent/20 shadow-elegant">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold text-primary mb-1">G-Code Tools</h2>
          <p className="text-sm text-muted-foreground">Choose your G-code processing tool</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant={currentApp === 'repeater' ? 'default' : 'outline'}
            onClick={() => onAppChange('repeater')}
            className="gap-2 font-medium"
          >
            <Repeat className="w-4 h-4" />
            Pattern Repeater
          </Button>
          
          <Button
            variant={currentApp === 'converter' ? 'default' : 'outline'}
            onClick={() => onAppChange('converter')}
            className="gap-2 font-medium"
          >
            <Settings className="w-4 h-4" />
            Custom Converter
          </Button>
        </div>
      </div>
    </Card>
  );
};