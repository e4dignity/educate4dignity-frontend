import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // load all, including VITE_*
  const testUrl = env.VITE_STRIPE_CHECKOUT_TEST_URL;
  const useMock = env.VITE_USE_MOCK_API === 'true';

  return {
    base: './',
    plugins: [
      react(),
      useMock && ({
        name: 'mock-checkout-session',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use('/api/create-checkout-session', async (req, res, next) => {
            if (req.method !== 'POST') return next();
            try {
              let body = '';
              req.on('data', (chunk) => (body += chunk));
              req.on('end', () => {
                const mockId = 'cs_test_' + Math.random().toString(36).slice(2, 10);
                const payload: any = { id: mockId };
                if (testUrl) payload.url = testUrl;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(payload));
              });
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: (e as any)?.message || 'mock error' }));
            }
          });
        },
      } as any),
    ].filter(Boolean) as any,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: true,
      // In dev, optionally proxy /api to a remote backend (e.g., Render) to avoid CORS issues.
      // Set VITE_PROXY_API_TARGET in .env.local to enable.
      proxy: env.VITE_PROXY_API_TARGET
        ? {
            '/api': {
              target: env.VITE_PROXY_API_TARGET,
              changeOrigin: true,
              secure: true,
            },
          }
        : undefined,
    },
  };
});
