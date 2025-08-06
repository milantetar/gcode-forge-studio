import React, { useState, useEffect } from 'react';
import { Repeat, Settings, Move, User } from 'lucide-react';

// Mock Authentication Context
const AuthContext = React.createContext({ user: { name: 'User' } });
const useAuth = () => React.useContext(AuthContext);

// Themed Placeholder Components
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={`bg-slate-800/60 border border-cyan-400/20 rounded-xl shadow-lg shadow-black/20 ${className}`}>
        {children}
    </div>
);

const Button = ({ variant, className, children, onClick }: { variant?: string; className?: string; children: React.ReactNode; onClick?: () => void }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
    const variantClasses = variant === 'default'
        ? "bg-cyan-400 text-slate-900 hover:bg-cyan-300 shadow-md shadow-cyan-500/20"
        : "bg-slate-900/50 text-slate-300 hover:bg-slate-700/50 hover:text-white";
    return (
        <button className={`${baseClasses} ${variantClasses} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

const UserMenu = () => (
    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300 transition-all duration-200 shadow-md shadow-cyan-500/20 flex-shrink-0">
        <User className="w-5 h-5" />
    </button>
);

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