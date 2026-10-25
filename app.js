import { PROBLEMS, TRACKS, INTERVIEW, WEEKS, STATUS_OPTIONS, SEED_JOB_TIPS } from './data.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const STORAGE = 'devshift-state-v1';
const TODAY = () => new Date().toLocaleDateString('en-CA');
const INITIAL = { solved: {}, drafts: {}, roadmap: {}, interviews: {}, jobs: [], activity: {}, joined: TODAY() };
const clone = value => JSON.parse(JSON.stringify(value));
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const e = escapeHtml;
const iconPaths = {
 'layout-dashboard':'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/>',
 code:'<path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 4l-4 16"/>',
 mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
 briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 13a24 24 0 0 0 20 0"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M5 17v4h14v-4"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 'check-circle':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-8l1-7Z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 flame:'<path d="M12 22c-4.5 0-8-3-8-8 0-3 2-5 4-7 0 3 3 3 3 5 4-5 3-8 3-10 5 4 6 8 6 12 0 5-3.5 8-8 8Z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 search:'<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6"/>',
 play:'<path d="m8 5 11 7-11 7V5Z"/>',
 pause:'<path d="M8 5v14m8-14v14"/>',
 refresh:'<path d="M20 11a8 8 0 1 1-2.6-5.9M20 4v6h-6"/>',
 lightbulb:'<path d="M9 18h6M10 21h4M8 14a6 6 0 1 1 8 0l-1 2H9l-1-2Z"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 10v7m4-7v7"/>',
 upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 16v5h16v-5"/>',
 external:'<path d="M14 4h6v6M20 4l-9 9M20 14v6H4V4h6"/>',
 chevron:'<path d="m9 18 6-6-6-6"/>',
 trophy:'<path d="M7 4h10v7a5 5 0 0 1-10 0V4ZM7 6H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4m-5 3v5m-5 0h10"/>',
 edit:'<path d="m4 20 4.5-1L20 7.5 16.5 4 5 15.5 4 20ZM14.5 6l3.5 3.5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
 terminal:'<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m6 8 4 4-4 4m7 0h5"/>'
};
const svg = (name, size=18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||iconPaths.bolt}</svg>`;

function loadState() {
 try { const raw = JSON.parse(localStorage.getItem(STORAGE)); if (!raw || typeof raw !== 'object') return clone(INITIAL);
  const state = {...clone(INITIAL), ...raw};
  for (const key of ['solved','drafts','roadmap','interviews','activity']) if(!state[key] || typeof state[key] !== 'object' || Array.isArray(state[key])) state[key]={};
  if (!Array.isArray(state.jobs)) state.jobs=[];
  return state;
 } catch { return clone(INITIAL); }
}
let state = loadState();
let view = 'dashboard', selectedProblem = PROBLEMS[0].id, filter = 'All', search = '', activeWeek = 0, selectedInterview = INTERVIEW[0].id, revealHint = 0, revealSolution = false;
let results = null, running = false, worker = null, runTimeout = null;
let timer = { duration: INTERVIEW[0].time, remaining: INTERVIEW[0].time, active: false, deadline: 0 };
let modalJobId = null;
const root = $('#view-root');

function save(){
 try { localStorage.setItem(STORAGE, JSON.stringify(state)); return true; }
 catch { toast('Storage is full or unavailable. Export progress to keep a backup.',true); return false; }
}
function progress(){return PROBLEMS.filter(p=>state.solved[p.id]).length;}
function completedDays(){return Object.values(state.roadmap).filter(Boolean).length;}
function xp(){return PROBLEMS.reduce((n,p)=>n+(state.solved[p.id]?p.points:0),0);}
function attempts(){return Object.values(state.activity).reduce((a,b)=>a+(Number(b)||0),0);}
function streak(){let count=0;let date=new Date();for(let i=0;i<200;i++){const key=date.toLocaleDateString('en-CA');if(state.activity[key]){count++;date.setDate(date.getDate()-1);} else if(i===0){date.setDate(date.getDate()-1);}else break;}return count;}
function syncSidebar(){const s=progress();$('#side-progress').style.width=`${100*s/PROBLEMS.length}%`;$('#side-progress-label').textContent=`${s} of ${PROBLEMS.length} challenges cleared`;}
function toast(message,error=false){const item=document.createElement('div');item.className=`toast${error?' error':''}`;item.textContent=message;$('#toast-stack').append(item);setTimeout(()=>item.remove(),3600);}
function setView(next){
 if (!['dashboard','arena','interview','roadmap','jobs'].includes(next))next='dashboard';
 view=next; window.location.hash=next;
 $$('.nav-item').forEach(el=>{const yes=el.dataset.view===next;el.classList.toggle('active',yes);yes?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current');});
 $('#breadcrumb').textContent={dashboard:'Overview',arena:'Code arena',interview:'Mock interviews',roadmap:'6-week roadmap',jobs:'Application tracker'}[next];
 $('#sidebar').classList.remove('open');$('#mobile-backdrop').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');
 syncSidebar();render();window.scrollTo({top:0,behavior:'instant'});
}
function metric(label,value,caption,icon){return `<div class="metric-card"><div class="metric-label">${e(label)}</div><div class="metric-symbol">${svg(icon)}</div><div class="metric-number">${value}</div><small>${caption}</small></div>`;}
const bar = (pct,cls='roadmap-progress-track')=>`<div class="${cls}"><span style="width:${Math.min(100,Math.max(0,pct))}%"></span></div>`;
function header(kicker,title,sub,right='') {return `<div class="page-header"><div><div class="eyebrow">${kicker}</div><h1 class="page-title">${title}</h1><p class="page-sub">${sub}</p></div>${right}</div>`;}
function render(){
 if(view==='dashboard')renderDashboard();
 if(view==='arena')renderArena();
 if(view==='interview')renderInterview();
 if(view==='roadmap')renderRoadmap();
 if(view==='jobs')renderJobs();
 root.classList.remove('view-fade');void root.offsetWidth;root.classList.add('view-fade');
}
function renderDashboard(){
 const solved=progress();let bars='';const now=new Date();let max=1;
 const chart=Array.from({length:7},(_,i)=>{const d=new Date(now);d.setDate(now.getDate()-(6-i));const key=d.toLocaleDateString('en-CA');const value=state.activity[key]||0;max=Math.max(max,value);return{day:d.toLocaleDateString('en',{weekday:'short'}),value}});
 bars=chart.map(b=>`<div class="chart-col"><div class="chart-value">${b.value||'·'}</div><div class="chart-bar-track"><div class="chart-bar" style="height:${b.value?Math.max(8,100*b.value/max):0}%"></div></div><div class="chart-label">${b.day}</div></div>`).join('');
 const next=PROBLEMS.find(p=>!state.solved[p.id])||PROBLEMS[0];const week=Math.min(5,Math.floor(completedDays()/7));const w=WEEKS[week];
 root.innerHTML=`${header('GOOD TO HAVE YOU BACK','Your engineering <strong>journey.</strong>','Your move from enterprise support to SDE-1 starts with deliberate, measurable practice.')}
 <section class="hero"><div class="hero-copy"><div class="eyebrow">THE SDE-1 MISSION</div><h1>Debugged systems.<br/><em>Now build them.</em></h1><p>Use the troubleshooting and networking skills you already have. Add DSA fluency, clean code, API fundamentals and stories you can defend in an interview.</p><button class="btn btn-primary" data-go="arena">${svg('bolt')} Start coding ${svg('arrow')}</button></div><div class="hero-graphic"><div class="hero-ring"></div><div class="hero-mark">&lt;/&gt;</div></div></section>
 <section class="metric-grid" aria-label="Your progress">
 ${metric('Problems solved',`${solved}<span> / ${PROBLEMS.length}</span>`,'Completed with all tests passing','check-circle')}
 ${metric('XP earned',xp().toLocaleString(),'Points from accepted solutions','bolt')}
 ${metric('Current streak',`${streak()}<span> days</span>`,'Daily coding attempts','flame')}
 ${metric('Applications',state.jobs.length,'Jobs in your tracker','briefcase')}
 </section>
 <section class="dashboard-mid section-block"><div class="card"><div class="section-head"><div><h2 class="section-title">Your coding activity</h2><p class="section-sub">Attempts made each day · last 7 days</p></div><span class="tag">${attempts()} total runs</span></div><div class="chart-area">${bars}</div></div>
 <div class="card chapter-card"><div class="chapter-count">WEEK ${String(week+1).padStart(2,'0')} / 06 · CURRENT FOCUS</div><div class="chapter-title">${e(w.title)}</div><p>${e(w.desc)}</p><div class="chapter-tags">${w.focus.map(t=>`<span class="tag">${e(t)}</span>`).join('')}</div>${bar(100*completedDays()/42)}<div class="section-sub">${completedDays()} / 42 daily milestones</div><button class="btn btn-secondary" data-go="roadmap">View roadmap ${svg('arrow')}</button></div></section>
 <section class="section-block"><div class="section-head"><div><h2 class="section-title">Today's practice picks</h2><p class="section-sub">Build momentum with one complete solution.</p></div><button class="text-link" data-go="arena">Open challenge library ${svg('arrow')}</button></div><div class="problem-list compact">${[next,...PROBLEMS.filter(p=>p.id!==next.id&&!state.solved[p.id]).slice(0,2)].map(p=>problemCard(p)).join('')}</div></section>
 <section class="section-block card"><div class="section-head"><div><h2 class="section-title">Your edge in SDE-1 interviews</h2><p class="section-sub">Connect your real-world engineering experience to strong answers.</p></div><button class="btn btn-muted btn-small" data-go="interview">Practice stories ${svg('arrow')}</button></div><div class="feedback-list">${SEED_JOB_TIPS.slice(0,3).map(t=>`<div class="feedback-item good"><div class="feedback-dot"></div><span>${e(t)}</span></div>`).join('')}</div></section>`;
}
function problemCard(p){return `<button class="card problem-mini" data-problem="${e(p.id)}"><div class="problem-mini-top"><span class="badge ${p.level==='Medium'?'medium':''}">${p.level}</span>${state.solved[p.id]?`<span class="badge solved">${svg('check',13)} Solved</span>`:svg('arrow')}</div><h3>${e(p.title)}</h3><div class="problem-mini-meta"><span>${e(p.track)}</span><span>·</span><span>${p.mins} min</span></div></button>`;}
function currentProblem(){return PROBLEMS.find(p=>p.id===selectedProblem)||PROBLEMS[0];}
function renderArena(){
 const p=currentProblem();let list=PROBLEMS.filter(v=>(filter==='All'||filter==='Solved'&&state.solved[v.id]||filter==='Unsolved'&&!state.solved[v.id]||v.track===filter)&&(!search||`${v.title} ${v.track}`.toLowerCase().includes(search.toLowerCase())));
 root.innerHTML=`${header('THE CODE ARENA','Solve. Test. <strong>Level up.</strong>','Write JavaScript solutions, run actual test cases and build the problem-solving reflex interviewers look for.',`<div class="pill-inline">${svg('terminal',14)} ${progress()} / ${PROBLEMS.length} accepted</div>`)}
 <div class="arena-layout"><div class="arena-sidebar"><div class="arena-head"><h2>Challenge library <span class="small-gray">(${PROBLEMS.length})</span></h2><div class="search-wrap">${svg('search')}<input class="search-box" id="arena-search" placeholder="Search problems..." value="${e(search)}" aria-label="Search coding problems" /></div><div class="arena-filters">${['All','Unsolved','Solved'].map(x=>`<button class="filter-chip ${filter===x?'selected':''}" data-filter="${x}">${x}</button>`).join('')}</div><select class="form-control" id="track-filter" aria-label="Filter by topic" style="margin-top:12px;padding:8px 10px;font-size:11px"><option value="All" ${filter==='All'?'selected':''}>All topics</option>${TRACKS.map(x=>`<option value="${e(x.tag)}" ${filter===x.tag?'selected':''}>${e(x.name)}</option>`).join('')}</select></div><div class="arena-items" id="arena-list">${listRows(list)}</div></div>
 <div class="arena-workspace"><section class="workspace-panel"><div class="workspace-head"><h3>01 / Problem statement</h3><span class="tag">${p.mins} min target</span></div><div class="workspace-body"><div class="problem-heading"><div><span class="eyebrow">${e(p.track)}</span><h2>${e(p.title)}</h2></div><span class="badge ${p.level==='Medium'?'medium':''}">${e(p.level)}</span></div><div class="problem-description">${e(p.description)}</div><p class="section-sub" style="margin:17px 0 7px">EXAMPLE</p><div class="example-box">${e(p.example)}</div><div style="display:flex;align-items:center;gap:8px;margin-top:14px;flex-wrap:wrap"><button class="btn btn-muted btn-small" id="hint-btn">${svg('lightbulb',14)} ${revealHint?'Next hint':'Get a hint'}</button>${state.solved[p.id]?'<span class="badge solved">✓ All tests passed</span>':''}<span class="small-gray">${p.points} XP · ${p.tests.filter(t=>!t.hidden).length} public tests + hidden tests</span></div>${revealHint?`<div class="hint-panel"><strong>Hint ${Math.min(revealHint,p.hints.length)}:</strong> ${e(p.hints[Math.min(revealHint,p.hints.length)-1])}</div>`:''}</div></section>
 <section class="workspace-panel"><div class="editor-top"><span class="editor-lang"><span class="editor-dot"></span> JavaScript · ES2022</span><div class="editor-actions"><button id="reset-code">Reset</button><button id="solution-btn">${revealSolution?'Hide':'View'} solution</button></div></div><div class="code-area"><div class="code-gutter" id="line-gutter"></div><textarea id="code-editor" class="code-editor" aria-label="JavaScript solution" autocomplete="off" autocapitalize="off" spellcheck="false">${e(state.drafts[p.id]??p.starter)}</textarea></div><div class="editor-footer"><span class="editor-hint">Ctrl / ⌘ + Enter to run · Auto-saved on this device</span><div class="editor-buttons"><button class="btn btn-muted btn-small" id="reset-code-footer">${svg('refresh',14)} Reset</button><button class="btn btn-primary btn-small" id="run-tests">${svg('play',14)} Run tests</button></div></div></section>
 ${revealSolution?`<div class="solution-panel"><div class="section-head"><h3 class="section-title">Reference solution</h3><span class="tag">${e(p.complexity)}</span></div><pre>${e(p.solution)}</pre><p class="section-sub">Understand the pattern, then close this panel and solve it from scratch.</p></div>`:''}
 <section class="workspace-panel"><div class="workspace-head"><h3>02 / Test results</h3><span class="tag" id="test-meta">${results?'Latest run':'Ready to execute'}</span></div><div class="workspace-body" id="test-panel">${renderTestResults()}</div></section>
 </div></div>`;
 bindArenaEditor();
}
function listRows(arr){return arr.length?arr.map((p)=>`<button class="problem-row ${selectedProblem===p.id?'selected':''}" data-problem="${e(p.id)}"><span class="problem-index">${String(PROBLEMS.indexOf(p)+1).padStart(2,'0')}</span><span class="problem-row-body"><span class="problem-row-title">${e(p.title)}</span><span class="problem-row-meta">${e(p.track)} · ${p.level}</span></span>${state.solved[p.id]?'<span class="problem-check">✓</span>':''}</button>`).join(''):'<div class="empty-state">No challenges match these filters.</div>';}
function bindArenaEditor(){const ta=$('#code-editor');if(!ta)return;const updateGutter=()=>{$('#line-gutter').innerHTML=Array.from({length:Math.max(8,ta.value.split('\n').length)},(_,i)=>`<span>${i+1}</span>`).join('');};ta.addEventListener('input',()=>{state.drafts[selectedProblem]=ta.value;save();updateGutter();});ta.addEventListener('keydown',ev=>{if(ev.key==='Tab'){ev.preventDefault();const x=ta.selectionStart;ta.setRangeText('  ',x,ta.selectionEnd,'end');ta.dispatchEvent(new Event('input'));}if(ev.key==='Enter'&&(ev.ctrlKey||ev.metaKey)){ev.preventDefault();runTests();}});updateGutter();}
function renderTestResults(){if(running)return `<div class="result-placeholder">Running tests securely in a disposable worker…</div>`;if(!results)return `<div class="result-placeholder">Run the solution to see visible and hidden test results. Only solutions passing every test earn XP.</div>`;if(results.error)return `<div class="test-row fail"><span class="result-name">Runtime / syntax error</span><div class="test-detail">${e(results.error)}</div></div>`;
 const all=results.results||[];const passed=all.filter(x=>x.ok).length;
 return `<h4 class="result-title">${passed} of ${all.length} tests passed</h4><div class="test-results">${all.map((t,i)=>`<div class="test-row ${t.ok?'pass':'fail'}"><div><div class="result-name">${t.ok?'✓':'✕'} Test ${i+1}${t.hidden?' · hidden':' · public'}</div>${t.error?`<div class="test-detail">Error: ${e(t.error)}</div>`:t.hidden?`<div class="test-detail">${t.ok?'Passed':'Failed'} private edge-case check</div>`:`<div class="test-detail">Expected: ${e(t.expected)}<br>Actual: ${e(t.actual)}</div>`}</div><small>${t.ms}ms</small></div>`).join('')}</div><div class="result-foot"><span class="result-summary ${passed===all.length?'pass':'fail'}">${passed===all.length?'Accepted · great work!':'Try again · inspect the failures'}</span><span>Timeout: 2.5s</span></div>`;
}
function stopWorker(){if(worker){worker.terminate();worker=null;}if(runTimeout){clearTimeout(runTimeout);runTimeout=null;}running=false;}
function runTests(){
 const p=currentProblem();const source=$('#code-editor')?.value??(state.drafts[p.id]??p.starter);
 if(source.length>30000){toast('Please keep the solution under 30,000 characters.',true);return;}
 state.drafts[p.id]=source;state.activity[TODAY()]=(state.activity[TODAY()]||0)+1;save();
 stopWorker();running=true;results=null;$('#run-tests').disabled=true;$('#run-tests').innerHTML=`${svg('clock',14)} Running…`;$('#test-panel').innerHTML=renderTestResults();
 const id=p.id;const token=crypto?.randomUUID?.()||String(Date.now());
 try {worker=new Worker('./runner-worker.js');
  worker.onmessage=ev=>{if(ev.data?.runId!==token)return;const data=ev.data;stopWorker();results=data;
   if(!data.error&&data.results?.length===p.tests.length&&data.results.every(v=>v.ok)){
    const first=!state.solved[id];state.solved[id]=true;save();syncSidebar();if(first)toast(`Accepted! +${p.points} XP earned`);else toast('All tests passed!');
   }else toast(data.error?'Code could not run':'Some tests failed. Keep going!',true);
   if(view==='arena'&&selectedProblem===id){$('#test-panel').innerHTML=renderTestResults();$('#run-tests').disabled=false;$('#run-tests').innerHTML=`${svg('play',14)} Run tests`; $$('.problem-row').forEach(n=>{if(n.dataset.problem===id&&state.solved[id]&&!n.querySelector('.problem-check'))n.insertAdjacentHTML('beforeend','<span class="problem-check">✓</span>')});}
  };
  worker.onerror=()=>{stopWorker();results={error:'The execution worker failed. Check your code and try again.'};if(view==='arena'&&selectedProblem===id){$('#test-panel').innerHTML=renderTestResults();$('#run-tests').disabled=false;$('#run-tests').innerHTML=`${svg('play',14)} Run tests`;}toast('Execution error',true);};
  worker.postMessage({runId:token,code:source,fn:p.fn,tests:p.tests});
  runTimeout=setTimeout(()=>{stopWorker();results={error:'Time limit exceeded (2.5 seconds). Look for an infinite loop or a slow approach.'};if(view==='arena'&&selectedProblem===id){$('#test-panel').innerHTML=renderTestResults();$('#run-tests').disabled=false;$('#run-tests').innerHTML=`${svg('play',14)} Run tests`;}toast('Time limit exceeded',true);},2500);
 }catch(err){stopWorker();results={error:'Could not start the code worker. Open this site from a local HTTP server, not file://.'};$('#test-panel').innerHTML=renderTestResults();$('#run-tests').disabled=false;toast('Worker unavailable',true);}
}
function changeProblem(id){if(!PROBLEMS.some(p=>p.id===id))return;stopWorker();selectedProblem=id;results=null;revealHint=0;revealSolution=false;setView('arena');}
function changeFilter(v){filter=v;const items=PROBLEMS.filter(p=>(filter==='All'||filter==='Solved'&&state.solved[p.id]||filter==='Unsolved'&&!state.solved[p.id]||p.track===filter)&&(!search||`${p.title} ${p.track}`.toLowerCase().includes(search.toLowerCase())));$('#arena-list').innerHTML=listRows(items);$$('[data-filter]').forEach(el=>el.classList.toggle('selected',el.dataset.filter===filter));if($('#track-filter'))$('#track-filter').value=TRACKS.some(t=>t.tag===filter)?filter:'All';}
function currentInterview(){return INTERVIEW.find(i=>i.id===selectedInterview)||INTERVIEW[0];}
function formatTime(seconds){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function renderInterview(){const p=currentInterview();const history=state.interviews[p.id]||{};root.innerHTML=`${header('THE INTERVIEW STUDIO','Practice under <strong>pressure.</strong>','Timed questions and practical review checkpoints help you build clear, evidence-backed interview answers.')}
 <div class="interview-grid"><div class="card interview-question"><div class="interview-type">${e(p.kind.toUpperCase())} / QUESTION ${INTERVIEW.findIndex(x=>x.id===p.id)+1} OF ${INTERVIEW.length}</div><select class="interview-select" id="interview-picker" aria-label="Select interview question">${INTERVIEW.map(v=>`<option value="${e(v.id)}" ${v.id===p.id?'selected':''}>${e(v.kind)} · ${e(v.question)}</option>`).join('')}</select><h2>${e(p.question)}</h2><p>${e(p.context)}</p><div class="divider"></div><div class="timer-face" id="timer-face">${formatTime(timer.remaining)}</div><div class="timer-caption">TIME FOR YOUR ANSWER · ${p.time/60} MIN RECOMMENDED</div><div class="timer-progress"><div id="timer-bar" style="width:${100*timer.remaining/timer.duration}%"></div></div><div class="timer-actions"><button class="btn btn-primary" id="timer-start">${svg(timer.active?'pause':'play',15)} ${timer.active?'Pause':'Start timer'}</button><button class="btn btn-muted" id="timer-reset">${svg('refresh',14)} Reset</button></div><div class="divider"></div><label for="interview-notes" class="section-sub" style="display:block;margin-bottom:9px">YOUR ANSWER / NOTES</label><textarea class="note-editor" id="interview-notes" placeholder="Speak aloud first, then write the key points you covered. Use real examples from SAP support, troubleshooting and projects you've built…">${e(history.notes||'')}</textarea><div class="editor-footer" style="padding:14px 0 0;border:0"><span class="editor-hint">Saved on this device</span><button class="btn btn-secondary btn-small" id="score-answer">${svg('check-circle',14)} Review my answer</button></div></div>
 <div><div class="card"><div class="section-head"><div><h3 class="section-title">Interviewer checklist</h3><p class="section-sub">What a strong answer should cover</p></div><span class="tag">${p.kind==='Behavioral'?'STAR':'Fundamentals'}</span></div><div class="feedback-list">${p.points.map((x,i)=>`<div class="feedback-item ${history.review?.checks?.[i]?'good':''}"><span class="feedback-dot"></span><span>${e(x)}</span></div>`).join('')}</div><div class="divider"></div><div class="prompt-outline"><h4>Answer strategy</h4><ol><li>Explain the problem before the solution.</li><li>Show exactly what you did, and why.</li><li>Share the result and what you learned.</li><li>Keep claims specific and verifiable.</li></ol></div></div>
 <div class="card" style="margin-top:16px" id="feedback-card"><div class="section-head"><h3 class="section-title">Practice feedback</h3><span class="tag">Local checklist</span></div>${interviewFeedbackMarkup(history.review)}<div class="interview-nav"><button class="btn btn-muted btn-small" id="interview-prev">← Previous</button><button class="btn btn-secondary btn-small" id="interview-next">Next question →</button></div></div></div></div>`;
}
function interviewFeedbackMarkup(review){if(!review)return `<p class="page-sub">Type notes above, then use “Review my answer” to check length and presence of relevant concepts. Review your own technical accuracy and delivery using the interviewer checklist.</p>`;
 return `<div class="metric-number" style="font:700 31px var(--display);color:var(--mint)">${review.score}<span style="font-size:13px;color:#93a5a0"> / 100</span></div><p class="section-sub">Heuristic coverage score · not a hiring prediction</p><div class="feedback-list" style="margin-top:16px">${review.tips.map(x=>`<div class="feedback-item ${x.good?'good':''}"><div class="feedback-dot"></div><span>${e(x.text)}</span></div>`).join('')}</div><p class="score-note" style="margin-top:14px">Use the checklist above to verify each technical claim and story detail yourself.</p>`;
}
function assessAnswer(){const p=currentInterview();const text=$('#interview-notes')?.value.trim()||'';const words=text.split(/\s+/).filter(Boolean);if(words.length<5){toast('Write your main answer points before reviewing.',true);return;}
 const checks=p.keywords.map(k=>new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}`, 'i').test(text));const coverage=checks.filter(Boolean).length;const lengthGood=words.length>=55;const concrete=/\b(for example|when|because|first|then|after|measured|reduced|built|implemented|tested|resolved)\b/i.test(text);
 const score=Math.min(100,Math.round(coverage/p.keywords.length*55+(lengthGood?25:Math.min(25,words.length/55*25))+(concrete?20:0)));
 const tips=[{good:lengthGood,text:lengthGood?`Good detail (${words.length} words). Practice delivering this concisely.`:`Only ${words.length} words. Add situation, action and concrete outcome.`},{good:coverage>=Math.ceil(p.keywords.length*.75),text:`Relevant concept coverage: ${coverage} of ${p.keywords.length} checkpoints mentioned (${p.keywords.join(', ')}).`},{good:concrete,text:concrete?'You describe actions or cause-and-effect, which strengthens the answer.':'Add an exact troubleshooting step, code decision or measurable result.'}];
 const review={score,checks:p.points.map((_,i)=>i<coverage),tips,at:new Date().toISOString()};state.interviews[p.id]={notes:text,review};save();$('#feedback-card').innerHTML=`<div class="section-head"><h3 class="section-title">Practice feedback</h3><span class="tag">Local checklist</span></div>${interviewFeedbackMarkup(review)}<div class="interview-nav"><button class="btn btn-muted btn-small" id="interview-prev">← Previous</button><button class="btn btn-secondary btn-small" id="interview-next">Next question →</button></div>`;toast('Answer review saved');}
function stopTimer(){if(timer.active){timer.remaining=Math.max(0,Math.ceil((timer.deadline-Date.now())/1000));timer.active=false;} updateTimerUI();}
function updateTimerUI(){if(timer.active){timer.remaining=Math.max(0,Math.ceil((timer.deadline-Date.now())/1000));if(timer.remaining<=0){timer.active=false;toast('Time is up. Review your answer.');}}
 if($('#timer-face'))$('#timer-face').textContent=formatTime(timer.remaining);if($('#timer-bar'))$('#timer-bar').style.width=`${100*timer.remaining/timer.duration}%`;
 if($('#timer-start'))$('#timer-start').innerHTML=`${svg(timer.active?'pause':'play',15)} ${timer.active?'Pause':'Start timer'}`;}
setInterval(updateTimerUI,250);
function changeInterview(id){const p=INTERVIEW.find(x=>x.id===id);if(!p)return;stopTimer();selectedInterview=id;timer={duration:p.time,remaining:p.time,active:false,deadline:0};renderInterview();}
function renderRoadmap(){const w=WEEKS[activeWeek];const done=completedDays();root.innerHTML=`${header('A REALISTIC LEARNING PLAN','Six weeks. <strong>One goal.</strong>','A practical roadmap built around your debugging strengths, with 42 achievable daily checkpoints.',`<div class="pill-inline">${done} / 42 days completed</div>`)}
 <div class="roadmap-timeline">${WEEKS.map((v,i)=>`<button class="roadmap-week-btn ${i===activeWeek?'selected':''}" data-week="${i}"><span class="week-id">WEEK ${String(i+1).padStart(2,'0')}</span><strong>${e(v.title)}</strong><small>${Array.from({length:7},(_,d)=>state.roadmap[`${i}-${d}`]).filter(Boolean).length} / 7 done</small></button>`).join('')}</div>
 <div class="roadmap-week-panel"><section class="card"><div class="section-head"><div><div class="eyebrow">WEEK ${activeWeek+1} / 6</div><h2 class="section-title" style="margin-top:9px">${e(w.theme)}</h2><p class="section-sub">${e(w.desc)}</p></div></div><div class="roadmap-day-list">${Array.from({length:7},(_,d)=>{const done=!!state.roadmap[`${activeWeek}-${d}`];const title=dayTitle(activeWeek,d);return `<button class="roadmap-day ${done?'done':''}" data-day="${activeWeek}-${d}" aria-pressed="${done}"><span class="day-marker">${done?'✓':String(d+1).padStart(2,'0')}</span><span class="day-copy"><strong>${e(title)}</strong><small>Day ${activeWeek*7+d+1} · ${d===6?'Review / mock':'Focused study + coding'}</small></span><span class="small-gray">${done?'COMPLETED':'MARK DONE'}</span></button>`;}).join('')}</div></section>
 <aside class="roadmap-right"><div class="card"><h3 class="section-title">Your progress</h3><div class="row" style="margin-top:14px"><div class="progress-circle" style="--angle:${100*done/42}%"><b>${Math.round(100*done/42)}%</b></div><div><strong style="font:700 25px var(--display)">${done} / 42</strong><p class="section-sub">Days you marked complete</p></div></div>${bar(100*done/42)}</div><div class="card"><h3 class="section-title">This week's foundations</h3><ul>${w.goals.map(t=>`<li>${e(t)}</li>`).join('')}</ul><button class="btn btn-secondary btn-small" data-go="arena">Practice coding ${svg('arrow',14)}</button></div><div class="card"><h3 class="section-title">Career milestones</h3><div class="milestone-list"><div class="milestone">${svg('check-circle')} Explain complexity out loud</div><div class="milestone">${svg('check-circle')} Push a tested project to GitHub</div><div class="milestone">${svg('check-circle')} Record 3 STAR examples</div><div class="milestone">${svg('check-circle')} Complete a timed mock</div></div></div></aside></div>`;}
function dayTitle(w,d){const topics=WEEKS[w].goals;const schedule=['Learn: ','Implement: ','Practice: ','Explain: ','Compare: ','Review: ','Mock: '];return `${schedule[d]}${topics[d%topics.length]}`;}
function renderJobs(){const jobs=state.jobs;const count=s=>jobs.filter(j=>j.status===s).length;const advanced=jobs.filter(j=>['Technical','Final round','Offer'].includes(j.status)).length;
 root.innerHTML=`${header('OPPORTUNITY PIPELINE','Turn practice into <strong>offers.</strong>','Track applications, next actions, links and interview stages privately in your browser.',`<div class="row"><button class="btn btn-muted btn-small" id="import-progress">${svg('upload',15)} Import backup</button><button class="btn btn-primary" id="job-add">${svg('plus',16)} Add application</button></div>`)}
 <div class="job-grid"><div class="job-stat"><small>Tracked roles</small><strong>${jobs.length}</strong></div><div class="job-stat"><small>Applications sent</small><strong>${jobs.filter(j=>j.status!=='Saved').length}</strong></div><div class="job-stat"><small>In interview</small><strong>${advanced}</strong></div><div class="job-stat"><small>Offers</small><strong>${count('Offer')}</strong></div></div>
 <div class="job-toolbar"><div><h2 class="section-title">Application pipeline</h2><p class="section-sub">Everything stays in your browser; export a backup regularly.</p></div><div class="row"><label class="small-gray" for="job-status-filter">FILTER</label><select class="form-control" id="job-status-filter" style="padding:8px;width:150px"><option>All statuses</option>${STATUS_OPTIONS.map(s=>`<option>${e(s)}</option>`).join('')}</select></div></div>
 <div id="jobs-table">${jobsTable(jobs)}</div><div class="job-add"><h3>The next interview starts with applying.</h3><p>Focus on SDE-1 / Software Engineer I / Junior Backend positions that match your current skills.</p><button class="btn btn-secondary" id="job-add-lower">${svg('plus',15)} Track an opportunity</button></div>
 <div class="section-block card"><div class="section-head"><h2 class="section-title">Your application strategy</h2><span class="tag">Personalized playbook</span></div><div class="feedback-list">${SEED_JOB_TIPS.map(t=>`<div class="feedback-item good"><span class="feedback-dot"></span><span>${e(t)}</span></div>`).join('')}</div></div>`;
}
function jobsTable(jobs){if(!jobs.length)return `<div class="empty-state">No applications found. Add your first SDE-1 opportunity to start tracking interviews.</div>`;
 return `<div class="job-table-wrap"><table class="job-table"><thead><tr><th>COMPANY / ROLE</th><th>STATUS</th><th>DATE</th><th>NEXT ACTION</th><th>LINK</th><th>ACTIONS</th></tr></thead><tbody>${jobs.map(j=>{let url='';try{const u=new URL(j.url||'');if(['https:','http:'].includes(u.protocol))url=u.href;}catch{}return `<tr><td><div class="job-company">${e(j.company)}</div><div class="job-role">${e(j.role)}</div></td><td><span class="badge ${j.status.toLowerCase().replace(/\s+/g,'-')}">${e(j.status)}</span></td><td class="mono">${e(j.date||'—')}</td><td>${e(j.next||'—')}</td><td>${url?`<a class="text-link" target="_blank" rel="noopener noreferrer" href="${e(url)}">Open ${svg('external',12)}</a>`:'—'}</td><td><div class="row"><button class="table-button" data-edit-job="${e(j.id)}" aria-label="Edit ${e(j.company)}">Edit</button><button class="table-button" data-delete-job="${e(j.id)}" aria-label="Delete ${e(j.company)}">Delete</button></div></td></tr>`}).join('')}</tbody></table></div>`;}
function openJobModal(id=null){modalJobId=id;const j=state.jobs.find(x=>x.id===id)||{company:'',role:'Software Development Engineer I',status:'Saved',date:TODAY(),next:'',url:'',notes:''};
 const el=document.createElement('div');el.className='modal-overlay';el.id='job-dialog';el.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h2 id="modal-title">${id?'Edit':'Add'} job application</h2><button class="icon-button" id="close-job" aria-label="Close dialog">×</button></div><form class="modal-body" id="job-form"><div class="form-field"><label for="job-company">Company *</label><input id="job-company" class="form-control" required maxlength="100" value="${e(j.company)}" placeholder="e.g. Atlassian" /></div><div class="form-field"><label for="job-role">Role *</label><input id="job-role" class="form-control" required maxlength="120" value="${e(j.role)}" /></div><div class="form-field"><label for="job-status">Stage</label><select class="form-control" id="job-status">${STATUS_OPTIONS.map(s=>`<option ${s===j.status?'selected':''}>${e(s)}</option>`).join('')}</select></div><div class="form-field"><label for="job-date">Applied / saved on</label><input id="job-date" class="form-control" type="date" value="${e(j.date)}" /></div><div class="form-field"><label for="job-next">Next step</label><input id="job-next" class="form-control" maxlength="180" value="${e(j.next)}" placeholder="Prepare DSA round on Tuesday" /></div><div class="form-field"><label for="job-url">Job URL (optional)</label><input id="job-url" class="form-control" type="url" maxlength="500" value="${e(j.url)}" placeholder="https://company.com/careers/..." /></div><div class="form-field"><label for="job-notes">Notes</label><textarea id="job-notes" class="form-control" rows="3" maxlength="1200">${e(j.notes||'')}</textarea></div><p class="modal-hint">Your applications are never uploaded to a server.</p><div class="modal-actions"><button type="button" class="btn btn-ghost" id="cancel-job">Cancel</button><button class="btn btn-primary" type="submit">${id?'Save changes':'Add application'}</button></div></form></section>`;
 document.body.append(el);$('#job-company').focus();}
function saveJob(ev){ev.preventDefault();const company=$('#job-company')?.value.trim();const role=$('#job-role')?.value.trim();if(!company||!role)return;const obj={id:modalJobId||'job-'+(crypto.randomUUID?.()||Date.now()),company,role,status:$('#job-status').value,date:$('#job-date').value,next:$('#job-next').value.trim(),url:$('#job-url').value.trim(),notes:$('#job-notes').value.trim()};if(obj.url){try{if(!['https:','http:'].includes(new URL(obj.url).protocol))throw new Error('invalid');}catch{toast('Enter a valid http(s) URL.',true);return;}}
 if(modalJobId){const i=state.jobs.findIndex(j=>j.id===modalJobId);if(i>=0)state.jobs[i]=obj;}else state.jobs.unshift(obj);save();$('#job-dialog')?.remove();renderJobs();toast(modalJobId?'Application updated':'Application added');}
function downloadBackup(){const contents=JSON.stringify({version:1,exportedAt:new Date().toISOString(),data:state},null,2);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([contents],{type:'application/json'}));a.download=`devshift-progress-${TODAY()}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);toast('Progress backup downloaded');}
function importBackup(file){if(!file)return;if(file.size>2*1024*1024){toast('Backup is too large. Maximum 2 MB.',true);return;}const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(data.version!==1||!data.data||!Array.isArray(data.data.jobs)||typeof data.data.solved!=='object'||!data.data.drafts)throw new Error('Invalid backup structure');if(!confirm('Replace the current saved progress with this backup?'))return;localStorage.setItem(STORAGE,JSON.stringify(data.data));state=loadState();render();syncSidebar();toast('Backup imported successfully');}catch{toast('Could not read this backup file.',true);}finally{$('#import-file').value='';}};reader.readAsText(file);}

// One delegated event layer keeps view switches predictable and avoids duplicate handlers.
document.addEventListener('click',ev=>{
 const target=ev.target.closest('button,[data-view],[data-go],[data-problem],[data-week],[data-day]');if(!target)return;
 if(target.matches('[data-view]')){ev.preventDefault();setView(target.dataset.view);return;}
 if(target.dataset.go){setView(target.dataset.go);return;}
 if(target.dataset.problem){changeProblem(target.dataset.problem);return;}
 if(target.dataset.filter){changeFilter(target.dataset.filter);return;}
 if(target.dataset.week!==undefined){activeWeek=Number(target.dataset.week);renderRoadmap();return;}
 if(target.dataset.day){const key=target.dataset.day;state.roadmap[key]=!state.roadmap[key];save();renderRoadmap();toast(state.roadmap[key]?'Milestone completed':'Milestone reopened');return;}
 switch(target.id){
 case 'menu-button':{const open=$('#sidebar').classList.toggle('open');$('#mobile-backdrop').classList.toggle('open',open);target.setAttribute('aria-expanded',String(open));break;}
 case 'mobile-backdrop':$('#sidebar').classList.remove('open');$('#mobile-backdrop').classList.remove('open');break;
 case 'export-btn':downloadBackup();break;
 case 'import-progress':$('#import-file').click();break;
 case 'hint-btn':{const p=currentProblem();revealHint=revealHint%p.hints.length+1;renderArena();break;}
 case 'solution-btn':revealSolution=!revealSolution;renderArena();break;
 case 'reset-code': case 'reset-code-footer':{if(!confirm('Reset your current solution draft?'))break;const p=currentProblem();state.drafts[p.id]=p.starter;save();results=null;renderArena();break;}
 case 'run-tests':runTests();break;
 case 'timer-start':{if(timer.active)stopTimer();else{timer.deadline=Date.now()+timer.remaining*1000;timer.active=true;}updateTimerUI();break;}
 case 'timer-reset':timer.active=false;timer.remaining=timer.duration;updateTimerUI();break;
 case 'score-answer':assessAnswer();break;
 case 'interview-next':{const i=INTERVIEW.findIndex(q=>q.id===selectedInterview);changeInterview(INTERVIEW[(i+1)%INTERVIEW.length].id);break;}
 case 'interview-prev':{const i=INTERVIEW.findIndex(q=>q.id===selectedInterview);changeInterview(INTERVIEW[(i-1+INTERVIEW.length)%INTERVIEW.length].id);break;}
 case 'job-add':case 'job-add-lower':openJobModal();break;
 case 'close-job':case 'cancel-job':$('#job-dialog')?.remove();break;
 }
 if(target.dataset.editJob)openJobModal(target.dataset.editJob);
 if(target.dataset.deleteJob){const job=state.jobs.find(j=>j.id===target.dataset.deleteJob);if(job&&confirm(`Delete ${job.company} from your tracker?`)){state.jobs=state.jobs.filter(j=>j.id!==job.id);save();renderJobs();toast('Application deleted');}}
});
document.addEventListener('input',ev=>{if(ev.target.id==='arena-search'){search=ev.target.value;changeFilter(filter);}if(ev.target.id==='interview-notes'){const p=currentInterview();state.interviews[p.id]={...(state.interviews[p.id]||{}),notes:ev.target.value};save();}});
document.addEventListener('change',ev=>{if(ev.target.id==='track-filter')changeFilter(ev.target.value);if(ev.target.id==='interview-picker')changeInterview(ev.target.value);if(ev.target.id==='job-status-filter'){$('#jobs-table').innerHTML=jobsTable(ev.target.value==='All statuses'?state.jobs:state.jobs.filter(j=>j.status===ev.target.value));}if(ev.target.id==='import-file')importBackup(ev.target.files[0]);});
document.addEventListener('submit',ev=>{if(ev.target.id==='job-form')saveJob(ev);});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){$('#job-dialog')?.remove();$('#sidebar').classList.remove('open');$('#mobile-backdrop').classList.remove('open');}});
window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);if(next!==view&&['dashboard','arena','interview','roadmap','jobs'].includes(next))setView(next);});

$$('[data-icon]').forEach(el=>el.innerHTML=svg(el.dataset.icon));
$('#mobile-backdrop').addEventListener('click',()=>{$('#sidebar').classList.remove('open');$('#mobile-backdrop').classList.remove('open');});
$('#import-file').addEventListener('change',ev=>importBackup(ev.target.files[0]));
if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
syncSidebar();setView(location.hash.slice(1)||'dashboard');
