import { use } from 'react';
import { LayoutContext } from './layoutContext';
const useLayout = () => {
  const context = use(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
export default useLayout;