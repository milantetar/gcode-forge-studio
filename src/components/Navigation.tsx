import React, { useEffect, useState } from 'react';
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
            <Card className="p-4 mb-6 w-full">
                <div className="flex flex-col gap-4 items-center justify-between">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-cyan-400 mb-1">G-Code Tools</h2>
                        <p className="text-sm text-slate-400">Choose your G-code processing tool</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                variant={currentApp === 'repeater' ? 'default' : 'outline'}
                                onClick={() => onAppChange('repeater')}
                                className="gap-2 font-medium w-full text-sm py-2.5 px-4"
                            >
                                <Repeat className="w-4 h-4" />
                                Pattern Repeater
                            </Button>
                            <Button
                                variant={currentApp === 'converter' ? 'default' : 'outline'}
                                onClick={() => onAppChange('converter')}
                                className="gap-2 font-medium w-full text-sm py-2.5 px-4"
                            >
                                <Settings className="w-4 h-4" />
                                Hexagonal Flat Converter
                            </Button>
                            <Button
                                variant={currentApp === 'twoAxis' ? 'default' : 'outline'}
                                onClick={() => onAppChange('twoAxis')}
                                className="gap-2 font-medium w-full text-sm py-2.5 px-4"
                            >
                                <Move className="w-4 h-4" />
                                Two Axis Converter
                            </Button>
                        </div>
                        <div className="self-center">
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4 md:p-5 w-full">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="text-center lg:text-left">
                    <h2 className="text-xl font-bold text-cyan-400 mb-1">G-Code Tools</h2>
                    <p className="text-sm text-slate-400">Choose your G-code processing tool</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button
                            variant={currentApp === 'repeater' ? 'default' : 'outline'}
                            onClick={() => onAppChange('repeater')}
                            className="gap-2 font-medium w-full sm:w-auto px-4 py-2.5"
                        >
                            <Repeat className="w-4 h-4" />
                            Pattern Repeater
                        </Button>
                        <Button
                            variant={currentApp === 'converter' ? 'default' : 'outline'}
                            onClick={() => onAppChange('converter')}
                            className="gap-2 font-medium w-full sm:w-auto px-4 py-2.5"
                        >
                            <Settings className="w-4 h-4" />
                            Hexagonal Flat Converter
                        </Button>
                        <Button
                            variant={currentApp === 'twoAxis' ? 'default' : 'outline'}
                            onClick={() => onAppChange('twoAxis')}
                            className="gap-2 font-medium w-full sm:w-auto px-4 py-2.5"
                        >
                            <Move className="w-4 h-4" />
                            Two Axis Converter
                        </Button>
                    </div>
                    <div className="self-center sm:self-auto">
                        <UserMenu />
                    </div>
                </div>
            </div>
        </Card>
    );
};