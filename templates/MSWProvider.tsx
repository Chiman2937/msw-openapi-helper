// src/msw/index.jsx
'use client';

import { useEffect } from 'react';

const config = {
  enabledInDevelopment: true,
  enabledInProduction: false,
  handlersPath: 'src/mock/handlers',
  serviceWorkerUrl: '/mockServiceWorker.js',
  onUnhandledRequest: 'bypass' as const,
};

interface Props {
  children: React.ReactNode;
}

export function MSWProvider({ children }: Props) {
  useEffect(() => {
    async function initMSW() {
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
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.warn('⚠️  MSW Client setup failed:', errorMessage);
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
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.warn('⚠️  MSW Client setup failed:', errorMessage);
    }
  })();
}
