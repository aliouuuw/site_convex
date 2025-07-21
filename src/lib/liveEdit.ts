import { ConvexReactClient } from "convex/react";

export interface LiveEditElement {
  id: string;
  element: HTMLElement;
  originalContent: string;
  currentContent: string;
}

export class LiveEditPrototype {
  private isEditMode: boolean = false;
  private editableElements: Map<string, LiveEditElement> = new Map();
  private activeEditor: HTMLInputElement | null = null;
  private convex: ConvexReactClient;
  private onEditModeChange?: (isEditMode: boolean) => void;
  private elementHandlers: Map<HTMLElement, (e: MouseEvent) => void> =
    new Map();

  constructor(
    convex: ConvexReactClient,
    onEditModeChange?: (isEditMode: boolean) => void,
  ) {
    this.convex = convex;
    this.onEditModeChange = onEditModeChange;
  }

  public enableEditMode(): void {
    if (this.isEditMode) return;

    this.isEditMode = true;
    document.body.classList.add("live-edit-mode");
    this.scanForEditableElements();
    this.enhanceElements();
    this.onEditModeChange?.(true);
  }

  public disableEditMode(): void {
    if (!this.isEditMode) return;

    this.isEditMode = false;
    document.body.classList.remove("live-edit-mode");
    this.removeElementEnhancements();
    this.closeActiveEditor();
    this.editableElements.clear(); // Clear the stored elements
    this.onEditModeChange?.(false);
  }

  public toggleEditMode(): void {
    if (this.isEditMode) {
      this.disableEditMode();
    } else {
      this.enableEditMode();
    }
  }

  private scanForEditableElements(): void {
    this.editableElements.clear();

    // Use a more specific selector to ensure we're targeting the right elements
    const elements = document.querySelectorAll("[data-live-edit-id]");
    console.log(`Found ${elements.length} elements with data-live-edit-id`);

    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const id = element.getAttribute("data-live-edit-id");
        if (id) {
          console.log(`Registering editable element: ${id}`);
          this.editableElements.set(id, {
            id,
            element,
            originalContent: this.getElementContent(element),
            currentContent: this.getElementContent(element),
          });
        }
      }
    });
  }

  private getElementContent(element: HTMLElement): string {
    if (element.tagName === "IMG") {
      return element.getAttribute("alt") || element.getAttribute("src") || "";
    }

    // For input elements, get value instead of text content
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      return (element as HTMLInputElement).value || "";
    }

    // First try innerText for more accurate representation, fallback to textContent or innerHTML
    return element.innerText || element.textContent || element.innerHTML || "";
  }

  private enhanceElements(): void {
    this.editableElements.forEach((editElement) => {
      const { element } = editElement;

      // Add visual indicators
      element.classList.add("live-edit-element");

      // Create a specific handler for this element
      const clickHandler = (e: MouseEvent) => {
        if (this.isEditMode) {
          e.preventDefault();
          e.stopPropagation();
          console.log(`Editing element with id: ${editElement.id}`);
          this.startEditing(editElement);
        }
      };

      // Store the handler reference
      this.elementHandlers.set(element, clickHandler);

      // Add click handler with capture phase to ensure it runs before other handlers
      element.addEventListener("click", clickHandler, true);
    });
  }

  private removeElementEnhancements(): void {
    // Remove handlers and classes from tracked elements
    this.editableElements.forEach((editElement) => {
      const { element } = editElement;
      element.classList.remove("live-edit-element");

      // Remove the specific handler for this element
      const handler = this.elementHandlers.get(element);
      if (handler) {
        element.removeEventListener("click", handler, true);
        this.elementHandlers.delete(element);
      }
    });

    // Also scan DOM for any elements that might have been missed
    const allEditableElements = document.querySelectorAll(".live-edit-element");
    allEditableElements.forEach((element) => {
      element.classList.remove("live-edit-element");
    });

    // Clear the handlers map
    this.elementHandlers.clear();
  }

  private startEditing(editElement: LiveEditElement): void {
    this.closeActiveEditor();

    const { element, id } = editElement;
    const isImage = element.tagName === "IMG";
    const isTextarea =
      element.tagName === "TEXTAREA" ||
      (element.textContent && element.textContent.length > 100);

    console.log(`Starting to edit element: ${id}, type: ${element.tagName}`);

    // Create inline editor (textarea for longer content)
    const editor = document.createElement(isTextarea ? "textarea" : "input");
    if (!isTextarea) {
      (editor as HTMLInputElement).type = "text";
    }
    editor.className = "live-edit-input";
    editor.value = isImage
      ? element.getAttribute("alt") || ""
      : this.getElementContent(element);

    // Position editor
    const rect = element.getBoundingClientRect();
    editor.style.position = "absolute";
    editor.style.left = `${rect.left + window.scrollX}px`;
    editor.style.top = `${rect.top + window.scrollY}px`;
    editor.style.width = `${rect.width}px`;
    editor.style.height = isTextarea
      ? `${Math.max(rect.height, 100)}px`
      : `${rect.height}px`;
    editor.style.zIndex = "9999";
    editor.style.overflow = "auto";
    editor.style.resize = "both";

    // Add to DOM
    document.body.appendChild(editor);
    this.activeEditor = editor as HTMLInputElement;

    // Focus and select
    editor.focus();
    if (!isTextarea) {
      (editor as HTMLInputElement).select();
    }

    // Handle save
    const saveContent = async () => {
      const newContent = editor.value.trim();
      if (newContent !== editElement.currentContent) {
        editElement.currentContent = newContent;
        await this.saveContent(id, newContent, isImage);

        // Update DOM
        if (isImage) {
          element.setAttribute("alt", newContent);
        } else {
          element.textContent = newContent;
        }
      }
      this.closeActiveEditor();
    };

    // Event listeners
    editor.addEventListener("blur", () => void saveContent());
    editor.addEventListener("keydown", (e) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === "Enter") {
        keyEvent.preventDefault();
        void saveContent();
      } else if (keyEvent.key === "Escape") {
        keyEvent.preventDefault();
        this.closeActiveEditor();
      }
    });
  }

  private closeActiveEditor(): void {
    if (this.activeEditor) {
      this.activeEditor.remove();
      this.activeEditor = null;
    }
  }

  private async saveContent(
    id: string,
    content: string,
    isImage: boolean,
  ): Promise<void> {
    try {
      console.log(`Saving content for element: ${id}`);

      // Use dynamic import to avoid TypeScript errors during development
      const { api } = await import("../../convex/_generated/api");

      // Show a temporary save indicator
      const saveIndicator = document.createElement("div");
      saveIndicator.textContent = "Saving...";
      saveIndicator.style.position = "fixed";
      saveIndicator.style.bottom = "60px";
      saveIndicator.style.right = "20px";
      saveIndicator.style.backgroundColor = "rgba(0,0,0,0.7)";
      saveIndicator.style.color = "white";
      saveIndicator.style.padding = "8px 16px";
      saveIndicator.style.borderRadius = "4px";
      saveIndicator.style.zIndex = "9999";
      document.body.appendChild(saveIndicator);

      // Save the content
      await this.convex.mutation((api as any).content.updateContent, {
        id,
        content,
        type: isImage ? "image" : "text",
        page: this.getCurrentPage(),
      });

      // Update indicator to show success
      saveIndicator.textContent = "Saved!";
      saveIndicator.style.backgroundColor = "rgba(39,174,96,0.9)";

      // Remove indicator after a delay
      setTimeout(() => {
        document.body.removeChild(saveIndicator);
      }, 2000);

      console.log(`Content saved successfully for element: ${id}`);
    } catch (error) {
      console.error("Failed to save content:", error);

      // Show error message
      const errorIndicator = document.createElement("div");
      errorIndicator.textContent = "Failed to save changes";
      errorIndicator.style.position = "fixed";
      errorIndicator.style.bottom = "60px";
      errorIndicator.style.right = "20px";
      errorIndicator.style.backgroundColor = "rgba(231,76,60,0.9)";
      errorIndicator.style.color = "white";
      errorIndicator.style.padding = "8px 16px";
      errorIndicator.style.borderRadius = "4px";
      errorIndicator.style.zIndex = "9999";
      document.body.appendChild(errorIndicator);

      // Remove indicator after a delay
      setTimeout(() => {
        document.body.removeChild(errorIndicator);
      }, 3000);
    }
  }

  private getCurrentPage(): string {
    const path = window.location.pathname;
    if (path === "/") return "home";
    if (path === "/histoire") return "about";
    if (path === "/contact") return "contact";
    if (path === "/inscription") return "inscription";
    if (path === "/journal") return "blog";
    if (path.startsWith("/programs/")) return "programs";
    if (path === "/gallery") return "gallery";
    if (path === "/equipe") return "equipe";
    return "unknown";
  }

  public isInEditMode(): boolean {
    return this.isEditMode;
  }

  public getEditableElementsCount(): number {
    return this.editableElements.size;
  }
}
