export const neumorphicTheme = {
  // For active state (stronger or colored shadow)
  neumorphismActive: (color = '#FF5722', radius = '20px') => `
    background:rgb(7, 116, 116);
    border-radius: ${radius};
    box-shadow: 0 4px 20px ${color}33, 0 1.5px 6px #D1D9E6, 0 -1.5px 6px #FFFFFF;
    border: 2px solid ${color};
  `,
  primary: '#FF5722',
  body: '#F0F2F5',
  text: '#3E4A59',
  textSecondary: '#8A94A6',
  
  shadows: {
    light: '#FFFFFF',
    dark: '#D1D9E6',
  },

  neumorphism: (inset = false, radius = '20px') => `
    background: #F0F2F5;
    border-radius: ${radius};
    box-shadow: ${inset ? 'inset' : ''} 6px 6px 12px #D1D9E6, 
                ${inset ? 'inset' : ''} -6px -6px 12px #FFFFFF;
  `,
  
  neumorphismPressed: (radius = '20px') => `
    background: #E2E6EC;
    border-radius: ${radius};
    box-shadow: inset 2px 2px 6px #D1D9E6, 
                inset -2px -2px 6px #FFFFFF;
  `,
};
