import React from 'react';
import HandwrittenLetter from './HandwrittenLetter';
import RecentStoriesSection from './RecentStoriesSection';

const LetterAndStoriesSection: React.FC = () => {
  return (
    <div className="mb-8 sm:mb-12 md:mb-16 relative px-4 sm:px-0">
      {/* Section combinée : Lettre + Stories */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 xl:gap-12 items-start">
        
        {/* Lettre Manuscrite - Prend 2/3 de l'espace sur desktop */}
        <div className="lg:col-span-2 order-1">
          <HandwrittenLetter />
        </div>
        
        {/* Stories Récentes - Prend 1/3 de l'espace à droite sur desktop, en dessous sur mobile */}
        <div className="lg:col-span-1 order-2 lg:order-2">
          {/* Sticky positioning seulement sur les grands écrans */}
          <div className="lg:sticky lg:top-8">
            <RecentStoriesSection />
          </div>
        </div>
      </div>

      {/* Note décorative pour lier les deux sections - seulement sur desktop */}
      <div className="hidden xl:block absolute -right-4 top-1/3 transform -translate-y-1/2 z-10">
        <div className="bg-pink-200 p-2 rounded transform rotate-12 shadow-md border border-pink-300">
          <div className="text-xs text-gray-700 whitespace-nowrap" style={{ fontFamily: 'Caveat, cursive' }}>
            📖 My latest stories
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterAndStoriesSection;