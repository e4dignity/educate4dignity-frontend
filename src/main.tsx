import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './components/admin/admin-tokens.css'
import './i18n'
// Attempt to retrieve a dev JWT for local admin flows (non-prod only)
import { fetchAndStoreDevToken } from './services/devAuth';
import { AuthProvider } from './hooks/authContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'

const queryClient = new QueryClient();

// If running in Vite dev, try to fetch a dev token so admin endpoints work locally.
if ((import.meta as any).env?.DEV) {
  // best-effort, don't block rendering
  fetchAndStoreDevToken().catch(()=>void 0);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </RecoilRoot>
  </React.StrictMode>,
)
