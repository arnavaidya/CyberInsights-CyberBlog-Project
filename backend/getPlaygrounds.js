const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to JSON file
const toolsFilePath = path.join(__dirname, 'playgroundslist.json');

// Hash storage for reverse lookup simulation (Hash Playground)
const hashStorage = new Map();

// Generate SHA256 hash - SINGLE DECLARATION
function generateSHA256(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

// Function to read tools from JSON file
const readToolsFromFile = () => {
  try {
    console.log('🔍 Looking for tools file at:', toolsFilePath);
    console.log('📁 File exists:', fs.existsSync(toolsFilePath));
    
    if (fs.existsSync(toolsFilePath)) {
      const data = fs.readFileSync(toolsFilePath, 'utf8');
      console.log('📄 Raw file content length:', data.length);
      const parsedData = JSON.parse(data);
      console.log('✅ Successfully parsed', parsedData.length, 'tools from JSON file');
      return parsedData;
    } else {
      console.log('❌ JSON file not found, using default tools');
      return getDefaultTools();
    }
  } catch (error) {
    console.error('❌ Error reading tools file:', error);
    console.log('🔄 Falling back to default tools');
    return getDefaultTools();
  }
};

// Function to write tools to JSON file
const writeToolsToFile = (tools) => {
  try {
    fs.writeFileSync(toolsFilePath, JSON.stringify(tools, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing tools file:', error);
    return false;
  }
};

// Default tools data - Fallback list
const getDefaultTools = () => [
  {
    id: "caesar-cipher",
    name: "Caesar Cipher",
    icon: "🔒",
    color: "#4f46e5",
    category: "encryption",
    description: "Encrypt and decrypt messages using this classical cipher",
    longDescription: "The Caesar cipher is one of the simplest and most widely known encryption techniques. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet."
  },
  {
    id: "hash-playground",
    name: "Hash Playground",
    icon: "#",
    color: "#0891b2",
    category: "cryptography",
    description: "See how hashing algorithms transform your input",
    longDescription: "Hash functions are mathematical algorithms that transform input data into fixed-size strings. They are crucial for data integrity, password storage, and digital signatures."
  },
  {
    id: "sql-injection",
    name: "SQL Injection",
    icon: "🗄️",
    color: "#db2777",
    category: "vulnerabilities",
    description: "Test SQL injection attacks in a safe environment",
    longDescription: "SQL injection is a code injection technique that exploits security vulnerabilities in database-driven applications. Learn how to identify and prevent these attacks."
  },
  {
    id: "signature-verifier",
    name: "Signature Verifier",
    icon: "🔑",
    color: "#ca8a04",
    category: "cryptography",
    description: "Verify digital signatures with public key cryptography",
    longDescription: "Digital signatures provide authentication, non-repudiation, and data integrity. Learn how public key cryptography enables secure digital communications."
  },
  {
    id: "xss-demo",
    name: "XSS Demo",
    icon: "⚡",
    color: "#dc2626",
    category: "vulnerabilities",
    description: "Learn about Cross-Site Scripting attacks safely",
    longDescription: "Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web applications. Practice identification and prevention."
  },
  {
    id: "password-analyzer",
    name: "Password Analyzer",
    icon: "🔐",
    color: "#059669",
    category: "security",
    description: "Analyze password strength and security",
    longDescription: "Learn about password security, common attack methods, and how to create strong, secure passwords."
  }
];

// Initialize tools file if it doesn't exist
if (!fs.existsSync(toolsFilePath)) {
  writeToolsToFile(getDefaultTools());
}

// ============ MAIN PLAYGROUND ROUTES ============

// API route - reads fresh data from file each time
app.get('/api/tools', (req, res) => {
  console.log('🌐 API request received for /api/tools');
  const tools = readToolsFromFile();
  console.log('📤 Sending', tools.length, 'tools to frontend');
  res.json(tools);
});

// Get specific playground details
app.get('/api/playground/:id', (req, res) => {
  const { id } = req.params;
  const tools = readToolsFromFile();
  const playground = tools.find(tool => tool.id === id);
  
  if (!playground) {
    return res.status(404).json({ error: 'Playground not found' });
  }
  
  res.json(playground);
});

// ============ HASH PLAYGROUND ROUTES ============

// Hash text
app.post('/api/playground/hash-playground/hash', (req, res) => {
    try {
        const { text } = req.body;
        console.log('📝 Hash request received:', { text });
        
        if (!text) {
            console.log('❌ No text provided');
            return res.status(400).json({ error: 'Text is required' });
        }

        const hash = generateSHA256(text);
        hashStorage.set(hash, text);
        
        console.log('✅ Hash generated successfully:', { originalText: text, hash });

        res.json({ 
            originalText: text,
            hash,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Hashing failed:', err);
        res.status(500).json({ error: 'Hashing failed' });
    }
});

// Reverse lookup
app.post('/api/playground/hash-playground/reverse', (req, res) => {
    try {
        const { hash } = req.body;
        console.log('🔍 Reverse lookup request:', { hash });
        
        if (!hash) {
            console.log('❌ No hash provided');
            return res.status(400).json({ error: 'Hash is required' });
        }

        const originalText = hashStorage.get(hash);
        console.log('🔍 Lookup result:', { hash, found: !!originalText, originalText });
        
        if (originalText) {
            res.json({
                hash,
                originalText,
                success: true,
                note: 'Found in session storage'
            });
        } else {
            res.json({
                hash,
                originalText: null,
                success: false,
                note: 'SHA-256 is cryptographically secure; reverse lookup is not feasible'
            });
        }
    } catch (err) {
        console.error('❌ Reverse lookup failed:', err);
        res.status(500).json({ error: 'Reverse lookup failed' });
    }
});

// Sender integrity
app.post('/api/playground/hash-playground/integrity/send', (req, res) => {
    try {
        const { message } = req.body;
        console.log('📨 Integrity send request:', { message });
        
        if (!message) {
            console.log('❌ No message provided');
            return res.status(400).json({ error: 'Message is required' });
        }

        const hash = generateSHA256(message);
        console.log('✅ Integrity hash generated:', { message, hash });
        
        res.json({
            originalMessage: message,
            originalHash: hash,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Integrity check setup failed:', err);
        res.status(500).json({ error: 'Integrity check setup failed' });
    }
});

// Receiver integrity check
app.post('/api/playground/hash-playground/integrity/verify', (req, res) => {
    try {
        const { originalMessage, originalHash, receivedMessage } = req.body;
        console.log('🔐 Integrity verify request:', { originalMessage, originalHash, receivedMessage });
        
        if (!originalMessage || !originalHash || !receivedMessage) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        const receivedHash = generateSHA256(receivedMessage);
        const integrityMaintained = originalHash === receivedHash;
        
        console.log('✅ Integrity verification result:', { 
            originalHash, 
            receivedHash, 
            integrityMaintained 
        });

        res.json({
            originalMessage,
            originalHash,
            receivedMessage,
            receivedHash,
            integrityMaintained,
            status: integrityMaintained ? 'INTEGRITY MAINTAINED' : 'INTEGRITY COMPROMISED',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Integrity verification failed:', err);
        res.status(500).json({ error: 'Integrity verification failed' });
    }
});

// ============ CAESAR CIPHER PLAYGROUND ROUTES ============

// Caesar cipher encryption/decryption
app.post('/api/playground/caesar-cipher/cipher', (req, res) => {
    try {
        const { text, shift, operation } = req.body;
        console.log('🔒 Caesar cipher request:', { text, shift, operation });
        
        if (!text || shift === undefined) {
            console.log('❌ Missing required fields for Caesar cipher');
            return res.status(400).json({ error: 'Text and shift are required' });
        }
        
        const shiftAmount = operation === 'decrypt' ? -parseInt(shift) : parseInt(shift);
        const result = caesarCipher(text, shiftAmount);
        
        console.log('✅ Caesar cipher result:', { originalText: text, result, shift: shiftAmount });
        
        res.json({
            originalText: text,
            result: result,
            shift: parseInt(shift),
            operation: operation || 'encrypt',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Caesar cipher operation failed:', error);
        res.status(500).json({ error: 'Caesar cipher operation failed' });
    }
});

// Helper function for Caesar cipher
function caesarCipher(text, shift) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + shift + 26) % 26) + base);
        }
        return char;
    }).join('');
}

// ============ GENERAL ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Unified Playground Server is running',
        timestamp: new Date().toISOString(),
        availablePlaygrounds: readToolsFromFile().length,
        storedHashes: hashStorage.size
    });
});

// Root route
app.get('/', (req, res) => {
  res.send('Unified Cyber Playground Backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Unified Playground Server is running on http://localhost:${PORT}`);
  console.log(`📁 Tools data stored in: ${toolsFilePath}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});