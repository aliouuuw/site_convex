import { useLocation, useNavigate } from "react-router-dom";

export const useEditMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // For now, assume authenticated - can be enhanced later TODO: add auth
  const isAuthenticated = true;

  const isEditMode =
    new URLSearchParams(location.search).get("edit") === "true";

  const enableEditMode = () => {
    if (!isAuthenticated) {
      console.log("Authentication required for edit mode");
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('edit', 'true');
    void navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
  };

  const disableEditMode = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete("edit");
    const newSearch = urlParams.toString();
    const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    void navigate(newUrl, { replace: true });
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      disableEditMode();
    } else {
      enableEditMode();
    }
  };

  return {
    isEditMode,
    enableEditMode,
    disableEditMode,
    toggleEditMode,
    isAuthenticated,
  };
};
