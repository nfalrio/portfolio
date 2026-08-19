import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievements } from '../data/achievements.js';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';

const CAT_STYLE = {
  Competition: { bg: ['#7C3AED', '#C026D3'], icon: '🏆', label: 'COMPETITION' },
  Certification: { bg: ['#0EA5E9', '#6366F1'], icon: '📜', label: 'CERTIFICATION' },
  Award: { bg: ['#F59E0B', '#EF4444'], icon: '⭐', label: 'AWARD' },
};

function PreviewCard({ item, active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(0);
  const cat = CAT_STYLE[item.category] ?? CAT_STYLE.Award;

  useEffect(() => {
    if (item.image) return; // Skip canvas animation if image exists
    if (!active) { cancelAnimationFrame(animRef.current); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 320; canvas.height = 200;

    let t = 0;
    const [c1, c2] = cat.bg;
    const ph = (h) => ({ r: parseInt(h.slice(1,3),16), g: parseInt(h.slice(3,5),16), b: parseInt(h.slice(5,7),16) });
    const col1 = ph(c1); const col2 = ph(c2);

    const draw = () => {
      const grd = ctx.createLinearGradient(canvas.width*(0.5+0.5*Math.sin(t*0.4)),0,canvas.width*(0.5+0.5*Math.cos(t*0.3)),canvas.height);
      grd.addColorStop(0,`rgb(${col1.r},${col1.g},${col1.b})`);
      grd.addColorStop(1,`rgb(${col2.r},${col2.g},${col2.b})`);
      ctx.fillStyle = grd; ctx.fillRect(0,0,canvas.width,canvas.height);
      for (let i=0;i<5;i++) {
        const ox=canvas.width*0.2+i*55+Math.sin(t*0.6+i*1.2)*22, oy=canvas.height*0.4+Math.cos(t*0.5+i*0.9)*28, r=18+i*6+Math.sin(t+i)*5;
        ctx.beginPath(); ctx.arc(ox,oy,r,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${0.08+i*0.03})`; ctx.fill();
      }
      for (let y=0;y<canvas.height;y+=4) { const s=Math.sin(y*0.05+t*2)*0.04; ctx.fillStyle=`rgba(255,255,255,${Math.max(0,s)})`; ctx.fillRect(0,y,canvas.width,2); }
      ctx.font='52px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor='rgba(0,0,0,0.3)'; ctx.shadowBlur=12; ctx.fillText(cat.icon,canvas.width/2,canvas.height/2-10); ctx.shadowBlur=0;
      ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.font='bold 10px monospace'; ctx.fillText(cat.label,canvas.width/2,canvas.height-18);
      t+=0.025; animRef.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(animRef.current);
  },[active,cat,item.image]);

  return (
    <div style={{ position:'relative', borderRadius:'12px', overflow:'hidden', flexShrink:0, width:'100%', height:'100%', border:'2px solid var(--border)', boxShadow: active?'6px 6px 0 var(--accent)':'none' }}>
      {item.image ? (
        <img src={item.image} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="lazy" />
      ) : (
        <canvas ref={canvasRef} style={{width:'100%',height:'100%',display:'block'}}/>
      )}
      <div style={{ position:'absolute',top:'0.4rem',right:'0.5rem',fontFamily:'var(--font-mono)',fontSize:'0.55rem',letterSpacing:'2px',color:'rgba(255,255,255,0.9)',textTransform:'uppercase', backgroundColor: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px' }}>Preview</div>
    </div>
  );
}

export default function Milestones() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  useRevealOnScroll(sectionRef, 0.2);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev === achievements.length - 1 ? 0 : prev + 1));
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? achievements.length - 1 : prev - 1));
    setProgress(0);
  }, []);

  /* Auto-advance and Progress bar synced */
  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const DURATION = 8000;
    
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= DURATION) {
        // Time to advance
        setCurrentIndex(prev => (prev === achievements.length - 1 ? 0 : prev + 1));
        // Note: state update on currentIndex triggers re-render and resets this effect
      } else {
        setProgress(Math.min(100, (elapsed / DURATION) * 100));
      }
    }, 60);

    return () => clearInterval(tick);
  }, [currentIndex]);

  return (
    <section className="section" id="pencapaian" ref={sectionRef}>
      <div className="container">
        <p className="section-label reveal">02 / Achievements</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'0.75rem' }}>
          <h2 className="section-title reveal" style={{marginBottom:0}}>Milestones &amp; Certifications</h2>
          <div style={{display:'flex',gap:'0.75rem'}}>
            {[{fn:prevSlide,icon:'M15 18l-6-6 6-6',lbl:'Prev'},{fn:nextSlide,icon:'M9 18l6-6-6-6',lbl:'Next'}].map((b,i)=>(
              <button key={i} onClick={b.fn} className="nav-btn" aria-label={b.lbl} style={{ width:'48px',height:'48px',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid var(--border)',borderRadius:'50%',backgroundColor:'var(--bg-surface)',color:'var(--text-primary)',cursor:'pointer',transition:'all 0.2s ease',flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><path d={b.icon}/></svg>
              </button>
            ))}
          </div>
        </div>
        <hr className="section-divider reveal" style={{marginBottom:'4rem'}}/>

        {/* Carousel */}
        <div className="carousel-container" style={{ position:'relative', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', maskImage:'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage:'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <AnimatePresence mode="popLayout">
            {achievements.map((item, index) => {
              const diff = (index - currentIndex + achievements.length) % achievements.length;
              const isRight = diff > 0 && diff <= Math.floor(achievements.length/2);
              const isLeft = diff > Math.floor(achievements.length/2);
              let offset = diff===0?0:isRight?diff:isLeft?diff-achievements.length:0;
              if (Math.abs(offset)>2) return null;
              const active = diff===0;
              const xPos = offset*340;
              const scale = active?1:Math.max(0.72,1-Math.abs(offset)*0.14);
              const opacity = active ? 1 : Math.max(0.55, 0.75 - Math.abs(offset) * 0.2);

              return (
                <motion.div key={item.id} layout
                  initial={{opacity:0,scale:0.5,x:xPos>0?340:-340}}
                  animate={{opacity,scale,x:xPos,zIndex:10-Math.abs(offset),filter:active?'blur(0px)':`blur(${Math.abs(offset)*0.8}px)`}}
                  exit={{opacity:0,scale:0.5,x:xPos<0?340:-340}}
                  transition={{type:'spring',stiffness:260,damping:28,mass:0.5}}
                  className="milestone-card"
                  style={{ position:'absolute',width:'100%',maxWidth:'740px',borderRadius:'16px',border:active?'2px solid var(--accent)':'2px solid var(--border)',backgroundColor:active?'var(--bg-surface)':'var(--bg-primary)',boxShadow:active?'16px 16px 0 var(--accent)':'none' }}
                >
                  <div style={{display:'flex',gap:'1.5rem',alignItems:'center'}} className="milestone-card-inner">
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'1rem',marginBottom:'1rem'}}>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:'0.65rem',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'var(--bg-surface)',backgroundColor:'var(--text-primary)',padding:'0.4rem 0.75rem',borderRadius:'6px',flexShrink:0}}>{item.category}</span>
                        <span style={{fontFamily:'var(--font-mono)',fontSize:'0.875rem',fontWeight:700,color:'var(--accent)',flexShrink:0}}>{item.period}</span>
                      </div>
                      <h3 style={{fontFamily:'var(--font-sans)',fontSize:'clamp(1.1rem,2vw,1.5rem)',fontWeight:700,color:'var(--text-primary)',lineHeight:1.25,marginBottom:'0.4rem'}}>{item.title}</h3>
                      <p style={{color:'var(--accent)',fontSize:'0.875rem',fontWeight:600,marginBottom:'0.75rem'}}>{item.organization}</p>
                      <p style={{color:'var(--text-secondary)',fontSize:'0.85rem',lineHeight:1.6}}>{item.description}</p>
                    </div>
                    <div className="milestone-preview-wrap">
                      <PreviewCard item={item} active={active}/>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Progress + dots */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.625rem',marginTop:'1.5rem'}}>
          <div style={{width:'140px',height:'2px',backgroundColor:'var(--border)',borderRadius:'1px',overflow:'hidden'}}>
            <div style={{height:'100%',backgroundColor:'var(--accent)',width:`${progress}%`,borderRadius:'1px',transition:'width 0.06s linear'}}/>
          </div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            {achievements.map((_,i)=>(
              <button key={i} onClick={()=>{setCurrentIndex(i);setProgress(0);}} style={{ width:i===currentIndex?'24px':'8px',height:'8px',borderRadius:'4px',backgroundColor:i===currentIndex?'var(--accent)':'var(--border)',border:'none',cursor:'pointer',transition:'all 0.3s ease',padding:0 }} aria-label={`Milestone ${i+1}`}/>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .carousel-container { height: 400px; }
        .milestone-card { padding: 2.5rem; }
        .nav-btn:hover { border-color:var(--accent)!important; color:var(--accent)!important; box-shadow:4px 4px 0 var(--accent); }
        .milestone-preview-wrap {
          width: 280px;
          aspect-ratio: 16/10;
          flex-shrink: 0;
        }
        
        @media(max-width:640px){
          .carousel-container { height: 560px; }
          .milestone-card { padding: 1.25rem !important; }
          .milestone-card-inner { flex-direction:column!important; gap: 1rem!important; }
          .milestone-preview-wrap { 
            width: 100% !important; 
            aspect-ratio: 16/10;
            height: auto !important;
            min-height: 200px;
          }
        }
      `}</style>
    </section>
  );
}
