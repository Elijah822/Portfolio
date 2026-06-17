import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import SoundButton from "./components/SoundButton.jsx"
import CloseButton from "./components/CloseButton.jsx"
import { ytEmbedUrl, ytThumbnail } from "./lib/youtube.js"

const BG     = "#07070c"
const TEXT   = "#e0dbd2"
const DIM    = "#a39e98"
const GOLD   = "#c9aa7c"
const BORDER = "rgba(255,255,255,0.07)"

const BTN = {
  fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 3,
  color: BG, background: GOLD, border: "none", padding: "12px 32px",
  cursor: "none", textTransform: "uppercase",
}

const MOBILE_ARROW_GAME_IDS = new Set([1, 3, 4, 9])
const MOBILE_SPACE_GAME_IDS = new Set([3, 9])
const MOBILE_MOUSE_GAME_IDS = new Set([2, 8])

function pressKey(key) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }))
}

function releaseKey(key) {
  window.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true, cancelable: true }))
}

function DpadButton({ label, keyName, onPress, onRelease, className = "" }) {
  const down = () => {
    onPress?.(keyName)
    pressKey(keyName)
  }
  const up = () => {
    onRelease?.(keyName)
    releaseKey(keyName)
  }
  return (
    <button
      type="button"
      className={`game-dpad__btn ${className}`.trim()}
      aria-label={label}
      onPointerDown={e => { e.preventDefault(); down() }}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
    >
      {label}
    </button>
  )
}

function MobileGamePad({ showSpace }) {
  return (
    <div className="game-dpad" aria-label="Game controls">
      <div className="game-dpad__grid">
        <span className="game-dpad__empty" />
        <DpadButton label="↑" keyName="ArrowUp" className="game-dpad__btn--up" />
        <span className="game-dpad__empty" />
        <DpadButton label="←" keyName="ArrowLeft" className="game-dpad__btn--left" />
        {showSpace ? (
          <DpadButton label="␣" keyName=" " className="game-dpad__btn--space" />
        ) : (
          <span className="game-dpad__empty game-dpad__empty--center" />
        )}
        <DpadButton label="→" keyName="ArrowRight" className="game-dpad__btn--right" />
        <span className="game-dpad__empty" />
        <DpadButton label="↓" keyName="ArrowDown" className="game-dpad__btn--down" />
        <span className="game-dpad__empty" />
      </div>
    </div>
  )
}

const GAMES = [
  { id:1,  name:"Snake",    tag:"Arrow keys",       color:"#5ecfb1", desc:"Eat. Grow. Don't bite yourself." },
  { id:2,  name:"Pong",     tag:"Mouse to move",    color:"#c9aa7c", desc:"Beat the machine. First to 7." },
  { id:3,  name:"Tetris",   tag:"Arrows + Space",   color:"#9b7ce0", desc:"Stack. Clear. Outlast." },
  { id:4,  name:"2048",     tag:"Arrow keys",       color:"#e07c7c", desc:"Merge tiles. Reach 2048." },
  { id:5,  name:"Memory",   tag:"Click to flip",    color:"#7ca8e0", desc:"Find all pairs. Faster than yesterday." },
  { id:6,  name:"Typing",   tag:"Just type",        color:"#e0c87c", desc:"Words per minute. No backspace." },
  { id:7,  name:"Reaction", tag:"Click when green", color:"#7ce08a", desc:"How sharp are your reflexes?" },
  { id:8,  name:"Breakout", tag:"Mouse to move",    color:"#e07ca8", desc:"Destroy every last brick." },
  { id:9,  name:"Space",    tag:"Arrows + Space",   color:"#7ce0d4", desc:"Survive the asteroid field." },
  { id:10, name:"Stroop",   tag:"Click the color",  color:"#c4e07c", desc:"Your brain vs itself." },
  { id:11, name:"???",      tag:"Coming soon",      color:GOLD,      desc:"Something new is brewing...", locked:true },
]

// ── CONSOLE GAME DATA (PS · Xbox) ─────────────────────────────────────────────
const CONSOLE_GAMES = [
  { id:1,  short:"GTA IV",        title:"Grand Theft Auto IV",           year:"2008", genre:"Open World · Crime",   note:"The most honest Rockstar ever got. Niko's story hit different.", grad:"linear-gradient(150deg,#060e1a 0%,#0d1f38 60%,#1e3554 100%)", accent:"#5a8fbf", trailerId:"M80K51DosFo" },
  { id:2,  short:"GTA V",         title:"Grand Theft Auto V",            year:"2013", genre:"Open World · Crime",   note:"Three protagonists. One perfectly broken city. Still unmatched.", grad:"linear-gradient(150deg,#080e00 0%,#162600 60%,#c9a800 100%)", accent:"#d4a800", trailerId:"RLoBX9skQoY" },
  { id:3,  short:"FIFA 23",       title:"FIFA 23",                       year:"2022", genre:"Football · Sports",    note:"The last FIFA before the rebrand. End of a 30-year era.", grad:"linear-gradient(150deg,#001228 0%,#002a52 60%,#0055a5 100%)", accent:"#00adef", trailerId:"o3V-GvvZBRE" },
  { id:4,  short:"FC 25",         title:"EA Sports FC 25",               year:"2024", genre:"Football · Sports",    note:"Rush mode was the best thing to happen to the game in years.", grad:"linear-gradient(150deg,#001208 0%,#003820 60%,#00a650 100%)", accent:"#00c960", trailerId:"Xh5f5P7_77U" },
  { id:5,  short:"FC 26",         title:"EA Sports FC 26",               year:"2025", genre:"Football · Sports",    note:"The latest in the collection. The Beautiful Game, undefeated.", grad:"linear-gradient(150deg,#150300 0%,#341000 60%,#cc4800 100%)", accent:"#ff6b1a", trailerId:"Xh5f5P7_77U" },
  { id:6,  short:"Spider-Man",    title:"Marvel's Spider-Man",           year:"2018", genre:"Action Adventure",     note:"Web-swinging through Manhattan at golden hour. A masterclass.", grad:"linear-gradient(150deg,#120000 0%,#2e0404 60%,#c41e1e 100%)", accent:"#e83535", trailerId:"9fboG9X_itk" },
  { id:7,  short:"Ghost of Tsushima", title:"Ghost of Tsushima",        year:"2020", genre:"Action RPG · Samurai", note:"A haiku in game form. The wind mechanic alone deserves an award.", grad:"linear-gradient(150deg,#0d0600 0%,#251400 50%,#c49a3c 80%,#8b1a1a 100%)", accent:"#c49a3c", trailerId:"7zPrsmrXnWE" },
  { id:8,  short:"A Way Out",     title:"A Way Out",                     year:"2018", genre:"Co-op · Drama",        note:"The best co-op I've played. That ending, nothing prepares you.", grad:"linear-gradient(150deg,#00102a 0%,#001a10 50%,#2a3a5c 100%)", accent:"#7ca8e0", trailerId:"D0U0kl9q3oE" },
  { id:9,  short:"Black Ops 7",   title:"Call of Duty: Black Ops 7",     year:"2025", genre:"FPS · Tactical",       note:"The grind is real. The chaos is real. Still can't stop.", grad:"linear-gradient(150deg,#040804 0%,#0a1408 60%,#1e3210 100%)", accent:"#4a7a20", trailerId:"i6GkFzczZAE" },
  { id:10, short:"Beach Buggy",   title:"Beach Buggy Racing",            year:"2014", genre:"Racing · Kart",        note:"Deceptively competitive. Don't let the beach fool you.", grad:"linear-gradient(150deg,#120800 0%,#2e1800 60%,#e8880a 100%)", accent:"#ff9f1c", trailerId:"ONpzj0n7Ez4" },
  { id:11, short:"Beach Buggy 2", title:"Beach Buggy Racing 2",          year:"2018", genre:"Racing · Kart",        note:"More tracks. More chaos. More damage. The sequel that earned it.", grad:"linear-gradient(150deg,#150010 0%,#380030 60%,#c83c80 100%)", accent:"#e05090", trailerId:"SLW1sZPcvnU" },
  { id:12, short:"???",           title:"Next Session",                  year:"TBD",    genre:"Unknown",              note:"Controller is charged. Game TBD. Stay tuned.", grad:"linear-gradient(150deg,#0a0a0a 0%,#141414 100%)", accent:"#c9aa7c", locked:true },
]

const FEATURED_TRAILERS = CONSOLE_GAMES.filter(g => g.trailerId && !g.locked)

function TrailerPreview({ videoId, active = false, opacity = 0.55 }) {
  if (!videoId) return null
  return (
    <img
      src={ytThumbnail(videoId, "hqdefault")}
      alt=""
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: active ? Math.min(opacity + 0.12, 0.85) : opacity,
        filter: "saturate(0.9)",
        transform: active ? "scale(1.06)" : "scale(1)",
        transition: "opacity 0.35s ease, transform 0.45s ease",
      }}
    />
  )
}

// ── CONSOLE GAME CARD ─────────────────────────────────────────────────────────
function ConsoleGameCard({ g, onTrailer }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      data-h
      className={`console-card${hov ? " is-hovered" : ""}`}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      onClick={() => !g.locked && g.trailerId && onTrailer?.(g)}
      style={{ position:"relative", width:"100%", paddingBottom:"155%", overflow:"hidden", cursor:"none", userSelect:"none" }}
    >
      {g.trailerId ? (
        <TrailerPreview videoId={g.trailerId} active={hov} opacity={hov ? 0.72 : 0.55} />
      ) : (
        <div style={{ position:"absolute", inset:0, background:g.grad, transition:"transform 0.4s ease", transform:hov?"scale(1.03)":"scale(1)" }} />
      )}
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, rgba(7,7,12,0.15) 0%, rgba(7,7,12,0.55) 55%, rgba(7,7,12,0.95) 100%)` }} />
      {!g.locked && g.trailerId && hov && (
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:44, height:44, borderRadius:"50%", border:`1px solid ${GOLD}`, display:"flex", alignItems:"center", justifyContent:"center", color:GOLD, fontSize:14, background:"rgba(7,7,12,0.5)" }}>▶</div>
      )}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:g.locked?DIM:g.accent, opacity:hov?1:0.5, transition:"opacity 0.3s" }} />
      <div style={{ position:"absolute", inset:0, padding:"22px 20px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:8, letterSpacing:3, color:g.locked?DIM:g.accent, marginBottom:6, textTransform:"uppercase" }}>{g.year}</div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:8, letterSpacing:2, color:"rgba(255,255,255,0.35)", textTransform:"uppercase" }}>{g.genre}</div>
        </div>
        <div>
          <div style={{ fontFamily:'var(--font-heading)', fontSize:"clamp(20px,2.2vw,28px)", fontWeight:300, color:g.locked?DIM:TEXT, lineHeight:1.15, marginBottom:8 }}>
            {g.short}
          </div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:13, fontWeight:400, color:"rgba(224,219,210,0.75)", lineHeight:1.65, maxHeight:hov?"100px":"0px", opacity:hov?1:0, overflow:"hidden", transition:"all 0.35s ease" }}>
            {g.note}
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div style={{ fontFamily:'var(--font-body)', fontSize:8, letterSpacing:2, color:"rgba(255,255,255,0.22)", textTransform:"uppercase" }}>PS · Xbox</div>
          {g.locked && <div style={{ fontFamily:'var(--font-body)', fontSize:8, letterSpacing:3, color:DIM }}>SOON</div>}
          {!g.locked && hov && <div style={{ fontFamily:'var(--font-body)', fontSize:8, letterSpacing:2, color:g.accent }}>{g.trailerId ? "TRAILER" : "◈ PLAYED"}</div>}
        </div>
      </div>
    </div>
  )
}

function ConsoleGames({ onTrailer }) {
  return (
    <div className="page-pad-x" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ marginBottom:48 }}>
        <div style={{ fontFamily:'var(--font-body)', fontSize:11, letterSpacing:5, color:GOLD, marginBottom:20, textTransform:"uppercase" }}>PS · Xbox Collection</div>
        <div style={{ fontFamily:'var(--font-heading)', fontSize:"clamp(28px,3.5vw,44px)", fontWeight:300, color:TEXT, lineHeight:1.2, marginBottom:16 }}>
          Games that lived<br/>in the controller.
        </div>
        <div style={{ fontFamily:'var(--font-body)', fontSize:12, letterSpacing:2, color:DIM }}>
          {CONSOLE_GAMES.filter(g=>!g.locked).length} titles played · click a card for the trailer
        </div>
      </div>

      <div className="console-poster-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:1, background:BORDER, border:`1px solid ${BORDER}` }}>
        {CONSOLE_GAMES.map(g => (
          <div key={g.id} style={{ background:BG }}>
            <ConsoleGameCard g={g} onTrailer={onTrailer} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SNAKE ─────────────────────────────────────────────────────────────────────
function SnakeGame({ onRestart }) {
  const cvs = useRef(null)
  const alive = useRef(true)
  const snake = useRef([{x:10,y:10}])
  const dir   = useRef({x:1,y:0})
  const next  = useRef({x:1,y:0})
  const food  = useRef({x:5,y:5})
  const [score, setScore] = useState(0)
  const [over,  setOver]  = useState(false)

  useEffect(() => {
    const canvas = cvs.current, ctx = canvas.getContext("2d")
    const G=20, W=canvas.width, H=canvas.height, CW=W/G, CH=H/G
    let sc=0
    alive.current=true; snake.current=[{x:10,y:10}]; dir.current={x:1,y:0}; next.current={x:1,y:0}

    const spawnFood = () => {
      let f
      do { f={x:Math.floor(Math.random()*G),y:Math.floor(Math.random()*G)} }
      while(snake.current.some(c=>c.x===f.x&&c.y===f.y))
      food.current=f
    }
    spawnFood()

    const tick = () => {
      if(!alive.current) return
      dir.current=next.current
      const h={x:snake.current[0].x+dir.current.x, y:snake.current[0].y+dir.current.y}
      if(h.x<0||h.x>=G||h.y<0||h.y>=G||snake.current.some(c=>c.x===h.x&&c.y===h.y)) {
        alive.current=false; setOver(true); return
      }
      snake.current.unshift(h)
      if(h.x===food.current.x&&h.y===food.current.y) { sc++; setScore(sc); spawnFood() }
      else snake.current.pop()

      ctx.fillStyle=BG; ctx.fillRect(0,0,W,H)
      for(let x=0;x<G;x++) for(let y=0;y<G;y++) { ctx.fillStyle="rgba(255,255,255,0.02)"; ctx.fillRect(x*CW+CW/2-0.5,y*CH+CH/2-0.5,1,1) }
      ctx.shadowColor=GOLD; ctx.shadowBlur=10; ctx.fillStyle=GOLD
      ctx.beginPath(); ctx.arc(food.current.x*CW+CW/2,food.current.y*CH+CH/2,CW/2-4,0,Math.PI*2); ctx.fill()
      ctx.shadowBlur=0
      snake.current.forEach((c,i)=>{
        ctx.fillStyle=i===0?TEXT:`rgba(224,219,210,${Math.max(0.1,0.85-i*0.04)})`
        ctx.fillRect(c.x*CW+1,c.y*CH+1,CW-2,CH-2)
      })
    }

    const id=setInterval(tick,110)
    const onKey=e=>{
      const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}}
      if(m[e.key]){const d=m[e.key];if(d.x!==-dir.current.x||d.y!==-dir.current.y){next.current=d;e.preventDefault()}}
    }
    window.addEventListener("keydown",onKey)
    return()=>{ clearInterval(id); window.removeEventListener("keydown",onKey) }
  },[])

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>SCORE: {score}</div>
      <canvas ref={cvs} width={400} height={400} style={{border:`1px solid ${BORDER}`,display:"block"}} />
      {over && <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>PLAY AGAIN</button>}
    </div>
  )
}

// ── PONG ─────────────────────────────────────────────────────────────────────
function PongGame({ onRestart }) {
  const cvs = useRef(null)
  const mouseY = useRef(175)
  const [scores, setScores] = useState([0,0])
  const [over,   setOver]   = useState(null)

  useEffect(() => {
    const canvas=cvs.current, ctx=canvas.getContext("2d")
    const W=500,H=350,PH=80,PW=10,BR=8
    let ball={x:W/2,y:H/2,vx:4,vy:3}
    let playerY=H/2-PH/2, aiY=H/2-PH/2
    let ps=0,as=0,running=true

    const onMouse=e=>{ const r=canvas.getBoundingClientRect(); mouseY.current=e.clientY-r.top-PH/2 }
    canvas.addEventListener("mousemove",onMouse)

    let raf
    const draw=()=>{
      if(!running) return
      playerY=Math.max(0,Math.min(H-PH,mouseY.current))
      aiY+=(ball.y-PH/2-aiY)*0.065

      ball.x+=ball.vx; ball.y+=ball.vy
      if(ball.y-BR<0){ball.y=BR;ball.vy*=-1}
      if(ball.y+BR>H){ball.y=H-BR;ball.vy*=-1}
      if(ball.x-BR<PW+16&&ball.y>playerY&&ball.y<playerY+PH){
        ball.vx=Math.min(12,Math.abs(ball.vx)*1.05)
        ball.vy+=(ball.y-(playerY+PH/2))*0.08
      }
      if(ball.x+BR>W-PW-16&&ball.y>aiY&&ball.y<aiY+PH){
        ball.vx=-Math.min(12,Math.abs(ball.vx)*1.05)
        ball.vy+=(ball.y-(aiY+PH/2))*0.08
      }
      if(ball.x-BR<0){ as++; setScores([ps,as]); ball={x:W/2,y:H/2,vx:4,vy:3} }
      if(ball.x+BR>W){ ps++; setScores([ps,as]); ball={x:W/2,y:H/2,vx:-4,vy:3} }
      if(ps>=7||as>=7){running=false;setOver(ps>=7?"you":"ai");return}

      ctx.fillStyle=BG; ctx.fillRect(0,0,W,H)
      for(let y=0;y<H;y+=20){ctx.fillStyle="rgba(255,255,255,0.05)";ctx.fillRect(W/2-0.5,y,1,12)}
      ctx.fillStyle=TEXT; ctx.fillRect(16,playerY,PW,PH)
      ctx.fillStyle=DIM;  ctx.fillRect(W-16-PW,aiY,PW,PH)
      ctx.shadowColor=GOLD; ctx.shadowBlur=14; ctx.fillStyle=GOLD
      ctx.beginPath(); ctx.arc(ball.x,ball.y,BR,0,Math.PI*2); ctx.fill()
      ctx.shadowBlur=0
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return()=>{ cancelAnimationFrame(raf); canvas.removeEventListener("mousemove",onMouse); running=false }
  },[])

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>YOU {scores[0]} · {scores[1]} AI</div>
      <canvas ref={cvs} width={500} height={350} style={{border:`1px solid ${BORDER}`,cursor:"none"}} />
      {over && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{fontFamily:'var(--font-body)',fontSize:32,color:over==="you"?GOLD:DIM}}>{over==="you"?"You win.":"The machine wins."}</div>
          <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>REMATCH</button>
        </div>
      )}
    </div>
  )
}

// ── TETRIS ────────────────────────────────────────────────────────────────────
const TETROMINOS = [
  {shape:[[1,1,1,1]],       color:"#5ecfb1"},
  {shape:[[1,1],[1,1]],     color:"#c9aa7c"},
  {shape:[[0,1,0],[1,1,1]], color:"#9b7ce0"},
  {shape:[[1,0],[1,0],[1,1]],color:"#e07c7c"},
  {shape:[[0,1],[0,1],[1,1]],color:"#7ca8e0"},
  {shape:[[1,1,0],[0,1,1]], color:"#e0c87c"},
  {shape:[[0,1,1],[1,1,0]], color:"#7ce08a"},
]
const rotatePiece = p => {
  const rows=p.shape.length, cols=p.shape[0].length
  const r=Array.from({length:cols},()=>Array(rows).fill(0))
  for(let i=0;i<rows;i++) for(let j=0;j<cols;j++) r[j][rows-1-i]=p.shape[i][j]
  return {...p,shape:r}
}

function TetrisGame({ onRestart }) {
  const cvs=useRef(null)
  const COLS=10,ROWS=20,CS=28,W=COLS*CS,H=ROWS*CS
  const [score,setScore]=useState(0)
  const [over,setOver]=useState(false)
  const boardRef=useRef(Array.from({length:ROWS},()=>Array(COLS).fill(null)))
  const pieceRef=useRef(null), px=useRef(0), py=useRef(0)
  const running=useRef(true)

  useEffect(()=>{
    const canvas=cvs.current, ctx=canvas.getContext("2d")
    let sc=0
    boardRef.current=Array.from({length:ROWS},()=>Array(COLS).fill(null))
    running.current=true

    const canPlace=(shape,x,y)=>{
      for(let r=0;r<shape.length;r++) for(let c=0;c<shape[r].length;c++){
        if(!shape[r][c]) continue
        if(x+c<0||x+c>=COLS||y+r>=ROWS) return false
        if(y+r>=0&&boardRef.current[y+r][x+c]) return false
      }
      return true
    }
    const spawnPiece=()=>{
      const p=TETROMINOS[Math.floor(Math.random()*TETROMINOS.length)]
      pieceRef.current={...p,shape:p.shape.map(r=>[...r])}
      px.current=Math.floor((COLS-p.shape[0].length)/2)
      py.current=0
      if(!canPlace(pieceRef.current.shape,px.current,py.current)){running.current=false;setOver(true)}
    }
    const lock=()=>{
      const {shape,color}=pieceRef.current
      shape.forEach((row,r)=>row.forEach((v,c)=>{if(v&&py.current+r>=0) boardRef.current[py.current+r][px.current+c]=color}))
      let cleared=0
      boardRef.current=boardRef.current.filter(row=>{if(row.every(v=>v)){cleared++;return false}return true})
      while(boardRef.current.length<ROWS) boardRef.current.unshift(Array(COLS).fill(null))
      if(cleared){sc+=[0,100,300,500,800][cleared]||800;setScore(sc)}
      spawnPiece()
    }
    const draw=()=>{
      ctx.fillStyle=BG; ctx.fillRect(0,0,W,H)
      for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
        ctx.strokeStyle="rgba(255,255,255,0.03)"; ctx.strokeRect(c*CS,r*CS,CS,CS)
        if(boardRef.current[r][c]){ctx.fillStyle=boardRef.current[r][c];ctx.fillRect(c*CS+1,r*CS+1,CS-2,CS-2)}
      }
      if(pieceRef.current){
        let gy=py.current
        while(canPlace(pieceRef.current.shape,px.current,gy+1)) gy++
        pieceRef.current.shape.forEach((row,r)=>row.forEach((v,c)=>{
          if(!v) return
          ctx.fillStyle="rgba(255,255,255,0.07)"; ctx.fillRect((px.current+c)*CS+1,(gy+r)*CS+1,CS-2,CS-2)
          ctx.fillStyle=pieceRef.current.color;    ctx.fillRect((px.current+c)*CS+1,(py.current+r)*CS+1,CS-2,CS-2)
        }))
      }
    }
    spawnPiece()
    let lastDrop=Date.now(), raf
    const loop=()=>{
      if(!running.current) return
      if(Date.now()-lastDrop>600){
        if(canPlace(pieceRef.current.shape,px.current,py.current+1)) py.current++
        else lock()
        lastDrop=Date.now()
      }
      draw(); raf=requestAnimationFrame(loop)
    }
    raf=requestAnimationFrame(loop)
    const onKey=e=>{
      if(!running.current||!pieceRef.current) return
      if(e.key==="ArrowLeft"){if(canPlace(pieceRef.current.shape,px.current-1,py.current)) px.current--;e.preventDefault()}
      if(e.key==="ArrowRight"){if(canPlace(pieceRef.current.shape,px.current+1,py.current)) px.current++;e.preventDefault()}
      if(e.key==="ArrowDown"){if(canPlace(pieceRef.current.shape,px.current,py.current+1)) py.current++;else lock();lastDrop=Date.now();e.preventDefault()}
      if(e.key==="ArrowUp"){const r=rotatePiece(pieceRef.current);if(canPlace(r.shape,px.current,py.current)) pieceRef.current=r;e.preventDefault()}
      if(e.key===" "){while(canPlace(pieceRef.current.shape,px.current,py.current+1)) py.current++;lock();e.preventDefault()}
    }
    window.addEventListener("keydown",onKey)
    return()=>{ cancelAnimationFrame(raf); window.removeEventListener("keydown",onKey); running.current=false }
  },[])

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>SCORE: {score}</div>
      <canvas ref={cvs} width={W} height={H} style={{border:`1px solid ${BORDER}`}} />
      {over && <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>PLAY AGAIN</button>}
    </div>
  )
}

// ── 2048 ─────────────────────────────────────────────────────────────────────
const spawnTile=g=>{
  const empty=[];g.forEach((row,r)=>row.forEach((v,c)=>{if(!v)empty.push([r,c])}))
  if(!empty.length) return
  const [r,c]=empty[Math.floor(Math.random()*empty.length)]
  g[r][c]=Math.random()<0.9?2:4
}
const make2048Grid=()=>{const g=Array.from({length:4},()=>Array(4).fill(0));spawnTile(g);spawnTile(g);return g}
const slideRow=row=>{
  const f=row.filter(v=>v),out=[];let i=0,gained=0
  while(i<f.length){if(i+1<f.length&&f[i]===f[i+1]){out.push(f[i]*2);gained+=f[i]*2;i+=2}else{out.push(f[i]);i++}}
  while(out.length<4) out.push(0)
  return{row:out,gained}
}
const TILE_C={0:"rgba(255,255,255,0.04)",2:"#2a2825",4:"#3a3530",8:"#c9aa7c",16:"#d4a96a",32:"#e07c7c",64:"#c96060",128:"#9b7ce0",256:"#7ca8e0",512:"#5ecfb1",1024:"#7ce08a",2048:TEXT}

function Game2048({ onRestart }) {
  const [grid,setGrid]=useState(make2048Grid)
  const [score,setScore]=useState(0)
  const [won,setWon]=useState(false)
  const [lost,setLost]=useState(false)

  useEffect(()=>{
    const onKey=e=>{
      if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return
      e.preventDefault()
      setGrid(prev=>{
        const g=prev.map(r=>[...r]); let moved=false, bonus=0
        if(e.key==="ArrowLeft") g.forEach((row,r)=>{const{row:s,gained}=slideRow(row);if(JSON.stringify(s)!==JSON.stringify(row))moved=true;g[r]=s;bonus+=gained})
        if(e.key==="ArrowRight") g.forEach((row,r)=>{const rev=[...row].reverse();const{row:s,gained}=slideRow(rev);const ns=[...s].reverse();if(JSON.stringify(ns)!==JSON.stringify(row))moved=true;g[r]=ns;bonus+=gained})
        if(e.key==="ArrowUp") for(let c=0;c<4;c++){const col=g.map(r=>r[c]);const{row:s,gained}=slideRow(col);if(JSON.stringify(s)!==JSON.stringify(col))moved=true;s.forEach((v,r)=>g[r][c]=v);bonus+=gained}
        if(e.key==="ArrowDown") for(let c=0;c<4;c++){const col=g.map(r=>r[c]).reverse();const{row:s,gained}=slideRow(col);const ns=[...s].reverse();if(JSON.stringify(ns)!==JSON.stringify(g.map(r=>r[c])))moved=true;ns.forEach((v,r)=>g[r][c]=v);bonus+=gained}
        if(moved){spawnTile(g);if(bonus) setScore(s=>s+bonus)}
        if(g.flat().includes(2048)) setWon(true)
        const canMove=g.some((row,r)=>row.some((v,c)=>!v||(r<3&&g[r+1][c]===v)||(c<3&&g[r][c+1]===v)))
        if(!canMove) setLost(true)
        return g
      })
    }
    window.addEventListener("keydown",onKey)
    return()=>window.removeEventListener("keydown",onKey)
  },[])

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
      <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>SCORE: {score}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,90px)",gap:8}}>
        {grid.flat().map((v,i)=>(
          <div key={i} style={{width:90,height:90,background:TILE_C[v]||GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:'var(--font-body)',fontSize:v>=1000?24:v>=100?30:38,fontWeight:300,color:v>4?BG:DIM,transition:"background 0.15s"}}>
            {v||""}
          </div>
        ))}
      </div>
      {(won||lost)&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{fontFamily:'var(--font-body)',fontSize:28,color:won?GOLD:DIM}}>{won?"You reached 2048.":"No moves left."}</div>
          <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  )
}

// ── MEMORY ────────────────────────────────────────────────────────────────────
const MEM_SYMS=["◈","◉","◎","◐","◑","◒","◓","△","⬡","▽","⬠","◆","⟐","◇","⬟","⊕"]
const makeMemCards=()=>{const p=[...MEM_SYMS.slice(0,8),...MEM_SYMS.slice(0,8)];for(let i=p.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]]};return p.map((sym,id)=>({id,sym,flipped:false,matched:false}))}

function MemoryGame({ onRestart }) {
  const [cards,setCards]=useState(makeMemCards)
  const [sel,setSel]=useState([])
  const [moves,setMoves]=useState(0)
  const [done,setDone]=useState(false)
  const locked=useRef(false)

  const flip=id=>{
    if(locked.current) return
    const card=cards.find(c=>c.id===id)
    if(!card||card.flipped||card.matched||sel.length>=2) return
    const newSel=[...sel,id]
    setCards(prev=>prev.map(c=>c.id===id?{...c,flipped:true}:c))
    if(newSel.length===2){
      setMoves(m=>m+1); locked.current=true
      const [a,b]=newSel.map(id=>cards.find(c=>c.id===id))
      if(a.sym===b.sym){
        setCards(prev=>{const next=prev.map(c=>newSel.includes(c.id)?{...c,matched:true,flipped:true}:c);if(next.every(c=>c.matched)) setDone(true);return next})
        setSel([]); locked.current=false
      } else {
        setSel(newSel)
        setTimeout(()=>{
          setCards(prev=>prev.map(c=>newSel.includes(c.id)&&!c.matched?{...c,flipped:false}:c))
          setSel([]); locked.current=false
        },900)
      }
    } else setSel(newSel)
  }

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
      <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>MOVES: {moves}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,80px)",gap:8}}>
        {cards.map(c=>(
          <div key={c.id} data-h onClick={()=>flip(c.id)} style={{width:80,height:80,display:"flex",alignItems:"center",justifyContent:"center",cursor:"none",fontSize:26,background:c.flipped||c.matched?"rgba(201,170,124,0.1)":"rgba(255,255,255,0.04)",border:`1px solid ${c.matched?GOLD+"44":c.flipped?"rgba(255,255,255,0.15)":BORDER}`,color:c.matched?GOLD:TEXT,transition:"all 0.2s",transform:c.flipped||c.matched?"scale(1)":"scale(0.96)"}}>
            {c.flipped||c.matched?c.sym:""}
          </div>
        ))}
      </div>
      {done&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{fontFamily:'var(--font-body)',fontSize:28,color:GOLD}}>Cleared in {moves} moves.</div>
          <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  )
}

// ── TYPING SPEED ─────────────────────────────────────────────────────────────
const WORD_POOL=["design","system","pixel","interface","layout","prototype","visual","hierarchy","contrast","motion","product","pattern","component","structure","token","user","flow","grid","typeface","weight","space","color","brand","form","feedback","state","variant","layer","frame","asset","deploy","iterate","scope","audit","journey","canvas","stroke","vector","render","export","palette","shadow","radius","opacity","cursor","gesture","scroll","viewport","baseline","kerning"]
const makeWords=()=>{const w=[];for(let i=0;i<40;i++) w.push(WORD_POOL[Math.floor(Math.random()*WORD_POOL.length)]);return w}

function TypingGame({ onRestart }) {
  const [words]=useState(makeWords)
  const [input,setInput]=useState("")
  const [idx,setIdx]=useState(0)
  const [correct,setCorrect]=useState(0)
  const [timer,setTimer]=useState(60)
  const [started,setStarted]=useState(false)
  const [done,setDone]=useState(false)

  useEffect(()=>{
    if(!started||done) return
    const id=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(id);setDone(true);return 0}return t-1}),1000)
    return()=>clearInterval(id)
  },[started,done])

  const onInput=e=>{
    if(!started) setStarted(true)
    const val=e.target.value
    if(val.endsWith(" ")){
      if(val.trim()===words[idx]) setCorrect(c=>c+1)
      setIdx(i=>i+1); setInput("")
    } else setInput(val)
  }

  const wpm=done?correct:Math.round(correct/Math.max(1,(60-timer)/60))

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,maxWidth:540}}>
      <div style={{display:"flex",gap:40}}>
        <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>TIME: {timer}s</div>
        {done&&<div style={{fontFamily:'var(--font-body)',fontSize:11,color:DIM,letterSpacing:3}}>WPM: {wpm}</div>}
      </div>
      <div style={{fontFamily:'var(--font-body)',fontSize:22,color:DIM,lineHeight:2,textAlign:"center",minHeight:88}}>
        {words.slice(Math.max(0,idx-3),idx+12).map((w,i)=>{
          const abs=Math.max(0,idx-3)+i
          return <span key={abs} style={{marginRight:12,color:abs<idx?GOLD:abs===idx?TEXT:"rgba(255,255,255,0.18)",transition:"color 0.2s"}}>{w}</span>
        })}
      </div>
      {!done?(
        <input value={input} onChange={onInput} autoFocus placeholder="start typing…"
          style={{background:"transparent",border:"none",borderBottom:`1px solid ${GOLD}`,color:TEXT,fontFamily:'var(--font-body)',fontSize:16,padding:"12px 0",width:280,outline:"none",textAlign:"center"}} />
      ):(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{fontFamily:'var(--font-body)',fontSize:56,color:GOLD,fontWeight:300}}>{wpm}<span style={{fontSize:20,color:DIM,marginLeft:8}}>WPM</span></div>
          <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>TRY AGAIN</button>
        </div>
      )}
    </div>
  )
}

// ── REACTION TIME ─────────────────────────────────────────────────────────────
function ReactionGame({ onRestart }) {
  const [phase,setPhase]=useState("idle")
  const [times,setTimes]=useState([])
  const [t0,setT0]=useState(0)
  const timerRef=useRef(null)

  const go=()=>{
    setPhase("waiting")
    timerRef.current=setTimeout(()=>{ setPhase("ready"); setT0(Date.now()) },1500+Math.random()*3500)
  }

  const click=()=>{
    if(phase==="idle"){ go(); return }
    if(phase==="waiting"){ clearTimeout(timerRef.current); setPhase("idle"); setTimes(t=>[...t,{ms:null,early:true}]); return }
    if(phase==="ready"){
      const ms=Date.now()-t0
      const next=[...times,{ms,early:false}]
      setTimes(next); setPhase(next.length>=5?"done":"idle"); return
    }
  }

  const valid=times.filter(t=>!t.early&&t.ms)
  const avg=valid.length?Math.round(valid.reduce((a,t)=>a+t.ms,0)/valid.length):0

  const bg=phase==="ready"?"#3a5c3a":phase==="waiting"?"rgba(224,124,124,0.12)":BG

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
      <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>ROUND {Math.min(times.length+1,5)} OF 5</div>
      <div onClick={click} data-h style={{width:320,height:280,background:bg,border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"none",transition:"background 0.1s",userSelect:"none"}}>
        <div style={{fontFamily:'var(--font-body)',fontSize:26,color:phase==="ready"?"#b8e0b8":DIM,textAlign:"center",lineHeight:1.6}}>
          {phase==="idle"&&(times.length===0?"Click to start":"Click for next round")}
          {phase==="waiting"&&"Wait for green..."}
          {phase==="ready"&&"CLICK NOW"}
          {phase==="done"&&""}
        </div>
      </div>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
        {times.map((t,i)=>(
          <div key={i} style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:1,color:t.early?"#e07c7c":GOLD}}>
            {t.early?"EARLY":t.ms+"ms"}
          </div>
        ))}
      </div>
      {phase==="done"&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{fontFamily:'var(--font-body)',fontSize:48,color:GOLD,fontWeight:300}}>{avg}ms<span style={{fontSize:18,color:DIM,marginLeft:8}}>avg</span></div>
          <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:3,color:DIM}}>{avg<200?"lightning fast":avg<300?"sharp reflexes":avg<400?"decent":"room to improve"}</div>
          <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  )
}

// ── BREAKOUT ─────────────────────────────────────────────────────────────────
function BreakoutGame({ onRestart }) {
  const cvs=useRef(null), mouseX=useRef(240)
  const [lives,setLives]=useState(3)
  const [score,setScore]=useState(0)
  const [over,setOver]=useState(null)
  const BCOLS=["#9b7ce0","#7ca8e0","#5ecfb1","#e0c87c","#e07ca8"]

  useEffect(()=>{
    const canvas=cvs.current, ctx=canvas.getContext("2d")
    const W=480,H=400,BW=38,BH=14,GAP=8,ROWS=5,COLS=10
    const PW=100,PH=10,BR=7
    let ball={x:W/2,y:H-90,vx:3.5,vy:-4}, paddleX=W/2-PW/2
    let sc=0, lv=3, running=true
    let bricks=[]
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      bricks.push({x:c*(BW+GAP)+GAP,y:r*(BH+GAP)+48,alive:true,color:BCOLS[r]})
    }
    const onMouse=e=>{ const r=canvas.getBoundingClientRect(); mouseX.current=e.clientX-r.left }
    canvas.addEventListener("mousemove",onMouse)
    let raf
    const draw=()=>{
      if(!running) return
      paddleX=Math.max(0,Math.min(W-PW,mouseX.current-PW/2))
      ball.x+=ball.vx; ball.y+=ball.vy
      if(ball.x-BR<0){ball.x=BR;ball.vx*=-1}
      if(ball.x+BR>W){ball.x=W-BR;ball.vx*=-1}
      if(ball.y-BR<0){ball.y=BR;ball.vy*=-1}
      if(ball.y+BR>H-30&&ball.x>paddleX&&ball.x<paddleX+PW&&ball.vy>0){
        ball.vy=-Math.abs(ball.vy); ball.vx+=(ball.x-(paddleX+PW/2))*0.05
      }
      if(ball.y+BR>H){ lv--; setLives(lv); if(lv<=0){running=false;setOver("lose");return}; ball={x:W/2,y:H-90,vx:3.5,vy:-4} }
      for(let b of bricks){
        if(!b.alive) continue
        if(ball.x>b.x&&ball.x<b.x+BW&&ball.y-BR<b.y+BH&&ball.y+BR>b.y){
          b.alive=false; sc+=10; setScore(sc); ball.vy*=-1; break
        }
      }
      if(bricks.every(b=>!b.alive)){running=false;setOver("win");return}
      ctx.fillStyle=BG; ctx.fillRect(0,0,W,H)
      bricks.forEach(b=>{if(!b.alive)return;ctx.fillStyle=b.color;ctx.fillRect(b.x,b.y,BW,BH)})
      ctx.fillStyle=TEXT; ctx.fillRect(paddleX,H-30,PW,PH)
      ctx.shadowColor=GOLD; ctx.shadowBlur=12; ctx.fillStyle=GOLD
      ctx.beginPath(); ctx.arc(ball.x,ball.y,BR,0,Math.PI*2); ctx.fill()
      ctx.shadowBlur=0
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return()=>{ cancelAnimationFrame(raf); canvas.removeEventListener("mousemove",onMouse); running=false }
  },[])

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      <div style={{display:"flex",gap:32}}>
        <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>SCORE: {score}</div>
        <div style={{fontFamily:'var(--font-body)',fontSize:11,color:DIM,letterSpacing:3}}>{"◈".repeat(Math.max(0,lives))}</div>
      </div>
      <canvas ref={cvs} width={480} height={400} style={{border:`1px solid ${BORDER}`,cursor:"none"}} />
      {over&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{fontFamily:'var(--font-body)',fontSize:28,color:over==="win"?GOLD:DIM}}>{over==="win"?"All bricks cleared.":"Game over."}</div>
          <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  )
}

// ── SPACE SHOOTER ─────────────────────────────────────────────────────────────
function SpaceGame({ onRestart }) {
  const cvs=useRef(null), keys=useRef({})
  const [score,setScore]=useState(0)
  const [lives,setLives]=useState(3)
  const [over,setOver]=useState(false)

  useEffect(()=>{
    const canvas=cvs.current, ctx=canvas.getContext("2d")
    const W=400,H=500
    let player={x:200,y:450,w:22,h:18}
    let bullets=[],asteroids=[],stars=[]
    let sc=0,lv=3,running=true,spawnT=0,shootT=0

    for(let i=0;i<90;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+0.3,sp:Math.random()*0.4+0.15})

    const spawnAst=()=>{
      const r=Math.random()*18+10
      asteroids.push({x:Math.random()*(W-r*2)+r,y:-r,r,vy:Math.random()*1.8+0.8,vx:(Math.random()-0.5)*1.5,rot:0,drot:(Math.random()-0.5)*0.04})
    }

    const drawShip=(x,y,w,h)=>{
      ctx.fillStyle=TEXT; ctx.beginPath()
      ctx.moveTo(x,y-h/2); ctx.lineTo(x+w/2,y+h/2); ctx.lineTo(x-w/2,y+h/2); ctx.closePath(); ctx.fill()
      ctx.shadowColor="#7ce0d4"; ctx.shadowBlur=10; ctx.fillStyle="#7ce0d4"
      ctx.fillRect(x-3,y+h/2,6,4); ctx.shadowBlur=0
    }

    let raf
    const loop=()=>{
      if(!running) return
      if(keys.current["ArrowLeft"]&&player.x>14) player.x-=4
      if(keys.current["ArrowRight"]&&player.x<W-14) player.x+=4
      shootT++; if(keys.current[" "]&&shootT>14){bullets.push({x:player.x,y:player.y-player.h/2});shootT=0}
      spawnT++; if(spawnT>55){spawnAst();spawnT=0}
      bullets=bullets.filter(b=>b.y>0); bullets.forEach(b=>b.y-=9)
      asteroids.forEach(a=>{a.y+=a.vy;a.x+=a.vx;a.rot+=a.drot})
      asteroids=asteroids.filter(a=>a.y<H+a.r)
      for(let bi=bullets.length-1;bi>=0;bi--){
        for(let ai=asteroids.length-1;ai>=0;ai--){
          const dx=bullets[bi].x-asteroids[ai].x,dy=bullets[bi].y-asteroids[ai].y
          if(Math.sqrt(dx*dx+dy*dy)<asteroids[ai].r+4){bullets.splice(bi,1);asteroids.splice(ai,1);sc++;setScore(sc);break}
        }
      }
      for(let ai=asteroids.length-1;ai>=0;ai--){
        const a=asteroids[ai],dx=a.x-player.x,dy=a.y-player.y
        if(Math.sqrt(dx*dx+dy*dy)<a.r+10){asteroids.splice(ai,1);lv--;setLives(lv);if(lv<=0){running=false;setOver(true);return}}
      }
      ctx.fillStyle=BG; ctx.fillRect(0,0,W,H)
      stars.forEach(s=>{s.y+=s.sp;if(s.y>H)s.y=0;ctx.fillStyle=`rgba(224,219,210,${s.r*0.4})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()})
      ctx.shadowColor=GOLD; ctx.shadowBlur=6; ctx.fillStyle=GOLD
      bullets.forEach(b=>{ctx.fillRect(b.x-1,b.y-8,2,9)})
      ctx.shadowBlur=0
      asteroids.forEach(a=>{ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.rot);ctx.fillStyle="rgba(224,219,210,0.35)";ctx.beginPath();ctx.arc(0,0,a.r,0,Math.PI*2);ctx.fill();ctx.restore()})
      drawShip(player.x,player.y,player.w,player.h)
      raf=requestAnimationFrame(loop)
    }
    raf=requestAnimationFrame(loop)
    const onDown=e=>{keys.current[e.key]=true;if([" ","ArrowLeft","ArrowRight"].includes(e.key))e.preventDefault()}
    const onUp=e=>{keys.current[e.key]=false}
    window.addEventListener("keydown",onDown); window.addEventListener("keyup",onUp)
    return()=>{ cancelAnimationFrame(raf); window.removeEventListener("keydown",onDown); window.removeEventListener("keyup",onUp); running=false }
  },[])

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      <div style={{display:"flex",gap:32}}>
        <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>SCORE: {score}</div>
        <div style={{fontFamily:'var(--font-body)',fontSize:11,color:DIM,letterSpacing:3}}>{"◈".repeat(Math.max(0,lives))}</div>
      </div>
      <canvas ref={cvs} width={400} height={500} style={{border:`1px solid ${BORDER}`}} />
      {over&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{fontFamily:'var(--font-body)',fontSize:28,color:DIM}}>Destroyed by the field.</div>
          <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>TRY AGAIN</button>
        </div>
      )}
    </div>
  )
}

// ── STROOP ────────────────────────────────────────────────────────────────────
const STROOP_COLORS=[
  {name:"RED",hex:"#e07c7c"},{name:"BLUE",hex:"#7ca8e0"},
  {name:"GREEN",hex:"#7ce08a"},{name:"GOLD",hex:"#c9aa7c"},
  {name:"PURPLE",hex:"#9b7ce0"},{name:"TEAL",hex:"#5ecfb1"},
]
function StroopGame({ onRestart }) {
  const [round,setRound]=useState(0)
  const [score,setScore]=useState(0)
  const [done,setDone]=useState(false)
  const [card,setCard]=useState(null)
  const [opts,setOpts]=useState([])
  const [fb,setFb]=useState(null)

  const nextCard=useCallback(()=>{
    const word=STROOP_COLORS[Math.floor(Math.random()*STROOP_COLORS.length)]
    let display; do{display=STROOP_COLORS[Math.floor(Math.random()*STROOP_COLORS.length)]}while(display===word)
    const wrong=STROOP_COLORS.filter(c=>c!==display).sort(()=>Math.random()-0.5).slice(0,3)
    setCard({text:word.name,color:display.hex,answer:display})
    setOpts([...wrong,display].sort(()=>Math.random()-0.5))
    setFb(null)
  },[])

  useEffect(()=>{ nextCard() },[])

  const pick=c=>{
    if(fb) return
    const ok=c===card.answer
    setFb(ok?"correct":"wrong")
    if(ok) setScore(s=>s+1)
    const nr=round+1
    if(nr>=10) setTimeout(()=>setDone(true),600)
    else setTimeout(()=>{setRound(nr);nextCard()},700)
  }

  if(!card) return null
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:28}}>
      <div style={{fontFamily:'var(--font-body)',fontSize:11,color:GOLD,letterSpacing:3}}>{round+1}/10 · {score} CORRECT</div>
      {!done?(
        <>
          <div style={{fontFamily:'var(--font-body)',fontSize:80,fontWeight:300,color:card.color,letterSpacing:10,lineHeight:1}}>{card.text}</div>
          <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:4,color:DIM}}>CLICK THE COLOR OF THE TEXT</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {opts.map((c,i)=>(
              <button key={i} data-h onClick={()=>pick(c)} style={{width:150,height:52,background:c.hex,border:"none",cursor:"none",fontFamily:'var(--font-body)',fontSize:12,letterSpacing:2,color:BG,opacity:fb&&c!==card.answer?0.35:1,transition:"all 0.2s"}}>
                {c.name}
              </button>
            ))}
          </div>
          {fb&&<div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:3,color:fb==="correct"?"#7ce08a":"#e07c7c"}}>{fb==="correct"?"✓ CORRECT":"✗ WRONG"}</div>}
        </>
      ):(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{fontFamily:'var(--font-body)',fontSize:60,color:GOLD,fontWeight:300}}>{score}<span style={{fontSize:24,color:DIM}}>/10</span></div>
          <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:3,color:DIM}}>{score>=9?"your brain is built different":score>=7?"solid focus":score>=5?"the word keeps winning":"the word won every time"}</div>
          <button type="button" className="game-inline-restart" style={BTN} onClick={onRestart}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  )
}

// ── GAME MAP ──────────────────────────────────────────────────────────────────
const GAME_MAP={1:SnakeGame,2:PongGame,3:TetrisGame,4:Game2048,5:MemoryGame,6:TypingGame,7:ReactionGame,8:BreakoutGame,9:SpaceGame,10:StroopGame}

// ── GAME CARD ─────────────────────────────────────────────────────────────────
function GameCard({ game, onClick }) {
  const [hov,setHov]=useState(false)
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={!game.locked?onClick:undefined}
      data-h={!game.locked ? "" : undefined}
      className={`arcade-card${hov ? " is-hovered" : ""}`}
      style={{padding:0,border:`1px solid ${hov&&!game.locked?game.color+"55":BORDER}`,cursor:"none",position:"relative",transition:"border-color 0.25s, box-shadow 0.25s",background:BG,userSelect:"none",overflow:"hidden",minHeight:280}}>
      <div style={{height:132,background:`linear-gradient(135deg, ${game.color}22, ${BG})`,borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <div style={{fontFamily:'var(--font-body)',fontSize:52,fontWeight:300,color:game.color,opacity:0.35,lineHeight:1}}>{String(game.id).padStart(2,"0")}</div>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 120%, ${game.color}33, transparent 60%)`}} />
      </div>
      <div style={{padding:"26px 28px"}}>
        <div style={{fontFamily:'var(--font-body)',fontSize:32,fontWeight:300,color:game.locked?DIM:TEXT,marginBottom:10,transition:"color 0.2s"}}>{game.name}</div>
        <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:2,color:DIM,marginBottom:12}}>{game.tag}</div>
        <div style={{fontFamily:'var(--font-body)',fontSize:15,fontWeight:400,color:DIM,opacity:hov?1:0.85,transition:"opacity 0.2s",lineHeight:1.6,marginBottom:14}}>{game.desc}</div>
        {!game.locked && (
          <div className="arcade-card-play" style={{ fontFamily:'var(--font-body)', fontSize:11, letterSpacing:2, color:game.color, textTransform:"uppercase" }}>Play →</div>
        )}
      </div>
      {game.locked&&<div style={{position:"absolute",top:14,right:16,fontFamily:'var(--font-body)',fontSize:8,letterSpacing:3,color:DIM}}>SOON</div>}
    </div>
  )
}

// ── ROOT ─────────────────────────────────────────────────────────────────────
export default function Games() {
  const [active,setActive]=useState(null)
  const [gameKey,setGameKey]=useState(0)
  const [tab,setTab]=useState("browser")
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const [activeTrailer, setActiveTrailer] = useState(null)

  const featured = FEATURED_TRAILERS[featuredIdx] ?? FEATURED_TRAILERS[0]

  useEffect(() => {
    const id = setInterval(() => setFeaturedIdx(i => (i + 1) % FEATURED_TRAILERS.length), 8000)
    return () => clearInterval(id)
  }, [])

  const openGame=id=>{ setActive(id); setGameKey(k=>k+1) }
  const closeGame=()=>setActive(null)
  const restart=()=>setGameKey(k=>k+1)
  const openTrailer = g => { setActiveTrailer(g); setTrailerOpen(true) }

  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [active])

  useEffect(() => {
    const onKey = e => {
      if (e.key !== "Escape") return
      setActive(null)
      setTrailerOpen(false)
      setActiveTrailer(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const GameComponent=active?GAME_MAP[active]:null
  const game=active?GAMES.find(g=>g.id===active):null
  const trailerGame = activeTrailer ?? featured

  const TABS=[["browser","Arcade"],["console","PS/Xbox Shelf"]]

  return (
    <div className="game-room" style={{minHeight:"100vh",background:BG,color:TEXT,cursor:"none",position:"relative"}}>
      <div className="vr-hud" aria-hidden="true" />
      <div className="vr-grid-floor" aria-hidden="true" />

      <div className="games-nav page-pad-x">
        <Link to="/" style={{fontFamily:'var(--font-body)',fontSize:22,color:TEXT,letterSpacing:3,fontWeight:300,textDecoration:"none",cursor:"none"}}>AE</Link>
        <SoundButton compact />
        <Link to="/" data-h className="games-nav__back" style={{fontFamily:'var(--font-body)',fontSize:12,letterSpacing:3,color:DIM,textDecoration:"none",cursor:"none",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color=TEXT} onMouseLeave={e=>e.target.style.color=DIM}>← Portfolio</Link>
      </div>

      <div className="games-tabs page-pad-x">
        {TABS.map(([id,label])=>(
          <button key={id} data-h type="button" onClick={()=>setTab(id)} className={`games-tabs__btn${tab===id?" is-active":""}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="games-body">
      <section className="games-hero">
        <div className="page-pad-x">
          <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:5,color:GOLD,marginBottom:20,textTransform:"uppercase"}}>Game Room · VR Lounge</div>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:"clamp(44px,5.5vw,80px)",fontWeight:300,color:TEXT,lineHeight:1.05,margin:"0 0 20px"}}>
            Even designers<br/><em style={{color:GOLD}}>need to play.</em>
          </h1>
          <p style={{fontFamily:'var(--font-body)',fontSize:17,fontWeight:400,color:DIM,lineHeight:1.75,maxWidth:440,margin:0}}>
            Browser arcade classics, a PS/Xbox shelf of favourites, and trailers pulled from each title.
          </p>
        </div>

        <button data-h type="button" onClick={() => openTrailer(featured)} className="featured-trailer" style={{position:"relative",border:"none",borderLeft:`1px solid ${BORDER}`,background:BG,padding:0,cursor:"none",overflow:"hidden",minHeight:420}}>
          {featured?.trailerId && (
            <TrailerPreview key={featured.trailerId} videoId={featured.trailerId} active opacity={0.62} />
          )}
          <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg, rgba(7,7,12,0.92) 0%, rgba(7,7,12,0.2) 45%, rgba(7,7,12,0.75) 100%)"}} />
          <div className="featured-trailer-copy" style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"40px var(--page-gutter)",textAlign:"left"}}>
            <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:4,color:GOLD,marginBottom:12,textTransform:"uppercase"}}>Now featuring</div>
            <div style={{fontFamily:'var(--font-heading)',fontSize:"clamp(28px,3vw,44px)",fontWeight:300,color:TEXT,marginBottom:8}}>{featured?.short}</div>
            <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:2,color:DIM,marginBottom:20}}>{featured?.genre} · {featured?.year}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,fontFamily:'var(--font-body)',fontSize:11,letterSpacing:3,color:GOLD,textTransform:"uppercase"}}>
              <span style={{width:40,height:40,borderRadius:"50%",border:`1px solid ${GOLD}`,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>▶</span>
              Watch trailer
            </div>
          </div>
        </button>
      </section>

      {tab==="browser"&&(
        <div className="page-pad-x" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:4,color:DIM,marginBottom:24,textTransform:"uppercase"}}>In-browser arcade</div>
          <p className="arcade-mobile-note">
            Arcade games are best on desktop. On mobile, tap a game to open full screen and use the on-screen directional controls.
          </p>
          <div className="game-grid-vr" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:1,background:BORDER,border:`1px solid ${BORDER}`}}>
            {GAMES.map(g=>(
              <div key={g.id} style={{background:BG}}>
                <GameCard game={g} onClick={()=>openGame(g.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="console"&&<ConsoleGames onTrailer={openTrailer} />}

      {/* FOOTER */}
      <div className="page-pad-x" style={{ paddingTop: 40, paddingBottom: 40, borderTop:`1px solid ${BORDER}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap: 16 }}>
        <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:3,color:DIM}}>AKINLOLU ELIJAH · GAME ROOM</div>
        <a data-h href="/" style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:3,color:DIM,textDecoration:"none",cursor:"none",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color=GOLD} onMouseLeave={e=>e.target.style.color=DIM}>Back to portfolio →</a>
      </div>
      </div>

      {/* GAME OVERLAY */}
      {active&&GameComponent&&(
        <div className="game-overlay" role="dialog" aria-modal="true" aria-label={`${game.name} game`}>
          <CloseButton onClick={closeGame} className="game-close-floating" />
          <div className="game-overlay__topbar page-pad-x">
            <button type="button" className="game-overlay__restart game-overlay__mobile-only" onClick={restart}>
              Play again
            </button>
            <div className="game-overlay__meta">
              <div className="game-overlay__name">{game.name}</div>
              <div className="game-overlay__tag">{game.tag}</div>
            </div>
            <button type="button" data-h className="game-overlay__close game-overlay__mobile-only" onClick={closeGame} aria-label="Close">
              ×
            </button>
            <button data-h type="button" className="game-overlay__close-desktop game-overlay__desktop-only" onClick={closeGame}>CLOSE ×</button>
          </div>
          <div className="game-overlay__body">
            <div className="game-stage">
              <GameComponent key={gameKey} onRestart={restart} />
            </div>
          </div>
          <div className="game-overlay__mobile-foot game-overlay__mobile-only">
            {MOBILE_MOUSE_GAME_IDS.has(game.id) ? (
              <p className="game-overlay__note">This game plays best on desktop with a mouse or trackpad.</p>
            ) : MOBILE_ARROW_GAME_IDS.has(game.id) ? (
              <>
                <p className="game-overlay__note">Use the controls below, or switch to desktop for keyboard play.</p>
                <MobileGamePad showSpace={MOBILE_SPACE_GAME_IDS.has(game.id)} />
              </>
            ) : (
              <p className="game-overlay__note">Tap the game area to play. For the smoothest experience, try desktop.</p>
            )}
          </div>
        </div>
      )}

      {trailerOpen && trailerGame?.trailerId && (
        <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(7,7,12,0.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
          <CloseButton onClick={() => { setTrailerOpen(false); setActiveTrailer(null) }} />
          <div style={{fontFamily:'var(--font-body)',fontSize:11,letterSpacing:4,color:GOLD,marginBottom:16,textTransform:"uppercase"}}>{trailerGame.short} · Official trailer</div>
          <div style={{width:"min(92vw,960px)",aspectRatio:"16/9",border:`1px solid ${BORDER}`,background:BG}}>
            <iframe title={`${trailerGame.short} trailer`} src={ytEmbedUrl(trailerGame.trailerId, { autoplay: true, mute: false, loop: false })} allow="autoplay; encrypted-media; fullscreen" style={{width:"100%",height:"100%",border:"none"}} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes musicPulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .game-room {
          --games-nav-height: 58px;
          --games-tabs-height: 57px;
          --games-chrome-height: calc(var(--games-nav-height) + var(--games-tabs-height));
        }
        .games-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: var(--games-nav-height);
          padding-top: 0;
          padding-bottom: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(7,7,12,0.94);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid ${BORDER};
        }
        .games-tabs {
          position: fixed;
          top: var(--games-nav-height);
          left: 0;
          right: 0;
          z-index: 99;
          height: var(--games-tabs-height);
          display: flex;
          align-items: stretch;
          gap: 0;
          background: rgba(7,7,12,0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid ${BORDER};
        }
        .games-tabs__btn {
          font-family: var(--font-body);
          font-size: 12px;
          letter-spacing: 3px;
          color: ${DIM};
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 0 28px 0 0;
          margin-right: 16px;
          cursor: none;
          text-transform: uppercase;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .games-tabs__btn.is-active {
          color: ${TEXT};
          border-bottom-color: ${GOLD};
        }
        .games-body {
          padding-top: var(--games-chrome-height);
        }
        .games-hero {
          position: relative;
          min-height: 58vh;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          border-bottom: 1px solid ${BORDER};
        }
        .games-hero > .page-pad-x:first-child {
          padding-top: 48px;
          padding-bottom: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 2;
        }
        .vr-scene { perspective: 1400px; }
        .vr-hud::before, .vr-hud::after, .vr-hud span::before, .vr-hud span::after {
          content: ""; position: fixed; width: 56px; height: 56px; border: 1px solid rgba(201,170,124,0.22); pointer-events: none; z-index: 90;
        }
        .vr-hud::before { top: var(--games-chrome-height); left: var(--page-gutter); border-right: none; border-bottom: none; }
        .vr-hud::after { top: var(--games-chrome-height); right: var(--page-gutter); border-left: none; border-bottom: none; }
        .vr-grid-floor {
          position: fixed; bottom: 0; left: 0; right: 0; height: 35vh; pointer-events: none; z-index: 0;
          background: linear-gradient(180deg, transparent, rgba(201,170,124,0.03));
          mask-image: linear-gradient(180deg, transparent, black 80%);
        }
        .featured-trailer { transition: filter 0.35s ease; }
        .featured-trailer:hover { filter: brightness(1.08); }
        .game-grid-vr,
        .console-poster-grid {
          overflow: visible;
        }
        .arcade-card,
        .console-card {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease, box-shadow 0.35s ease;
          transform-origin: center center;
          will-change: transform;
        }
        .arcade-card.is-hovered,
        .console-card.is-hovered {
          transform: translateY(-8px) scale(1.035);
          z-index: 3;
          box-shadow: 0 28px 56px rgba(0, 0, 0, 0.42);
        }
        @media (hover: hover) and (pointer: fine) {
          .arcade-card:hover { transform: translateY(-8px) scale(1.035); }
        }
        .arcade-mobile-note {
          display: none;
        }
        .game-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(7,7,12,0.97);
          display: flex;
          flex-direction: column;
        }
        .game-overlay__topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 18px;
          padding-bottom: 18px;
          border-bottom: 1px solid ${BORDER};
          background: ${BG};
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 12;
        }
        .game-overlay__meta {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: baseline;
          gap: 16px;
          flex-wrap: wrap;
        }
        .game-overlay__name {
          font-family: var(--font-body);
          font-size: 24px;
          font-weight: 300;
          color: ${TEXT};
        }
        .game-overlay__tag {
          font-family: var(--font-body);
          font-size: 11px;
          letter-spacing: 3px;
          color: ${DIM};
        }
        .game-overlay__body {
          flex: 1;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }
        .game-overlay__close-desktop {
          font-family: var(--font-body);
          font-size: 12px;
          letter-spacing: 2px;
          color: ${DIM};
          background: none;
          border: 1px solid ${BORDER};
          padding: 8px 20px;
          cursor: none;
          text-transform: uppercase;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .game-overlay__mobile-only {
          display: none;
        }
        .game-overlay__desktop-only {
          display: block;
        }
        .game-overlay__restart,
        .game-overlay__close {
          font-family: var(--font-body);
          flex-shrink: 0;
        }
        .game-overlay__restart {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${BG};
          background: ${GOLD};
          border: none;
          padding: 10px 16px;
        }
        .game-overlay__close {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid ${BORDER};
          background: rgba(7,7,12,0.92);
          color: ${TEXT};
          font-size: 24px;
          line-height: 1;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .game-dpad {
          display: flex;
          justify-content: center;
          padding-top: 8px;
        }
        .game-dpad__grid {
          display: grid;
          grid-template-columns: repeat(3, 62px);
          grid-template-rows: repeat(3, 62px);
          gap: 1px;
          padding: 1px;
          border-radius: 18px;
          overflow: hidden;
          background: ${BORDER};
          border: 1px solid ${BORDER};
        }
        .game-dpad__empty {
          background: rgba(7,7,12,0.98);
        }
        .game-dpad__empty--center {
          background: rgba(255,255,255,0.03);
        }
        .game-dpad__btn {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 0;
          background: rgba(255,255,255,0.05);
          color: ${TEXT};
          font-family: var(--font-body);
          font-size: 18px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          touch-action: manipulation;
          user-select: none;
        }
        .game-dpad__btn:active,
        .game-dpad__btn:focus-visible {
          background: rgba(201,170,124,0.22);
        }
        .game-dpad__btn--up {
          border-radius: 16px 16px 0 0;
        }
        .game-dpad__btn--down {
          border-radius: 0 0 16px 16px;
        }
        .game-dpad__btn--left {
          border-radius: 16px 0 0 16px;
        }
        .game-dpad__btn--right {
          border-radius: 0 16px 16px 0;
        }
        .game-dpad__btn--space {
          font-size: 22px;
        }
        .game-overlay__note {
          font-family: var(--font-body);
          font-size: 12px;
          line-height: 1.6;
          color: ${DIM};
          text-align: center;
          margin: 0 0 14px;
        }
        .game-overlay__mobile-foot {
          flex-shrink: 0;
          padding: 16px var(--page-gutter) calc(16px + env(safe-area-inset-bottom));
          border-top: 1px solid ${BORDER};
          background: rgba(7,7,12,0.98);
        }
        @media (max-width: 900px) {
          .game-grid-vr { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important; }
          .console-poster-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important; }
        }
        @media (max-width: 768px) {
          .game-grid-vr { grid-template-columns: 1fr !important; }
          .arcade-mobile-note {
            display: block;
            font-family: var(--font-body);
            font-size: 13px;
            line-height: 1.65;
            color: ${DIM};
            margin: 0 0 20px;
            padding: 14px 16px;
            border: 1px solid ${BORDER};
            background: rgba(255,255,255,0.02);
          }
          .game-overlay__mobile-only {
            display: block;
          }
          .game-overlay__restart.game-overlay__mobile-only,
          .game-overlay__close.game-overlay__mobile-only {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .game-overlay__desktop-only,
          .game-close-floating {
            display: none !important;
          }
          .game-overlay__body {
            align-items: flex-start;
            padding: 20px var(--page-gutter) 12px;
          }
          .game-stage {
            width: 100%;
            display: flex;
            justify-content: center;
          }
          .game-stage canvas {
            max-width: 100%;
            height: auto;
          }
          .game-inline-restart {
            display: none !important;
          }
          .arcade-card.is-hovered,
          .console-card.is-hovered {
            transform: translateY(-4px) scale(1.02);
          }
        }
        @media (max-width: 900px) {
          .games-hero { grid-template-columns: 1fr !important; min-height: auto !important; }
          .games-hero > .page-pad-x:first-child { padding-top: 32px; padding-bottom: 32px; }
          .featured-trailer { min-height: 280px !important; border-left: none !important; border-top: 1px solid ${BORDER}; }
        }
        @media (max-width: 768px) {
          .game-room {
            --games-nav-height: 54px;
            --games-tabs-height: 52px;
          }
          .games-nav__back { display: none; }
          .featured-trailer-copy { padding-top: 28px !important; padding-bottom: 28px !important; }
        }
      `}</style>
    </div>
  )
}
