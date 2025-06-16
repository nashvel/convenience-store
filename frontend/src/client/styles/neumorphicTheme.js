export const neumorphicTheme = {
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
    background: #F0F2F5;
    border-radius: ${radius};
    box-shadow: inset 6px 6px 12px #D1D9E6, 
                inset -6px -6px 12px #FFFFFF;
  `,

  neumorphismActive: (color = '#FF5722', radius = '20px') => `
    background: ${color};
    border-radius: ${radius};
    color: white;
    box-shadow: inset 3px 3px 6px #d64a1e, 
                inset -3px -3px 6px #ff6426;
  `,
};
