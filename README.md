# Deccan Turf Web App

This project is a web application built using React, TypeScript, and Vite. It also integrates Firebase for backend services.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)
- [JDK 21](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html) (required for firebase)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd deccan-turf-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Setting Up Firebase Environment Variables

1. Obtain the Firebase secrets from the [Google Group](https://groups.google.com/g/deccan-turf).
2. Create a `.env` file in the root of the project directory.
3. Copy the contents of `.env.example` into `.env`.
4. Replace the placeholder values in `.env` with the actual Firebase secrets provided.

## Run/Build

### Running the Development Server

To start the development server, run:
```bash
npm run dev
# or
yarn dev
```

This will start the Vite development server. Open your browser and navigate to `http://localhost:5173` to view the app.

### Building for Production

To build the application for production, run:
```bash
npm run build
# or
yarn build
```

The production-ready files will be generated in the `dist` directory.

### Previewing the Production Build

To preview the production build locally, run:
```bash
npm run preview
# or
yarn preview
```

This will serve the files from the `dist` directory locally.

## Running Firebase

To run Firebase services locally, follow these steps:

1. Install the Firebase CLI if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to your Firebase account:
   ```bash
   firebase login
   ```

3. Start the Firebase emulator suite for local development:
   ```bash
   firebase emulators:start
   ```

   This will start the local emulators for the selected Firebase services. You can access the emulator UI at `http://localhost:4000` (default port).

4. To deploy your Firebase project to the cloud, run:
   ```bash
   firebase deploy
   ```

   Ensure you have the correct Firebase project selected before deploying.

---

For more details on the project setup and configuration, refer to the [Vite documentation](https://vitejs.dev/) and [Firebase documentation](https://firebase.google.com/docs).
