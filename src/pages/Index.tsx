import React, { useState, FC } from 'react';
import  GcodePatternRepeater  from '@/components/GcodePatternRepeater';
import { GcodeCustomConverter } from '@/components/GcodeCustomConverter';
import GcodeTwoAxisConverter from '@/components/GcodeTwoAxisConverter';
import { Navigation }  from '@/components/Navigation';
import { AuthPage } from '@/components/auth/AuthPage';
import { useAuth } from '@/contexts/AuthContext';

// Define the possible app modes
type AppMode = 'repeater' | 'converter' | 'twoAxis';

const Index: FC = () => {
  const [currentApp, setCurrentApp] = useState<AppMode>('repeater');
  const { user } = useAuth();

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
