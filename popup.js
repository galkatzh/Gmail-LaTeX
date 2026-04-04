const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');
const commandList = document.getElementById('commandList');
const clearBtn = document.getElementById('clearBtn');

// Parse \newcommand and \renewcommand definitions from preamble text.
// Supports: \newcommand{\name}{body} and \newcommand{\name}[argCount]{body}
function parsePreamble(text) {
  const commands = [];
  // Match \newcommand or \renewcommand, then {\name}, optional [n], then {body}
  // We need to handle nested braces in the body.
  const regex = /\\(?:re)?newcommand\s*\{(\\[a-zA-Z]+)\}\s*(?:\[(\d+)\])?\s*\{/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const name = match[1];
    const argCount = match[2] ? parseInt(match[2], 10) : 0;
    // Extract the body by counting balanced braces
    const bodyStart = match.index + match[0].length;
    let depth = 1;
    let i = bodyStart;
    while (i < text.length && depth > 0) {
      if (text[i] === '{' && text[i - 1] !== '\\') depth++;
      else if (text[i] === '}' && text[i - 1] !== '\\') depth--;
      i++;
    }
    const body = text.substring(bodyStart, i - 1);
    commands.push({ name, argCount, body });
  }
  return commands;
}

function displayCommands(commands) {
  if (commands.length === 0) {
    status.textContent = 'No preamble loaded.';
    commandList.style.display = 'none';
    clearBtn.style.display = 'none';
    return;
  }
  status.textContent = `${commands.length} command(s) loaded.`;
  commandList.style.display = 'block';
  clearBtn.style.display = 'inline-block';
  commandList.textContent = commands.map(c => {
    const args = c.argCount > 0 ? `[${c.argCount}]` : '';
    return `${c.name}${args} -> ${c.body}`;
  }).join('\n');
}

// Load saved commands on popup open
chrome.storage.local.get('preambleCommands', (data) => {
  displayCommands(data.preambleCommands || []);
});

uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    const commands = parsePreamble(text);
    chrome.storage.local.set({ preambleCommands: commands }, () => {
      displayCommands(commands);
    });
  };
  reader.readAsText(file);
});

clearBtn.addEventListener('click', () => {
  chrome.storage.local.remove('preambleCommands', () => {
    displayCommands([]);
  });
});
