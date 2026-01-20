import React from 'react';
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter, FaYoutube, FaTiktok, FaPlay } from 'react-icons/fa';

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

interface FloatingTabletScreenProps {
  videoSrc: string;
  videoPoster?: string;
  className?: string;
}

const FloatingTabletScreen: React.FC<FloatingTabletScreenProps> = ({ 
  videoSrc, 
  videoPoster,
  className = ""
}) => {
  const socialLinks: SocialLink[] = [
    {
      platform: 'Instagram',
      url: 'https://instagram.com/jessica.luiru',
      icon: <FaInstagram />,
      color: 'bg-gradient-to-br from-purple-600 to-pink-500'
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/jessica-luiru',
      icon: <FaLinkedin />,
      color: 'bg-blue-600'
    },
    {
      platform: 'Facebook',
      url: 'https://facebook.com/jessica.luiru',
      icon: <FaFacebook />,
      color: 'bg-blue-700'
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/jessica_luiru',
      icon: <FaTwitter />,
      color: 'bg-blue-400'
    },
    {
      platform: 'TikTok',
      url: 'https://tiktok.com/@jessica.luiru',
      icon: <FaTiktok />,
      color: 'bg-black'
    },
    {
      platform: 'YouTube',
      url: 'https://youtube.com/@jessica.luiru',
      icon: <FaYoutube />,
      color: 'bg-red-600'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Conteneur Vidéo - Style Moderne */}
      <div className="relative mx-auto">
        {/* Conteneur Principal */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 w-full max-w-[520px] mx-auto">
          {/* Vidéo */}
          <div className="relative overflow-hidden rounded-xl aspect-video w-full max-w-[480px] min-w-[280px]">
            <video
              className="w-full h-full object-cover"
              poster={videoPoster}
              controls
              loop
              muted
              playsInline
            >
              <source src={videoSrc} type="video/mp4" />
              Votre navigateur ne supporte pas la vidéo.
            </video>
          </div>
          
          {/* Titre sous la vidéo - Plus discret */}
          <div className="mt-3 sm:mt-4 text-center">
            <h4 className="font-semibold text-[#5a4a47] text-sm sm:text-base mb-1">Behind the Scenes</h4>
            <p className="text-[#7a6a67] italic text-xs sm:text-sm">Real stories from the field</p>
          </div>
        </div>
        
        {/* Stickers multiples créatifs */}
        <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-8 h-6 sm:w-10 sm:h-7 bg-gradient-to-br from-amber-200 to-amber-300 opacity-60 transform rotate-12 rounded-md shadow-md"></div>
        <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-pink-200 to-pink-300 opacity-50 transform -rotate-12 rounded-full shadow-sm"></div>
        
        {/* Badge play subtil */}
        <div className="absolute top-6 sm:top-8 right-6 sm:right-8 bg-black/20 text-white text-xs font-medium px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm flex items-center">
          <FaPlay className="mr-1 text-xs" /> Play
        </div>
      </div>

      {/* Réseaux Sociaux Discrets */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-[#7a6a67] text-xs mb-2 sm:mb-3 opacity-75">
          Follow Jessica's journey
        </p>
        
        {/* Ligne horizontale discrète des réseaux */}
        <div className="flex justify-center items-center space-x-3 sm:space-x-4">
          {socialLinks.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-60 hover:opacity-100"
              title={`Follow Jessica on ${social.platform}`}
            >
              <span className="text-xs sm:text-sm">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingTabletScreen;