import { useCallback, useMemo, useState } from 'react';
// CUSTOM DATA
import { PROJECTS } from '@/__fakeData__/projects';
export default function useProjects() {
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    searchValue: ''
  });
  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);
  const handleChangeFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  const filteredProjects = useMemo(() => {
    const {
      status,
      searchValue
    } = filters;
    if (status === 'all' && !searchValue) return PROJECTS;
    const searchValueLower = searchValue.toLowerCase();
    return PROJECTS.filter(project => {
      const statusMatch = status === 'all' || project.status === status;
      const searchMatch = searchValue === '' || project.name.toLowerCase().includes(searchValueLower);
      return statusMatch && searchMatch;
    });
  }, [filters]);
  return {
    filters,
    openModal,
    filteredProjects,
    handleOpenModal,
    handleCloseModal,
    handleChangeFilter
  };
}