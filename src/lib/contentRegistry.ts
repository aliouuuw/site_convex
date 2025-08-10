export type EditableItemType = 'text' | 'image' | 'imageSlider' | 'richText';

export interface EditableItem {
  id: string;
  type: EditableItemType;
  label: string;
  section: string;
  page: string;
}

export type ContentRegistry = Record<string, Record<string, EditableItem[]>>;

export const contentRegistry: ContentRegistry = {
  home: {
    hero: [
      { id: 'hero.background', type: 'imageSlider', label: 'Background Images', section: 'hero', page: 'home' },
      { id: 'hero.badge', type: 'text', label: 'Badge', section: 'hero', page: 'home' },
      { id: 'hero.title', type: 'text', label: 'Title', section: 'hero', page: 'home' },
      { id: 'hero.description', type: 'text', label: 'Description', section: 'hero', page: 'home' },
      { id: 'hero.stats.students', type: 'text', label: 'Students Count', section: 'hero', page: 'home' },
      { id: 'hero.stats.students.label', type: 'text', label: 'Students Label', section: 'hero', page: 'home' },
      { id: 'hero.stats.success', type: 'text', label: 'Success Rate', section: 'hero', page: 'home' },
      { id: 'hero.stats.success.label', type: 'text', label: 'Success Label', section: 'hero', page: 'home' },
      { id: 'hero.stats.years', type: 'text', label: 'Years', section: 'hero', page: 'home' },
      { id: 'hero.stats.years.label', type: 'text', label: 'Years Label', section: 'hero', page: 'home' },
    ],
    programs: [
      { id: 'programs.title', type: 'text', label: 'Section Title', section: 'programs', page: 'home' },
      { id: 'programs.description', type: 'text', label: 'Section Description', section: 'programs', page: 'home' },
      { id: 'programs.préscolaire.image', type: 'image', label: 'Préscolaire Image', section: 'programs', page: 'home' },
      { id: 'programs.primaire.image', type: 'image', label: 'Primaire Image', section: 'programs', page: 'home' },
      { id: 'programs.collège.image', type: 'image', label: 'Collège Image', section: 'programs', page: 'home' },
    ],
    mission: [
      { id: 'mission.title', type: 'text', label: 'Title', section: 'mission', page: 'home' },
      { id: 'mission.description', type: 'text', label: 'Description', section: 'mission', page: 'home' },
      { id: 'mission.main', type: 'richText', label: 'Main Text', section: 'mission', page: 'home' },
      { id: 'mission.secondary', type: 'richText', label: 'Secondary Text', section: 'mission', page: 'home' },
      { id: 'mission.image', type: 'image', label: 'Mission Image', section: 'mission', page: 'home' },
    ],
    news: [
      { id: 'news.title', type: 'text', label: 'News Title', section: 'news', page: 'home' },
      { id: 'news.description', type: 'text', label: 'News Description', section: 'news', page: 'home' },
      { id: 'news.featured.image', type: 'image', label: 'Featured Image', section: 'news', page: 'home' },
    ],
    cta: [
      { id: 'cta.title', type: 'text', label: 'CTA Title', section: 'cta', page: 'home' },
      { id: 'cta.description', type: 'text', label: 'CTA Description', section: 'cta', page: 'home' },
      { id: 'cta.card1.title', type: 'text', label: 'Card 1 Title', section: 'cta', page: 'home' },
      { id: 'cta.card1.description', type: 'text', label: 'Card 1 Description', section: 'cta', page: 'home' },
      { id: 'cta.card1.button', type: 'text', label: 'Card 1 Button', section: 'cta', page: 'home' },
      { id: 'cta.card2.title', type: 'text', label: 'Card 2 Title', section: 'cta', page: 'home' },
      { id: 'cta.card2.description', type: 'text', label: 'Card 2 Description', section: 'cta', page: 'home' },
      { id: 'cta.card2.button', type: 'text', label: 'Card 2 Button', section: 'cta', page: 'home' },
      { id: 'cta.card3.title', type: 'text', label: 'Card 3 Title', section: 'cta', page: 'home' },
      { id: 'cta.card3.description', type: 'text', label: 'Card 3 Description', section: 'cta', page: 'home' },
      { id: 'cta.card3.button', type: 'text', label: 'Card 3 Button', section: 'cta', page: 'home' },
    ],
  },
  about: {
    hero: [
      { id: 'about.title', type: 'text', label: 'Page Title', section: 'hero', page: 'about' },
      { id: 'about.intro', type: 'text', label: 'Introduction Text', section: 'hero', page: 'about' },
      { id: 'about.founded', type: 'text', label: 'Founded Year', section: 'hero', page: 'about' },
      { id: 'about.location', type: 'text', label: 'Location', section: 'hero', page: 'about' },
      { id: 'about.quote', type: 'text', label: 'Quote Text', section: 'hero', page: 'about' },
      { id: 'about.quote.author', type: 'text', label: 'Quote Author', section: 'hero', page: 'about' },
      { id: 'about.hero.image', type: 'image', label: 'Hero Image', section: 'hero', page: 'about' },
    ],
    mission: [
      { id: 'about.mission.title', type: 'text', label: 'Mission Title', section: 'mission', page: 'about' },
      { id: 'about.mission.description', type: 'text', label: 'Mission Description', section: 'mission', page: 'about' },
    ],
    values: [
      { id: 'about.values.excellence.title', type: 'text', label: 'Excellence Title', section: 'values', page: 'about' },
      { id: 'about.values.excellence.description', type: 'text', label: 'Excellence Description', section: 'values', page: 'about' },
      { id: 'about.values.respect.title', type: 'text', label: 'Respect Title', section: 'values', page: 'about' },
      { id: 'about.values.respect.description', type: 'text', label: 'Respect Description', section: 'values', page: 'about' },
      { id: 'about.values.development.title', type: 'text', label: 'Development Title', section: 'values', page: 'about' },
      { id: 'about.values.development.description', type: 'text', label: 'Development Description', section: 'values', page: 'about' },
    ],
    timeline: [
      { id: 'about.timeline.title', type: 'text', label: 'Timeline Title', section: 'timeline', page: 'about' },
      { id: 'about.timeline.description', type: 'text', label: 'Timeline Description', section: 'timeline', page: 'about' },
    ],
    team: [
      { id: 'about.team.title', type: 'text', label: 'Team Title', section: 'team', page: 'about' },
      { id: 'about.team.description', type: 'text', label: 'Team Description', section: 'team', page: 'about' },
    ],
    cta: [
      { id: 'about.cta.title', type: 'text', label: 'CTA Title', section: 'cta', page: 'about' },
      { id: 'about.cta.description', type: 'text', label: 'CTA Description', section: 'cta', page: 'about' },
    ],
  },
  contact: {
    hero: [
      { id: 'contact.title', type: 'text', label: 'Page Title', section: 'hero', page: 'contact' },
      { id: 'contact.description', type: 'text', label: 'Page Description', section: 'hero', page: 'contact' },
      { id: 'contact.hero.image', type: 'image', label: 'Hero Image', section: 'hero', page: 'contact' },
    ],
    coordinates: [
      { id: 'contact.coordinates.title', type: 'text', label: 'Coordinates Title', section: 'coordinates', page: 'contact' },
      { id: 'contact.coordinates.description', type: 'text', label: 'Coordinates Description', section: 'coordinates', page: 'contact' },
    ],
    info: [
      { id: 'contact.info.address', type: 'text', label: 'Address', section: 'info', page: 'contact' },
      { id: 'contact.info.phone', type: 'text', label: 'Phone', section: 'info', page: 'contact' },
      { id: 'contact.info.email', type: 'text', label: 'Email', section: 'info', page: 'contact' },
      { id: 'contact.info.hours', type: 'text', label: 'Opening Hours', section: 'info', page: 'contact' },
    ],
    departments: [
      { id: 'contact.departments.direction.title', type: 'text', label: 'Direction Title', section: 'departments', page: 'contact' },
      { id: 'contact.departments.direction.contact', type: 'text', label: 'Direction Contact', section: 'departments', page: 'contact' },
      { id: 'contact.departments.admission.title', type: 'text', label: 'Admission Title', section: 'departments', page: 'contact' },
      { id: 'contact.departments.admission.contact', type: 'text', label: 'Admission Contact', section: 'departments', page: 'contact' },
      { id: 'contact.departments.viescolaire.title', type: 'text', label: 'Vie Scolaire Title', section: 'departments', page: 'contact' },
      { id: 'contact.departments.viescolaire.contact', type: 'text', label: 'Vie Scolaire Contact', section: 'departments', page: 'contact' },
    ],
  },
  inscription: {
    hero: [
      { id: 'inscription.title', type: 'text', label: 'Page Title', section: 'hero', page: 'inscription' },
      { id: 'inscription.description', type: 'text', label: 'Page Description', section: 'hero', page: 'inscription' },
      { id: 'inscription.hero.image', type: 'image', label: 'Hero Image', section: 'hero', page: 'inscription' },
    ],
    process: [
      { id: 'inscription.process.title', type: 'text', label: 'Process Title', section: 'process', page: 'inscription' },
      { id: 'inscription.process.description', type: 'text', label: 'Process Description', section: 'process', page: 'inscription' },
    ],
    steps: [
      { id: 'inscription.steps.step1.title', type: 'text', label: 'Step 1 Title', section: 'steps', page: 'inscription' },
      { id: 'inscription.steps.step1.description', type: 'text', label: 'Step 1 Description', section: 'steps', page: 'inscription' },
      { id: 'inscription.steps.step2.title', type: 'text', label: 'Step 2 Title', section: 'steps', page: 'inscription' },
      { id: 'inscription.steps.step2.description', type: 'text', label: 'Step 2 Description', section: 'steps', page: 'inscription' },
      { id: 'inscription.steps.step3.title', type: 'text', label: 'Step 3 Title', section: 'steps', page: 'inscription' },
      { id: 'inscription.steps.step3.description', type: 'text', label: 'Step 3 Description', section: 'steps', page: 'inscription' },
      { id: 'inscription.steps.step4.title', type: 'text', label: 'Step 4 Title', section: 'steps', page: 'inscription' },
      { id: 'inscription.steps.step4.description', type: 'text', label: 'Step 4 Description', section: 'steps', page: 'inscription' },
    ],
    requirements: [
      { id: 'inscription.requirements.title', type: 'text', label: 'Requirements Title', section: 'requirements', page: 'inscription' },
      { id: 'inscription.requirements.description', type: 'text', label: 'Requirements Description', section: 'requirements', page: 'inscription' },
    ],
  },
  blog: {
    hero: [
      { id: 'blog.title', type: 'text', label: 'Page Title', section: 'hero', page: 'blog' },
      { id: 'blog.description', type: 'text', label: 'Page Description', section: 'hero', page: 'blog' },
    ],
  },
  programs: {
    hero: [
      { id: 'programs.title', type: 'text', label: 'Page Title', section: 'hero', page: 'programs' },
      { id: 'programs.description', type: 'text', label: 'Page Description', section: 'hero', page: 'programs' },
    ],
  },
  gallery: {
    hero: [
      { id: 'gallery.title', type: 'text', label: 'Page Title', section: 'hero', page: 'gallery' },
      { id: 'gallery.description', type: 'text', label: 'Page Description', section: 'hero', page: 'gallery' },
    ],
  },
  equipe: {
    hero: [
      { id: 'equipe.title', type: 'text', label: 'Page Title', section: 'hero', page: 'equipe' },
      { id: 'equipe.description', type: 'text', label: 'Page Description', section: 'hero', page: 'equipe' },
    ],
  },
};

export const getPageRegistry = (page: string) => contentRegistry[page] || {};


