import React from 'react';

interface HeroSignatureProps {
  paragraph: string;
}

function HeroSignature({ paragraph }: HeroSignatureProps) {
  return (
    <div
      className="
                font-pacifico
                text-2xl
                text-gray-900
                tracking-wide
                text-center
                mt-8
                select-none
                max-w-xl
                mx-auto
            "
    >
      {paragraph}
    </div>
  );
}

export default HeroSignature;
