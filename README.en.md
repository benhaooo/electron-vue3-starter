# Electron Vue3 Starter

<div align="center">

[English](README.en.md) | [中文](README.md)

</div>

A modern, comprehensive Electron application template built with the latest web technologies for creating cross-platform desktop applications.

## 🚀 Features

### Core Technologies

- **Electron** - Cross-platform desktop app framework
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework

### Development Experience

- ⚡ **Hot Module Replacement (HMR)** - Instant feedback during development
- 🔧 **TypeScript Support** - Full type safety for both main and renderer processes
- 🎨 **Modern UI Components** - Pre-built components with Tailwind CSS
- 📱 **Responsive Design** - Mobile-first responsive layouts
- 🔍 **ESLint & Prettier** - Code linting and formatting
- 🧪 **Example Components** - Comprehensive examples and patterns

### Electron Features

- 🔒 **Security First** - Context isolation and secure IPC communication
- 🖥️ **Native Integration** - System dialogs, menus, and window controls
- 📦 **Multi-platform Building** - Build for Windows, macOS, and Linux
- ⚙️ **Configurable** - Extensive configuration options
- 🎯 **Performance Optimized** - Efficient bundling and loading
- 🌓 **Dark/Light Themes** - Complete theme support with system theme detection

## 📁 Project Structure

```
electron-vue3-starter/
├── out/                      # Build output
├── release/                  # Packaged app output
├── src/
│   ├── main/                 # Electron Main Process
│   │   └── index.ts          # Main process entry point
│   ├── preload/              # Preload Scripts
│   │   └── index.ts          # Bridge between main and renderer
│   └── renderer/             # Vue 3 Renderer Process
│       ├── components/       # Vue Components
│       ├── router/           # Router config
│       └── index.ts          # Renderer process entry point
├── index.html                # Renderer HTML entry
├── electron.vite.config.ts   # Electron Vite config
└── ...                       # Other config files
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm

### Installation

1. **Clone or download this template**

   ```bash
   git clone <repository-URL>
   cd electron-vue3-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

## 🚀 Development

### Start the development server

```bash
npm run dev
```

This command will:

- Start the Vite development server for the renderer process
- Launch Electron with hot-reload support
- Automatically open DevTools in development mode

### Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build and package the application for the current platform
- `npm run build:win` - Build and package for Windows
- `npm run build:mac` - Build and package for macOS
- `npm run build:linux` - Build and package for Linux
- `npm run lint` - Lint your code with ESLint
- `npm run lint:fix` - Lint your code and fix issues automatically
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Production Build

### Build the application

```bash
# This will build the app for your current development platform
npm run build
```

### Package for distribution

```bash
# For specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

The built application will be available in the `release/` directory.

### 🐳 Building with Docker

This project supports cross-platform builds using Docker, which is very helpful for ensuring a consistent build environment without installing complex dependencies on your local machine.

#### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

#### Configuration

1.  Create a `.env` file in the project root. You can use the example below to configure your build environment:

    ```env
    # ------------------------- Docker Build Environment Configuration -------------------------

    # NPM mirror (optional, defaults to https://registry.npmmirror.com)
    NPM_MIRROR=https://registry.npmmirror.com

    # ------------------------- Output Configuration -------------------------

    # Output directories (can be relative or absolute paths)
    # 1. Relative path: Recommended to start with './', e.g., './release/win'
    # 2. Absolute path: Use a format that Docker can recognize.
    #    - Linux/macOS: /path/to/your/dir
    #    - Windows (WSL2): /mnt/c/Users/YourUser/Desktop
    #    - Please ensure the path case is correct.
    OUTPUT_DIR_WIN=./release/win
    OUTPUT_DIR_LINUX=./release/linux
    OUTPUT_DIR_MAC=./release/mac

    # ------------------------- Advanced Options -------------------------

    # Whether to run the build inside the Docker container as a non-root user (electronuser) (true/false)
    # Defaults to 'false'
    USE_NON_ROOT=false

    # Set permissions for the Docker volume mount output directory.
    # If you encounter permission issues on Linux, you can try '777'.
    OUTPUT_PERMISSION=777
    ```

2.  **Important Notes**:
    *   **Path Format**: The Docker build script will not automatically modify the paths you provide. It is your responsibility to decide whether to use a relative path (starting with `./`) or an absolute path (starting with `/`). Incorrect path formats may cause build failures or output files to be placed in unintended locations.
    *   **Absolute Paths & WSL**: When using Docker in a WSL2 environment on Windows, your Windows drives (e.g., `D:\`) are mounted under the `/mnt/` directory (e.g., `/mnt/d/`). Please ensure you use the correct absolute path and pay attention to case sensitivity.

#### Build Commands

Use the `docker-build.sh` script in the root directory to perform builds. Before running, ensure the script is executable: `chmod +x docker-build.sh`.

```bash
# Show help information
./docker-build.sh

# Build for Windows
./docker-build.sh win

# Build for Linux
./docker-build.sh linux

# Build for macOS
./docker-build.sh mac

# Build for all platforms at once
./docker-build.sh all
```

The build artifacts will be placed in the directories specified in your `.env` file.

## 🔧 Configuration

### Electron Builder

Configure packaging options in `electron-builder.json`.

### Vite Configuration

Configure Vite options for the main, preload, and renderer processes in `electron.vite.config.ts`.

### TypeScript Configuration

Configure TypeScript options for the entire project in the root `tsconfig.json`, which covers main, preload, and renderer processes.

## 🎨 Customization

### Styling

- Modify `tailwind.config.js` to customize design tokens
- Update `src/renderer/style.css` to set global styles
- Create component-specific styles in Vue SFC files

### Adding New Pages

1. Create a new Vue component in `src/renderer/views/`
2. Add a route in `src/renderer/router/index.ts`
3. Update navigation in `src/renderer/App.vue`

### IPC Communication

1. Add new IPC handlers in `src/main/ipcHandlers.ts` (or your chosen file)
2. Expose methods in `src/preload/index.ts`
3. Update TypeScript definitions in `src/renderer/types/electron.d.ts`

## �� Included Examples

### Vue 3 Composition API

- Reactive state management
- Computed properties
- Lifecycle hooks
- Custom composition functions

### Electron Integration

- System information retrieval
- File dialogs (open/save)
- Window controls
- Native menus
- IPC communication

### UI Components

- Feature cards
- Toggle switches
- Modal dialogs
- Form handling
- Responsive layouts

## 🔒 Security

This template implements Electron security best practices:

- **Context Isolation** - Renderer process isolated from Node.js
- **Preload Scripts** - Secure IPC communication bridge
- **CSP Headers** - Web security content security policy
- **No Node Integration** - Renderer process has no direct Node.js access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and code checks
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Electron](https://electronjs.org/) - Desktop application framework
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Vite](https://vitejs.dev/) - Fast build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://typescriptlang.org/) - Typed JavaScript

## 📞 Support

If you encounter any issues or have questions:

1. Consult the documentation
2. Search existing issues
3. Create a detailed new issue

## 🔧 Troubleshooting

### Type Errors

If you encounter TypeScript type errors, ensure:

1. `@types/node` and `@types/electron` are installed
2. `tsconfig.json` includes the correct type definitions
3. Access Electron features through `window.electronAPI` in the renderer process, not directly using the `process` object

### Build Issues

If you encounter issues during the build process:

1. Ensure Node.js version >= 18.0.0
2. Delete the `out`, `release`, `node_modules`, and `package-lock.json`
3. Reinstall dependencies: `npm install`

### Platform-specific Issues

- **Windows**: Ensure Visual Studio Build Tools are installed
- **macOS**: Make sure Xcode Command Line Tools are installed
- **Linux**: Ensure necessary build dependencies are installed

---

**Happy Coding! 🎉**
