import dynamic from 'next/dynamic';
import HeroSection from '@/components/organisms/HeroSection';

const MatrixRain = dynamic(() => import('@/components/organisms/MatrixRain'), {
  ssr: false,
  loading: () => null,
});

export default function LandingPage() {
  return (
    <div className="relative h-full w-full">
      <MatrixRain />

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.2) 100%)',
        }}
      />

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
