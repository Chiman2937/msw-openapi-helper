// config/openapi.config.example.js
const config = {
  // Source type: 'js' or 'json'
  type: 'js',

  // Swagger URL
  url: 'https://your-api.com/docs/swagger-ui-init.js',
  // If type is 'json': 'https://your-api.com/v3/api-docs'

  // Base URL for API requests
  baseUrl: 'https://your-api.com',

  // Optional: Remove path prefix from all endpoints
  // Example: '/{organizationId}' will transform '/org123/users' to '/users'
  removePathPrefix: '/{organizationId}',

  // Output file path
  outputFile: 'openapi.json',
};

export default config;
