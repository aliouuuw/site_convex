import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ConvexReactClient } from "convex/react";
import { LiveEditPrototype } from "../lib/liveEdit";
import EditModeToggle from "./EditModeToggle"; // Commented out as per requirements
import EditPanel from "./EditPanel";
import { useEditMode as useEditModeHook } from "../hooks/useEditMode";
import { FaPenToSquare } from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

interface EditContextType {
  liveEdit: LiveEditPrototype | null;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const EditContext = createContext<EditContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useEditMode = () => {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error("useEditMode must be used within an EditProvider");
  }
  return context;
};

interface EditProviderProps {
  children: React.ReactNode;
}

export default function EditProvider({ children }: EditProviderProps) {
  const { isAuthenticated } = useAuth();
  const { isEditMode, toggleEditMode, editPanelOpen, openEditPanel, closeEditPanel, currentPage, canEdit, disableEditMode } = useEditModeHook();
  const liveEditRef = useRef<LiveEditPrototype | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [previousAuthState, setPreviousAuthState] = useState(isAuthenticated);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Session expiry detection and automatic edit mode disabling
  useEffect(() => {
    // If user was previously authenticated but is no longer authenticated
    if (previousAuthState && !isAuthenticated) {
      console.log("Session expired - disabling edit mode");
      
      // Show user-friendly message about session expiry
      const message = "Votre session a expiré. Le mode édition a été désactivé. Veuillez vous reconnecter pour continuer à éditer.";
      alert(message);
      
      // Automatically disable edit mode when session expires
      if (isEditMode) {
        disableEditMode();
      }
    }
    
    // Update previous auth state
    setPreviousAuthState(isAuthenticated);
  }, [isAuthenticated, previousAuthState, isEditMode, disableEditMode]);

  // Initialize live edit system only for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const convex = new ConvexReactClient(
        import.meta.env.VITE_CONVEX_URL as string,
      );
      liveEditRef.current = new LiveEditPrototype(convex, (editMode) => {
        // This callback helps synchronize the LiveEditPrototype state with our React state
        if (editMode !== isEditMode) {
          toggleEditMode();
        }
      });
      setIsInitialized(true);
    } else {
      // Clean up live edit system when user is not authenticated
      if (liveEditRef.current) {
        liveEditRef.current.disableEditMode();
        liveEditRef.current = null;
      }
      setIsInitialized(false);
    }
  }, [isAuthenticated, toggleEditMode, isEditMode]);

  // Handle edit mode changes
  useEffect(() => {
    if (!liveEditRef.current) return;

    // Ensure the DOM is fully loaded before scanning for editable elements
    setTimeout(() => {
      if (canEdit) { // Use canEdit instead of isEditMode to include auth check
        liveEditRef.current?.enableEditMode();
        console.log(
          "Edit mode enabled, editable elements:",
          liveEditRef.current?.getEditableElementsCount(),
        );
      } else {
        liveEditRef.current?.disableEditMode();
        // Force a re-render to ensure CSS classes are removed
        document.body.classList.remove("live-edit-mode");
        // Clean up any remaining edit mode classes
        document.querySelectorAll(".live-edit-element").forEach((el) => {
          el.classList.remove("live-edit-element");
        });
      }
    }, 100);
  }, [canEdit]); // Use canEdit as dependency instead of isEditMode

  const contextValue: EditContextType = {
    liveEdit: liveEditRef.current,
    isEditMode,
    toggleEditMode, // Use the toggleEditMode from the hook
  };

  return (
    <EditContext.Provider value={contextValue}>
      {children}
      {isAuthenticated && isInitialized && liveEditRef.current && !isAdminRoute && (
        <div className="edit-buttons-container">
          {/* Floating action button to open the panel when in edit mode */}
          {canEdit && !editPanelOpen && ( // Use canEdit instead of isEditMode
            <button
              className="edit-content-fab"
              onClick={openEditPanel}
              title="Ouvrir le panneau d'édition de contenu (Ctrl+E pour basculer)"
            >
              <FaPenToSquare className="text-base" />
              <span className="font-medium">Ouvrir le panneau</span>
            </button>
          )}
          <EditModeToggle liveEdit={liveEditRef.current} />
        </div>
      )}
      {/* Centralized Edit Panel - only show for authenticated users */}
      {isAuthenticated && (
        <EditPanel page={currentPage} isOpen={editPanelOpen} onClose={closeEditPanel} />
      )}
    </EditContext.Provider>
  );
}
