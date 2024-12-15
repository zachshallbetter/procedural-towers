# Procedural Node Generation System

A TypeScript-based procedural generation system for creating dynamic, biome-specific 3D towers using Three.js. The system features customizable nodes, materials, decorations, and animations with a comprehensive parameter control system.

## Features

### Core Components

- **Node Generation**: Create procedural nodes with different shapes (cube, cylinder, arch)
- **Material System**: Biome-specific materials with dynamic variations
- **Decoration System**: Procedural placement of decorations (moss, vines, coral)
- **Tower Generation**: Stack nodes with different patterns and rules
- **Parameter Control**: Comprehensive GUI for real-time parameter adjustments

### Biome System

Three distinct biomes with unique characteristics:
- **Forest**: Green tones with moss and vine decorations
- **Desert**: Sandy colors with minimal decorations
- **Ocean**: Blue tones with coral formations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd procedural-nodes
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

### Development Commands

- **Start Development Server**: `npm start`
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run serve`
- **Run Linter**: `npm run lint`
- **Fix Linting Issues**: `npm run lint:fix`

## Dependencies

### Production Dependencies
- **three**: ^0.158.0 - 3D graphics library
- **dat.gui**: ^0.7.9 - Parameter control interface
- **simplex-noise**: ^4.0.1 - Procedural noise generation

### Development Dependencies
- **typescript**: ^5.2.2 - Type safety and modern JavaScript features
- **vite**: ^4.5.0 - Development and build tool
- **@types/three**: ^0.158.0 - Three.js type definitions
- **@types/dat.gui**: ^0.7.10 - dat.GUI type definitions
- **@types/node**: ^22.10.2 - Node.js type definitions
- **eslint**: ^8.54.0 - Code quality and style enforcement
- **vite-tsconfig-paths**: ^4.2.1 - Path alias support

## Project Structure

```bash
src/
├── types/
│   ├── nodes.ts           # Type definitions for nodes
│   └── parameters.ts      # Type definitions for parameters
├── generators/
│   ├── MaterialFactory.ts # Material generation
│   ├── NodeGenerator.ts   # Node creation
│   └── DecorationGenerator.ts # Decoration system
├── controllers/
│   └── ParameterController.ts # GUI controls
├── config/
│   └── parameters.ts      # Default parameters
└── main.ts               # Main application
```

## Configuration

### Path Aliases
The project uses path aliases for cleaner imports:
- `@/*` resolves to `src/*`

### TypeScript Configuration
- Strict type checking enabled
- Modern ECMAScript features
- Path alias support
- Node.js type definitions

### Vite Configuration
- Development server on port 3000
- Path alias resolution
- TypeScript support
- Auto-opening in browser

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes using conventional commits:

```bash
git add .
git commit -m "type: description

- Detailed bullet points
- About the changes"
```

4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
