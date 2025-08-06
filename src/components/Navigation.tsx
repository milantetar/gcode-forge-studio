import React, { useState } from 'react';
import { Repeat, Settings, Move, User } from 'lucide-react';

// --- Themed Placeholder Components ---
// These are stand-ins for your UI components, now styled to match the dark theme.
// The Tailwind classes are the key part of the theming.

const Card = ({ className, children }) => (
    // Card with a dark background, subtle border, and rounded corners.
    <div className={`bg-slate-800/50 border border-cyan-400/20 rounded-xl shadow-lg shadow-black/20 ${className}`}>
        {children}
    </div>
);

const Button = ({ variant, className, children, onClick }) => {
    // Base classes for all buttons
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none";

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
    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300 transition-all duration-200 shadow-md shadow-cyan-500/20">
        <User className="w-5 h-5" />
    </button>
);

// --- Responsive Navigation Component (Themed) ---
// The component logic is the same, but the classes are updated for the new theme.

const Navigation = ({ currentApp, onAppChange }) => {
    return (
        <Card className="p-4 md:p-6 mb-8 w-full">
            {/* Main container for the navbar. */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">

                {/* Left Side: Title and Subtitle */}
                <div className="text-center lg:text-left">
                    <h2 className="text-xl font-bold text-cyan-400 mb-1">G-Code Tools</h2>
                    <p className="text-sm text-slate-400">Choose your G-code processing tool</p>
                </div>

                {/* Right Side: All controls (Buttons + User Menu). */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">

                    {/* Button Group for tool selection. */}
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

                    {/* User Menu */}
                    <div className="self-center sm:self-auto">
                        <UserMenu />
                    </div>
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
            <div className="container mx-auto p-4 md:p-8">
                <Navigation currentApp={currentApp} onAppChange={setCurrentApp} />

                {/* Your page content for the selected tool will go here */}
            </div>
        </div>
    );
}
