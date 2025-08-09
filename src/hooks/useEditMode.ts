import { useLocation, useNavigate } from "react-router-dom";

const resolveCurrentPage = (path: string): string => {
  if (path === "/") return "home";
  if (path === "/histoire" || path === "/about") return "about";
  if (path === "/contact") return "contact";
  if (path === "/inscription") return "inscription";
  if (path === "/journal" || path.startsWith("/blog")) return "blog";
  if (path.startsWith("/programs/")) return "programs";
  if (path === "/gallery") return "gallery";
  if (path === "/equipe") return "equipe";
  return "unknown";
};

export const useEditMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // For now, assume authenticated - can be enhanced later TODO: add auth
  const isAuthenticated = true;

  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get("edit") === "true";
  const editPanelOpen = searchParams.get("panel") === "true";
  const currentPage = resolveCurrentPage(location.pathname);

  const enableEditMode = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("edit", "true");
    void navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
  };

  const disableEditMode = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete("edit");
    // Also close panel when leaving edit mode
    urlParams.delete("panel");
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

  const openEditPanel = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("panel", "true");
    // Ensure edit mode is on when opening panel
    urlParams.set("edit", "true");
    void navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
  };

  const closeEditPanel = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete("panel");
    const newSearch = urlParams.toString();
    const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    void navigate(newUrl, { replace: true });
  };

  return {
    isEditMode,
    enableEditMode,
    disableEditMode,
    toggleEditMode,
    isAuthenticated,
    // New centralized panel fields
    editPanelOpen,
    openEditPanel,
    closeEditPanel,
    currentPage,
  };
};
