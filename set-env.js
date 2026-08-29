const fs = require('fs');
const path = require('path');

// Read .env file
const envFilePath = path.resolve(__dirname, '.env');
let envFileContent = '';
if (fs.existsSync(envFilePath)) {
    envFileContent = fs.readFileSync(envFilePath, 'utf8');
}

// Parse simple KEY=VALUE
const envVars = {};
envFileContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim().replace(/^"/, '').replace(/"$/, '');
        }
    }
});

const backendUrl = envVars.BACKEND_URL || 'http://localhost:8080/';

const targetPath = path.join(__dirname, 'src', 'environments', 'environment.ts');
const envConfigFile = `export const environment = {
    production: false,
    backendUrl: '${backendUrl}'
};
`;

const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
