import { getContentStore } from '@/lib/admin/contentStore';
import HomeClient from './HomeClient';

export default function Home() {
  const store = getContentStore();
  const isOpenForOpportunities = false;

  return (
    <HomeClient
      experience={store.experience}
      education={store.education}
      publications={store.publications}
      profile={store.profile}
      highlights={store.highlights}
      skillCategories={store.skillCategories}
      certifications={store.certifications}
      awards={store.awards}
      interests={store.interests}
      isOpenForOpportunities={isOpenForOpportunities}
    />
  );
}
