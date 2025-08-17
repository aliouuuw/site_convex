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
      { id: 'about.badge', type: 'text', label: 'Badge Text', section: 'hero', page: 'about' },
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
      { id: 'contact.badge', type: 'text', label: 'Badge Text', section: 'hero', page: 'contact' },
      { id: 'contact.title', type: 'text', label: 'Page Title', section: 'hero', page: 'contact' },
      { id: 'contact.description', type: 'text', label: 'Page Description', section: 'hero', page: 'contact' },
      { id: 'contact.hero.image', type: 'image', label: 'Hero Image', section: 'hero', page: 'contact' },
      { id: 'contact.hours.title', type: 'text', label: 'Hours Title', section: 'hero', page: 'contact' },
      { id: 'contact.hours.weekdays.label', type: 'text', label: 'Weekdays Label', section: 'hero', page: 'contact' },
      { id: 'contact.hours.weekdays.time', type: 'text', label: 'Weekdays Time', section: 'hero', page: 'contact' },
      { id: 'contact.hours.saturday.label', type: 'text', label: 'Saturday Label', section: 'hero', page: 'contact' },
      { id: 'contact.hours.saturday.time', type: 'text', label: 'Saturday Time', section: 'hero', page: 'contact' },
      { id: 'contact.hours.sunday.label', type: 'text', label: 'Sunday Label', section: 'hero', page: 'contact' },
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
      { id: 'inscription.badge', type: 'text', label: 'Badge Text', section: 'hero', page: 'inscription' },
      { id: 'inscription.title', type: 'text', label: 'Page Title', section: 'hero', page: 'inscription' },
      { id: 'inscription.description', type: 'text', label: 'Page Description', section: 'hero', page: 'inscription' },
      { id: 'inscription.notice.message', type: 'text', label: 'Notice Message', section: 'hero', page: 'inscription' },
      { id: 'inscription.notice.limited', type: 'text', label: 'Limited Spots Notice', section: 'hero', page: 'inscription' },
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
  primary: {
    hero: [
      { id: 'primary.hero.label', type: 'text', label: 'Hero Label', section: 'hero', page: 'primary' },
      { id: 'primary.hero.title', type: 'text', label: 'Hero Title', section: 'hero', page: 'primary' },
      { id: 'primary.hero.age', type: 'text', label: 'Age Range', section: 'hero', page: 'primary' },
      { id: 'primary.hero.desc', type: 'text', label: 'Hero Description', section: 'hero', page: 'primary' },
      { id: 'primary.hero.hours', type: 'text', label: 'School Hours', section: 'hero', page: 'primary' },
      { id: 'primary.hero.classsize', type: 'text', label: 'Class Size', section: 'hero', page: 'primary' },
      { id: 'primary.hero.excellence.title', type: 'text', label: 'Excellence Title', section: 'hero', page: 'primary' },
      { id: 'primary.hero.excellence.desc', type: 'text', label: 'Excellence Description', section: 'hero', page: 'primary' },
      { id: 'primary.hero.image', type: 'image', label: 'Hero Image', section: 'hero', page: 'primary' },
    ],
    levels: [
      { id: 'primary.levels.title', type: 'text', label: 'Levels Title', section: 'levels', page: 'primary' },
      { id: 'primary.levels.desc', type: 'text', label: 'Levels Description', section: 'levels', page: 'primary' },
      { id: 'primary.level.0.image', type: 'image', label: 'CP Level Image', section: 'levels', page: 'primary' },
      { id: 'primary.level.0.age', type: 'text', label: 'CP Age Range', section: 'levels', page: 'primary' },
      { id: 'primary.level.0.name', type: 'text', label: 'CP Level Name', section: 'levels', page: 'primary' },
      { id: 'primary.level.0.focus', type: 'text', label: 'CP Focus Area', section: 'levels', page: 'primary' },
      { id: 'primary.level.1.image', type: 'image', label: 'CE Level Image', section: 'levels', page: 'primary' },
      { id: 'primary.level.1.age', type: 'text', label: 'CE Age Range', section: 'levels', page: 'primary' },
      { id: 'primary.level.1.name', type: 'text', label: 'CE Level Name', section: 'levels', page: 'primary' },
      { id: 'primary.level.1.focus', type: 'text', label: 'CE Focus Area', section: 'levels', page: 'primary' },
      { id: 'primary.level.2.image', type: 'image', label: 'CM Level Image', section: 'levels', page: 'primary' },
      { id: 'primary.level.2.age', type: 'text', label: 'CM Age Range', section: 'levels', page: 'primary' },
      { id: 'primary.level.2.name', type: 'text', label: 'CM Level Name', section: 'levels', page: 'primary' },
      { id: 'primary.level.2.focus', type: 'text', label: 'CM Focus Area', section: 'levels', page: 'primary' },
    ],
    subjects: [
      { id: 'primary.subjects.title', type: 'text', label: 'Subjects Title', section: 'subjects', page: 'primary' },
      { id: 'primary.subjects.desc', type: 'text', label: 'Subjects Description', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.francais.title', type: 'text', label: 'French Subject Title', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.francais.desc', type: 'text', label: 'French Subject Description', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.mathematiques.title', type: 'text', label: 'Math Subject Title', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.mathematiques.desc', type: 'text', label: 'Math Subject Description', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.sciences.title', type: 'text', label: 'Science Subject Title', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.sciences.desc', type: 'text', label: 'Science Subject Description', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.langues.title', type: 'text', label: 'Languages Subject Title', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.langues.desc', type: 'text', label: 'Languages Subject Description', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.informatique.title', type: 'text', label: 'IT Subject Title', section: 'subjects', page: 'primary' },
      { id: 'primary.subject.informatique.desc', type: 'text', label: 'IT Subject Description', section: 'subjects', page: 'primary' },
    ],
    schedule: [
      { id: 'primary.schedule.title', type: 'text', label: 'Schedule Title', section: 'schedule', page: 'primary' },
      { id: 'primary.schedule.desc', type: 'text', label: 'Schedule Description', section: 'schedule', page: 'primary' },
    ],
    cta: [
      { id: 'primary.cta.title', type: 'text', label: 'CTA Title', section: 'cta', page: 'primary' },
      { id: 'primary.cta.desc', type: 'text', label: 'CTA Description', section: 'cta', page: 'primary' },
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
      { id: 'equipe.badge', type: 'text', label: 'Badge Text', section: 'hero', page: 'equipe' },
      { id: 'equipe.title', type: 'text', label: 'Page Title', section: 'hero', page: 'equipe' },
      { id: 'equipe.description', type: 'text', label: 'Page Description', section: 'hero', page: 'equipe' },
      { id: 'equipe.values.title', type: 'text', label: 'Values Title', section: 'hero', page: 'equipe' },
      { id: 'equipe.values.description', type: 'text', label: 'Values Description', section: 'hero', page: 'equipe' },
      { id: 'equipe.hero.image', type: 'image', label: 'Hero Image', section: 'hero', page: 'equipe' },
    ],
    sections: [
      { id: 'equipe.sections.leadership.title', type: 'text', label: 'Leadership Title', section: 'sections', page: 'equipe' },
      { id: 'equipe.sections.leadership.description', type: 'text', label: 'Leadership Description', section: 'sections', page: 'equipe' },
      { id: 'equipe.sections.administration.title', type: 'text', label: 'Administration Title', section: 'sections', page: 'equipe' },
      { id: 'equipe.sections.administration.description', type: 'text', label: 'Administration Description', section: 'sections', page: 'equipe' },
      { id: 'equipe.sections.teachers.title', type: 'text', label: 'Teachers Title', section: 'sections', page: 'equipe' },
      { id: 'equipe.sections.teachers.description', type: 'text', label: 'Teachers Description', section: 'sections', page: 'equipe' },
      { id: 'equipe.sections.staff.title', type: 'text', label: 'Staff Title', section: 'sections', page: 'equipe' },
      { id: 'equipe.sections.staff.description', type: 'text', label: 'Staff Description', section: 'sections', page: 'equipe' },
      { id: 'equipe.sections.other.title', type: 'text', label: 'Other Title', section: 'sections', page: 'equipe' },
      { id: 'equipe.sections.other.description', type: 'text', label: 'Other Description', section: 'sections', page: 'equipe' },
    ],
    categories: [
      { id: 'equipe.category.leadership.label', type: 'text', label: 'Leadership Category Label', section: 'categories', page: 'equipe' },
      { id: 'equipe.category.administration.label', type: 'text', label: 'Administration Category Label', section: 'categories', page: 'equipe' },
      { id: 'equipe.category.teachers.label', type: 'text', label: 'Teachers Category Label', section: 'categories', page: 'equipe' },
      { id: 'equipe.category.staff.label', type: 'text', label: 'Staff Category Label', section: 'categories', page: 'equipe' },
    ],
    fallbacks: [
      { id: 'equipe.member.role.fallback', type: 'text', label: 'Member Role Fallback', section: 'fallbacks', page: 'equipe' },
      { id: 'equipe.member.bio.fallback', type: 'text', label: 'Member Bio Fallback', section: 'fallbacks', page: 'equipe' },
      { id: 'equipe.empty.message', type: 'text', label: 'Empty State Message', section: 'fallbacks', page: 'equipe' },
    ],
    cta: [
      { id: 'equipe.cta.title', type: 'text', label: 'CTA Title', section: 'cta', page: 'equipe' },
      { id: 'equipe.cta.description', type: 'text', label: 'CTA Description', section: 'cta', page: 'equipe' },
      { id: 'equipe.cta.button', type: 'text', label: 'CTA Button', section: 'cta', page: 'equipe' },
    ],
  },
};

export const getPageRegistry = (page: string) => contentRegistry[page] || {};


