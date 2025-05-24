
export const generateUniqueId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createDefaultStyling = () => ({
  desktop: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#ffffff',
    padding: '16px',
    margin: '0',
  },
  tablet: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#ffffff',
    padding: '16px',
    margin: '0',
  },
  mobile: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#ffffff',
    padding: '16px',
    margin: '0',
  },
});
