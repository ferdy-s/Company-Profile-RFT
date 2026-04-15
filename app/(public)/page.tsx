import { HomeSections } from '@/components/home-sections';
import { getPublishedPostSummaries } from '@/lib/blog-public';
import {
  getPublicAbout,
  getPublicBrandLogoUrl,
  getPublicPortfolio,
  getPublicServices,
  getPublicTrustedPartners,
} from '@/lib/public-content';

export default async function Home() {
  const [previewPosts, services, projects, about, trustedPartners, brandLogoUrl] = await Promise.all([
    getPublishedPostSummaries({ take: 6 }),
    getPublicServices(),
    getPublicPortfolio(),
    getPublicAbout(),
    getPublicTrustedPartners(),
    getPublicBrandLogoUrl(),
  ]);

  return (
    <HomeSections
      trustedPartners={trustedPartners}
      services={services}
      projects={projects}
      about={about}
      previewPosts={previewPosts}
      brandLogoUrl={brandLogoUrl}
    />
  );
}
