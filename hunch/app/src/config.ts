// Guide and app are separate Netlify sites, so the app can't link to the
// guide with a relative path. Override with VITE_GUIDE_URL (e.g. to
// http://localhost:4321) when developing against a local guide instead.
export const GUIDE_URL = import.meta.env.VITE_GUIDE_URL || 'https://scintilla-guide.netlify.app/';
