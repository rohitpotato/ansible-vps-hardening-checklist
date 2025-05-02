const { execSync } = require('child_process');
const fs = require('fs');
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
        const [key, value] = line.split('=');   
        envJson[key] = value;
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
        if(envJson[key]) {
            newFileContent += `${key}: ${envJson[key]}${index === lines.length - 1 ? '' : '\n'}`;
        }
    })
    fs.writeFileSync(file, newFileContent, 'utf-8');
}

const postCommit = () => {
    try {
        console.log('Running post-commit hook..');
        modifyGitIgnoreFile('.gitignore', true);
        const output = execSync('git status --porcelain -uall')
        .toString()
        .split('\n')
        .filter(Boolean);       

        const files = new Set();

        for (const line of output) {
          const filepath = line.slice(3); // skip status code
          if(listOfFiles.includes(filepath)) {
            files.add(filepath);
          }
        }
       
        const filesToModify = Array.from(files);
        const filesWithoutEnv = filesToModify.filter((file) => file !== '.env');
        const envFileContents = fs.readFileSync('.env', 'utf8');
        const envJson = convertEnvToJSON(envFileContents);
        filesWithoutEnv.forEach((file) => {
            if(file === 'inventory.ini') {
                handleInventoryFile(file, envJson);
            } else {
                handleOtherFiles(file, envJson);
            }
        })

        modifyGitIgnoreFile('.gitignore', false);
        process.exit(0)
        
    } catch(err) {
        console.log(err);
        process.exit(0)
    }
}

postCommit()