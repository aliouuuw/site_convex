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
};

export const getPageRegistry = (page: string) => contentRegistry[page] || {};


