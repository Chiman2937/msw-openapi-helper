// msw.config.example.js
const config = {
  // Enable MSW in development
  enabledInDevelopment: true,

  // Enable MSW in production (usually false)
  enabledInProduction: false,

  // Optional: Custom handlers path
  handlersPath: 'src/lib/msw/handlers',

  // Optional: Service worker URL
  serviceWorkerUrl: '/mockServiceWorker.js',

  // Optional: Unhandled request behavior
  onUnhandledRequest: 'bypass', // 'warn' | 'error' | 'bypass'
};

export default config;
