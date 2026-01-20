import React, { useEffect, useRef, useState, PropsWithChildren } from 'react';

interface RevealProps extends PropsWithChildren {
  as?: keyof JSX.IntrinsicElements;
  delay?: number; // ms
  y?: number; // translate start
  className?: string;
  id?: string;
}

// Lightweight intersection-based fade/slide in (no external lib)
export const Reveal: React.FC<RevealProps> = ({ as='div', delay=0, y=24, className, id, children }) => {
  const Tag: any = as;
  const ref = useRef<HTMLElement|null>(null);
  const [visible,setVisible] = useState(false);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ setVisible(true); obs.disconnect(); } });
    },{threshold:0.25});
    obs.observe(el); return ()=> obs.disconnect();
  },[]);
  return (
    <Tag ref={ref} id={id} className={className} style={{
      opacity: visible?1:0,
      transform: visible? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.25,.6,.3,1) ${delay}ms`
    }}>
      {children}
    </Tag>
  );
};

export default Reveal;
