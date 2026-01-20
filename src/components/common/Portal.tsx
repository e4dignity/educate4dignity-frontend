import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }: { children: React.ReactNode }) {
  const elRef = useRef<HTMLElement | null>(null);
  if (typeof document === 'undefined') return children as any;
  if (!elRef.current) {
    elRef.current = document.createElement('div');
    elRef.current.setAttribute('data-portal', 'true');
    elRef.current.style.position = 'relative';
    elRef.current.style.zIndex = '9999';
  }
  useEffect(() => {
    const modalRoot = document.getElementById('modal-root') || (() => {
      const d = document.createElement('div'); d.id = 'modal-root'; document.body.appendChild(d); return d;
    })();
    modalRoot.appendChild(elRef.current!);
    return () => { try { modalRoot.removeChild(elRef.current!); } catch {} };
  }, []);
  return createPortal(children, elRef.current);
}
