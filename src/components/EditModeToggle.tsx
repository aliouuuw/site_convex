import React, { useEffect, useState, useCallback } from "react";
import { LiveEditPrototype } from "../lib/liveEdit";
import { useEditMode } from "../hooks/useEditMode";
import { FaPen, FaXmark } from "react-icons/fa6";

interface EditModeToggleProps {
  liveEdit: LiveEditPrototype;
}

export default function EditModeToggle({ liveEdit }: EditModeToggleProps) {
  const { isEditMode, toggleEditMode, editPanelOpen } = useEditMode();
  const [editableCount, setEditableCount] = useState(0);

  useEffect(() => {
    // Update editable count when elements change
    const updateCount = () => {
      // Scan for elements even when not in edit mode to show count
      const elements = document.querySelectorAll("[data-live-edit-id]");
      const count = elements.length;
      setEditableCount(count);
      // TODO: Replace with a more robust logging system if needed, render is infinite
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

    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleToggle]);

  return (
    <button
      className={`edit-mode-toggle ${isEditMode ? "active" : ""} ${editPanelOpen ? "panel-open" : ""}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      title={`${isEditMode ? "Exit" : "Enter"} edit mode (Ctrl+E)`}
    >
      <span className="icon">
        {isEditMode ? <FaXmark /> : <FaPen />}
      </span>
      <span className="text-xs font-medium">
        {isEditMode ? "Cancel" : "Edit"}
      </span>
      {editableCount > 0 && !isEditMode && (
        <span className="count">{editableCount}</span>
      )}
    </button>
  );
}
