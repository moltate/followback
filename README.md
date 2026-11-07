# Open Source Project — Linux Kernel
### Open Source Software | VIT Bhopal | NGMC Course

| Field | Details |
|---|---|
| **Student Name** | Ankit Pandey |
| **Registration Number** | 24BCE10540 |
| **Chosen Software** | Linux Kernel |
| **License** | GNU General Public License v2 (GPL v2) |

---

## About This Project

This repository contains five shell scripts written as part of the **Open Source Audit** capstone project for the OSS NGMC course at VIT Bhopal. Each script demonstrates practical Linux shell scripting skills while exploring the Linux Kernel as an open-source software project.

---

## Repository Structure

```
oss-audit-[rollnumber]/
├── script1_system_identity.sh       # System welcome screen with OS info
├── script2_package_inspector.sh     # Checks FOSS packages and versions
├── script3_disk_permission_auditor.sh  # Audits directory permissions/sizes
├── script4_log_analyzer.sh          # Analyzes log files for keywords
├── script5_manifesto_generator.sh   # Generates a personal OSS manifesto
└── README.md
```

---

## Environment Requirements

- **OS**: Linux (Ubuntu 22.04 / 24.04 recommended) or WSL2 on Windows
- **Shell**: Bash (pre-installed on all Linux systems)
- **Dependencies**: `coreutils`, `util-linux`, `dpkg` (all pre-installed on Ubuntu/WSL2)

No additional installations required for any script.

---

## Setup Instructions

### Step 1 — Clone the repository

```bash
git clone https://github.com/moltate/open-source-project
cd open-source-project
```

### Step 2 — Make all scripts executable

```bash
chmod +x script1_system_identity.sh
chmod +x script2_package_inspector.sh
chmod +x script3_disk_permission_auditor.sh
chmod +x script4_log_analyzer.sh
chmod +x script5_manifesto_generator.sh
```

---

## How to Run Each Script

### Script 1 — System Identity Report
Displays OS name, kernel version, logged-in user, home directory, uptime, date/time, and license info.

```bash
./script1_system_identity.sh
```

**Expected output:** A formatted report showing your Linux system details.

---

### Script 2 — FOSS Package Inspector
Checks whether git, python3, apache2, and vlc are installed. Prints version and a philosophy note for each.

```bash
./script2_package_inspector.sh
```

**Expected output:** Installation status, version numbers, and open-source philosophy notes per package.

---

### Script 3 — Disk and Permission Auditor
Loops through key system directories and reports permissions, ownership, and size. Also checks for the Linux Kernel config file.

```bash
./script3_disk_permission_auditor.sh
```

**Expected output:** A table of directories with their permission strings and disk usage.

---

### Script 4 — Log File Analyzer
Reads any log file and counts lines matching a keyword. Prints the last 5 matching lines.

```bash
# Basic usage (default keyword: error)
./script4_log_analyzer.sh /var/log/dpkg.log

# With a custom keyword
./script4_log_analyzer.sh /var/log/dpkg.log install

# Another example
./script4_log_analyzer.sh /var/log/auth.log sudo
```

**Arguments:**
- `$1` — Path to the log file (required)
- `$2` — Keyword to search for (optional, defaults to `error`)

**Expected output:** Count of keyword matches and the last 5 matching lines.

---

### Script 5 — Open Source Manifesto Generator
Asks you three interactive questions and generates a personalised open-source philosophy statement saved to a `.txt` file.

```bash
./script5_manifesto_generator.sh
```

**Interactive prompts:**
1. Name one open-source tool you use every day
2. In one word, what does 'freedom' mean to you?
3. Name one thing you would build and share freely

**Output file:** `manifesto_[yourusername].txt` saved in the current directory.

---

## Shell Concepts Used

| Script | Key Concepts |
|---|---|
| Script 1 | Variables, command substitution `$()`, `echo`, `grep`, `cut` |
| Script 2 | `for` loop, `if-then-else`, `case` statement, `dpkg`, `awk` |
| Script 3 | `for` loop over array, `ls -ld`, `du -sh`, `awk`, `cut`, conditionals |
| Script 4 | `while read` loop, `if-then`, counter variables, `$1`/`$2` arguments, `grep`, `tail` |
| Script 5 | `read -p`, string concatenation, `>` and `>>` file writing, `date`, aliases concept |

---

## Notes

- All scripts are tested on **Ubuntu 22.04 via WSL2**
- Scripts use `dpkg` for package checking (Debian/Ubuntu systems)
- Script 4 works best with `/var/log/dpkg.log` or `/var/log/auth.log` on WSL2
- Script 3 may show restricted sizes for some directories due to WSL2 permissions
