import { getContentStore } from '@/lib/admin/contentStore';
import HomeClient from './HomeClient';

export default function Home() {
  const store = getContentStore();

  // Set this to true when you're open for opportunities
  const isOpenForOpportunities = false; // Change to true when job searching

  return (
    <HomeClient
      experience={store.experience}
      education={store.education}
      publications={store.publications}
      isOpenForOpportunities={isOpenForOpportunities}
    />
  );
}
