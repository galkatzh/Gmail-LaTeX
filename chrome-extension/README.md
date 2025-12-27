# LaTeX to Image for Gmail

A browser extension that allows you to convert LaTeX code to images directly in Gmail's compose window.

## Features

- Right-click on selected LaTeX code in Gmail
- Automatically converts it to an image using CodeCogs LaTeX API
- Inserts the image directly into your email at the cursor position
- Works with both Chrome and Firefox

## Installation

### Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the folder containing the extension files
5. Rename `manifest-chrome.json` to `manifest.json` before loading

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the extension folder and select `manifest-firefox.json`
4. Rename `manifest-firefox.json` to `manifest.json` before loading

## Usage

1. Open Gmail and start composing an email
2. Type or paste your LaTeX code (e.g., `E = mc^2` or `\frac{a}{b}`)
3. Select the LaTeX code
4. Right-click on the selection
5. Click "Convert to LaTeX Image" from the context menu
6. The LaTeX code will be replaced with an image of the rendered equation

## Examples

Try these LaTeX expressions:

- Simple: `E = mc^2`
- Fractions: `\frac{a}{b}`
- Greek letters: `\alpha + \beta = \gamma`
- Complex: `\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}`
- Matrices: `\begin{pmatrix} a & b \\ c & d \end{pmatrix}`

## Technical Details

- Uses the CodeCogs LaTeX API: `https://latex.codecogs.com/png.image?`
- Works only on Gmail pages (`https://mail.google.com/*`)
- Requires active tab and context menu permissions
- Compatible with Gmail's contenteditable compose areas

## File Structure

```
latex-gmail-extension/
├── manifest-chrome.json   # Chrome manifest (v3)
├── manifest-firefox.json  # Firefox manifest (v2)
├── background.js          # Background script (context menu handler)
├── content.js             # Content script (DOM manipulation)
├── icon16.png             # 16x16 icon
├── icon48.png             # 48x48 icon
└── icon128.png            # 128x128 icon
```

## Browser Compatibility

- **Chrome**: Uses Manifest V3
- **Firefox**: Uses Manifest V2
- Code is identical between browsers (only manifest differs)

## Notes

- The extension only activates on Gmail pages for security
- Images are loaded from CodeCogs servers
- Selected text must be valid LaTeX syntax for proper rendering
- The extension automatically URL-encodes special characters

## Troubleshooting

**Context menu doesn't appear:**
- Make sure you're on mail.google.com
- Ensure text is selected before right-clicking
- Check that the extension is enabled

**Image doesn't insert:**
- Make sure cursor is in the compose area
- Try clicking into the compose box first
- Check browser console for errors

**Image doesn't render properly:**
- Verify LaTeX syntax is correct
- Test the LaTeX on CodeCogs website directly
- Some complex LaTeX may need additional packages

## Development

To modify the extension:

1. Edit `background.js` for context menu behavior
2. Edit `content.js` for Gmail DOM manipulation
3. Update manifest files if adding permissions
4. Reload the extension in browser after changes

## License

MIT License - Feel free to modify and distribute
