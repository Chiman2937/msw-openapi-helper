// config/handlers.config.example.js
const config = {
  // Directory containing .msw.ts files
  endpointsDir: 'src/api/endpoints',

  // Output file path
  outputFile: 'src/mocks/handlers.ts',

  // HTTP methods to include in handlers
  // Example: ['get'] will only include GET requests
  // Example: ['get', 'post'] will include GET and POST requests
  includeMethods: ['get'],
};

export default config;
