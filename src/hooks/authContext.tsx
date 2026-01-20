import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '../types';
import { USE_MOCK } from '../config';
import { login as apiLogin, logout as apiLogout } from '../services/authApi';

interface AuthUser { id: string; email: string; role: UserRole; name?: string; }
interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string, roleHint?: UserRole) => Promise<AuthUser>;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'e4d_auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(()=>{ const raw = localStorage.getItem(STORAGE_KEY); if(raw){ try { setUser(JSON.parse(raw)); } catch {} } },[]);

  const login = async (email: string, password: string, roleHint?: UserRole) => {
    // Dev credentials from seed.ts
    const DEV_EMAIL = 'admin@e4d.test';
    const DEV_PASSWORD = 'admin123';

    // IMPORTANT: In non-mock/production, always perform a real backend login so
    // access/refresh tokens are stored. Only simulate in mock mode.
    if (email === DEV_EMAIL && password === DEV_PASSWORD && USE_MOCK) {
      await new Promise(r => setTimeout(r, 300));
      const u: AuthUser = { id: 'dev-admin-001', email: DEV_EMAIL, role: 'admin', name: 'Dev Admin' };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return u;
    }

    if (!USE_MOCK) {
      // Real backend login; stores e4d_access_token and e4d_refresh_token
      await apiLogin(email, password);
    } else {
      // Mock mode: pretend a network call
      await new Promise(r=>setTimeout(r,300));
    }
    
    // Simple heuristic mapping for other accounts
    let role: UserRole = 'donor';
    if(email.startsWith('admin')) role = 'admin';
    else if(email.includes('supplier')) role = 'supplier';
    else if(email.includes('distrib')) role = 'distributor';
    else if(email.includes('trainer')) role = 'trainer';
    else if(email.includes('team')) role = 'team_member';
    else if(roleHint) role = roleHint;
  const u: AuthUser = { id: 'u_'+Math.random().toString(36).slice(2), email, role, name: email.split('@')[0] };
    setUser(u); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return u; // Return the user object for immediate access
  };
  const logout = () => { setUser(null); localStorage.removeItem(STORAGE_KEY); apiLogout(); };
  const hasRole = (...roles: UserRole[]) => !!user && roles.includes(user.role);
  // Dev convenience: auto-login disabled to not interfere with manual testing
  // useEffect(()=>{
  //   try {
  //     if (import.meta.env?.DEV) {
  //       const hasToken = !!localStorage.getItem('e4d_access_token');
  //       const hasUser = !!localStorage.getItem(STORAGE_KEY);
  //       if (!hasToken || !hasUser) {
  //         // Attempt silent login with seeded credentials; ignore failures
  //         login('admin@e4d.test','admin123','admin').catch(()=>{});
  //       }
  //     }
  //   } catch {}
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[]);

  return <AuthContext.Provider value={{user, login, logout, hasRole}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => { const ctx = useContext(AuthContext); if(!ctx) throw new Error('useAuth outside provider'); return ctx; };
