import { getContentStore } from '@/lib/admin/contentStore';
import AboutPageClient from '@/components/pages/AboutPageClient';

export default function AboutPage() {
  const store = getContentStore();

  return (
    <AboutPageClient
      profile={store.profile}
      experience={store.experience}
      education={store.education}
      publications={store.publications}
      skillCategories={store.skillCategories}
      certifications={store.certifications}
      awards={store.awards}
      interests={store.interests}
      highlights={store.highlights}
    />
  );
}
