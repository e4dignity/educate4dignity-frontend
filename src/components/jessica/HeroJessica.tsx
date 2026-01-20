import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Globe, Loader, DollarSign, UserCheck } from 'lucide-react';
import { useFormattedJessicaData } from '../../hooks/useJessicaData';
import TypewriterHero from './TypewriterHero';

const HeroJessica: React.FC = () => {
  const { story, formatImpactMetrics, isLoading, error } = useFormattedJessicaData();

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fef7f0] via-[#f9f1f1] to-[#f4e6e6]" />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 text-[#f4a6a9] animate-spin" />
          <p className="text-[#7a6a67] text-lg">Loading Jessica's story...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fef7f0] via-[#f9f1f1] to-[#f4e6e6]" />
        <div className="relative z-10 text-center">
          <p className="text-[#f4a6a9] text-lg mb-4">Unable to load story data</p>
          <p className="text-[#7a6a67]">Using offline version...</p>
        </div>
      </section>
    );
  }

  const impactMetrics = formatImpactMetrics();
  const missionStatement = story?.missionStatement || 
    "What started as conversations with peers in Bujumbura became a movement. Today, I'm using science, empathy, and education to transform how we talk about menstruation in Africa.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fef7f0] via-[#f9f1f1] to-[#f4e6e6]" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left: Jessica's photo */}
          <div className="relative">
            <div className="relative">
              <img 
                src="/photos/about/B13.jpg" 
                alt="Jessica Luiru - Founder of Jessica Dignity Project" 
                className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
                style={{ aspectRatio: '3/4', objectFit: 'cover' }}
              />
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#f4a6a9] rounded-full opacity-20 blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#e8b4b8] rounded-full opacity-15 blur-2xl" />
            </div>
          </div>
          
          {/* Right: Personal introduction */}
          <div className="space-y-8">
            <div>
              <TypewriterHero className="mb-4" />
              <p className="text-xl text-[#7a6a67] leading-relaxed">
                {missionStatement}
              </p>
            </div>
            
            {/* Key stats - Métriques étendues selon Jessica */}
            {impactMetrics && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#f4a6a9] rounded-full mb-2 mx-auto">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#5a4a47]">{impactMetrics.girlsTrained.value}</div>
                  <div className="text-xs sm:text-sm text-[#7a6a67]">{impactMetrics.girlsTrained.label}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#e8b4b8] rounded-full mb-2 mx-auto">
                    <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#5a4a47]">{impactMetrics.kitsDistributed.value}</div>
                  <div className="text-xs sm:text-sm text-[#7a6a67]">{impactMetrics.kitsDistributed.label}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#f5e6d3] rounded-full mb-2 mx-auto">
                    <Globe className="w-4 h-4 sm:w-6 sm:h-6 text-[#5a4a47]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#5a4a47]">{impactMetrics.yearsImpact.value} Years</div>
                  <div className="text-xs sm:text-sm text-[#7a6a67]">Kit Lifespan</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#d4a5a8] rounded-full mb-2 mx-auto">
                    <UserCheck className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#5a4a47]">8</div>
                  <div className="text-xs sm:text-sm text-[#7a6a67]">Partenaires</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#c49ca0] rounded-full mb-2 mx-auto">
                    <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#5a4a47]">$5K</div>
                  <div className="text-xs sm:text-sm text-[#7a6a67]">Fundraising</div>
                </div>
              </div>
            )}
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/blog" 
                className="inline-flex items-center justify-center px-8 py-4 bg-[#f4a6a9] text-white font-semibold rounded-full hover:bg-[#e89396] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Read My Stories
              </Link>
              <Link 
                to="/gallery" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#f4a6a9] text-[#f4a6a9] font-semibold rounded-full hover:bg-[#f4a6a9] hover:text-white transition-all duration-200"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#f4a6a9] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#f4a6a9] rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroJessica;