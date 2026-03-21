import { getContentStore } from '@/lib/admin/contentStore';
import HomeClient from './HomeClient';

export default function Home() {
  const store = getContentStore();

  return (
    <HomeClient
      profile={store.profile}
      landing={store.landing}
    />
  );
}
