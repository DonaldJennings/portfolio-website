import React from 'react';
import HeroTitle from '@/components/atoms/HeroTitle';
import HeroSignature from '@/components/atoms/HeroSignature';

type HeroSummaryProps = {
  title: string;
  signature: string;
};

function HeroSummary({ title, signature }: HeroSummaryProps) {
  return (
    <section>
      <HeroTitle>{title}</HeroTitle>
      <HeroSignature paragraph={signature} />
    </section>
  );
}

export default HeroSummary;
