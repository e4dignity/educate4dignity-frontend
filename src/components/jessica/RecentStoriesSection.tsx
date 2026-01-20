import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaClock, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';
import { useJessicaStory } from '../../hooks/useJessicaData';

const RecentStoriesSection: React.FC = () => {
  const { story, isLoading } = useJessicaStory();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const recentStories = story?.recentStories || [];
  
  // Stories de fallback cohérentes avec la page blog
  const fallbackStories = [
    {
      id: 'why-dignity-engineering-matters',
      slug: 'why-dignity-engineering-matters',
      title: 'Why dignity engineering matters in MHM',
      excerpt: 'Exploring innovative approaches to bring digital literacy to underserved populations through menstrual health management.',
      publishedAt: '2024-12-10',
      readTime: '7 min read',
      category: 'insights',
      jessicaPerspective: 'A story from my direct field experience'
    },
    {
      id: 'coops-women-led-production',
      slug: 'coops-women-led-production',
      title: 'Co-ops at the center: women-led production',
      excerpt: 'How local women cooperatives are transforming menstrual health kit production in rural Burundi.',
      publishedAt: '2024-12-05',
      readTime: '10 min read',
      category: 'research',
      jessicaPerspective: 'Lessons learned through personal engagement'
    },
    {
      id: 'training-day-mhm-basics',
      slug: 'training-day-mhm-basics',
      title: 'Training day: MHM basics that stick',
      excerpt: 'Breaking taboos through education: how we make menstrual health conversations approachable and lasting.',
      publishedAt: '2024-11-28',
      readTime: '8 min read',
      category: 'insights',
      jessicaPerspective: 'Real conversations that changed everything'
    }
  ];

  // Limiter à maximum 3 stories
  const displayStories = (recentStories.length > 0 ? recentStories : fallbackStories).slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleStoryClick = (slug: string) => {
    // Navigation vers la page individuelle de la story
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="space-y-6">
      {/* Titre avec style manuscrit - aligné avec la lettre */}
      <div className="text-center mb-6 md:mb-8 relative px-4">
        {/* Petit papier sticky note style pour le titre */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-3 sm:p-4 border border-yellow-300/50 shadow-md transform rotate-1 relative max-w-xs sm:max-w-none mx-auto">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#5a4a47] mb-1" style={{ fontFamily: 'Caveat, cursive' }}>
            Recent Stories from My Journey
          </h3>
          <p className="text-[#7a6a67] italic text-xs sm:text-sm" style={{ fontFamily: 'Caveat, cursive' }}>
            Latest updates from the field
          </p>
          {/* Petite punaise décorative */}
          <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-red-400 rounded-full shadow-sm border-2 border-white"></div>
        </div>
      </div>

      {/* Stories Cards */}
      <div className="space-y-4">
        {displayStories.map((story) => (
          <div
            key={story.id}
            onClick={() => handleStoryClick(story.slug)}
            className="block group cursor-pointer"
          >
            <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-lg md:rounded-xl border border-blue-200/50 p-3 sm:p-4 hover:shadow-lg transition-all duration-300 hover:border-[#f4a6a9]/50 transform hover:-translate-y-1 relative">
              
              {/* Story Header */}
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f4a6a9]"></div>
                  <span className="text-xs font-medium text-[#f4a6a9] uppercase tracking-wide">
                    {story.category || 'Field Story'}
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-[#7a6a67]">
                  <FaClock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="text-xs">{story.readTime}</span>
                </div>
              </div>

              {/* Story Title */}
              <h4 className="text-base sm:text-lg font-bold text-[#5a4a47] mb-2 group-hover:text-[#f4a6a9] transition-colors line-clamp-2" 
                  style={{ fontFamily: 'Caveat, cursive' }}>
                {story.title}
              </h4>

              {/* Story Excerpt */}
              <p className="text-xs sm:text-sm text-[#7a6a67] mb-3 line-clamp-2 leading-relaxed">
                {story.excerpt}
              </p>

              {/* Jessica's Perspective avec quote */}
              {story.jessicaPerspective && (
                <div className="bg-[#f4a6a9]/5 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 border-l-2 sm:border-l-3 border-[#f4a6a9]">
                  <div className="flex items-start space-x-1 sm:space-x-2">
                    <FaQuoteLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#f4a6a9] mt-0.5 sm:mt-1 flex-shrink-0" />
                    <p className="text-xs italic text-[#7a6a67] leading-relaxed" style={{ fontFamily: 'Caveat, cursive' }}>
                      {story.jessicaPerspective}
                    </p>
                  </div>
                </div>
              )}

              {/* Story Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7a6a67]" style={{ fontFamily: 'Caveat, cursive' }}>
                  {formatDate(story.publishedAt)}
                </span>
                <div className="flex items-center space-x-1 text-[#f4a6a9] group-hover:text-[#e89396] transition-colors">
                  <span className="text-xs font-medium">Read</span>
                  <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Decorative elements pour chaque carte - cachés sur très petits écrans */}
              <div className="hidden sm:block absolute -top-1 -right-1 w-3 h-3 bg-yellow-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Link to all stories */}
      <div className="text-center pt-4">
        <Link
          to="/blog"
          className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#f4a6a9] to-[#e8b4b8] text-white font-semibold rounded-full hover:from-[#e89396] hover:to-[#d4a5a8] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          style={{ fontFamily: 'Caveat, cursive' }}
        >
          <FaBook className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
          Read All My Stories
        </Link>
      </div>

      {/* Lien vers la police Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap" 
        rel="stylesheet" 
      />
    </div>
  );
};

export default RecentStoriesSection;