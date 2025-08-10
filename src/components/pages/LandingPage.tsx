import HeroSection from '@/components/organisms/HeroSection';

export default function LandingPage() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 z-10 pointer-events-none" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <HeroSection
          name="Donald Jennings"
          summary="Software Engineer at Leonardo UK Ltd | MIET | BSc (Hons) Computer Science"
          photoUrl="/images/graduation-photo-inf-forum.jpg"
        />

        <div
          className="mt-8 animate-bounce text-green-400 text-3xl fade-slide-up cursor-pointer pointer-events-auto"
          style={{ animationDelay: '0.5s' }}
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
        >
          ↓
        </div>
      </div>
    </div>
  );
}
