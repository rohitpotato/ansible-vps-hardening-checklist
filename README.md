# VPS Security Checklist Ansible Playbook

This Ansible playbook provides a comprehensive security hardening solution for Linux VPS servers. It implements various security best practices and system optimizations to ensure your VPS is properly secured and configured.

## Features

- 🔒 **SSH Hardening**: Secure SSH configuration with key-based authentication
- 🛡️ **Firewall Setup**: UFW (Uncomplicated Firewall) configuration
- 🚫 **Fail2Ban**: Protection against brute force attacks
- 🔍 **RKHunter**: Rootkit detection and system security scanning
- 📊 **System Observability**: Monitoring and logging setup
- 💾 **Filesystem Security**: Secure mount options and filesystem configurations
- 🎯 **Kernel Hardening**: Kernel parameter optimization for security
- 🔐 **System Hardening**: Various system-level security configurations
- ⚡ **Runtime Optimization**: System performance and security tweaks

## Prerequisites

- Ansible 2.9 or higher installed on your local machine
- A target Linux VPS server (tested on Ubuntu/Debian)
- SSH access to your VPS with sudo privileges
- Basic understanding of Ansible and Linux system administration

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/vps-checklist.git
   cd vps-checklist
   ```

2. Configure your inventory file:
   ```bash
   cp inventory.ini.example inventory.ini
   ```
   Edit `inventory.ini` with your VPS details:
   ```ini
   [vps]
   your-host-here ansible_user=your-user ansible_port=22 ansible_ssh_private_key_file=/path/to/your/private/key ansible_ssh_common_args='-o IdentitiesOnly=yes'
   ```

## Configuration

### Variables and Settings

All configuration settings can be found in the `vars/` directory. Each role has its own variable file that you can customize:

- SSH configuration (`vars/ssh.yml`)
- Firewall rules (`vars/ufw.yml`)
- System parameters (`vars/system.yml`)
- Security thresholds (`vars/security.yml`)
- Monitoring settings (`vars/monitoring.yml`)
- And more...

Modify these files to match your security requirements and system needs.

### Available Roles

The playbook includes several roles that can be enabled or disabled based on your needs:

- `ssh`: SSH server hardening
- `ufw`: Firewall configuration
- `fail2ban`: Brute force protection
- `rkhunter`: Rootkit detection
- `observability`: System monitoring
- `filesystem`: Filesystem security
- `kernel-memory`: Kernel hardening
- `harden`: General system hardening
- `system`: System optimizations
- `runtime`: Runtime configurations

## Usage

1. Test the connection to your VPS:
   ```bash
   ansible vps -m ping
   ```

2. Run a security check (dry-run):
   ```bash
   ansible-playbook roles/main.yml --check
   ```

3. Apply the security configurations:
   ```bash
   ansible-playbook roles/main.yml
   ```

### Customization

You can customize the security settings by:

1. Modifying role-specific variables in `vars/` directory
2. Creating custom handlers in `handlers/` directory
3. Adding custom templates in `templates/` directory

## Security Considerations

- Always backup your system before applying security changes
- Test changes in a staging environment first
- Keep track of changes made to your system
- Regularly update and audit your security configurations
- Monitor system logs for any suspicious activities

## Troubleshooting

If you encounter issues:

1. Check the Ansible logs for detailed error messages
2. Verify your VPS connectivity and credentials
3. Ensure all required packages are installed
4. Check system logs on the target VPS
5. Run the playbook with `-vvv` flag for verbose output

## Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues for bugs and feature requests.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ansible community for best practices and modules
- Various security frameworks and guidelines
- Linux security community

## Support

If you need help or have questions:

1. Create an issue in the repository
2. Check existing documentation
3. Review closed issues for similar problems

## Disclaimer

This playbook implements security best practices but should not be considered a complete security solution. Always follow your organization's security policies and regularly audit your systems. 