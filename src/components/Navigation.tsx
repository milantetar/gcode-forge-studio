import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Repeat, Settings, Move } from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';

interface NavigationProps {
    currentApp: 'repeater' | 'converter' | 'twoAxis';
    onAppChange: (app: 'repeater' | 'converter' | 'twoAxis') => void;
}

export const Navigation = ({ currentApp, onAppChange }: NavigationProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640); // Tailwind's 'sm' breakpoint
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMobile) {
        return (
            <Card className="p-4 mb-6 border-accent/20 shadow-elegant">
                <div className="flex flex-col gap-4 items-center justify-between">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-primary mb-1">G-Code Tools</h2>
                        <p className="text-sm text-muted-foreground">Choose your G-code processing tool</p>
                    </div>

                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                variant={currentApp === 'repeater' ? 'default' : 'outline'}
                                onClick={() => onAppChange('repeater')}
                                className="gap-2 font-medium w-full text-sm py-2"
                            >
                                <Repeat className="w-4 h-4" />
                                Pattern Repeater
                            </Button>

                            <Button
                                variant={currentApp === 'converter' ? 'default' : 'outline'}
                                onClick={() => onAppChange('converter')}
                                className="gap-2 font-medium w-full text-sm py-2"
                            >
                                <Settings className="w-4 h-4" />
                                Hexagonal Flat Converter
                            </Button>

                            <Button
                                variant={currentApp === 'twoAxis' ? 'default' : 'outline'}
                                onClick={() => onAppChange('twoAxis')}
                                className="gap-2 font-medium w-full text-sm py-2"
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
    }

    return (
        <Card className="p-4 mb-8 border-accent/20 shadow-elegant">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-center sm:text-left">
                    <h2 className="text-lg font-semibold text-primary mb-1">G-Code Tools</h2>
                    <p className="text-sm text-muted-foreground">Choose your G-code processing tool</p>
                </div>

                <div className="flex items-center gap-4">
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
                            Hexagonal Flat Converter
                        </Button>

                        <Button
                            variant={currentApp === 'twoAxis' ? 'default' : 'outline'}
                            onClick={() => onAppChange('twoAxis')}
                            className="gap-2 font-medium"
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