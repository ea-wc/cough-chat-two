import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

// GitHub Pages serves a project site under /<repo>/. Set DOCS_BASE=/<repo>/
// in the deploy workflow; leave unset for local dev and user/organization pages.
const base = process.env.DOCS_BASE ?? '/';

export default withMermaid(
  defineConfig({
    title: 'TeleHealth — Technical Documentation',
    description:
      'Technical documentation for the TeleHealth telehealth prototype: overview, C4 architecture, per-module detail, and API reference.',
    base,
    lastUpdated: true,
    cleanUrls: true,
    themeConfig: {
      nav: [
        { text: 'Overview', link: '/overview/context' },
        { text: 'Architecture', link: '/architecture/c4-l1' },
        { text: 'Modules', link: '/modules/admin' },
        { text: 'API', link: '/api/' },
      ],
      sidebar: [
        {
          text: 'Technical Overview',
          items: [
            { text: 'Context', link: '/overview/context' },
            { text: 'Features', link: '/overview/features' },
          ],
        },
        {
          text: 'High-level Architecture',
          items: [
            { text: 'C4 — L1 Context', link: '/architecture/c4-l1' },
            { text: 'C4 — L2 Container', link: '/architecture/c4-l2' },
            { text: 'C4 — L3 Component', link: '/architecture/c4-l3' },
            { text: 'C4 — Deployment', link: '/architecture/deployment' },
            { text: 'Data model', link: '/architecture/data-model' },
          ],
        },
        {
          text: 'Detailed Architecture',
          items: [
            { text: 'admin', link: '/modules/admin' },
            { text: 'appointments', link: '/modules/appointments' },
            { text: 'auth', link: '/modules/auth' },
            { text: 'consultations', link: '/modules/consultations' },
            { text: 'doctor-discovery', link: '/modules/doctor-discovery' },
            { text: 'doctor-profile', link: '/modules/doctor-profile' },
            { text: 'medical-records', link: '/modules/medical-records' },
            { text: 'notifications', link: '/modules/notifications' },
            { text: 'patient-profile', link: '/modules/patient-profile' },
            { text: 'product-website', link: '/modules/product-website' },
          ],
        },
        {
          text: 'API Documentation',
          items: [{ text: 'REST API (Swagger)', link: '/api/' }],
        },
        {
          text: 'Testing',
          items: [{ text: 'End-to-end tests', link: '/testing' }],
        },
      ],
      socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
      outline: { level: [2, 3] },
    },
  }),
);
