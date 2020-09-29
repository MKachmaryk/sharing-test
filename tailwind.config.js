const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    screens: {
      xs: '321px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1124px',
      xxl: '1280px'
    },
    extend: {
      screens: {
        // xs: '321px',
        'sm-desktop': '415px'
      },
      minHeight: {
        '40': '10rem',
        '48': '12rem',
        '64': '16rem'
      },
      height: {
        '40': '10rem',
        '44': '11rem',
        '46': '11.5rem',
        '48': '12rem',
        '60': '15rem',
        '64': '16rem'
      },
      maxHeight: {
        '3/4': '75%'
      },
      maxWidth: {
        '1/2': '50%',
        '3/4': '75%',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
        '32': '8rem',
        '48': '12rem',
        '64': '16rem'
      },
      spacing: {
        '14': '4.5rem',
        '28': '7rem',
        '72': '18rem',
        '80': '20rem',
        '84': '21rem',
        '96': '24rem',
        '1/8': '12.5%',
        '1/6': '16.666667%',
        '1/5': '20%',
        '1/3': '33.333333%',
        '2/5': '40%',
        '2/3': '66.666667%',
        '3/4': '75%',
        '4/5': '80%',
        '10/12': '83.333333%',
        '2/2': '100%'
      },
      padding: {
        base: '10px',
        'base-plus': '20px'
      },
      margin: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        xxxl: '64px',
        xxxxl: '80px'
      },
      inset: {
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem'
      },
      colors: {
        dark: {
          700: '#444',
          500: 'rgba(0,0,0,0.55)',
          300: 'rgba(0,0,0,0.3)',
          200: 'rgba(0,0,0,0.1)',
          100: 'rgba(0,0,0,0.04)'
        },
        fog: {
          700: '#f3f3f3',
          500: 'rgba(243, 243, 243, 0.6)',
          300: 'rgba(243, 243, 243, 0.3)',
          200: 'rgba(243, 243, 243, 0.1)',
          100: 'rgba(243, 243, 243, 0.06)'
        },
        red: {
          ...colors.red,
          light: '#ffbdbd'
        },
        orange: {
          ...colors.orange,
          light: '#f0d091'
        },
        yellow: {
          ...colors.yellow,
          light: '#fffcc0'
        },
        green: {
          ...colors.green,
          light: '#97ffc7'
        },
        blue: {
          ...colors.blue,
          light: '#c8eeff'
        },
        purple: {
          ...colors.purple,
          light: '#edd0fb'
        },
        twitter: '#1da1f2',
        facebook: '#4267b2',
        instagram: '#e1306c'
      }
    }
  },
  variants: {},
  plugins: []
};
