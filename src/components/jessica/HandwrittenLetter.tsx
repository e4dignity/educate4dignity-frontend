import React, { useState } from 'react';
import { FaBook, FaStar, FaHeart, FaLightbulb } from 'react-icons/fa';

const HandwrittenLetter: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortText = `My journey into this movement began in 2023, when I first spoke with girls my age in Bujumbura about menstruation—an act that felt both radical and necessary in a country where the topic is considered taboo.

What started as a simple conversation among peers has grown into a lasting commitment. I realized that when we combine engineering with empathy, we can restore dignity and create lasting change.`;

  const fullText = `My journey into this movement began in 2023, when I first spoke with girls my age in Bujumbura about menstruation—an act that felt both radical and necessary in a country where the topic is considered taboo.

What started as a simple conversation among peers has grown into a lasting commitment. I realized that when we combine engineering with empathy, we can restore dignity and create lasting change.

This year, with the support of a grant from Deerfield, I had the opportunity to deepen this commitment by leading a menstrual health education initiative in the village of Mugerere, nearly 300 miles from the capital city of Bujumbura.

There, I worked with 500 girls between the ages of 13 and 15, providing each with a kit of reusable pads designed to last up to five years. The joy—and in many cases, tears in their eyes reminded me that this is not just a cause I care about; it is the path for dignity and justice.

I used the opportunity to teach them how to make their own cost-effective, safe pads using basic, locally available materials. These moments have affirmed my belief that engineering, when grounded in empathy and local understanding, can be a powerful tool for equity.

As I continue my education, I carry with me the stories of girls like Nathalie Ndayishimiye who misses class each month, not because she lacks ambition, but because she lacks a pad.

At the core of this dream is a belief that biology should never determine destiny. Menstruation should not be a reason for exclusion, silence, or shame—it should be met with science, support, and solidarity.

The fight against period poverty is a fight for gender equity, public health, and human dignity. It is one I intend to pursue, not just in theory, but in practice.`;

  return (
    <div className="mb-16">
      {/* Titre de la lettre */}
      <div className="text-center mb-6 md:mb-8 px-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#5a4a47] mb-2">A Personal Letter from Jessica</h3>
        <p className="text-sm sm:text-base text-[#7a6a67] italic">What if one conversation could change everything?</p>
      </div>

      {/* Conteneur de la lettre manuscrite */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Papier à lignes */}
          <div className="bg-gradient-to-b from-white to-blue-50/30 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl border border-blue-200/50 overflow-hidden">
            
            {/* Trous de classeur */}
            <div className="absolute left-4 sm:left-6 md:left-8 top-6 md:top-8 bottom-6 md:bottom-8 w-1 flex flex-col justify-around">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300 border-2 border-white shadow-inner"></div>
              ))}
            </div>

            {/* Lignes du papier */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(25)].map((_, i) => (
                <div 
                  key={i} 
                  className="border-b border-blue-200" 
                  style={{ 
                    height: '28px',
                    marginTop: i === 0 ? '60px' : '0'
                  }}
                ></div>
              ))}
            </div>

            {/* Marge rouge */}
            <div className="absolute left-12 sm:left-16 md:left-20 top-0 bottom-0 w-px bg-red-300"></div>

            {/* Contenu de la lettre */}
            <div className="relative px-6 sm:px-12 md:px-24 py-8 md:py-12 pl-16 sm:pl-20 md:pl-28">
              
              {/* En-tête manuscrit */}
              <div className="mb-6 md:mb-8">
                <div className="text-right text-[#7a6a67] mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
                  <div className="text-sm sm:text-base md:text-lg">Bujumbura, Burundi</div>
                  <div className="text-sm sm:text-base md:text-lg">October 2024</div>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#5a4a47] mb-3 md:mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
                  Dear Friend,
                </div>
              </div>

              {/* Texte de la lettre */}
              <div 
                className="prose prose-lg max-w-none text-[#5a4a47] leading-relaxed"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                {isExpanded ? (
                  <div className="space-y-4 md:space-y-6">
                    {fullText.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-base sm:text-lg md:text-xl leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {shortText.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-base sm:text-lg md:text-xl leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Signature */}
              <div className="mt-8 md:mt-12 text-right">
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-[#f4a6a9] mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
                  With hope and determination,
                </div>
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-[#5a4a47] flex items-center justify-end" style={{ fontFamily: 'Caveat, cursive' }}>
                  Jessica Luiru <FaStar className="ml-1 sm:ml-2 text-[#f4a6a9] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
              </div>

              {/* Bouton Lire plus/moins */}
              <div className="text-center mt-6 md:mt-8">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 bg-[#f4a6a9] text-white font-semibold rounded-full hover:bg-[#e89396] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  style={{ fontFamily: 'inherit' }}
                >
                  {isExpanded ? (
                    <>
                      <FaBook className="mr-2 w-3 h-3 sm:w-4 sm:h-4" /> Read Less
                    </>
                  ) : (
                    <>
                      <FaBook className="mr-2 w-3 h-3 sm:w-4 sm:h-4" /> Read My Full Story
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Ombres et effets de papier */}
          <div className="absolute -bottom-2 -right-2 w-full h-full bg-gray-200 rounded-2xl -z-10"></div>
          <div className="absolute -bottom-1 -right-1 w-full h-full bg-gray-100 rounded-2xl -z-20"></div>

          {/* Post-it décoratifs - cachés sur très petits écrans */}
          <div className="hidden sm:block absolute -top-4 right-12 sm:right-20 bg-yellow-200 p-2 rounded transform rotate-12 shadow-md">
            <div className="text-xs font-handwriting text-gray-700 flex items-center" style={{ fontFamily: 'Caveat, cursive' }}>
              <FaLightbulb className="mr-1 text-yellow-600 w-3 h-3" /> Change starts here!
            </div>
          </div>

          <div className="hidden sm:block absolute bottom-16 sm:bottom-20 -left-4 sm:-left-6 bg-pink-200 p-2 rounded transform -rotate-6 shadow-md">
            <div className="text-xs font-handwriting text-gray-700 flex items-center" style={{ fontFamily: 'Caveat, cursive' }}>
              <FaHeart className="mr-1 text-pink-600 w-3 h-3" /> Every girl matters
            </div>
          </div>

        </div>
      </div>

      {/* Lien vers la police Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap" 
        rel="stylesheet" 
      />
    </div>
  );
};

export default HandwrittenLetter;