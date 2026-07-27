import { useCallback, useEffect, useState, createContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
// MUI
import useMediaQuery from '@mui/material/useMediaQuery';
// CUSTOM NAVIGATION DATA
import { navigation } from '@/data/navigation-2';
// TYPES

// ==============================================================
// Context Interface

// ==============================================================

export const LayoutContext = createContext({});
export default function LayoutProvider({
  children
}) {
  const navigate = useNavigate();
  const {
    pathname
  } = useLocation();
  const [active, setActive] = useState('');
  const [activeSubMenuItem, setActiveSubMenuItem] = useState('');
  const [showMobileSideBar, setShowMobileSideBar] = useState(false);
  const [openSecondarySideBar, setOpenSecondarySideBar] = useState(false);
  const [categoryMenus, setCategoryMenus] = useState([]);
  const downMd = useMediaQuery(theme => theme.breakpoints.down(1200));

  // TOGGLE MOBILE SIDEBAR
  const handleCloseMobileSidebar = useCallback(() => setShowMobileSideBar(false), []);
  const handleToggleSecondarySideBar = useCallback(() => setShowMobileSideBar(prev => !prev), []);

  // SET SECONDARY SIDEBAR STATE
  const handleSecondarySideBar = useCallback(value => setOpenSecondarySideBar(value), []);

  // HANDLE MAIN MENU ACTIVATION
  const handleActiveMainMenu = useCallback(menuItem => () => {
    setActive(menuItem.name);
    if (menuItem.children?.length) {
      setCategoryMenus(menuItem.children);
      const isSameMenuActive = openSecondarySideBar && active === menuItem.name;
      handleSecondarySideBar(!isSameMenuActive);
    } else {
      navigate(menuItem.path);
      setCategoryMenus([]);
      handleCloseMobileSidebar();
      handleSecondarySideBar(false);
    }
  }, [navigate, openSecondarySideBar, active, handleCloseMobileSidebar, handleSecondarySideBar]);

  // ACTIVATE THE CORRECT ROUTE BASED ON THE CURRENT PATHNAME
  const activeRoute = useCallback(() => {
    for (const menu of navigation) {
      if (menu.children?.some(item => item.path === pathname)) {
        const activeChild = menu.children.find(item => item.path === pathname);
        setActive(menu.name);
        setCategoryMenus(menu.children);
        setActiveSubMenuItem(activeChild.path);
        handleSecondarySideBar(true);
        return;
      }
      if (menu.path === pathname) {
        setActive(menu.name);
        setCategoryMenus([]);
        setActiveSubMenuItem('');
        handleSecondarySideBar(false);
        return;
      }
    }
  }, [pathname, handleSecondarySideBar]);
  useEffect(() => {
    activeRoute();
  }, [activeRoute]);

  // HANDLE SUB-MENU ITEM ACTIVATION
  const handleSubMenuItem = useCallback(path => {
    navigate(path);
    setActiveSubMenuItem(path);
    handleCloseMobileSidebar();
  }, [navigate, handleCloseMobileSidebar]);
  const contextValue = useMemo(() => ({
    active,
    downMd,
    categoryMenus,
    activeSubMenuItem,
    showMobileSideBar,
    openSecondarySideBar,
    handleSubMenuItem,
    handleActiveMainMenu,
    handleSecondarySideBar,
    handleCloseMobileSidebar,
    handleToggleSecondarySideBar
  }), [active, downMd, categoryMenus, activeSubMenuItem, showMobileSideBar, openSecondarySideBar, handleSubMenuItem, handleActiveMainMenu, handleSecondarySideBar, handleCloseMobileSidebar, handleToggleSecondarySideBar]);
  return <LayoutContext value={contextValue}>{children}</LayoutContext>;
}