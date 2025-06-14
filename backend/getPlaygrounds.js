const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Allow requests from any frontend
app.use(cors());

// Path to JSON file
const toolsFilePath = path.join(__dirname, 'playgroundslist.json');

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

// API route - reads fresh data from file each time
app.get('/api/tools', (req, res) => {
  console.log('🌐 API request received for /api/tools');
  const tools = readToolsFromFile();
  console.log('📤 Sending', tools.length, 'tools to frontend');
  res.json(tools);
});

// Root route
app.get('/', (req, res) => {
  res.send('Cyber Playground Backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📁 Tools data stored in: ${toolsFilePath}`);
});