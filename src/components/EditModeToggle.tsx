import React, { useEffect, useState, useCallback } from "react";
import { LiveEditPrototype } from "../lib/liveEdit";
import { useEditMode } from "../hooks/useEditMode";

interface EditModeToggleProps {
  liveEdit: LiveEditPrototype;
}

export default function EditModeToggle({ liveEdit }: EditModeToggleProps) {
  const { isEditMode, toggleEditMode } = useEditMode();
  const [editableCount, setEditableCount] = useState(0);

  useEffect(() => {
    // Update editable count when elements change
    const updateCount = () => {
      // Scan for elements even when not in edit mode to show count
      const elements = document.querySelectorAll("[data-live-edit-id]");
      const count = elements.length;
      setEditableCount(count);
      console.log(`Found ${count} editable elements on page`);
    };

    // Initial count
    updateCount();

    // Scan for elements whenever DOM changes with MutationObserver
    const observer = new MutationObserver(() => {
      updateCount();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Set up interval to check for changes - reduced frequency
    const interval = setInterval(updateCount, 1000);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [liveEdit]);

  // Memoize the toggle function to prevent unnecessary re-renders
  const handleToggle = useCallback(() => {
    console.log("Toggle edit mode requested");
    toggleEditMode();
  }, [toggleEditMode]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Keyboard shortcut: Ctrl+E to toggle edit mode
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle],
  );

  useEffect(() => {
    // Add global keyboard listener
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        handleToggle();
      }
    };

    console.log("Adding global keyboard listener for edit mode toggle");
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleToggle]);

  return (
    <button
      className={`edit-mode-toggle ${isEditMode ? "active" : ""}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      title={`${isEditMode ? "Disable" : "Enable"} edit mode (Ctrl+E)`}
    >
      <span className="icon">{isEditMode ? "✕" : "✏️"}</span>
      <span>{isEditMode ? "Exit Edit" : "Edit Mode"}</span>
      {editableCount > 0 && <span className="count">{editableCount}</span>}
    </button>
  );
}
