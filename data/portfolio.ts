/**
 * Typed gateway over the site content.
 *
 * The actual content lives in content/portfolio.yaml — edit THAT file to
 * update the site. It's parsed at build time (webpack yaml-loader) and
 * inlined into the bundle, so everything is loaded before the site is; no
 * runtime fetching. This module only narrows it to types and validates the
 * shape so a bad edit fails the build instead of rendering a broken page.
 */

import rawContent from '@/content/portfolio.yaml';

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'cloud' | 'blockchain';
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  achievements: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
}

export interface CommunityEvent {
  title: string;
  type: 'conference' | 'hackathon' | 'meetup' | 'talk';
  date: string;
  location?: string;
  description: string;
  link?: string;
  /** Photo shown in the horizontal slider — replace with real event photos */
  image: string;
}

export interface Seo {
  title: string;
  siteName: string;
  author: string;
  description: string;
  url: string;
  twitterHandle: string;
  keywords: string[];
}

interface PortfolioContent {
  seo: Seo;
  hero: { name: string };
  about: { bio: string; highlights: string[] };
  skillCategories: Record<Skill['category'], string>;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  eventTypeLabels: Record<CommunityEvent['type'], string>;
  communityEvents: CommunityEvent[];
  quote: { tagline: string; text: string; author: string };
  contact: {
    handle: string;
    email: string;
    links: { label: string; url: string; icon: string }[];
  };
}

/**
 * Build-time sanity check: every section must exist with the right rough
 * shape. Throwing here fails `next build` (and the dev overlay) immediately,
 * pointing at the YAML — instead of a half-rendered site.
 */
function validate(data: unknown): PortfolioContent {
  const c = data as Partial<PortfolioContent> | null;
  const missing: string[] = [];
  if (!c?.seo?.title || !c.seo.description || !c.seo.url)
    missing.push('seo.title / seo.description / seo.url');
  if (!c?.hero?.name) missing.push('hero.name');
  if (!c?.about?.bio || !Array.isArray(c.about.highlights))
    missing.push('about.bio / about.highlights');
  if (!c?.skillCategories) missing.push('skillCategories');
  if (!Array.isArray(c?.skills) || c.skills.length === 0)
    missing.push('skills');
  if (!Array.isArray(c?.projects) || c.projects.length === 0)
    missing.push('projects');
  if (!Array.isArray(c?.experiences) || c.experiences.length === 0)
    missing.push('experiences');
  if (!Array.isArray(c?.education) || c.education.length === 0)
    missing.push('education');
  if (!c?.eventTypeLabels) missing.push('eventTypeLabels');
  if (!Array.isArray(c?.communityEvents) || c.communityEvents.length === 0)
    missing.push('communityEvents');
  if (!c?.quote?.text) missing.push('quote.text');
  if (!c?.contact?.email || !Array.isArray(c.contact.links))
    missing.push('contact');

  const badSkill = c?.skills?.find(
    (s) => !s?.name || !(s.category in (c.skillCategories ?? {}))
  );
  if (badSkill) missing.push(`skills entry "${badSkill?.name}" (bad category)`);

  if (missing.length) {
    throw new Error(
      `content/portfolio.yaml is missing or malformed: ${missing.join(', ')}`
    );
  }
  return c as PortfolioContent;
}

const content = validate(rawContent);

export const seo = content.seo;
export const hero = content.hero;
export const about = content.about;
export const skills = content.skills;
export const skillCategories = content.skillCategories;
export const projects = content.projects;
export const experiences = content.experiences;
export const education = content.education;
export const communityEvents = content.communityEvents;
export const eventTypeLabels = content.eventTypeLabels;
export const quote = content.quote;
export const contact = content.contact;
