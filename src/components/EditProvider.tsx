import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ConvexReactClient } from "convex/react";
import { LiveEditPrototype } from "../lib/liveEdit";
import EditModeToggle from "./EditModeToggle";
import { useEditMode as useEditModeHook } from "../hooks/useEditMode";

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
  // For now, assume authenticated - can be enhanced later
  const isAuthenticated = true;
  const { isEditMode, toggleEditMode } = useEditModeHook();
  const liveEditRef = useRef<LiveEditPrototype | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize live edit system
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
    }
  }, [isAuthenticated, toggleEditMode, isEditMode]);

  // Handle edit mode changes
  useEffect(() => {
    if (!liveEditRef.current) return;

    // Ensure the DOM is fully loaded before scanning for editable elements
    setTimeout(() => {
      if (isEditMode) {
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
  }, [isEditMode]);

  const contextValue: EditContextType = {
    liveEdit: liveEditRef.current,
    isEditMode,
    toggleEditMode, // Use the toggleEditMode from the hook
  };

  return (
    <EditContext.Provider value={contextValue}>
      {children}
      {isAuthenticated && isInitialized && liveEditRef.current && (
        <EditModeToggle liveEdit={liveEditRef.current} />
      )}
    </EditContext.Provider>
  );
}
