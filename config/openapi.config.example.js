// config/openapi.config.example.js
const config = {
  // Source type: 'js' or 'json'
  type: 'js',

  // Swagger URL
  url: 'https://your-api.com/docs/swagger-ui-init.js',
  // If type is 'json': 'https://your-api.com/v3/api-docs'

  // Base URL for API requests
  // This will be set as the OpenAPI spec's servers[0].url
  // Many backend frameworks set servers[0].url to "/" by default,
  // so this baseUrl is used to replace it with your actual API server URL
  baseUrl: 'https://your-api.com',

  // Optional: Remove path prefix from all endpoints
  // Example: '/{teamId}' will transform '/16-1/users' to '/users'
  removePathPrefix: '/{teamId}',

  // Output file path
  outputFile: 'openapi.json',
};

export default config;
