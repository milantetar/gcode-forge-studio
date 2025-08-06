import React, { useState } from 'react';
import { Repeat, Settings, Move, User } from 'lucide-react';

// --- Themed Placeholder Components ---
// These are stand-ins for your UI components, styled to match the dark theme.
// The core logic and classes have been updated for the new layout.

const Card = ({ className, children }) => (
    // Card with a dark background, subtle border, and rounded corners.
    <div className={`bg-slate-800/60 border border-cyan-400/20 rounded-xl shadow-lg shadow-black/20 ${className}`}>
        {children}
    </div>
);

const Button = ({ variant, className, children, onClick }) => {
    // Base classes for all buttons
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
    
    // Classes for the active ('default') and inactive ('outline') button variants
    const variantClasses = variant === 'default'
        ? "bg-cyan-400 text-slate-900 hover:bg-cyan-300 shadow-md shadow-cyan-500/20" // Active button: bright blue
        : "bg-slate-900/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"; // Inactive button: dark with hover effect
        
    return (
        <button className={`${baseClasses} ${variantClasses} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

const UserMenu = () => (
    // User menu styled as a bright blue circle, matching the active button.
    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300 transition-all duration-200 shadow-md shadow-cyan-500/20 flex-shrink-0">
        <User className="w-5 h-5" />
    </button>
);

// --- Responsive Navigation Component (Themed & Improved) ---
// This version implements horizontal scrolling for the buttons on mobile.

const Navigation = ({ currentApp, onAppChange }) => {
    return (
        <Card className="p-4 md:p-5 w-full">
            {/* Main container stacks title/controls on mobile, and aligns them side-by-side on desktop */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

                {/* Left Side: Title and Subtitle */}
                <div className="text-center lg:text-left self-start lg:self-center">
                    <h2 className="text-lg font-bold text-cyan-400">G-Code Tools</h2>
                    <p className="text-xs text-slate-400">Choose your G-code processing tool</p>
                </div>

                {/* Right Side: All controls (Buttons + User Menu). */}
                <div className="flex items-center gap-4 w-full lg:w-auto">

                    {/* Horizontally scrolling container for the buttons.
                      - `flex-1` allows it to take up available space.
                      - `overflow-x-auto` enables scrolling when content overflows.
                      - `scrollbar-hide` is a common utility to hide the scrollbar visually (requires a plugin, but is safe to include).
                    */}
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex items-center gap-2">
                            <Button
                                variant={currentApp === 'repeater' ? 'default' : 'outline'}
                                onClick={() => onAppChange('repeater')}
                                className="gap-2 font-medium px-4 py-2.5"
                            >
                                <Repeat className="w-4 h-4" />
                                Pattern Repeater
                            </Button>

                            <Button
                                variant={currentApp === 'converter' ? 'default' : 'outline'}
                                onClick={() => onAppChange('converter')}
                                className="gap-2 font-medium px-4 py-2.5"
                            >
                                <Settings className="w-4 h-4" />
                                Hexagonal Flat Converter
                            </Button>

                            <Button
                                variant={currentApp === 'twoAxis' ? 'default' : 'outline'}
                                onClick={() => onAppChange('twoAxis')}
                                className="gap-2 font-medium px-4 py-2.5"
                            >
                                <Move className="w-4 h-4" />
                                Two Axis Converter
                            </Button>
                        </div>
                    </div>

                    {/* User Menu */}
                    <UserMenu />
                </div>
            </div>
        </Card>
    );
};


// --- Main App Component to demonstrate the Navigation ---
export default function App() {
    const [currentApp, setCurrentApp] = useState('repeater');

    return (
        // Main container with a dark background to complement the theme.
        <div className="bg-slate-900 min-h-screen w-full font-sans">
            {/* Wrapper to control padding and max-width for the content. */}
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                <Navigation currentApp={currentApp} onAppChange={setCurrentApp} />
            </div>
        </div>
    );
}
