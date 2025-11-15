import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { FocusManager, ARIA, Keyboard, ScreenReader } from "../accessibility";

describe("FocusManager", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = `
      <button>Button 1</button>
      <button>Button 2</button>
      <button>Button 3</button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("traps focus within element", () => {
    const cleanup = FocusManager.trapFocus(container);
    const buttons = container.querySelectorAll("button");
    
    expect(document.activeElement).toBe(buttons[0]);
    cleanup();
  });

  it("saves and restores focus", () => {
    const button = container.querySelector("button") as HTMLElement;
    button.focus();
    
    const saved = FocusManager.saveFocus();
    expect(saved).toBe(button);
    
    FocusManager.restoreFocus(saved);
    expect(document.activeElement).toBe(button);
  });
});

describe("ARIA", () => {
  it("announces messages to screen readers", () => {
    ARIA.announce("Test message");
    const announcement = document.querySelector('[role="status"]');
    expect(announcement).toBeInTheDocument();
    expect(announcement?.textContent).toBe("Test message");
  });

  it("labels elements correctly", () => {
    const element = document.createElement("button");
    element.id = "test-button";
    document.body.appendChild(element);
    
    ARIA.label("test-button", "Test Label");
    expect(element.getAttribute("aria-label")).toBe("Test Label");
    
    document.body.removeChild(element);
  });
});

describe("Keyboard", () => {
  it("detects Enter key", () => {
    const event = new KeyboardEvent("keydown", { key: "Enter" });
    expect(Keyboard.isEnter(event)).toBe(true);
  });

  it("detects Escape key", () => {
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    expect(Keyboard.isEscape(event)).toBe(true);
  });

  it("detects arrow keys", () => {
    expect(Keyboard.isArrowUp(new KeyboardEvent("keydown", { key: "ArrowUp" }))).toBe(true);
    expect(Keyboard.isArrowDown(new KeyboardEvent("keydown", { key: "ArrowDown" }))).toBe(true);
    expect(Keyboard.isArrowLeft(new KeyboardEvent("keydown", { key: "ArrowLeft" }))).toBe(true);
    expect(Keyboard.isArrowRight(new KeyboardEvent("keydown", { key: "ArrowRight" }))).toBe(true);
  });
});

describe("ScreenReader", () => {
  it("hides elements from screen readers", () => {
    const element = document.createElement("div");
    ScreenReader.hide(element);
    expect(element.getAttribute("aria-hidden")).toBe("true");
  });

  it("shows elements to screen readers", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "true");
    ScreenReader.show(element);
    expect(element.getAttribute("aria-hidden")).toBeNull();
  });
});

