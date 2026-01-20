import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Camera, RefreshCw } from 'lucide-react';
import JessicaNav from '../components/jessica/JessicaNav';
import JessicaFooter from '../components/jessica/JessicaFooter';
import JessicaChatAssistant from '../components/jessica/JessicaChatAssistant';
import { usePublicGallery } from '../hooks/useGallery';

interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: 'education' | 'distribution' | 'impact' | 'community';
  location?: string;
  date?: string;
}

// Featured Photo Component - Changes automatically
const FeaturedPhoto: React.FC<{
  photos: GalleryPhoto[];
  onPhotoClick: (photo: GalleryPhoto) => void;
}> = ({ photos, onPhotoClick }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [photos.length]);

  const currentPhoto = photos[currentPhotoIndex];

  if (!currentPhoto) return null;

  return (
    <div className="relative mb-8">
      <div 
        className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-2xl"
        onClick={() => onPhotoClick(currentPhoto)}
      >
        <img 
          src={currentPhoto.src} 
          alt={currentPhoto.alt}
          className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-[#f4a6a9]" />
              <span className="text-[#f4a6a9] font-semibold text-sm uppercase tracking-wide">Featured Story</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">{currentPhoto.caption}</h3>
            {currentPhoto.location && (
              <p className="text-lg opacity-90 flex items-center gap-2">
                <span>{currentPhoto.location}</span>
                {currentPhoto.date && (
                  <>
                    <span>•</span>
                    <span>{currentPhoto.date}</span>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
        
        {/* Photo counter indicator */}
        <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
          <span className="text-white text-sm font-medium">
            {currentPhotoIndex + 1} / {photos.length}
          </span>
        </div>
        
        {/* Category badge */}
        <div className="absolute top-6 left-6">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            currentPhoto.category === 'education' ? 'bg-blue-500 text-white' :
            currentPhoto.category === 'distribution' ? 'bg-green-500 text-white' :
            currentPhoto.category === 'impact' ? 'bg-purple-500 text-white' :
            'bg-orange-500 text-white'
          }`}>
            {currentPhoto.category.charAt(0).toUpperCase() + currentPhoto.category.slice(1)}
          </span>
        </div>
        
        {/* Auto-rotation indicator dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPhotoIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentPhotoIndex 
                  ? 'bg-[#f4a6a9] w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const JessicaGalleryPage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAutoplay, setIsAutoplay] = useState(false);

  // Fetch public gallery images from backend (Cloudinary sources)
  const { images, loading, error, isFallback, reload } = usePublicGallery();

  // Transform API images -> GalleryPhoto shape expected by UI
  const galleryPhotos: GalleryPhoto[] = useMemo(() => {
    return images.map(img => ({
      id: img.id,
      src: img.url, // Cloudinary URL
      alt: img.title || img.description || 'Gallery image',
      caption: img.title || img.description || 'Untitled',
      category: (img.category as GalleryPhoto['category']) || 'education',
      // location & date could be future metadata fields; left undefined for now
    }));
  }, [images]);

  const categories = useMemo(() => ([
    { id: 'all', label: 'All Photos', count: galleryPhotos.length },
    { id: 'education', label: 'Education Sessions', count: galleryPhotos.filter(p => p.category === 'education').length },
    { id: 'distribution', label: 'Kit Distribution', count: galleryPhotos.filter(p => p.category === 'distribution').length },
    { id: 'impact', label: 'Impact Stories', count: galleryPhotos.filter(p => p.category === 'impact').length },
    { id: 'community', label: 'Community', count: galleryPhotos.filter(p => p.category === 'community').length }
  ]), [galleryPhotos]);

  const filteredPhotos = selectedCategory === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter(photo => photo.category === selectedCategory);

  const openLightbox = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = '';
    setIsAutoplay(false);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return;
    
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    let nextIndex;
    
    if (direction === 'prev') {
      nextIndex = currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex === filteredPhotos.length - 1 ? 0 : currentIndex + 1;
    }
    
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  // Auto-advance slideshow
  React.useEffect(() => {
    if (!isAutoplay || !selectedPhoto) return;
    
    const interval = setInterval(() => {
      navigatePhoto('next');
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoplay, selectedPhoto]);

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <JessicaNav />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#fef7f0] to-[#f9f1f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#5a4a47] mb-6">
            Real Stories, Real Impact
          </h1>
          <p className="text-xl text-[#7a6a67] max-w-3xl mx-auto mb-8">
            Every photo tells a story of dignity restored, confidence rebuilt, and futures secured. 
            See the authentic moments behind my mission to transform menstrual health education in Africa.
          </p>
          <div className="w-24 h-1 bg-[#f4a6a9] mx-auto rounded-full" />
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-[#f4a6a9]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#f4a6a9] text-white shadow-lg'
                    : 'bg-gray-100 text-[#7a6a67] hover:bg-[#f4a6a9]/10 hover:text-[#f4a6a9]'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
            <button
              onClick={reload}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-gray-100 text-[#7a6a67] hover:bg-[#f4a6a9]/10 hover:text-[#f4a6a9] transition-colors"
              title="Reload gallery"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            {loading && (
              <span className="flex items-center gap-2 text-sm text-[#7a6a67] animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading images…
              </span>
            )}
            {!loading && galleryPhotos.length === 0 && (
              <span className="text-sm text-[#7a6a67]">No images yet</span>
            )}
          </div>
          {isFallback && !loading && (
            <div className="mt-4 text-center text-[#7a6a67] text-sm">
              Showing demo gallery while the server wakes up. You can try Refresh in a moment.
            </div>
          )}
        </div>
      </section>

      {/* Creative Gallery Layout - Variable sizes and dynamic main photo */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && images.length === 0 && (
            <div className="text-center text-red-600 mb-8">
              {error === 'NOT_FOUND' ? '404 — Gallery not found' : 'Gallery is temporarily unavailable. Please try again later.'}
            </div>
          )}
          {filteredPhotos.length > 0 && !loading && (
            <div className="space-y-4">
              {/* Featured Photo - Changes every 6 seconds */}
              <FeaturedPhoto 
                photos={filteredPhotos} 
                onPhotoClick={openLightbox}
              />
              
              {/* Dynamic Masonry Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 auto-rows-max">
                {filteredPhotos.slice(1).map((photo, index) => {
                  // Create varied layouts
                  const isLarge = index % 7 === 0; // Every 7th photo is large
                  const isTall = index % 5 === 0 && index % 7 !== 0; // Every 5th (but not 7th) is tall
                  const isWide = index % 9 === 0 && index % 7 !== 0; // Every 9th (but not 7th) is wide
                  
                  let containerClass = "group cursor-pointer relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1";
                  let imageClass = "w-full object-cover transition-transform duration-300 group-hover:scale-105";
                  
                  if (isLarge) {
                    containerClass += " col-span-2 row-span-2";
                    imageClass += " h-80";
                  } else if (isTall) {
                    containerClass += " row-span-2";
                    imageClass += " h-60";
                  } else if (isWide) {
                    containerClass += " col-span-2";
                    imageClass += " h-32";
                  } else {
                    imageClass += " h-32";
                  }
                  
                  return (
                    <div 
                      key={photo.id}
                      className={containerClass}
                      onClick={() => openLightbox(photo)}
                    >
                      <img 
                        src={photo.src} 
                        alt={photo.alt}
                        className={imageClass}
                        loading={index < 12 ? 'eager' : 'lazy'}
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <p className="font-medium text-xs mb-1 line-clamp-2">{photo.caption}</p>
                          {photo.location && (
                            <p className="text-xs opacity-90">{photo.location}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Category badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          photo.category === 'education' ? 'bg-blue-500/90 text-white' :
                          photo.category === 'distribution' ? 'bg-green-500/90 text-white' :
                          photo.category === 'impact' ? 'bg-purple-500/90 text-white' :
                          'bg-orange-500/90 text-white'
                        }`}>
                          {photo.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!loading && filteredPhotos.length === 0 && !error && (
            <div className="text-center text-[#7a6a67] py-24">
              <p className="text-xl font-medium mb-4">No gallery images published yet.</p>
              <p className="max-w-md mx-auto">As soon as administrators upload photos in the dashboard and mark them public, they will appear here automatically.</p>
            </div>
          )}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200/60 animate-pulse rounded-lg" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal - Professional photo viewer */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white hover:text-[#f4a6a9] transition-colors"
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Controls */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="p-2 text-white hover:text-[#f4a6a9] transition-colors"
              aria-label={isAutoplay ? 'Pause slideshow' : 'Start slideshow'}
            >
              {isAutoplay ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <span className="text-white text-sm">
              {filteredPhotos.findIndex(p => p.id === selectedPhoto.id) + 1} / {filteredPhotos.length}
            </span>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => navigatePhoto('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-[#f4a6a9] transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => navigatePhoto('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-[#f4a6a9] transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Photo */}
          <div className="max-w-4xl max-h-full flex flex-col">
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            
            {/* Photo info */}
            <div className="mt-4 text-white text-center">
              <h3 className="text-lg font-semibold mb-2">{selectedPhoto.caption}</h3>
              {selectedPhoto.location && (
                <p className="text-sm opacity-90">
                  {selectedPhoto.location} • {selectedPhoto.date}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-[#5a4a47] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Be Part of This Story
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Every photo represents a life changed, a barrier broken, and dignity restored. 
            Your support helps me reach more girls and transform more communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/support" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#f4a6a9] text-white font-semibold rounded-full hover:bg-[#e89396] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Support My Work
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#5a4a47] transition-all duration-200"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <JessicaFooter />

      {/* Chat Assistant - WhatsApp support intégré */}
      <JessicaChatAssistant />
    </div>
  );
};

export default JessicaGalleryPage;