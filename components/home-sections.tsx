'use client';

import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/hero-section';
import type { BlogPostCardData } from '@/components/blog-post-card';
import type { ServiceItem, PortfolioItem, TrustedPartnerItem } from '@/lib/marketing-data';
import type { AboutPublic } from '@/lib/public-content';

const TrustedBySection = dynamic(
  () => import('@/components/trusted-by-section').then((m) => m.TrustedBySection),
  { loading: () => <div className="py-16" /> }
);

const ServicesSection = dynamic(
  () => import('@/components/services-section').then((m) => m.ServicesSection),
  { loading: () => <div className="py-24" /> }
);

const ProjectsSection = dynamic(
  () => import('@/components/projects-section').then((m) => m.ProjectsSection),
  { loading: () => <div className="py-24" /> }
);

const AboutSection = dynamic(
  () => import('@/components/about-section').then((m) => m.AboutSection),
  { loading: () => <div className="py-24" /> }
);

const BlogPreviewSection = dynamic(
  () => import('@/components/blog-preview-section').then((m) => m.BlogPreviewSection),
  { loading: () => <div className="py-24" /> }
);

export function HomeSections({
  trustedPartners,
  services,
  projects,
  about,
  previewPosts,
  brandLogoUrl,
}: {
  trustedPartners: TrustedPartnerItem[];
  services: ServiceItem[];
  projects: PortfolioItem[];
  about: AboutPublic;
  previewPosts: BlogPostCardData[];
  brandLogoUrl: string;
}) {
  return (
    <>
      <HeroSection brandLogoUrl={brandLogoUrl} />
      <TrustedBySection partners={trustedPartners} />
      <ServicesSection services={services} />
      <ProjectsSection projects={projects} />
      <AboutSection about={about} />
      <BlogPreviewSection posts={previewPosts} />
    </>
  );
}

