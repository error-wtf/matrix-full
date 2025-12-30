// Matrix Rain
const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const MATRIX_CHARS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 16;
let columns = Math.floor(matrixCanvas.width / fontSize);
let drops = Array.from({ length: columns }, () => Math.random() * matrixCanvas.height / fontSize);
let rainActive = true;

function drawMatrixRain() {
    if (!rainActive) return;
    
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    matrixCtx.fillStyle = '#0F0';
    matrixCtx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < columns; i++) {
        const text = MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        matrixCtx.fillText(text, x, y);
        
        if (y > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i] += 0.3 + Math.random() * 0.4;
    }
}

setInterval(drawMatrixRain, 50);

window.addEventListener('resize', () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    columns = Math.floor(matrixCanvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * matrixCanvas.height / fontSize);
});

// Terminal System
const output = document.getElementById('output');
const commandInput = document.getElementById('commandInput');
const terminal = document.getElementById('terminal');
const loginScreen = document.getElementById('loginScreen');
const usernameInput = document.getElementById('usernameInput');
const promptEl = document.getElementById('prompt');

let username = 'guest';
let talkMode = null;
let talkDB = null;

// Login
function login() {
    const name = usernameInput.value.trim();
    if (name) {
        username = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        localStorage.setItem('matrixUsername', username);
    }
    
    loginScreen.style.display = 'none';
    terminal.style.display = 'flex';
    promptEl.textContent = `${username}@matrix:~$`;
    commandInput.focus();
    
    printLine('Welcome to Matrix Terminal v2.0', 'output-line');
    printLine(`Connected as: ${username}`, 'output-line');
    printLine('Type "help" for available commands', 'output-line');
    printLine('', 'output-line');
}

function logout() {
    terminal.style.display = 'none';
    loginScreen.style.display = 'block';
    output.innerHTML = '';
    usernameInput.value = '';
    usernameInput.focus();
}

// Load username on enter
usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') login();
});

// Auto-login if username stored
window.addEventListener('load', () => {
    const stored = localStorage.getItem('matrixUsername');
    if (stored) {
        usernameInput.value = stored;
    }
});

// Terminal Commands
const commands = {
    help: 'Available commands: help, clear, rain, quote, hack, talk <character>, date, whoami, echo <text>, tetris, exit',
    clear: () => { output.innerHTML = ''; return ''; },
    date: () => new Date().toString(),
    whoami: () => username,
    exit: 'Type "clear" to clear screen or logout to disconnect'
};

function printLine(text, className = 'output-line') {
    const line = document.createElement('div');
    line.className = className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function printHTML(html) {
    const div = document.createElement('div');
    div.className = 'output-line';
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = commandInput.value.trim();
        if (cmd) {
            printLine(`${username}@matrix:~$ ${cmd}`, 'command-line');
            handleCommand(cmd);
        }
        commandInput.value = '';
    }
});

function handleCommand(input) {
    const lower = input.toLowerCase();
    const parts = input.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Talk mode active
    if (talkMode) {
        handleTalkInput(input);
        return;
    }
    
    // Clear
    if (cmd === 'clear') {
        output.innerHTML = '';
        return;
    }
    
    // Help
    if (cmd === 'help') {
        printLine('Available commands:', 'output-line');
        printLine('  help          - Show this help', 'output-line');
        printLine('  clear         - Clear screen', 'output-line');
        printLine('  rain          - Toggle Matrix rain', 'output-line');
        printLine('  quote         - Random Matrix quote', 'output-line');
        printLine('  hack          - Hack simulation', 'output-line');
        printLine('  talk <name>   - Chat with Neo, Trinity, Morpheus, Smith, Oracle', 'output-line');
        printLine('  date          - Show date/time', 'output-line');
        printLine('  whoami        - Show current user', 'output-line');
        printLine('  echo <text>   - Echo text', 'output-line');
        printLine('  tetris        - Play Tetris game', 'output-line');
        printLine('  exit          - Exit command', 'output-line');
        return;
    }
    
    // Rain
    if (cmd === 'rain') {
        rainActive = !rainActive;
        if (rainActive) {
            printLine('Matrix rain enabled', 'output-line');
        } else {
            matrixCtx.fillStyle = '#000';
            matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            printLine('Matrix rain disabled', 'output-line');
        }
        return;
    }
    
    // Date
    if (cmd === 'date') {
        printLine(new Date().toString(), 'output-line');
        return;
    }
    
    // Whoami
    if (cmd === 'whoami') {
        printLine(username, 'output-line');
        return;
    }
    
    // Echo
    if (cmd === 'echo') {
        printLine(args.join(' '), 'output-line');
        return;
    }
    
    // Quote
    if (cmd === 'quote') {
        showQuote();
        return;
    }
    
    // Hack
    if (cmd === 'hack') {
        hackMatrix();
        return;
    }
    
    // Talk
    if (cmd === 'talk') {
        if (args.length === 0) {
            printLine('Usage: talk <character>', 'output-line');
            printLine('Available: neo, trinity, morpheus, smith, oracle', 'output-line');
        } else {
            startTalk(args[0].toLowerCase());
        }
        return;
    }
    
    // Tetris
    if (cmd === 'tetris') {
        printLine('Loading Tetris...', 'output-line');
        // Pass username to tetris
        window.open(`tetris.html?user=${encodeURIComponent(username)}`, '_blank');
        return;
    }
    
    // Exit
    if (cmd === 'exit' || cmd === 'bye') {
        printLine('Goodbye! Type "clear" to clear screen.', 'output-line');
        return;
    }
    
    // Unknown
    printLine(`Unknown command: ${cmd}`, 'error-line');
    printLine('Type "help" for available commands', 'output-line');
}

// Quote function
function showQuote() {
    const quotes = [
        '"There is no spoon." - Neo',
        '"What is real?" - Morpheus',
        '"Free your mind." - Morpheus',
        '"I know kung fu." - Neo',
        '"Welcome to the real world." - Morpheus',
        '"The Matrix has you..." - Trinity',
        '"You take the red pill..." - Morpheus',
        '"Never send a human to do a machine\'s job." - Agent Smith'
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    printLine(quote, 'output-line');
}

// Hack simulation
function hackMatrix() {
    const targets = ['mainframe', 'database', 'firewall', 'encryption', 'security'];
    const target = targets[Math.floor(Math.random() * targets.length)];
    
    printLine(`Initiating hack on ${target}...`, 'output-line');
    setTimeout(() => printLine('Scanning ports...', 'output-line'), 500);
    setTimeout(() => printLine('Bypassing security...', 'output-line'), 1000);
    setTimeout(() => printLine('Decrypting data...', 'output-line'), 1500);
    setTimeout(() => printLine('Access granted!', 'output-line'), 2000);
}

// Talk system
function startTalk(character) {
    const validChars = ['neo', 'trinity', 'morpheus', 'smith', 'oracle'];
    if (!validChars.includes(character)) {
        printLine(`Unknown character: ${character}`, 'error-line');
        printLine('Available: neo, trinity, morpheus, smith, oracle', 'output-line');
        return;
    }
    
    talkMode = character;
    printLine(`Connecting to ${character}...`, 'output-line');
    printLine(`Type your message (or "bye" to exit)`, 'output-line');
    printLine('', 'output-line');
}

function handleTalkInput(input) {
    if (input.toLowerCase() === 'bye') {
        printLine(`${talkMode}: Goodbye.`, 'output-line');
        talkMode = null;
        return;
    }
    
    printLine(`You: ${input}`, 'output-line');
    
    // Simple responses
    const responses = {
        neo: [
            "I know what you're trying to do.",
            "There is no spoon.",
            "I can dodge bullets now.",
            "The Matrix isn't real."
        ],
        trinity: [
            "I can help you.",
            "Trust me.",
            "We need to move fast.",
            "The agents are coming."
        ],
        morpheus: [
            "What is real?",
            "Free your mind.",
            "I can only show you the door.",
            "There's a difference between knowing the path..."
        ],
        smith: [
            "Mr. Anderson...",
            "It's inevitable.",
            "Never send a human to do a machine's job.",
            "I'm going to enjoy watching you die."
        ],
        oracle: [
            "You already know the answer.",
            "Would you still have broken it if I hadn't said anything?",
            "You're cuter than I thought.",
            "Everything that has a beginning has an end."
        ]
    };
    
    const response = responses[talkMode][Math.floor(Math.random() * responses[talkMode].length)];
    setTimeout(() => printLine(`${talkMode}: ${response}`, 'output-line'), 500);
}
