#!/bin/bash
DATE=$(date "+%Y-%m-%d")
REPORT="/var/log/daily-security-report-${DATE}.log"

echo "===== SECURITY REPORT FOR ${DATE} =====" > $REPORT

echo -e "\n--- SSH Logins ---" >> $REPORT
journalctl -u ssh --since yesterday >> $REPORT

echo -e "\n--- Sudo Usage ---" >> $REPORT
journalctl -u sudo --since yesterday >> $REPORT

echo -e "\n--- Audit Events (Privileged Activity) ---" >> $REPORT
ausearch --start yesterday -k sudo_edit -k shadow_change -k ssh_config -k module_activity >> $REPORT

echo -e "\n--- Fail2ban Events ---" >> $REPORT
journalctl -u fail2ban --since yesterday >> $REPORT

echo -e "\n--- Rkhunter Output ---" >> $REPORT
grep "$(date '+%d/%m/%Y')" /var/log/rkhunter.log >> $REPORT

mail -s "[Daily Security Report] ${DATE}" rohit.mmm1996@gmail.com < $REPORT
