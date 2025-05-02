const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const listOfFiles = [
    'inventory.ini',
    'vars/fail2ban.yml',
    'vars/msmtp.yml',
    'vars/rkhunter.yml',
    'vars/ssh.yml',
    'vars/unattended-upgrades.yml',
    '.env',
]

const modifyGitIgnoreFile = (gitIgnoreFile, remove = false) => {
    fs.writeFileSync(gitIgnoreFile, remove ? '' : '.env', 'utf-8')
} 

const convertEnvToJSON = (envFileContents) => {
    const fileLines = envFileContents.split('\n');
    const envJson = {};
    fileLines.forEach((line) => {
        if (line.trim() && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('='); // Handle values that might contain '='
            if (key && value) {
                envJson[key.trim()] = value.trim();
            }
        }
    })
    return envJson;
}

const handleInventoryFile = (file, envJson) => {
    console.log('Modifying inventory file..');
    const toReplace = 
    `[vps] 
    ${envJson.host_ip} ansible_user=${envJson.host_user} ansible_port=${envJson.host_port} ansible_ssh_private_key_file=${envJson.host_ssh_key_private_path} ansible_ssh_common_args='-o IdentitiesOnly=yes'
`
    fs.writeFileSync(file, toReplace, 'utf-8');
}

const handleOtherFiles = (file, envJson) => {
    console.log(`Modifying file: ${file}`);
    const fileContent = fs.readFileSync(file, 'utf8');
    const lines = fileContent.split('\n');
    let newFileContent = ``;
    lines.forEach((line, index) => {
        const [key] = line.split(':');
        if(key && envJson[key.trim()]) {
            newFileContent += `${key}: ${envJson[key.trim()]}${index === lines.length - 1 ? '' : '\n'}`;
        }
    })
    fs.writeFileSync(file, newFileContent, 'utf-8');
}

const fileExists = (filePath) => {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

const processFiles = () => {
    try {
        console.log('Processing configuration files...');
        modifyGitIgnoreFile('.gitignore', true);

        // Check if .env exists
        if (!fileExists('.env')) {
            console.error('Error: .env file not found!');
            process.exit(1);
        }

        // Get list of existing files
        const existingFiles = listOfFiles.filter(file => {
            const exists = fileExists(file);
            if (!exists) {
                console.log(`Warning: ${file} not found, skipping...`);
            }
            return exists;
        });

        if (existingFiles.length === 0) {
            console.error('Error: No configuration files found to process!');
            process.exit(1);
        }

        // Process the files
        const envFileContents = fs.readFileSync('.env', 'utf8');
        const envJson = convertEnvToJSON(envFileContents);

        existingFiles.forEach((file) => {
            if (file === '.env') return; // Skip .env file itself
            
            try {
                if(file === 'inventory.ini') {
                    handleInventoryFile(file, envJson);
                } else {
                    handleOtherFiles(file, envJson);
                }
                console.log(`Successfully processed ${file}`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err.message);
            }
        });

        modifyGitIgnoreFile('.gitignore', false);
        console.log('All files processed successfully!');
        process.exit(0);
        
    } catch(err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

processFiles()