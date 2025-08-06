import React, { useState, FC } from 'react';
import GcodePatternRepeater from '@/components/GcodePatternRepeater';
import { GcodeCustomConverter } from '@/components/GcodeCustomConverter';
import GcodeTwoAxisConverter from '@/components/GcodeTwoAxisConverter';
import {Navigation} from '@/components/Navigation';
import { AuthPage } from '@/components/auth/AuthPage';
import { useAuth } from '@/contexts/AuthContext';

// Define the possible app modes
type AppMode = 'repeater' | 'converter' | 'twoAxis';

const Index: FC = () => {
    const [currentApp, setCurrentApp] = useState<AppMode>('repeater');
    const { user } = useAuth();

    // --- Authentication Guard ---
    // If there is no user, render the authentication page instead of the main app.
    // This prevents showing a partially empty UI.
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <div className="container mx-auto px-4 py-8">
                    <AuthPage />
                </div>
            </div>
        );
    }

    // --- Authenticated View ---
    // This part will only be rendered if the user object exists.
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <Navigation currentApp={currentApp} onAppChange={setCurrentApp} />

                {/*
          Using a switch statement can be slightly more readable and performant 
          than multiple '&&' checks, especially if more apps are added later.
        */}
                {(() => {
                    switch (currentApp) {
                        case 'repeater':
                            return <GcodePatternRepeater />;
                        case 'converter':
                            return <GcodeCustomConverter />;
                        case 'twoAxis':
                            return <GcodeTwoAxisConverter />;
                        default:
                            return null; // Or a default/fallback component
                    }
                })()}
            </div>
        </div>
    );
};

export default Index;