# Node.js TypeScript Template

A modern Node.js TypeScript template with essential configurations for building RESTful APIs. This template includes support for environment variable management, logging, and development tooling.

## Features

- **TypeScript**: Leverage the power of TypeScript for type safety and improved developer experience.
- **Environment Management**: Easily manage environment variables with support for different environments using `.env` files.
- **Logging**: Built-in logging using `morgan` and `winston` for effective debugging and monitoring.
- **Development Tooling**: Use `nodemon` for automatic restarts during development, and `tsc` for compiling TypeScript code.
- **Cross-Platform Compatibility**: Set environment variables with `cross-env` to ensure your scripts work on all operating systems.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/node-ts-template.git
   cd node-ts-template

2. Install the dependencies:
    ```bash
   npm install

3. Set up your environment variables:
   - Create a .env file for production:
      ```bash
     touch .env

  - Create a .env.dev file for development:
      ```bash
     touch .env.dev

### Scripts

- Start the application in production mode:
   ```bash
  npm start

- Run the application in development mode (with automatic restarts):
   ```bash
  npm run dev

- Build the application (compile TypeScript to JavaScript):
   ```bash
  npm run build

- Clean the build directory:
   ```bash
  npm run clean
      


      
