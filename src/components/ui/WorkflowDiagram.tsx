import React from 'react';
import { useTranslation } from 'react-i18next';

interface Step {
  id: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

// Simple minimalist inline SVG icon helpers
const IconDefine = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth={2}>
    <path d="M4 5h16M4 12h10M4 19h7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconDonate = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth={2}>
    <path d="M12 21c4.418 0 8-3.134 8-7 0-4.5-5-8-8-11-3 3-8 6.5-8 11 0 3.866 3.582 7 8 7Z" />
    <path d="M10.5 13.5c0 1 1 1.75 1.75 1.75s1.75-.6 1.75-1.5c0-.9-.6-1.3-1.75-1.5s-1.75-.6-1.75-1.5.75-1.5 1.75-1.5S15 9 15 10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconProduce = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth={2}>
    <rect x={3} y={7} width={7} height={13} rx={2} />
    <rect x={14} y={4} width={7} height={16} rx={2} />
  </svg>
);
const IconDistribute = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth={2}>
    <path d="M4 4h6l2 4h8v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z" />
    <path d="M10 12h4" strokeLinecap="round" />
  </svg>
);
const IconEducate = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth={2}>
    <path d="M3 7 12 3l9 4-9 4-9-4Z" strokeLinejoin="round" />
    <path d="M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5" />
  </svg>
);

export const WorkflowDiagram: React.FC = () => {
  const { t } = useTranslation();
  
  const steps: Step[] = [
    { id:1, title:t('workflow.define.title','Define'), desc:t('workflow.define.desc','Set goals & plan'), icon:<IconDefine/> },
    { id:2, title:t('workflow.donate.title','Donate'), desc:t('workflow.donate.desc','Funds allocated'), icon:<IconDonate/> },
    { id:3, title:t('workflow.produce.title','Produce'), desc:t('workflow.produce.desc','Local women craft kits'), icon:<IconProduce/> },
    { id:4, title:t('workflow.distribute.title','Distribute'), desc:t('workflow.distribute.desc','Kits delivered & logged'), icon:<IconDistribute/> },
    { id:5, title:t('workflow.educate.title','Educate'), desc:t('workflow.educate.desc','Hygiene learning sessions'), icon:<IconEducate/> },
  ];

  return (
    <div className="relative" aria-labelledby="workflow-title">
      {/* Connector line (horizontal desktop / vertical mobile) */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center">
        {/* Horizontal */}
        <div className="hidden md:block w-full h-px bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200" />
        {/* Vertical (mobile) */}
        <div className="md:hidden w-px h-full bg-gradient-to-b from-rose-200 via-rose-300 to-rose-200" />
      </div>
      <ol className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-4">
        {steps.map((s, i)=> {
          const number = s.id.toString();
          return (
            <li key={s.id} className="group flex md:flex-1 items-start md:items-center md:flex-col gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:flex-col md:gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-sm tracking-wide shadow-sm ring-1 ring-rose-200/70 bg-white text-rose-600 group-hover:scale-105 transition-transform">{s.icon}</div>
                  <span className="absolute -top-2 -right-2 text-[11px] bg-rose-600 text-white rounded px-1.5 py-0.5 font-bold shadow">{number}</span>
                </div>
              </div>
              <div className="pr-6 md:pr-0">
                <div className="font-semibold text-[15px] md:text-[16px] text-slate-900 mb-1">{s.title}</div>
                <p className="text-[12.5px] md:text-[13px] text-slate-600 leading-snug max-w-[180px]">{s.desc}</p>
              </div>
              {i < steps.length-1 && (
                <div className="md:hidden ml-6 pl-6 border-l border-dashed border-rose-200" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default WorkflowDiagram;
