import dynamic from 'next/dynamic';
import HeroSection from '@/components/organisms/HeroSection';

// load NodeGraph (which uses the new useNodeGraph hook internally)
const NodeGraph = dynamic(() => import('@/components/organisms/NodeGraph'), {
  ssr: false,
  loading: () => null,
});

const MatrixRain = dynamic(() => import('@/components/organisms/MatrixRain'), {
  ssr: false,
  loading: () => null,
});

export default function LandingPage() {
  return (
    <div>
      <MatrixRain />

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <HeroSection
          name="Donald Jennings"
          summary="Software Engineer at Leonardo UK Ltd | MIET | BSc (Hons) Computer Science"
          photoUrl="/images/graduation-photo-inf-forum.jpg"
        />

        <div
          className="mt-8 animate-bounce text-green-400 text-3xl fade-slide-up"
          style={{ animationDelay: '0.5s' }}
        >
          ↓
        </div>
      </div>
    </div>
  );
}
