/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Matte black backgrounds
        background: '#121212',
        surface: '#1A1A1A',
        
        // Rich gold primary accents
        primary: '#D4AF37',
        'primary-bright': '#FFD700',
        
        // Neon accents for glowing elements and charts
        'neon-cyan': '#00FFFF',
        'neon-purple': '#B026FF',
        'neon-blue': '#005FFF',
        
        // Retained original semantic colors
        danger: '#dc2626',
        warning: '#d97706',
      },
      boxShadow: {
        // Glassmorphism subtle shadow
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        
        // Glowing drop-shadows
        'glow-primary': '0 0 15px 2px rgba(212, 175, 55, 0.4)',
        'glow-cyan': '0 0 15px 2px rgba(0, 255, 255, 0.5)',
        'glow-purple': '0 0 15px 2px rgba(176, 38, 255, 0.5)',
        'glow-blue': '0 0 15px 2px rgba(0, 95, 255, 0.5)',
      }
    }
  },
  plugins: []
};