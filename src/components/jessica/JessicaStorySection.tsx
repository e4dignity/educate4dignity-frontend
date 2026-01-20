import React from 'react';
import FloatingTabletScreen from './FloatingPhoneScreen';
import LetterAndStoriesSection from './LetterAndStoriesSection';

const JessicaStorySection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Storytelling Personnel de Jessica */}
        <div className="mb-12 md:mb-16">
          {/* Introduction narrative */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5a4a47] mb-4 md:mb-6">
              From Taboo to Dignity
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-[#f4a6a9] mx-auto rounded-full mb-6 md:mb-8" />
            <div className="max-w-3xl mx-auto">
              <p className="text-base sm:text-lg text-[#7a6a67] leading-relaxed mb-4 md:mb-6">
                In the quiet hills of rural Burundi, a girl misses school. Not because she is ill or uninterested, 
                but because she is menstruating. This story changed everything for me.
              </p>
            </div>
          </div>

          {/* Vidéo Centrée */}
          <div className="flex justify-center mb-8 md:mb-12">
            <FloatingTabletScreen 
              videoSrc="/videos/video5985359414595426492.mp4"
              videoPoster="/photos/about/B13.jpg"
              className=""
            />
          </div>
        </div>

        {/* Lettre Manuscrite Interactive avec Stories */}
        <LetterAndStoriesSection />

        {/* Vision for the future */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#5a4a47] mb-6">My Vision for the Future</h3>
          <div className="bg-gradient-to-br from-[#f4a6a9] to-[#e8b4b8] text-white rounded-2xl p-8 lg:p-12">
            <p className="text-lg lg:text-xl leading-relaxed mb-6">
              As I continue my education, I remain committed to this cause. 
              <strong> Biology should never determine destiny.</strong> Menstruation should not be a reason 
              for exclusion, silence, or shame – it should be met with science, support, and solidarity.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default JessicaStorySection;