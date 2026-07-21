import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

// --- Slide 1: Dawn village scene (existing) ---
function SlideDawn() {
  return (
    <svg viewBox="0 0 1440 480" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s1-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B71C1C" /><stop offset="20%" stopColor="#E64A19" />
          <stop offset="45%" stopColor="#FF8F00" /><stop offset="70%" stopColor="#FFE57F" />
          <stop offset="100%" stopColor="#E8F5E9" />
        </linearGradient>
        <radialGradient id="s1-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEE58" /><stop offset="50%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s1-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#90CAF9" stopOpacity="0.95" /><stop offset="100%" stopColor="#1565C0" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="s1-field1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#66BB6A" /><stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
        <linearGradient id="s1-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A1887F" /><stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>
        <filter id="s1-glow"><feGaussianBlur stdDeviation="12" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <style>{`
          @keyframes s1-sun{0%,100%{opacity:.9;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
          @keyframes s1-ray{0%,100%{opacity:.35}50%{opacity:.65}}
          @keyframes s1-bird1{0%{transform:translate(-80px,0);opacity:0}5%{opacity:1}95%{opacity:1}100%{transform:translate(1550px,-40px);opacity:0}}
          @keyframes s1-bird2{0%{transform:translate(-80px,0);opacity:0}5%{opacity:1}95%{opacity:1}100%{transform:translate(1550px,30px);opacity:0}}
          @keyframes s1-tree{0%,100%{transform:rotate(0deg);transform-origin:50% 100%}30%{transform:rotate(-1.8deg);transform-origin:50% 100%}70%{transform:rotate(1.8deg);transform-origin:50% 100%}}
          @keyframes s1-water{0%,100%{opacity:.5}50%{opacity:.85}}
          @keyframes s1-cart{0%,100%{transform:translateX(0)}50%{transform:translateX(-6px)}}
          @keyframes s1-mist{0%,100%{transform:translateX(0);opacity:.28}50%{transform:translateX(25px);opacity:.45}}
          @keyframes s1-butterfly{0%,100%{transform:translate(0,0)}25%{transform:translate(12px,-10px)}75%{transform:translate(12px,-6px)}}
        `}</style>
      </defs>
      <rect width="1440" height="480" fill="url(#s1-sky)" />
      <circle cx="180" cy="135" r="90" fill="url(#s1-sun)" opacity="0.5" filter="url(#s1-glow)" style={{animation:'s1-sun 4s ease-in-out infinite'}} />
      {Array.from({length:16}).map((_,i)=>{const a=(i*22.5*Math.PI)/180;return <line key={i} x1="180" y1="135" x2={180+Math.cos(a)*75} y2={135+Math.sin(a)*75} stroke="#FFE082" strokeWidth="2.5" opacity="0.5" style={{animation:`s1-ray 2.5s ease-in-out ${i*0.15}s infinite`}} />})}
      <circle cx="180" cy="135" r="38" fill="#FFEE58" style={{animation:'s1-sun 4s ease-in-out infinite'}} />
      <circle cx="180" cy="135" r="32" fill="#FFF176" />
      <polygon points="0,310 80,195 180,240 290,155 420,205 540,155 660,210 780,145 920,200 1060,145 1200,200 1340,155 1440,210 1440,320 0,320" fill="#607D8B" opacity="0.45" />
      <polygon points="0,330 120,225 250,265 380,205 510,250 640,195 770,245 900,185 1060,235 1200,185 1350,230 1440,200 1440,335 0,335" fill="#4E6B4E" opacity="0.75" />
      <rect x="-50" y="295" width="1600" height="28" rx="14" fill="white" opacity="0.22" style={{animation:'s1-mist 9s ease-in-out infinite'}} />
      <g opacity="0.9"><rect x="820" y="265" width="70" height="42" fill="#D7A87A" /><polygon points="814,270 897,270 855,228" fill="#B5451B" /><rect x="836" y="278" width="14" height="29" fill="#8B4513" /></g>
      <g opacity="0.8"><rect x="910" y="272" width="60" height="35" fill="#C8956A" /><polygon points="904,277 977,277 940,242" fill="#9E3B1A" /></g>
      <g style={{animation:'s1-tree 4.5s ease-in-out infinite'}}>
        <path d="M 230 480 Q 236 400 240 338" stroke="#5D4037" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M 240 338 Q 268 318 305 328" stroke="#2E7D32" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 240 338 Q 218 315 185 327" stroke="#2E7D32" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 240 338 Q 258 312 250 290" stroke="#33691E" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 240 338 Q 222 312 232 290" stroke="#33691E" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <g style={{animation:'s1-tree 5s ease-in-out 0.8s infinite'}}>
        <path d="M 1200 480 Q 1205 408 1208 350" stroke="#5D4037" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M 1208 350 Q 1238 330 1272 340" stroke="#2E7D32" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 1208 350 Q 1185 328 1152 340" stroke="#2E7D32" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 1208 350 Q 1226 324 1218 302" stroke="#33691E" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <path d="M 0 340 Q 360 332 720 338 Q 1080 344 1440 336 L 1440 360 Q 1080 368 720 362 Q 360 356 0 364 Z" fill="url(#s1-river)" style={{animation:'s1-water 4s ease-in-out infinite'}} />
      <path d="M 80 345 Q 200 342 320 345" stroke="#FFD54F" strokeWidth="2.5" opacity="0.5" />
      <path d="M 0 362 Q 720 354 1440 362 L 1440 400 Q 720 392 0 400 Z" fill="url(#s1-field1)" />
      <rect x="0" y="400" width="1440" height="80" fill="#1B5E20" />
      {Array.from({length:36}).map((_,i)=>(
        <g key={i} opacity="0.75">
          <line x1={i*40+8} y1="363" x2={i*40+6} y2="398" stroke="#4CAF50" strokeWidth="1.5" />
          <ellipse cx={i*40+6} cy="361" rx="3.5" ry="6" fill="#8BC34A" />
        </g>
      ))}
      <path d="M 0 428 Q 400 418 750 416 Q 1100 414 1440 422 L 1440 445 Q 1100 437 750 439 Q 400 441 0 451 Z" fill="url(#s1-road)" opacity="0.8" />
      <g style={{animation:'s1-cart 6s ease-in-out infinite'}}>
        <circle cx="535" cy="432" r="13" fill="none" stroke="#4E342E" strokeWidth="3" />
        <circle cx="535" cy="432" r="5" fill="#4E342E" />
        <circle cx="568" cy="432" r="13" fill="none" stroke="#4E342E" strokeWidth="3" />
        <rect x="525" y="412" width="65" height="20" fill="#8D6E63" rx="3" />
        <rect x="530" y="403" width="55" height="14" fill="#A1887F" rx="2" />
        <ellipse cx="557" cy="402" rx="22" ry="7" fill="#8BC34A" />
        <line x1="525" y1="422" x2="480" y2="424" stroke="#5D4037" strokeWidth="3" />
        <ellipse cx="462" cy="427" rx="22" ry="10" fill="#EFEBE9" />
        <ellipse cx="442" cy="421" rx="10" ry="9" fill="#D7CCC8" />
        <circle cx="585" cy="407" r="6" fill="#5D4037" />
        <rect x="581" y="413" width="8" height="12" fill="#FF8F00" rx="2" />
        <ellipse cx="585" cy="403" rx="10" ry="3.5" fill="#FDD835" />
      </g>
      <g style={{animation:'s1-bird1 14s linear infinite'}}>
        <path d="M 0 110 Q 11 103 22 110" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 36 104 Q 47 97 58 104" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 18 125 Q 29 118 40 125" stroke="#2A2A2A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
      <g style={{animation:'s1-bird2 20s linear 5s infinite'}}>
        <path d="M 0 165 Q 13 157 26 165" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 42 158 Q 55 150 68 158" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g style={{animation:'s1-butterfly 5s ease-in-out infinite'}} opacity="0.9">
        <path d="M 800 355 Q 790 345 787 355 Q 790 365 800 355" fill="#FF8F00" />
        <path d="M 800 355 Q 810 345 813 355 Q 810 365 800 355" fill="#FFA726" />
      </g>
    </svg>
  )
}

// --- Slide 2: Green fields midday ---
function SlideMidday() {
  return (
    <svg viewBox="0 0 1440 480" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1565C0" /><stop offset="40%" stopColor="#1976D2" />
          <stop offset="70%" stopColor="#42A5F5" /><stop offset="100%" stopColor="#BBDEFB" />
        </linearGradient>
        <linearGradient id="s2-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#81C784" /><stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
        <linearGradient id="s2-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4CAF50" /><stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <style>{`
          @keyframes s2-cloud{0%{transform:translateX(0)}100%{transform:translateX(1600px)}}
          @keyframes s2-cloud2{0%{transform:translateX(-400px)}100%{transform:translateX(1600px)}}
          @keyframes s2-flag{0%,100%{transform:rotate(-5deg);transform-origin:0 0}50%{transform:rotate(8deg);transform-origin:0 0}}
          @keyframes s2-walk{0%,100%{transform:translateX(0)}50%{transform:translateX(8px)}}
        `}</style>
      </defs>
      <rect width="1440" height="480" fill="url(#s2-sky)" />
      {/* Sun */}
      <circle cx="1280" cy="100" r="55" fill="#FFF176" opacity="0.95" />
      <circle cx="1280" cy="100" r="44" fill="#FFEE58" />
      {/* Clouds */}
      <g style={{animation:'s2-cloud 35s linear infinite'}}>
        <ellipse cx="-100" cy="80" rx="80" ry="30" fill="white" opacity="0.85" />
        <ellipse cx="-60" cy="68" rx="55" ry="28" fill="white" opacity="0.9" />
        <ellipse cx="-130" cy="75" rx="45" ry="22" fill="white" opacity="0.8" />
      </g>
      <g style={{animation:'s2-cloud2 50s linear 8s infinite'}}>
        <ellipse cx="-300" cy="120" rx="70" ry="25" fill="white" opacity="0.75" />
        <ellipse cx="-260" cy="108" rx="50" ry="22" fill="white" opacity="0.8" />
      </g>
      <g style={{animation:'s2-cloud 28s linear 15s infinite'}}>
        <ellipse cx="400" cy="60" rx="90" ry="32" fill="white" opacity="0.7" />
        <ellipse cx="360" cy="50" rx="60" ry="25" fill="white" opacity="0.75" />
      </g>
      {/* Hills */}
      <ellipse cx="200" cy="340" rx="350" ry="180" fill="url(#s2-hill)" opacity="0.9" />
      <ellipse cx="1200" cy="350" rx="320" ry="170" fill="url(#s2-hill)" opacity="0.85" />
      <ellipse cx="720" cy="360" rx="480" ry="160" fill="#43A047" opacity="0.7" />
      {/* Village */}
      <g>
        <rect x="600" y="260" width="80" height="50" fill="#FFCC80" />
        <polygon points="592,265 688,265 640,220" fill="#E64A19" />
        <rect x="618" y="275" width="18" height="35" fill="#5D4037" />
        <rect x="644" y="268" width="22" height="18" fill="#90CAF9" opacity="0.8" />
        <line x1="600" y1="310" x2="680" y2="310" stroke="#FFB74D" strokeWidth="1.5" />
      </g>
      <g>
        <rect x="710" y="268" width="65" height="42" fill="#FFCC80" />
        <polygon points="703,273 783,273 743,235" fill="#D84315" />
        <rect x="728" y="278" width="14" height="32" fill="#4E342E" />
      </g>
      <g opacity="0.7">
        <rect x="800" y="272" width="55" height="38" fill="#FFE0B2" />
        <polygon points="793,277 863,277 828,245" fill="#BF360C" />
      </g>
      {/* Market stall */}
      <g>
        <rect x="350" y="295" width="90" height="40" fill="#EF9A9A" opacity="0.9" />
        <line x1="350" y1="295" x2="440" y2="295" stroke="#C62828" strokeWidth="4" />
        <line x1="352" y1="295" x2="352" y2="340" stroke="#5D4037" strokeWidth="3" />
        <line x1="436" y1="295" x2="436" y2="340" stroke="#5D4037" strokeWidth="3" />
        <ellipse cx="370" cy="293" rx="7" ry="5" fill="#FF7043" />
        <ellipse cx="390" cy="291" rx="6" ry="5" fill="#FFCA28" />
        <ellipse cx="410" cy="292" rx="7" ry="5" fill="#66BB6A" />
        <g style={{animation:'s2-flag 2s ease-in-out infinite'}}>
          <line x1="395" y1="260" x2="395" y2="295" stroke="#5D4037" strokeWidth="2" />
          <polygon points="395,260 420,270 395,280" fill="#F44336" opacity="0.9" />
        </g>
      </g>
      {/* Fields */}
      <rect x="0" y="370" width="1440" height="110" fill="url(#s2-field)" />
      {Array.from({length:45}).map((_,i)=>(
        <g key={i} opacity="0.8">
          <line x1={i*32+5} y1="370" x2={i*32+4} y2="400" stroke="#2E7D32" strokeWidth="1.5" />
          <ellipse cx={i*32+4} cy="368" rx="3" ry="5.5" fill="#66BB6A" />
          <line x1={i*32+18} y1="372" x2={i*32+17} y2="400" stroke="#388E3C" strokeWidth="1.2" />
          <ellipse cx={i*32+17} cy="370" rx="2.5" ry="4.5" fill="#81C784" />
        </g>
      ))}
      {/* People walking */}
      <g style={{animation:'s2-walk 1.2s ease-in-out infinite'}}>
        <circle cx="500" cy="348" r="6" fill="#4E342E" />
        <rect x="496" y="354" width="8" height="14" fill="#1565C0" rx="1" />
        <ellipse cx="500" cy="342" rx="9" ry="3" fill="#FDD835" />
      </g>
      <g style={{animation:'s2-walk 1.4s ease-in-out 0.3s infinite'}}>
        <circle cx="520" cy="350" r="5" fill="#5D4037" />
        <rect x="517" y="355" width="7" height="12" fill="#C62828" rx="1" />
      </g>
      <rect x="0" y="0" width="1440" height="180" fill="#42A5F5" opacity="0.05" />
    </svg>
  )
}

// --- Slide 3: Evening dusk scene ---
function SlideDusk() {
  return (
    <svg viewBox="0 0 1440 480" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s3-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A237E" /><stop offset="25%" stopColor="#311B92" />
          <stop offset="50%" stopColor="#6A1B9A" /><stop offset="75%" stopColor="#AD1457" />
          <stop offset="100%" stopColor="#FF6F00" />
        </linearGradient>
        <linearGradient id="s3-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E7D32" /><stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
        <radialGradient id="s3-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" /><stop offset="80%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#FFF9C4" stopOpacity="0" />
        </radialGradient>
        <style>{`
          @keyframes s3-star{0%,100%{opacity:.4}50%{opacity:1}}
          @keyframes s3-lamp{0%,100%{opacity:.7;r:18px}50%{opacity:1;r:22px}}
          @keyframes s3-fire{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.2)}}
          @keyframes s3-moon{0%,100%{opacity:.92}50%{opacity:1}}
        `}</style>
      </defs>
      <rect width="1440" height="480" fill="url(#s3-sky)" />
      {/* Moon */}
      <circle cx="1320" cy="90" r="42" fill="url(#s3-moon)" style={{animation:'s3-moon 3s ease-in-out infinite'}} />
      <circle cx="1320" cy="90" r="36" fill="#FFFDE7" />
      {/* Stars */}
      {[[120,60],[280,40],[400,80],[560,30],[700,55],[850,25],[980,70],[1100,40],[200,120],[450,110],[650,95],[900,115],[1050,85],[1200,55]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2" fill="white" style={{animation:`s3-star ${1.5+i*0.3}s ease-in-out ${i*0.2}s infinite`}} />
      ))}
      {/* Silhouette hills */}
      <ellipse cx="0" cy="380" rx="400" ry="200" fill="#0D1B0D" opacity="0.9" />
      <ellipse cx="1440" cy="380" rx="380" ry="190" fill="#0D1B0D" opacity="0.85" />
      <ellipse cx="720" cy="400" rx="600" ry="160" fill="#0D1B0D" opacity="0.7" />
      {/* House silhouettes */}
      <g fill="#0D1B0D">
        <rect x="550" y="270" width="90" height="65" />
        <polygon points="540,278 650,278 595,225" />
        <rect x="570" y="282" width="20" height="53" />
        {/* Window glow */}
        <rect x="600" y="288" width="22" height="18" fill="#FFA726" opacity="0.7" rx="2" />
      </g>
      <g fill="#0D1B0D">
        <rect x="680" y="282" width="75" height="53" />
        <polygon points="672,288 764,288 718,248" />
        <rect x="700" y="298" width="16" height="37" />
        <rect x="728" y="292" width="18" height="15" fill="#FFB74D" opacity="0.6" rx="2" />
      </g>
      <g fill="#0A150A" opacity="0.9">
        <rect x="790" y="290" width="60" height="45" />
        <polygon points="783,296 858,296 820,262" />
        <rect x="820" y="300" width="14" height="35" />
        <rect x="804" y="305" width="14" height="12" fill="#FFC107" opacity="0.55" rx="1" />
      </g>
      {/* Trees silhouette */}
      <g fill="#0D1B0D">
        <rect x="200" y="300" width="8" height="180" />
        <ellipse cx="204" cy="295" rx="35" ry="50" />
        <rect x="1180" y="310" width="8" height="170" />
        <ellipse cx="1184" cy="305" rx="30" ry="45" />
        <rect x="430" y="320" width="6" height="160" />
        <ellipse cx="433" cy="316" rx="25" ry="38" />
        <rect x="1000" y="315" width="6" height="165" />
        <ellipse cx="1003" cy="311" rx="28" ry="40" />
      </g>
      {/* Bonfire */}
      <g style={{animation:'s3-fire 0.8s ease-in-out infinite', transformOrigin:'480px 390px'}}>
        <polygon points="480,390 468,360 480,368 492,360" fill="#FF8F00" opacity="0.95" />
        <polygon points="480,390 472,368 480,374 488,368" fill="#FFCA28" />
        <ellipse cx="480" cy="392" rx="14" ry="4" fill="#4E342E" />
        <ellipse cx="480" cy="390" rx="25" ry="8" fill="#FF6F00" opacity="0.25" />
      </g>
      {/* People around fire silhouettes */}
      <g fill="#0D1B0D">
        <circle cx="455" cy="382" r="6" />
        <rect x="452" y="388" width="6" height="12" rx="2" />
        <circle cx="508" cy="382" r="6" />
        <rect x="505" y="388" width="6" height="12" rx="2" />
        <circle cx="478" cy="379" r="5" />
        <rect x="475" y="384" width="6" height="11" rx="2" />
      </g>
      {/* Street lamps */}
      {[300, 700, 1100].map((x, i) => (
        <g key={i}>
          <rect x={x} y="350" width="4" height="80" fill="#424242" />
          <circle cx={x+2} cy="348" r="16" fill="#FFF9C4" opacity="0.3" style={{animation:`s3-lamp 2s ease-in-out ${i*0.7}s infinite`}} />
          <circle cx={x+2} cy="348" r="6" fill="#FFEE58" opacity="0.9" />
        </g>
      ))}
      {/* Ground */}
      <rect x="0" y="390" width="1440" height="90" fill="url(#s3-field)" />
      <rect x="0" y="430" width="1440" height="50" fill="#0D1B0D" opacity="0.6" />
    </svg>
  )
}

const SLIDES = [
  {
    Scene: SlideDawn,
    title: 'Your Trusted Rural Marketplace',
    subtitle: 'Connecting villages across India — buy, sell, and hire, all in one place.',
    titleLoggedIn: (name) => `Welcome back, ${name}!`,
    subtitleLoggedIn: 'Find services, sell your produce, and connect with your village community.',
    overlay: 'from-black/60 via-black/30 to-transparent',
    badge: '🌅 Dawn Village',
  },
  {
    Scene: SlideMidday,
    title: 'Discover Local Markets & Services',
    subtitle: 'Browse products, hire workers, and find transport — all near your village.',
    titleLoggedIn: (name) => `Good day, ${name}!`,
    subtitleLoggedIn: 'Your listings are visible to thousands of villagers nearby.',
    overlay: 'from-blue-900/60 via-blue-900/25 to-transparent',
    badge: '☀️ Village Market',
  },
  {
    Scene: SlideDusk,
    title: 'Grow Together as a Community',
    subtitle: 'OoruMitra brings rural communities closer through technology.',
    titleLoggedIn: (name) => `Good evening, ${name}!`,
    subtitleLoggedIn: 'Thank you for being part of the OoruMitra community.',
    overlay: 'from-purple-900/70 via-purple-900/30 to-transparent',
    badge: '🌙 Village Evening',
  },
]

function LocationBadge() {
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | denied

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        let name = ''
        try {
          if (MAPS_KEY) {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}&result_type=locality|sublocality|neighborhood|administrative_area_level_3`
            )
            const data = await res.json()
            if (data.status === 'OK' && data.results?.[0]) {
              name = data.results[0]?.address_components?.find(c =>
                c.types.some(t => ['locality','sublocality','sublocality_level_1','neighborhood','administrative_area_level_3'].includes(t))
              )?.long_name || data.results[0]?.formatted_address?.split(',')[0]
            }
          }
        } catch {}

        if (!name) {
          try {
            const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            const nomData = await nomRes.json()
            name = nomData.address?.village || nomData.address?.suburb || nomData.address?.town || nomData.address?.city || nomData.display_name?.split(',')[0] || ''
          } catch {}
        }

        setLocation(name || `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`)
        setStatus('done')
      },
      () => setStatus('denied'),
      { timeout: 8000 }
    )
  }, [])

  useEffect(() => { fetchLocation() }, [fetchLocation])

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex items-center gap-1.5 text-white/80 text-xs mt-2">
        <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span>Detecting location…</span>
      </div>
    )
  }
  if (status === 'denied') {
    return (
      <button onClick={fetchLocation} className="flex items-center gap-1.5 text-white/60 text-xs mt-2 hover:text-white/90 transition-colors">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span>Enable location</span>
      </button>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-white/90 text-xs mt-2 drop-shadow">
      <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      <span>{location}</span>
    </div>
  )
}

export default function VillageHero({ isLoggedIn, userName }) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback((idx) => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 300)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      goTo((current + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(t)
  }, [current, goTo])

  const slide = SLIDES[current]
  const { Scene } = slide

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl" style={{ height: '380px' }}>
      {/* Background scene */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <Scene />
      </div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
        <div className="animate-fadeIn">
          <img src="/Ooru_mitra_logo_2.png" alt="OoruMitra" className="h-14 sm:h-16 w-auto mb-1 drop-shadow-lg" />
          <LocationBadge />
        </div>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mt-3 mb-2 drop-shadow-lg animate-fadeInUp" style={{textShadow:'0 2px 8px rgba(0,0,0,0.5)'}}>
          {isLoggedIn ? slide.titleLoggedIn(userName) : slide.title}
        </h1>
        <p className="text-white/90 text-xs sm:text-sm max-w-xs sm:max-w-sm mb-4 drop-shadow animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          {isLoggedIn ? slide.subtitleLoggedIn : slide.subtitle}
        </p>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <Link
            to={isLoggedIn ? '/sell' : '/register'}
            className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg text-sm sm:text-base"
          >
            {isLoggedIn ? 'Post a Listing →' : 'Join OoruMitra →'}
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide badge */}
      <div className="absolute top-4 right-4 bg-black/30 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
        {slide.badge}
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >‹</button>
      <button
        onClick={() => goTo((current + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >›</button>
    </div>
  )
}
