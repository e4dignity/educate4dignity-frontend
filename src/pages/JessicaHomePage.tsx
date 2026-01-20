import React from 'react';
import HeroJessica from '../components/jessica/HeroJessica';
import JessicaStorySection from '../components/jessica/JessicaStorySection';
import JessicaNav from '../components/jessica/JessicaNav';
import JessicaFooter from '../components/jessica/JessicaFooter';
import JessicaInterventionMap from '../components/jessica/JessicaInterventionMap';
import JessicaChatAssistant from '../components/jessica/JessicaChatAssistant';
import { FaCamera, FaArrowRight } from 'react-icons/fa';



const JessicaHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <JessicaNav />
      <HeroJessica />
      <JessicaStorySection />
      
      {/* Dynamic Adventure Album */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[#fef7f0] to-[#f9f1f1] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5a4a47] mb-4">
              My Journey in Pictures
            </h2>
            <p className="text-base sm:text-lg text-[#7a6a67] max-w-2xl mx-auto mb-6 sm:mb-8">
              From first conversations to life-changing moments - experience my adventure 
              breaking menstrual health taboos across Burundi.
            </p>
          </div>

          <div className="relative">
            {/* Main Featured Photo */}
            <div className="mb-8 relative group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <img 
                  src="/photos/about/B13.jpg"
                  alt="Jessica with students during education session"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    "The moment everything changed"
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg drop-shadow">
                    My first education session in Bujumbura - 18 girls who had never spoken about menstruation openly
                  </p>
                </div>
              </div>
            </div>

            {/* Album Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  src: '/photos/Others/Luiru1.jpg',
                  title: 'Kit Distribution Day',
                  story: 'Handing out hope, one kit at a time',
                  rotation: 'rotate-1'
                },
                {
                  src: '/photos/Others/luiru5.jpg',
                  title: 'Local Seamstresses',
                  story: 'Building sustainability with local hands',
                  rotation: '-rotate-2'
                },
                {
                  src: '/photos/Others/B10.jpg',
                  title: 'Confidence Blooms',
                  story: 'Seeing girls light up with knowledge',
                  rotation: 'rotate-1'
                }
              ].map((moment, index) => (
                <div 
                  key={index} 
                  className={`relative group cursor-pointer ${moment.rotation} hover:rotate-0 transition-all duration-500 hover:scale-105`}
                >
                  <div className="bg-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <img 
                      src={moment.src}
                      alt={moment.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                    <h4 className="font-bold text-[#5a4a47] mb-2">{moment.title}</h4>
                    <p className="text-sm text-[#7a6a67] italic">"{moment.story}"</p>
                  </div>
                  
                  {/* Polaroid-style tape */}
                  <div className="absolute -top-2 -right-2 w-8 h-6 bg-gradient-to-br from-amber-200 to-amber-300 opacity-70 transform rotate-45 rounded-sm shadow-sm" />
                </div>
              ))}
            </div>

            {/* Animated CTA */}
            <div className="text-center">
              <a 
                href="/gallery" 
                className="inline-flex items-center justify-center px-10 py-5 bg-[#f4a6a9] text-white font-bold rounded-full hover:bg-[#e89396] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaCamera className="mr-2" />
                Explore My Full Adventure Album
                <FaArrowRight className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intervention Map - Zone d'Afrique centrale */}
      <JessicaInterventionMap />

      {/* Final CTA */}
      <section className="py-20 bg-[#5a4a47] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join My Mission
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Together, we can ensure that biology never determines destiny. 
            Every girl deserves the chance to learn, grow, and lead with dignity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/support" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#f4a6a9] text-white font-semibold rounded-full hover:bg-[#e89396] transition-all duration-200 shadow-lg hover:shadow-xl"
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
      
      {/* Chat Assistant */}
      <JessicaChatAssistant />
    </div>
  );
};

export default JessicaHomePage;