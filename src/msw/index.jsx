// src/msw/index.jsx
'use client';

import { useEffect } from 'react';

/**
 * MSW Provider Component
 * Automatically initializes MSW based on msw.config.js
 */
export function MSWProvider({ children }) {
  useEffect(() => {
    async function initMSW() {
      // MSW config 로드
      let config;
      try {
        const configModule = await import(process.cwd() + '/msw.config.js');
        config = configModule.default;
      } catch {
        // config 파일이 없으면 기본값
        config = {
          enabledInDevelopment: true,
          enabledInProduction: false,
          handlersPath: 'src/lib/msw/handlers',
          serviceWorkerUrl: '/mockServiceWorker.js',
          onUnhandledRequest: 'bypass',
        };
      }

      // MSW 활성화 여부 확인
      const isDev = process.env.NODE_ENV === 'development';
      const shouldEnable = isDev
        ? config.enabledInDevelopment
        : config.enabledInProduction;

      if (shouldEnable) {
        try {
          const [{ handlers }, { setupWorker }] = await Promise.all([
            import(process.cwd() + `/${config.handlersPath}`),
            import('msw/browser'),
          ]);

          const worker = setupWorker(...handlers);
          await worker.start({
            onUnhandledRequest: config.onUnhandledRequest,
            serviceWorker: { url: config.serviceWorkerUrl },
          });

          console.log('🔷 MSW Client ready');
        } catch (error) {
          console.warn('⚠️  MSW Client setup failed:', error.message);
        }
      }
    }

    initMSW();
  }, []);

  return children;
}

// 서버 MSW 자동 초기화
if (typeof window === 'undefined') {
  (async () => {
    try {
      // MSW config 로드
      let config;
      try {
        const configModule = await import(process.cwd() + '/msw.config.js');
        config = configModule.default;
      } catch {
        config = {
          enabledInDevelopment: true,
          enabledInProduction: false,
          handlersPath: 'src/lib/msw/handlers',
          onUnhandledRequest: 'bypass',
        };
      }

      // MSW 활성화 여부 확인
      const isDev = process.env.NODE_ENV === 'development';
      const shouldEnable = isDev
        ? config.enabledInDevelopment
        : config.enabledInProduction;

      if (shouldEnable) {
        const [{ handlers }, { setupServer }] = await Promise.all([
          import(process.cwd() + `/${config.handlersPath}`),
          import('msw/node'),
        ]);

        const server = setupServer(...handlers);
        server.listen({ onUnhandledRequest: config.onUnhandledRequest });
        console.log('🔶 MSW Server ready');
      }
    } catch (error) {
      console.warn('⚠️  MSW Server setup failed:', error.message);
    }
  })();
}
