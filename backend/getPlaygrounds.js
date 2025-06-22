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
   id: "diffie-hellman",
   name: "Diffie-Hellman Key Exchange",
   icon: "🔐",
   color: "#dc2626",
   category: "cryptography",
   description: "Simulate secure key exchange between Alice and Bob",
   longDescription: "The Diffie-Hellman key exchange is a method for two parties to establish a shared secret key over an insecure channel. This playground demonstrates the mathematical steps involved in the key exchange process."
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

// ============ PASSWORD ANALYZER HELPER FUNCTIONS ============

// Password strength analysis
function analyzePassword(password) {
    const analysis = {
        length: password.length,
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        hasSpaces: /\s/.test(password),
        entropy: calculateEntropy(password),
        commonPatterns: checkCommonPatterns(password),
        estimatedCrackTime: estimateCrackTime(password)
    };
    
    analysis.score = calculatePasswordScore(analysis);
    analysis.strength = getPasswordStrength(analysis.score);
    analysis.recommendations = getRecommendations(analysis);
    
    return analysis;
}

function calculateEntropy(password) {
    const charset = getCharsetSize(password);
    return password.length * Math.log2(charset);
}

function getCharsetSize(password) {
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/\d/.test(password)) charset += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) charset += 32;
    if (/\s/.test(password)) charset += 1;
    return charset || 1;
}

function checkCommonPatterns(password) {
    const patterns = [];
    
    // Sequential characters
    if (/abc|bcd|cde|def|efg/i.test(password)) patterns.push('Sequential letters');
    if (/123|234|345|456|567|678|789|890/.test(password)) patterns.push('Sequential numbers');
    
    // Repeated characters
    if (/(.)\1{2,}/.test(password)) patterns.push('Repeated characters');
    
    // Keyboard patterns
    if (/qwerty|asdf|zxcv|qaz|wsx|edc/i.test(password)) patterns.push('Keyboard patterns');
    
    // Common words (simple check)
    const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'secret'];
    commonWords.forEach(word => {
        if (password.toLowerCase().includes(word)) {
            patterns.push(`Common word: ${word}`);
        }
    });
    
    return patterns;
}

function estimateCrackTime(password) {
    const charset = getCharsetSize(password);
    const combinations = Math.pow(charset, password.length);
    const guessesPerSecond = 1000000000; // 1 billion guesses per second (modern GPU)
    const secondsToCrack = combinations / (2 * guessesPerSecond); // Average case
    
    if (secondsToCrack < 1) return 'Instantly';
    if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`;
    if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000000) return `${Math.round(secondsToCrack / 31536000)} years`;
    return 'Centuries';
}

function calculatePasswordScore(analysis) {
    let score = 0;
    
    // Length scoring
    if (analysis.length >= 8) score += 25;
    if (analysis.length >= 12) score += 25;
    if (analysis.length >= 16) score += 25;
    
    // Character diversity
    if (analysis.hasLowercase) score += 5;
    if (analysis.hasUppercase) score += 5;
    if (analysis.hasNumbers) score += 5;
    if (analysis.hasSpecialChars) score += 10;
    
    // Entropy bonus
    if (analysis.entropy > 50) score += 10;
    if (analysis.entropy > 70) score += 10;
    
    // Penalties
    if (analysis.commonPatterns.length > 0) score -= 20;
    if (analysis.hasSpaces) score -= 5;
    
    return Math.max(0, Math.min(100, score));
}

function getPasswordStrength(score) {
    if (score < 25) return 'Very Weak';
    if (score < 50) return 'Weak';
    if (score < 75) return 'Fair';
    if (score < 90) return 'Strong';
    return 'Very Strong';
}

function getRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.length < 8) {
        recommendations.push('Use at least 8 characters');
    }
    if (analysis.length < 12) {
        recommendations.push('Consider using 12+ characters for better security');
    }
    if (!analysis.hasLowercase) {
        recommendations.push('Add lowercase letters');
    }
    if (!analysis.hasUppercase) {
        recommendations.push('Add uppercase letters');
    }
    if (!analysis.hasNumbers) {
        recommendations.push('Include numbers');
    }
    if (!analysis.hasSpecialChars) {
        recommendations.push('Add special characters (!@#$%^&*)');
    }
    if (analysis.commonPatterns.length > 0) {
        recommendations.push('Avoid common patterns and dictionary words');
    }
    if (analysis.hasSpaces) {
        recommendations.push('Consider removing spaces for compatibility');
    }
    
    if (recommendations.length === 0) {
        recommendations.push('Excellent! Your password follows security best practices.');
    }
    
    return recommendations;
}

// Generate secure password
function generateSecurePassword(options = {}) {
    const {
        length = 16,
        includeLowercase = true,
        includeUppercase = true,
        includeNumbers = true,
        includeSpecialChars = true,
        excludeSimilar = true
    } = options;
    
    let charset = '';
    if (includeLowercase) charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += excludeSimilar ? '23456789' : '0123456789';
    if (includeSpecialChars) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) return '';
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
    }
    
    return password;
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

// ============ PASSWORD ANALYZER PLAYGROUND ROUTES ============

// Analyze password strength
app.post('/api/playground/password-analyzer/analyze', (req, res) => {
    try {
        const { password } = req.body;
        console.log('🔐 Password analysis request received');
        
        if (!password) {
            console.log('❌ No password provided');
            return res.status(400).json({ error: 'Password is required' });
        }

        const analysis = analyzePassword(password);
        
        console.log('✅ Password analysis completed:', { 
            length: analysis.length, 
            strength: analysis.strength, 
            score: analysis.score 
        });

        res.json({
            analysis,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Password analysis failed:', err);
        res.status(500).json({ error: 'Password analysis failed' });
    }
});

// Generate secure password
app.post('/api/playground/password-analyzer/generate', (req, res) => {
    try {
        const options = req.body || {};
        console.log('🔑 Password generation request:', options);
        
        const password = generateSecurePassword(options);
        const analysis = analyzePassword(password);
        
        console.log('✅ Secure password generated:', { 
            length: password.length, 
            strength: analysis.strength 
        });

        res.json({
            password,
            analysis,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Password generation failed:', err);
        res.status(500).json({ error: 'Password generation failed' });
    }
});

// Compare passwords
app.post('/api/playground/password-analyzer/compare', (req, res) => {
    try {
        const { passwords } = req.body;
        console.log('📊 Password comparison request for', passwords?.length || 0, 'passwords');
        
        if (!passwords || !Array.isArray(passwords) || passwords.length === 0) {
            console.log('❌ Invalid passwords array provided');
            return res.status(400).json({ error: 'Array of passwords is required' });
        }

        const comparisons = passwords.map((password, index) => ({
            index: index + 1,
            password: password,
            analysis: analyzePassword(password)
        }));
        
        // Sort by score (descending)
        comparisons.sort((a, b) => b.analysis.score - a.analysis.score);
        
        console.log('✅ Password comparison completed');

        res.json({
            comparisons,
            bestPassword: comparisons[0],
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Password comparison failed:', err);
        res.status(500).json({ error: 'Password comparison failed' });
    }
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

// Add this to your existing backend code (paste.txt)

// ============ DIFFIE-HELLMAN KEY EXCHANGE HELPER FUNCTIONS ============

// Function to check if a number is prime
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

// Generate a random prime number within a range
function generatePrime(min = 100, max = 1000) {
    let prime;
    do {
        prime = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (!isPrime(prime));
    return prime;
}

// Find primitive root (generator) for a prime number
function findPrimitiveRoot(p) {
    const phi = p - 1;
    const factors = [];
    
    // Find prime factors of phi
    let n = phi;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
            factors.push(i);
            while (n % i === 0) {
                n = Math.floor(n / i);
            }
        }
    }
    if (n > 1) factors.push(n);
    
    // Check each number from 2 to p-1
    for (let g = 2; g < p; g++) {
        let isPrimitiveRoot = true;
        
        // Check if g^(phi/factor) ≡ 1 (mod p) for any prime factor
        for (const factor of factors) {
            if (modPow(g, Math.floor(phi / factor), p) === 1) {
                isPrimitiveRoot = false;
                break;
            }
        }
        
        if (isPrimitiveRoot) {
            return g;
        }
    }
    return 2; // Fallback
}

// Modular exponentiation: (base^exp) % mod
function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;
    
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    
    return result;
}

// Generate random private key
function generatePrivateKey(max = 100) {
    return Math.floor(Math.random() * (max - 2)) + 2;
}

// ============ DIFFIE-HELLMAN KEY EXCHANGE PLAYGROUND ROUTES ============

// Generate initial parameters (prime and generator)
app.post('/api/playground/diffie-hellman/generate-params', (req, res) => {
    try {
        console.log('🔐 Generating Diffie-Hellman parameters');
        
        const prime = generatePrime(100, 500); // Smaller range for demo purposes
        const generator = findPrimitiveRoot(prime);
        
        console.log('✅ DH parameters generated:', { prime, generator });
        
        res.json({
            prime,
            generator,
            timestamp: new Date().toISOString(),
            note: `Prime (p) = ${prime}, Generator (g) = ${generator}`
        });
    } catch (err) {
        console.error('❌ DH parameter generation failed:', err);
        res.status(500).json({ error: 'Parameter generation failed' });
    }
});

// Generate private key for Alice or Bob
app.post('/api/playground/diffie-hellman/generate-private', (req, res) => {
    try {
        const { participant, prime } = req.body;
        console.log('🔑 Generating private key for:', participant);
        
        if (!participant || !prime) {
            return res.status(400).json({ error: 'Participant and prime are required' });
        }
        
        const privateKey = generatePrivateKey(Math.floor(prime / 2));
        
        console.log('✅ Private key generated for', participant, ':', privateKey);
        
        res.json({
            participant,
            privateKey,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Private key generation failed:', err);
        res.status(500).json({ error: 'Private key generation failed' });
    }
});

// Calculate public key
app.post('/api/playground/diffie-hellman/calculate-public', (req, res) => {
    try {
        const { participant, prime, generator, privateKey } = req.body;
        console.log('🔢 Calculating public key for:', participant);
        
        if (!participant || !prime || !generator || !privateKey) {
            return res.status(400).json({ error: 'All parameters are required' });
        }
        
        const publicKey = modPow(generator, privateKey, prime);
        
        console.log('✅ Public key calculated for', participant, ':', publicKey);
        
        res.json({
            participant,
            publicKey,
            calculation: `${generator}^${privateKey} mod ${prime} = ${publicKey}`,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Public key calculation failed:', err);
        res.status(500).json({ error: 'Public key calculation failed' });
    }
});

// Calculate shared secret
app.post('/api/playground/diffie-hellman/calculate-shared', (req, res) => {
    try {
        const { participant, prime, otherPublicKey, myPrivateKey } = req.body;
        console.log('🤝 Calculating shared secret for:', participant);
        
        if (!participant || !prime || !otherPublicKey || !myPrivateKey) {
            return res.status(400).json({ error: 'All parameters are required' });
        }
        
        const sharedSecret = modPow(otherPublicKey, myPrivateKey, prime);
        
        console.log('✅ Shared secret calculated for', participant, ':', sharedSecret);
        
        res.json({
            participant,
            sharedSecret,
            calculation: `${otherPublicKey}^${myPrivateKey} mod ${prime} = ${sharedSecret}`,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Shared secret calculation failed:', err);
        res.status(500).json({ error: 'Shared secret calculation failed' });
    }
});

// Complete key exchange simulation
app.post('/api/playground/diffie-hellman/simulate', (req, res) => {
    try {
        console.log('🎭 Running complete DH simulation');
        
        // Generate parameters
        const prime = generatePrime(100, 500);
        const generator = findPrimitiveRoot(prime);
        
        // Generate private keys
        const alicePrivate = generatePrivateKey(Math.floor(prime / 2));
        const bobPrivate = generatePrivateKey(Math.floor(prime / 2));
        
        // Calculate public keys
        const alicePublic = modPow(generator, alicePrivate, prime);
        const bobPublic = modPow(generator, bobPrivate, prime);
        
        // Calculate shared secrets
        const aliceShared = modPow(bobPublic, alicePrivate, prime);
        const bobShared = modPow(alicePublic, bobPrivate, prime);
        
        console.log('✅ Complete DH simulation finished');
        
        res.json({
            parameters: { prime, generator },
            alice: {
                privateKey: alicePrivate,
                publicKey: alicePublic,
                publicCalculation: `${generator}^${alicePrivate} mod ${prime} = ${alicePublic}`,
                sharedSecret: aliceShared,
                sharedCalculation: `${bobPublic}^${alicePrivate} mod ${prime} = ${aliceShared}`
            },
            bob: {
                privateKey: bobPrivate,
                publicKey: bobPublic,
                publicCalculation: `${generator}^${bobPrivate} mod ${prime} = ${bobPublic}`,
                sharedSecret: bobShared,
                sharedCalculation: `${alicePublic}^${bobPrivate} mod ${prime} = ${bobShared}`
            },
            success: aliceShared === bobShared,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ DH simulation failed:', err);
        res.status(500).json({ error: 'Simulation failed' });
    }
});


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