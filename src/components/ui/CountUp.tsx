import React from 'react';

interface CountUpProps {
  end: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  formatter?: (v:number)=>string;
  className?: string;
  start?: number;
  easing?: (t:number)=>number; // t 0..1
  onDone?: ()=>void;
}

const easeOutCubic = (t:number)=> 1 - Math.pow(1 - t, 3);

export const CountUp: React.FC<CountUpProps> = ({ end, start=0, duration=1600, prefix='', suffix='', formatter, className='', easing=easeOutCubic, onDone }) => {
  const ref = React.useRef<HTMLSpanElement|null>(null);
  const [val,setVal] = React.useState(start);
  const doneRef = React.useRef(false);

  React.useEffect(()=> {
    const el = ref.current; if(!el) return;
    let frame: number; let startTs: number|undefined;
    const step = (ts:number)=> {
      if(startTs===undefined) startTs = ts;
      const p = Math.min(1, (ts - startTs)/duration);
      const eased = easing(p);
      const current = start + (end - start)*eased;
      setVal(current);
      if(p < 1) { frame = requestAnimationFrame(step); } else if(!doneRef.current) { doneRef.current = true; onDone && onDone(); }
    };
    const observer = new IntersectionObserver(entries=> {
      entries.forEach(entry=> {
        if(entry.isIntersecting) {
          observer.disconnect();
          frame = requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(el);
    return ()=> { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [end,start,duration,easing,onDone]);

  const display = formatter ? formatter(val) : Math.round(val).toLocaleString();

  return <span ref={ref} className={className}>{prefix}{display}{suffix}</span>;
};

export default CountUp;
