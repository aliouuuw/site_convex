import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const resolveCurrentPage = (path: string): string => {
  if (path === "/") return "home";
  if (path === "/histoire" || path === "/about") return "about";
  if (path === "/contact") return "contact";
  if (path === "/inscription") return "inscription";
  if (path === "/journal" || path.startsWith("/blog")) return "blog";
  if (path === "/programs/preschool") return "preschool";
  if (path === "/programs/primary") return "primary";
  if (path === "/programs/middleschool") return "middleschool";
  if (path.startsWith("/programs/")) return "programs";
  if (path === "/gallery") return "gallery";
  if (path === "/equipe") return "equipe";
  return "unknown";
};

export const useEditMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get("edit") === "true";
  const editPanelOpen = searchParams.get("panel") === "true";
  const currentPage = resolveCurrentPage(location.pathname);

  // New computed property that combines authentication and edit mode state
  const canEdit = isAuthenticated && isEditMode;

  const showAuthenticationPrompt = () => {
    // Show a user-friendly message about authentication requirement
    const message = "Authentification requise pour accéder au mode édition. Veuillez vous connecter pour continuer.";
    
    // You can replace this with a more sophisticated notification system
    // For now, we'll use a simple alert, but this could be enhanced with a toast notification
    alert(message);
    
    // Optionally, you could trigger the login popover here
    // This would require passing a callback from the parent component
    console.log("Authentication required for edit mode access");
  };

  const enableEditMode = () => {
    // Only allow enabling edit mode if user is authenticated
    if (!isAuthenticated) {
      showAuthenticationPrompt();
      return;
    }
    
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
    // Only allow toggling edit mode if user is authenticated
    if (!isAuthenticated) {
      showAuthenticationPrompt();
      return;
    }
    
    if (isEditMode) {
      disableEditMode();
    } else {
      enableEditMode();
    }
  };

  const openEditPanel = () => {
    // Only allow opening edit panel if user is authenticated
    if (!isAuthenticated) {
      showAuthenticationPrompt();
      return;
    }
    
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
    canEdit, // New property that combines auth + edit mode
    // New centralized panel fields
    editPanelOpen,
    openEditPanel,
    closeEditPanel,
    currentPage,
    // New error handling functions
    showAuthenticationPrompt,
  };
};
