import { Info } from 'lucide-react';
import { useState } from 'react';

export function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center ml-2"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => { e.preventDefault(); setShow(!show); }}
    >
      <Info 
        size={14} 
        style={{ 
          color: show ? 'var(--electric)' : 'var(--text-muted)', 
          cursor: 'help',
          transition: 'color 0.2s ease'
        }} 
      />
      
      {/* Tooltip Popup */}
      <div 
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl shadow-2xl z-[999]"
        style={{
          background: 'rgba(7, 15, 60, 0.95)',
          border: '1px solid rgba(127,169,255,0.25)',
          backdropFilter: 'blur(12px)',
          opacity: show ? 1 : 0,
          visibility: show ? 'visible' : 'hidden',
          transform: show ? 'translate(-50%, 0) scale(1)' : 'translate(-50%, 4px) scale(0.95)',
          transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          pointerEvents: 'none',
        }}
      >
        <p style={{ 
          fontSize: 12, 
          lineHeight: 1.5, 
          color: 'var(--ice)', 
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
          whiteSpace: 'normal',
        }}>
          {text}
        </p>
        
        {/* Down Arrow indicator */}
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2"
          style={{
            borderWidth: '6px 6px 0 6px',
            borderStyle: 'solid',
            borderColor: 'rgba(127,169,255,0.25) transparent transparent transparent',
          }}
        />
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2"
          style={{
            marginTop: '-1.5px',
            borderWidth: '5px 5px 0 5px',
            borderStyle: 'solid',
            borderColor: 'rgba(7, 15, 60, 0.95) transparent transparent transparent',
          }}
        />
      </div>
    </div>
  );
}
