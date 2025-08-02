import React, { useState } from 'react';
import { GcodePatternRepeater } from '@/components/GcodePatternRepeater';
import { GcodeCustomConverter } from '@/components/GcodeCustomConverter';
import GcodeTwoAxisConverter from '@/components/GcodeTwoAxisConverter';
import { Navigation } from '@/components/Navigation';
import { Import } from 'lucide-react';

const Index = () => {
    const [currentApp, setCurrentApp] = useState<'repeater' | 'converter' | 'twoAxis'>('repeater');

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <Navigation currentApp={currentApp} onAppChange={setCurrentApp} />

                {currentApp === 'repeater' && <GcodePatternRepeater />}
                {currentApp === 'converter' && <GcodeCustomConverter />}
                {currentApp === 'twoAxis' && <GcodeTwoAxisConverter />}
            </div>
        </div>
    );
};

export default Index;
