import { useState, useEffect, useRef } from 'react'

const LANGUAGES = {
  English: {
    code: 'EN',
    scene1: { title: 'OoruMitra', subtitle: 'Your Village Digital Companion', voice: 'Connect your village community with OoruMitra.' },
    scene2: { title: 'Buy and Sell Easily', subtitle: 'Direct Local Marketplace', voice: 'Direct marketplace for cattle, tractors, crops, and household items.' },
    scene3: { title: 'Find Trusted Services', subtitle: 'Local Professionals Near You', voice: 'Hire certified electricians, plumbers, carpenters, mechanics, and farmers.' },
    scene4: { title: 'Jobs & Rentals', subtitle: 'Opportunities & Leases', voice: 'Explore local employment, machinery leases, and land rental listings instantly.' },
    scene5: { title: 'Stay Connected', subtitle: 'Community & Official Updates', voice: 'Get real-time updates on village events, official announcements, and emergency alerts.' },
    scene6: { title: 'OoruMitra App', subtitle: 'Connecting Villages Digitally', voice: 'Empowering rural India digitally. Install the app now.' }
  },
  Telugu: {
    code: 'TE',
    scene1: { title: 'ఊరుమిత్ర', subtitle: 'మీ గ్రామ డిజిటల్ తోడు', voice: 'ఊరుమిత్రతో మీ గ్రామ కమ్యూనిటీని కనెక్ట్ చేసుకోండి.' },
    scene2: { title: 'సులభంగా కొనండి-అమ్మండి', subtitle: 'స్థానిక మార్కెట్ ప్లేస్', voice: 'పశువులు, ట్రాక్టర్లు, పంటలు మరియు గృహోపకరణాల కోసం ప్రత్యక్ష మార్కెట్.' },
    scene3: { title: 'నమ్మకమైన సేవలు', subtitle: 'స్థానిక నిపుణుల సేవలు', voice: 'మీకు సమీపంలోని సర్టిఫైడ్ ఎలక్ట్రీషియన్లు, ప్లంబర్లు, వడ్రంగులు మరియు వ్యవసాయ సేవలను సంప్రదించండి.' },
    scene4: { title: 'ఉద్యోగాలు & అద్దెలు', subtitle: 'అవకాశాలు & లీజులు', voice: 'స్థానిక ఉద్యోగాలు, వ్యవసాయ యంత్రాల లీజులు మరియు భూమి అద్దె వివరాలను వెంటనే తెలుసుకోండి.' },
    scene5: { title: 'కలిసి ఉండండి', subtitle: 'కమ్యూనిటీ & అధికారిక ప్రకటనలు', voice: 'గ్రామ ఈవెంట్స్, అధికారిక ప్రకటనలు మరియు అత్యవసర హెచ్చరికల అప్‌డేట్స్ పొందండి.' },
    scene6: { title: 'ఊరుమిత్ర యాప్', subtitle: 'గ్రామాలను డిజిటల్‌గా అనుసంధానిస్తోంది', voice: 'గ్రామీణ భారతదేశాన్ని డిజిటల్‌గా బలోపేతం చేయండి. ఇప్పుడే ఇన్‌స్టాల్ చేసుకోండి.' }
  },
  Hindi: {
    code: 'HI',
    scene1: { title: 'ऊरुमित्र', subtitle: 'आपके गांव का डिजिटल साथी', voice: 'ऊरुमित्र के साथ अपने गांव के समुदाय को जोड़ें।' },
    scene2: { title: 'आसानी से खरीदें-बेचें', subtitle: 'सीधा स्थानीय बाजार', voice: 'मवेशी, ट्रैक्टर, फसल और घरेलू सामानों के लिए सीधा बाजार।' },
    scene3: { title: 'विश्वसनीय सेवाएँ', subtitle: 'प्रमाणित स्थानीय पेशेवर', voice: 'अपने नजदीकी प्रमाणित इलेक्ट्रीशियन, पहनकर, बढ़ई और कृषि सेवाओं को खोजें।' },
    scene4: { title: 'नौकरियाँ & किराये', subtitle: 'अवसर एवं पट्टे', voice: 'स्थानीय रोजगार, मशीनरी पट्टे और भूमि किराये के विवरण तुरंत जानें।' },
    scene5: { title: 'हमेशा जुड़े रहें', subtitle: 'सामुदायिक एवं सरकारी अपडेट', voice: 'गाँव के कार्यक्रमों, आधिकारिक घोषणाओं और आपातकालीन अलर्ट पर रीयल-टाइम अपडेट प्राप्त करें।' },
    scene6: { title: 'ऊरुमित्र ऐप', subtitle: 'गांवों को डिजिटली जोड़ना', voice: 'ग्रामीण भारत को डिजिटल रूप से सशक्त बना रहे हैं। अभी इंस्टॉल करें।' }
  },
  Tamil: {
    code: 'TA',
    scene1: { title: 'ஊருமித்ரா', subtitle: 'உங்கள் கிராமத்தின் டிஜிட்டல் துணை', voice: 'ஊருமித்ராவுடன் உங்கள் கிராம சமூகத்தை இணைக்கவும்.' },
    scene2: { title: 'எளிதாக வாங்க-விற்க', subtitle: 'நேரடி உள்ளூர் சந்தை', voice: 'கால்நடைகள், டிராக்டர்கள், பயிர்கள் மற்றும் வீட்டுப் பொருட்களுக்கான நேரடி சந்தை.' },
    scene3: { title: 'நம்பகமான சேவைகள்', subtitle: 'அருகிலுள்ள வல்லுநர்கள்', voice: 'உங்களுக்கு அருகிலுள்ள சான்றளிக்கப்பட்ட எலக்ட்ரீஷியன்கள், பிளம்பர்கள், தச்சர்கள் மற்றும் விவசாய சேவைகளை அமர்த்தவும்.' },
    scene4: { title: 'வேலைகள் & வாடகைகள்', subtitle: 'வாய்ப்புகள் & குத்தகைகள்', voice: 'உள்ளூர் வேலைவாய்ப்பு, இயந்திர குத்தகைகள் மற்றும் நில வாடகை பட்டியல்களை உடனடியாக ஆராயுங்கள்.' },
    scene5: { title: 'இணைந்திருங்கள்', subtitle: 'சமூக மற்றும் அவசர அறிவிப்புகள்', voice: 'கிராம நிகழ்வுகள், அதிகாரப்பூர்வ அறிவிப்புகள் மற்றும் அவசர விழிப்பூட்டல்கள் பற்றிய நிகழ்நேர அறிவிப்புகளைப் பெறுங்கள்.' },
    scene6: { title: 'ஊருமித்ரா செயலி', subtitle: 'கிராமங்களை டிஜிட்டல் முறையில் இணைக்கிறது', voice: 'டிஜிட்டல் முறையில் கிராமப்புற இந்தியாவை மேம்படுத்துவோம். இப்போது நிறுவவும்.' }
  },
  Kannada: {
    code: 'KA',
    scene1: { title: 'ಊರುಮಿತ್ರ', subtitle: 'ನಿಮ್ಮ ಗ್ರಾಮದ ಡಿಜಿಟಲ್ ಸಂಗಾತಿ', voice: 'ಊರುಮಿತ್ರದೊಂದಿಗೆ ನಿಮ್ಮ ಗ್ರಾಮ ಸಮುದಾಯವನ್ನು ಸಂಪರ್ಕಿಸಿ.' },
    scene2: { title: 'ಸುಲಭ ಖರೀದಿ-ಮಾರಾಟ', subtitle: 'ನೇರ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ', voice: 'ಜಾನುವಾರುಗಳು, ಟ್ರ್ಯಾಕ್ಟರ್‌ಗಳು, ಬೆಳೆಗಳು ಮತ್ತು ಗೃಹೋಪಯೋಗಿ ವಸ್ತುಗಳ ನೇರ ಮಾರುಕಟ್ಟೆ.' },
    scene3: { title: 'ವಿಶ್ವಾಸಾರ್ಹ ಸೇವೆಗಳು', subtitle: 'ಸ್ಥಳೀಯ ವೃತ್ತಿಪರರು', voice: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಪ್ರಮಾಣೀಕೃತ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಪ್ಲಂಬರ್, ಕಾರ್ಪೆಂಟರ್ ಮತ್ತು ಕೃಷಿ ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.' },
    scene4: { title: 'ಉದ್ಯೋಗಗಳು & ಬಾಡಿಗೆಗಳು', subtitle: 'ಅವಕಾಶಗಳು ಮತ್ತು ಗುತ್ತಿಗೆಗಳು', voice: 'ಸ್ಥಳೀಯ ಉದ್ಯೋಗಗಳು, ಕೃಷಿ ಉಪಕರಣಗಳ ಗುತ್ತಿಗೆ ಮತ್ತು ಜಮೀನು ಬಾಡಿಗೆ ವಿವರಗಳನ್ನು ತಕ್ಷಣ ಪಡೆದುಕೊಳ್ಳಿ.' },
    scene5: { title: 'ಸಂಪರ್ಕದಲ್ಲಿರಿ', subtitle: 'ಸಮುದಾಯ ಮತ್ತು ಅಧಿಕೃತ ಮಾಹಿತಿ', voice: 'ಗ್ರಾಮದ ಕಾರ್ಯಕ್ರಮಗಳು, ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು ಮತ್ತು ತುર્ತು ಮಾಹಿತಿಯನ್ನು ತಕ್ಷಣ ಪಡೆದುಕೊಳ್ಳಿ.' },
    scene6: { title: 'ಊರುಮಿತ್ರ ಆಪ್', subtitle: 'ಗ್ರಾಮಗಳನ್ನು ಡಿಜಿಟಲ್ ಆಗಿ ಜೋಡಿಸುವುದು', voice: 'ಗ್ರಾಮೀಣ ಭಾರತವನ್ನು ಡಿಜಿಟಲ್ ಆಗಿ ಸಬಲೀಕರಣಗೊಳಿಸಿ. ಇಂದೇ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ.' }
  },
  Malayalam: {
    code: 'ML',
    scene1: { title: 'ഊരുമിത്ര', subtitle: 'നിങ്ങളുടെ ഗ്രാമത്തിന്റെ ഡിജിറ്റൽ കൂട്ടാളി', voice: 'ഊരുമിത്രയിലൂടെ നിങ്ങളുടെ ഗ്രാമീണ കൂട്ടായ്മയെ ബന്ധിപ്പിക്കുക.' },
    scene2: { title: 'എളുപ്പത്തിൽ വാങ്ങാം-വിൽക്കാം', subtitle: 'പ്രാദേശിക വിപണി', voice: 'കന്നുകാലികൾ, ട്രാക്ടറുകൾ, വിളകൾ, ഗൃഹോപകരണങ്ങൾ എന്നിവയ്ക്കായുള്ള നേരിട്ടുള്ള വിപണി.' },
    scene3: { title: 'വിശ്വസ്ത സേവനങ്ങൾ', subtitle: 'വിദഗ്ദ്ധരായ തൊഴിലാളികൾ', voice: 'നിങ്ങളുടെ അടുത്തുള്ള സാക്ഷ്യപ്പെടുത്തിയിട്ടുള്ള ഇലക്ട്രീഷ്യൻമാർ, പ്ലംബർമാർ, ആശാരിമാർ, കാർഷിക സേവനങ്ങൾ എന്നിവരെ കണ്ടെത്തുക.' },
    scene4: { title: 'ജോലികൾ & വാടകകൾ', subtitle: 'അവസരങ്ങളും ലീസുകളും', voice: 'പ്രാദേശിക ജോലികൾ, കാർഷിക യന്ത്രങ്ങളുടെ ലീസ്, സ്ഥല വാടക വിവരങ്ങൾ എന്നിവ ഉടനടി അറിയുക.' },
    scene5: { title: 'എപ്പോഴും ബന്ധപ്പെടാം', subtitle: 'കൂട്ടായ്മയും ഔദ്യോഗിക വിവരങ്ങളും', voice: 'ഗ്രാമത്തിലെ വിശേഷങ്ങൾ, ഔദ്യോഗിക അറിയിപ്പുകൾ, അടിയന്തിര മുന്നറിയിപ്പുകൾ എന്നിവ തത്സമയം അറിയുക.' },
    scene6: { title: 'ഊരുമിത്ര ആപ്പ്', subtitle: 'ഗ്രാമങ്ങളെ ഡിജിറ്റലായി ബന്ധിപ്പിക്കുന്നു', voice: 'ഗ്രാമീണ ഇന്ത്യയെ ഡിജിറ്റലായി ശാക്തീകരിക്കാം. ഇപ്പോൾ ഇൻസ്റ്റാൾ ചെയ്യുക.' }
  }
}

// Presenter image imported via dynamic generated asset filename
const PRESENTER_IMG = '/oorumitra_presenter_1783098810743.png'

export default function PromotionalVideo() {
  const [lang, setLang] = useState('English')
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0) // 0 to 60 seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [musicOn, setMusicOn] = useState(true)

  const audioCtxRef = useRef(null)
  const musicIntervalRef = useRef(null)

  const duration = 60 // 60-second video
  const fps = 60

  // Animation interval loop
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setTime((prev) => {
        const next = prev + (1 / fps) * playbackSpeed
        if (next >= duration) {
          return 0
        }
        return next
      })
    }, 1000 / fps)
    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed])

  // Custom Web Audio API Synthesizer (Inspiring cultural fusion loop)
  const playSynthNote = (freq, type, durationSec, vol = 0.1) => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)

    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + durationSec)
  }

  // Loop rhythmic pattern syncing with BPM
  useEffect(() => {
    if (!isPlaying || !musicOn) {
      if (musicIntervalRef.current) clearInterval(musicIntervalRef.current)
      return
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    let beat = 0
    // 120 BPM -> 2 beats per second -> 250ms per 8th note
    musicIntervalRef.current = setInterval(() => {
      // Kick Drum on quarter beats
      if (beat % 4 === 0) {
        playSynthNote(90, 'sine', 0.25, 0.45)
      }
      
      // Cultural rhythm shaker/hihat on off-beats
      if (beat % 2 === 1) {
        // High frequency noise burst
        playSynthNote(8000, 'triangle', 0.05, 0.05)
      }

      // Chord Progression Arpeggio based on active scene
      const sceneIndex = Math.floor(time / 10)
      const scale = [
        [261.63, 329.63, 392.00, 523.25], // C Major (Scene 1)
        [293.66, 349.23, 440.00, 587.33], // D Minor (Scene 2)
        [329.63, 392.00, 493.88, 659.25], // E Minor (Scene 3)
        [349.23, 440.00, 523.25, 698.46], // F Major (Scene 4)
        [392.00, 493.88, 587.33, 783.99], // G Major (Scene 5)
        [440.00, 523.25, 659.25, 880.00]  // A Minor (Scene 6)
      ]
      const currentChord = scale[sceneIndex] || scale[0]
      const noteFreq = currentChord[beat % currentChord.length]

      // Plucky traditional sitar-like synth sound
      if (beat % 2 === 0) {
        playSynthNote(noteFreq, 'triangle', 0.35, 0.12)
        // Octave harmony note
        playSynthNote(noteFreq * 2, 'sine', 0.15, 0.04)
      }

      beat++
    }, 250)

    return () => {
      if (musicIntervalRef.current) clearInterval(musicIntervalRef.current)
    }
  }, [isPlaying, musicOn, time])

  const handleSeek = (e) => {
    setTime(parseFloat(e.target.value))
  }

  // Format code display
  const pad = (num) => ('00' + num).slice(-2)
  const formatTimecode = (t) => {
    const min = Math.floor(t / 60)
    const sec = Math.floor(t % 60)
    const ms = Math.floor((t % 1) * 100)
    return `${pad(min)}:${pad(sec)}:${pad(ms)}`
  }

  // Scenes mapping based on seconds
  const sceneIndex = Math.min(Math.floor(time / 10), 5)
  const sceneLabels = [
    '🎬 Scene 1: Introduction',
    '🛒 Scene 2: Buy & Sell Products',
    '🔧 Scene 3: Find Trusted Local Services',
    '🚜 Scene 4: Jobs, Rentals & Leases',
    '🤝 Scene 5: Community & Announcements',
    '🏆 Scene 6: Premium App CTA'
  ]
  const currentSceneName = sceneLabels[sceneIndex]
  const translations = LANGUAGES[lang]
  const textKeys = ['scene1', 'scene2', 'scene3', 'scene4', 'scene5', 'scene6']
  const sceneText = translations[textKeys[sceneIndex]]

  // Motion styling pipelines based on active play seconds
  const getCameraScale = () => {
    // Dynamic cinematic zoom in and pan loop for each 10-sec block
    const phase = (time % 10) / 10 // 0 to 1
    const scale = 1.05 + Math.sin(phase * Math.PI) * 0.04
    const yPan = -5 + Math.cos(phase * Math.PI) * 5
    return {
      transform: `scale(${scale}) translateY(${yPan}px)`,
      transition: 'transform 0.05s linear'
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center py-8 px-4 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Studio Header */}
      <div className="max-w-6xl w-full flex justify-between items-center border-b border-gray-800 pb-4 mb-6 text-left">
        <div>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-500/20">
            Social Media Video Studio
          </span>
          <h1 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>🎬</span> OoruMitra 60-Second Promotional Reels Ad
          </h1>
        </div>

        {/* Global Sound Control */}
        <button
          onClick={() => setMusicOn(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            musicOn
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          <span>{musicOn ? '🔊 Synthetic Soundtrack: ON' : '🔇 Soundtrack Muted'}</span>
        </button>
      </div>

      {/* Main Studio Console Layout */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Vertical Video Monitor (1080x1920 scaled preview container) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center">
          
          {/* Vertical Container (Reels Ratio 9:16) */}
          <div className="relative w-[320px] h-[568px] bg-gray-950 rounded-[40px] border-8 border-gray-800 shadow-[0_0_40px_rgba(99,102,241,0.15)] overflow-hidden flex flex-col justify-between">
            
            {/* Status bar */}
            <div className="absolute top-0 inset-x-0 h-7 bg-gradient-to-b from-black/60 to-transparent z-40 flex justify-between items-center px-6">
              <span className="text-[10px] font-bold text-white/90">OoruMitra Ad</span>
              <div className="w-16 h-3.5 bg-black rounded-full border border-gray-800" />
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/90">
                <span>{translations.code}</span>
                <span className="w-2.5 h-2 bg-emerald-500 rounded-sm" />
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="absolute inset-0 z-10 overflow-hidden flex flex-col justify-between p-6 pt-10 pb-8 select-none" style={getCameraScale()}>
              
              {/* Background scene elements */}
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 animate-fadeIn" style={{ backgroundImage: `url(${PRESENTER_IMG})` }} />
              
              {/* Cinematic Vignette Filter Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 mix-blend-multiply z-20" />

              {/* Dynamic Presentation UI Elements depending on Scene */}
              <div className="relative z-30 w-full flex flex-col items-center gap-3">
                {/* Presenter Speech Balloon dialog */}
                <div className="bg-white/95 backdrop-blur shadow-lg rounded-2xl p-3 border border-white max-w-[240px] animate-scaleUp text-left">
                  <p className="text-[11px] font-bold text-indigo-900 leading-normal">
                    📢 "{sceneText.voice}"
                  </p>
                </div>
              </div>

              {/* Central App Mockup Showcase Window */}
              <div className="relative z-30 w-full flex justify-center py-2">
                
                {/* Simulated Smartphone Screen */}
                <div className="w-52 h-72 bg-slate-900 rounded-3xl border-4 border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between p-3 relative">
                  
                  {/* Mock App Header */}
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                    <span className="text-[9px] font-black text-indigo-400">OoruMitra</span>
                    <span className="text-[8px] bg-slate-800 text-slate-400 px-1 rounded">V1.4</span>
                  </div>

                  {/* Mock App Content (Changes per Scene) */}
                  <div className="flex-1 py-2 flex flex-col gap-2 overflow-y-auto">
                    {sceneIndex === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                        <div className="text-3xl animate-bounce">🌾</div>
                        <p className="text-[10px] font-bold text-indigo-300">ఊరుమిత్ర ప్లాట్‌ఫారమ్</p>
                        <p className="text-[8px] text-slate-400">Village companion</p>
                      </div>
                    )}

                    {sceneIndex === 1 && (
                      <div className="space-y-1.5 text-left">
                        <p className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500">Products for Sale</p>
                        {[
                          ['🚜 John Deere Tractor', '₹4,50,000'],
                          ['🐄 Ongole Breed Bull', '₹85,000'],
                          ['⚙️ Hand Seed Drill', '₹12,500']
                        ].map(([n, p]) => (
                          <div key={n} className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 flex justify-between items-center">
                            <span className="text-[8px] text-white truncate max-w-[90px]">{n}</span>
                            <span className="text-[8px] font-extrabold text-emerald-400">{p}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {sceneIndex === 2 && (
                      <div className="space-y-1.5 text-left">
                        <p className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500">Service Providers</p>
                        {[
                          ['💡 R. Kumar (Electrician)', '⭐ 4.9 (45)'],
                          ['🔧 G. Reddy (Mechanic)', '⭐ 4.8 (32)'],
                          ['🚰 S. Murthy (Plumber)', '⭐ 4.7 (18)']
                        ].map(([n, r]) => (
                          <div key={n} className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 flex justify-between items-center">
                            <span className="text-[8px] text-white truncate max-w-[100px]">{n}</span>
                            <span className="text-[8px] font-bold text-amber-400">{r}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {sceneIndex === 3 && (
                      <div className="space-y-1.5 text-left">
                        <p className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500">Rentals & Leases</p>
                        {[
                          ['🌾 Harvesting Machine', '₹1,200 / hr'],
                          ['🏠 2 BHK Village House', '₹4,000 / mo'],
                          ['🌱 3 Acres Fertile Land', '₹15,000 / yr']
                        ].map(([n, r]) => (
                          <div key={n} className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 flex justify-between items-center">
                            <span className="text-[8px] text-white truncate max-w-[95px]">{n}</span>
                            <span className="text-[8px] font-black text-indigo-300">{r}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {sceneIndex === 4 && (
                      <div className="space-y-1.5 text-left">
                        <p className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500">Community Bulletin</p>
                        {[
                          ['📢 Panchayat Meeting', 'Sunday, 10 AM'],
                          ['🎉 Village Temple Festival', '15th July onwards'],
                          ['🧬 Free Health Camp', 'Primary School']
                        ].map(([n, d]) => (
                          <div key={n} className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
                            <p className="text-[8px] text-white font-semibold truncate">{n}</p>
                            <p className="text-[7px] text-slate-400 mt-0.5">{d}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {sceneIndex === 5 && (
                      <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                        <p className="text-[10px] font-bold text-emerald-400">📲 Available Now</p>
                        <div className="flex flex-col gap-1 w-full px-4">
                          <div className="bg-slate-800 p-1 rounded text-[8px] font-bold text-white border border-slate-700">Google Play</div>
                          <div className="bg-indigo-600 p-1 rounded text-[8px] font-bold text-white border border-indigo-500">App Store</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mock App Navigation Bar */}
                  <div className="border-t border-slate-800 pt-1.5 flex justify-around text-[9px]">
                    <span>🏠</span><span>🛒</span><span>🔧</span><span>📢</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Text Overlays and Subtitles */}
              <div className="relative z-30 w-full text-center flex flex-col gap-1 pt-4">
                <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest drop-shadow animate-pulse">
                  {sceneText.title}
                </span>
                <p className="text-xs font-bold text-white tracking-wide leading-tight drop-shadow-md">
                  {sceneText.subtitle}
                </p>

                {/* Subtitle Translation Caption block */}
                <div className="bg-black/75 rounded-lg border border-gray-800 px-3 py-1.5 mt-2 self-stretch">
                  <p className="text-[10px] text-gray-300 italic tracking-wide">
                    {lang === 'English' ? '' : `[Subtitles: ${lang}] `} {sceneText.voice}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Player controls */}
          <div className="w-[320px] bg-gray-900 border border-gray-800 rounded-3xl p-4 mt-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-indigo-400 font-bold">{formatTimecode(time)}</span>
              <span className="font-mono text-gray-500">00:01:00:00</span>
            </div>

            {/* Range Scrubber */}
            <input
              type="range"
              min={0}
              max={duration - 0.1}
              step={0.1}
              value={time}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            {/* Action buttons */}
            <div className="flex justify-between items-center gap-3">
              <button
                onClick={() => setIsPlaying(prev => !prev)}
                className={`flex-1 font-bold py-2 rounded-xl text-xs transition-all shadow-sm ${
                  isPlaying ? 'bg-amber-500 text-gray-900 hover:bg-amber-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isPlaying ? '⏸ Pause preview' : '▶ Play promo'}
              </button>
              <button
                onClick={() => setTime(0)}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold p-2 rounded-xl text-xs"
                title="Restart Video"
              >
                🔄
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Console Customization Panels */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6 text-left">
          
          {/* Panel 1: Multi-language selector */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <h3 className="text-md font-bold text-white mb-1.5 flex items-center gap-2 border-b border-gray-800 pb-3">
              <span>🌐</span> Multi-Language Audio & Caption Selector
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-normal">
              Select one of the 6 languages below to instantly update text cards, voiceovers, dialog balloons, and subtitles in real-time.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(LANGUAGES).map(lName => (
                <button
                  key={lName}
                  onClick={() => setLang(lName)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    lang === lName
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-black">{LANGUAGES[lName].code}</span>
                  <span>{lName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Panel 2: Scene Timeline Metadata & Specifications */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
              <span>📊</span> Video Timeline & Scene Specs
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <p className="text-gray-500 uppercase tracking-wider font-semibold">Active Scene Phase</p>
                <p className="text-amber-400 font-bold mt-1 text-sm">
                  {currentSceneName}
                </p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider font-semibold mb-2">Video Target Specs</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-800">
                    <p className="text-[10px] text-gray-500">Resolution</p>
                    <p className="font-bold text-white text-xs mt-0.5">1080 x 1920</p>
                  </div>
                  <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-800">
                    <p className="text-[10px] text-gray-500">Frame Rate</p>
                    <p className="font-bold text-white text-xs mt-0.5">60 FPS (Fluid)</p>
                  </div>
                  <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-800">
                    <p className="text-[10px] text-gray-500">Aspect Ratio</p>
                    <p className="font-bold text-white text-xs mt-0.5">9:16 (Vertical)</p>
                  </div>
                  <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-800">
                    <p className="text-[10px] text-gray-500">Runtime</p>
                    <p className="font-bold text-white text-xs mt-0.5">60 Seconds</p>
                  </div>
                </div>
              </div>

              {/* Attribution Footer Requirement */}
              <div className="border-t border-gray-800 pt-4 mt-2">
                <p className="text-gray-500 uppercase tracking-wider font-semibold mb-2.5">Production Credits</p>
                <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-lg font-bold text-indigo-400">
                    OT
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-200">Obulareddy Thavva</p>
                    <p className="text-[10px] text-gray-400">obulareddyjd@gmail.com</p>
                    <p className="text-[9px] text-indigo-400 font-extrabold uppercase mt-0.5">Full Stack AI Engineer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3: Quick Navigation Shortcuts */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
              <span>⚡</span> Scene Shortcuts
            </h3>
            <div className="flex flex-wrap gap-2">
              {sceneLabels.map((s, idx) => (
                <button
                  key={s}
                  onClick={() => setTime(idx * 10)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                    sceneIndex === idx
                      ? 'bg-amber-500 border-amber-400 text-gray-950 shadow'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  Scene {idx + 1}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
