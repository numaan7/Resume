import DefaultTemplate from './DefaultTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';

export const templates = [
  {
    id: 'default',
    name: 'Professional Classic',
    description: 'Traditional ATS-friendly layout with clear section hierarchy and professional formatting. Perfect for corporate applications.',
    features: ['ATS Optimized', 'Clean Typography', 'Section Headers', 'Skill Ratings'],
    recommendedFor: ['Corporate Jobs', 'Traditional Industries', 'Executive Positions'],
    component: DefaultTemplate
  },
  {
    id: 'modern',
    name: 'Modern Sidebar',
    description: 'Contemporary design with a stylish sidebar for skills and contact info. Features gradient accents and modern typography.',
    features: ['Sidebar Layout', 'Skill Visualizations', 'Modern Typography', 'Color Accents'],
    recommendedFor: ['Tech Industry', 'Creative Roles', 'Digital Portfolios'],
    component: ModernTemplate
  },
  {
    id: 'minimal',
    name: 'Minimal Essential',
    description: 'Clean, distraction-free design that lets your content shine. Perfect for academic and research positions.',
    features: ['Minimalist Design', 'Content Focused', 'Elegant Spacing', 'Simple Typography'],
    recommendedFor: ['Academic Positions', 'Research Roles', 'Conservative Industries'],
    component: MinimalTemplate
  }
];

export const getTemplateById = (id) => {
  return templates.find(template => template.id === id) || templates[0];
};
