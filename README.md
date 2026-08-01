# 🛡️ UniFied Kiosk App

UniFied is an enterprise-grade, Electron-based desktop application designed for secure laboratory management and endpoint security. It transforms standard Windows PCs into restricted kiosk terminals, ensuring secure student access, attendance logging, and hardware protection.

## ✨ Core Features

- **OS-Level Lockdown:** Modifies Windows Registry to run as the primary shell (replacing `explorer.exe`) and blocks hardware interrupt keys (e.g., `Ctrl+Alt+Del`, `Alt+Tab`).
- **Cryptographic Handshake:** Utilizes AES-256-GCM encryption via dynamic QR codes and Bluetooth Low Energy (BLE) for secure, offline session verification.
- **Instructor Control Panel:** A hidden, role-based UI triggered via a secure mobile app scan, allowing operators to execute peer switching, emergency unlocks, and safe PC shutdowns.
- **Dual-Layer Session Purge:** Automatically destroys session tokens upon graceful OS shutdowns and sudden power losses (boot-up purge) to prevent unauthorized auto-logins.
- **Offline Data Queuing:** Seamlessly caches PC registration and usage logs locally using SQLite/JSON, automatically synchronizing with the Admin Cloud (Firebase) once network connectivity is restored.

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript (TSX), Tailwind CSS
- **Backend/Desktop Runtime:** Electron, Node.js
- **Build Tool:** Vite
- **Data & Auth:** Local Storage (electron-store), Firebase Firestore

## 🚀 Development Setup

To run this project locally on your machine in development mode (which bypasses the OS-level kiosk lock for safe debugging):

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/XYZygarde/UniFied-Electron.git](https://github.com/XYZygarde/UniFied-Electron.git)
   ```
