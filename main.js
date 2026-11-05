const { Plugin, Notice } = require("obsidian");

const DEFAULT_DELAY_MS = 80;

module.exports = class FocusFollowsMousePlugin extends Plugin {
  async onload() {
    this.handlers = new Map();
    this.pendingTimer = null;
    this.enabled = true;

    this.registerEvent(
      this.app.workspace.on("layout-change", () => this.syncPaneListeners())
    );

    this.app.workspace.onLayoutReady(() => this.syncPaneListeners());

    this.addCommand({
      id: "toggle-focus-follows-mouse",
      name: "Toggle focus follows mouse",
      callback: () => {
        this.enabled = !this.enabled;
        if (this.pendingTimer !== null) {
          window.clearTimeout(this.pendingTimer);
          this.pendingTimer = null;
        }
        new Notice(
          `Focus follows mouse: ${this.enabled ? "ON" : "OFF"}`
        );
      },
    });
  }

  syncPaneListeners() {
    const currentContainers = new Set();

    // Root leaves are the main workspace panes. This avoids changing focus
    // just because the pointer passes over the left/right sidebars.
    this.app.workspace.iterateRootLeaves((leaf) => {
      const container = leaf.containerEl;
      if (!container) return;

      currentContainers.add(container);
      if (this.handlers.has(container)) return;

      const onPointerEnter = (event) => {
        if (!this.enabled) return;
        if (event.pointerType === "touch") return;

        if (this.pendingTimer !== null) {
          window.clearTimeout(this.pendingTimer);
        }

        // A short delay prevents focus flicker while resizing the split divider.
        this.pendingTimer = window.setTimeout(() => {
          this.pendingTimer = null;

          if (!container.isConnected) return;
          if (this.app.workspace.activeLeaf === leaf) return;

          this.app.workspace.setActiveLeaf(leaf, { focus: true });
        }, DEFAULT_DELAY_MS);
      };

      container.addEventListener("pointerenter", onPointerEnter);
      this.handlers.set(container, onPointerEnter);
    });

    // Remove listeners belonging to panes that have been closed/rebuilt.
    for (const [container, handler] of this.handlers) {
      if (!currentContainers.has(container)) {
        container.removeEventListener("pointerenter", handler);
        this.handlers.delete(container);
      }
    }
  }

  onunload() {
    if (this.pendingTimer !== null) {
      window.clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }

    for (const [container, handler] of this.handlers) {
      container.removeEventListener("pointerenter", handler);
    }

    this.handlers.clear();
  }
};
