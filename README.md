# Focus Follows Mouse (Obsidian plugin)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/utkaboga)

A small **desktop-only** plugin that makes focus follow the mouse between panes in Obsidian's main workspace.

![demo](demo.gif)

## Install

1. Close Obsidian, or leave it running and reload plugins after copying.
2. Copy this folder (`focus-follows-mouse`) into your vault's:
   `.obsidian/plugins/`
3. Make sure the folder contains `manifest.json` and `main.js` directly.
4. In Obsidian open **Settings → Community plugins** and enable **Focus Follows Mouse**.
5. If it does not appear, use **Reload app without saving** from the command palette, then enable it.

## Behaviour

- Moving the pointer into a main workspace pane activates that pane after 80 ms.
- Moving back into the other pane activates it in the same way.
- The plugin does not activate panes in the left/right sidebars just because the pointer passes over them.
- Use the command **Toggle focus follows mouse** to temporarily turn the behaviour on or off.

The delay reduces focus flicker when moving the split divider. This plugin uses Obsidian's documented workspace leaf and `setActiveLeaf` APIs.
