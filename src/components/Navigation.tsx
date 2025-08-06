import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Repeat, Settings, Move } from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';

interface NavigationProps {
    currentApp: 'repeater' | 'converter' | 'twoAxis';
    onAppChange: (app: 'repeater' | 'converter' | 'twoAxis') => void;
}

export const Navigation = ({ currentApp, onAppChange }: NavigationProps) => {
    return (
        <Card className="p-4 mb-6 border-accent/20 shadow-elegant">
            <div className="flex flex-col gap-4 items-center justify-between">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-primary mb-1">G-Code Tools</h2>
                    <p className="text-sm text-muted-foreground">Choose your G-code processing tool</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button
                            variant={currentApp === 'repeater' ? 'default' : 'outline'}
                            onClick={() => onAppChange('repeater')}
                            className="gap-2 font-medium w-full sm:w-auto text-sm py-2"
                        >
                            <Repeat className="w-4 h-4" />
                            Pattern Repeater
                        </Button>

                        <Button
                            variant={currentApp === 'converter' ? 'default' : 'outline'}
                            onClick={() => onAppChange('converter')}
                            className="gap-2 font-medium w-full sm:w-auto text-sm py-2"
                        >
                            <Settings className="w-4 h-4" />
                            Hexagonal Flat Converter
                        </Button>

                        <Button
                            variant={currentApp === 'twoAxis' ? 'default' : 'outline'}
                            onClick={() => onAppChange('twoAxis')}
                            className="gap-2 font-medium w-full sm:w-auto text-sm py-2"
                        >
                            <Move className="w-4 h-4" />
                            Two Axis Converter
                        </Button>
                    </div>
                    <UserMenu />
                </div>
            </div>
        </Card>
    );
};