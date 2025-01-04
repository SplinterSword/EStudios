# E-Studios

This is my very own screen recorderer build using Electron, which uses NodeJS and Typescript for the backend (Main Process) and React for the frontend (Renderer Process). 

## Why Electron

- Electron is a cross-platform desktop application framework that uses NodeJS and Typescript for the backend and React for the frontend.

- Electron provides a great base for building desktop applications that are fast, secure, and easy to maintain.

- Electron provides great performance and security as the two processes are completely isolated from each other and the communication between them is done through IPC (Inter-Process Communication) through the APIs exposed in preload.js file.

- Electron is bundled with chrominum which ensures that every system has the same user experience and can be used on all platforms like linux, windows and macOS.

- Electron also includes a bundler which allows us to build the application for all platforms in a single command.

## Recommended IDE Setup (Optional)

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
