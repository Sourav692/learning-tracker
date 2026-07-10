(function () {
  const board = document.getElementById('board');
  const DATA = window.LEARNING_DATA || [];     // seed content (data.js)
  const DATA_KEY = 'cip-tracker-data-v2';       // user-added/edited items
  const STATE_KEY = 'cip-tracker-v2';           // per-item status overrides

  // ===== Supabase config (from config.js) =====
  const CFG = window.APP_CONFIG || {};
  const SUPABASE_URL = CFG.SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = CFG.SUPABASE_ANON_KEY || '';
  const TABLE = CFG.TABLE || 'tracker_state';

  // ---- load persisted data (custom items) layered over the built-in DATA ----
  let custom = {};   // { moduleTitle: { topicTitle: [ {t,link,...}, ... ] } }  user additions
  let edits = {};    // { id: {t?,link?,stars?,deleted?} }  edits to built-ins or customs
  let topicEdits = {}; // { "section::origTopic": {title?, deleted?} }  rename/remove sub-topics
  let sectionEdits = {}; // { "origSection": {title?, deleted?} }  rename/remove modules
  let order = {};    // { sections:[title,...], topics:{ section:[topicTitle,...] } }  drag-reorder
  let activity = {}; // { 'YYYY-MM-DD': count }  completion events per day (for streaks/heatmap)
  let settings = {}; // { weeklyGoal }  user preferences (synced)
  let state = {};    // { id: 'todo'|'prog'|'done' }
  try { custom = JSON.parse(localStorage.getItem(DATA_KEY))?.custom || {}; } catch(e){}
  try { edits = JSON.parse(localStorage.getItem(DATA_KEY))?.edits || {}; } catch(e){}
  try { topicEdits = JSON.parse(localStorage.getItem(DATA_KEY))?.topicEdits || {}; } catch(e){}
  try { sectionEdits = JSON.parse(localStorage.getItem(DATA_KEY))?.sectionEdits || {}; } catch(e){}
  try { order = JSON.parse(localStorage.getItem(DATA_KEY))?.order || {}; } catch(e){}
  try { activity = JSON.parse(localStorage.getItem(DATA_KEY))?.activity || {}; } catch(e){}
  try { settings = JSON.parse(localStorage.getItem(DATA_KEY))?.settings || {}; } catch(e){}
  try { state = JSON.parse(localStorage.getItem(STATE_KEY)) || {}; } catch (e) { state = {}; }
  // migrate old flat custom shape { module: [items] } -> { module: { topic: [items] } }
  Object.keys(custom).forEach(mod=>{ if(Array.isArray(custom[mod])) custom[mod]={ 'Added items': custom[mod] }; });

  function saveData(){ try{ localStorage.setItem(DATA_KEY, JSON.stringify({custom,edits,topicEdits,sectionEdits,order,activity,settings})); }catch(e){} scheduleSync(); }
  function saveState(){ try{ localStorage.setItem(STATE_KEY, JSON.stringify(state)); }catch(e){} scheduleSync(); }

  // ---- build the working model: merge built-in DATA + custom additions + edits ----
  // Stable ids: built-ins "b:<module>::<topic>::<i>", customs "c:<module>::<topic>::<n>".
  const SEP = '::';
  function buildModel(){
    const model = [];
    const seen = new Set();
    DATA.forEach(sec => {
      const topics = [];
      const seenTopics = new Set();
      (sec.topics || []).forEach(top => {
        const items = [];
        top.items.forEach((it, i) => {
          const id = 'b:' + sec.title + SEP + top.title + SEP + i;
          const e = edits[id];
          if (e && e.deleted) return;
          items.push(Object.assign({}, it, e || {}, { _id: id }));
        });
        ((custom[sec.title] && custom[sec.title][top.title]) || []).forEach((it, n) => {
          const id = 'c:' + sec.title + SEP + top.title + SEP + n;
          const e = edits[id];
          if (e && e.deleted) return;
          items.push(Object.assign({}, it, e || {}, { _id: id }));
        });
        seenTopics.add(top.title);
        const meta = topicEdits[sec.title + SEP + top.title];
        if (meta && meta.deleted) return;
        topics.push({ title: top.title, display: (meta && meta.title) || top.title, items });
      });
      // custom sub-topics added under a built-in module
      if (custom[sec.title]) {
        Object.keys(custom[sec.title]).forEach(tt => {
          if (seenTopics.has(tt)) return;
          const items = (custom[sec.title][tt] || []).map((it, n) => {
            const id = 'c:' + sec.title + SEP + tt + SEP + n;
            const e = edits[id];
            if (e && e.deleted) return null;
            return Object.assign({}, it, e || {}, { _id: id });
          }).filter(Boolean);
          const meta = topicEdits[sec.title + SEP + tt];
          if (meta && meta.deleted) return;
          if (items.length) topics.push({ title: tt, display: (meta && meta.title) || tt, items });
        });
      }
      seen.add(sec.title);
      const smeta = sectionEdits[sec.title];
      if (smeta && smeta.deleted) return;
      model.push({ title: sec.title, display: (smeta && smeta.title) || sec.title, topics });
    });
    // brand-new modules that only exist in custom
    Object.keys(custom).forEach(title => {
      if (seen.has(title)) return;
      const smeta = sectionEdits[title];
      if (smeta && smeta.deleted) return;
      const topics = [];
      Object.keys(custom[title]).forEach(tt => {
        const items = (custom[title][tt] || []).map((it, n) => {
          const id = 'c:' + title + SEP + tt + SEP + n;
          const e = edits[id];
          if (e && e.deleted) return null;
          return Object.assign({}, it, e || {}, { _id: id });
        }).filter(Boolean);
        const meta = topicEdits[title + SEP + tt];
        if (meta && meta.deleted) return;
        if (items.length) topics.push({ title: tt, display: (meta && meta.title) || tt, items });
      });
      if (topics.length) model.push({ title, display: (smeta && smeta.title) || title, topics });
    });
    applyOrder(model);
    return model;
  }

  // apply saved drag-reorder; titles not listed keep their original order at the end (stable sort)
  function applyOrder(model){
    const rank = (arr, t) => { const i = arr ? arr.indexOf(t) : -1; return i === -1 ? 1e9 : i; };
    if (order.sections && order.sections.length) {
      model.sort((a, b) => rank(order.sections, a.title) - rank(order.sections, b.title));
    }
    if (order.topics) {
      model.forEach(sec => {
        const ord = order.topics[sec.title];
        if (ord && ord.length) sec.topics.sort((a, b) => rank(ord, a.title) - rank(ord, b.title));
      });
    }
    if (order.items) {
      model.forEach(sec => sec.topics.forEach(top => {
        const ord = order.items[sec.title + SEP + top.title];
        if (ord && ord.length) top.items.sort((a, b) => rank(ord, a._id) - rank(ord, b._id));
      }));
    }
  }

  let MODEL = buildModel();

  function statusOf(item) {
    const v = state[item._id];
    if (v === 'todo' || v === 'prog' || v === 'done') return v;
    if (item.done) return 'done';
    if (item.badge === 'prog') return 'prog';
    return 'todo';
  }
  const NEXT = { todo: 'prog', prog: 'done', done: 'todo' };

  function MODEL_ITEM(id){ for(const sec of MODEL){ for(const top of sec.topics){ const f=top.items.find(x=>x._id===id); if(f) return f; } } return null; }
  function logCompletion(n){ const k=ymd(new Date()); activity[k]=(activity[k]||0)+(n||1); }

  function escapeHtml(s){return (s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
  function escapeAttr(s){return (s||'').replace(/"/g,'&quot;');}

  // relative label + urgency class for a due date (YYYY-MM-DD)
  function dueInfo(due, st){
    const today=new Date(); today.setHours(0,0,0,0);
    const d=new Date(due+'T00:00:00'); if(isNaN(d)) return null;
    const diff=Math.round((d-today)/86400000);
    let label;
    if(diff===0) label='Today';
    else if(diff===1) label='Tomorrow';
    else if(diff===-1) label='1d overdue';
    else if(diff<0) label=(-diff)+'d overdue';
    else label='in '+diff+'d';
    let cls='';
    if(st==='done') cls='done';
    else if(diff<0) cls='overdue';
    else if(diff<=3) cls='soon';
    return {label, cls};
  }

  function renderItem(item) {
    if (item.group) return `<div class="grp-label">${escapeHtml(item.t)}</div>`;
    const st = statusOf(item);
    const cls = ['item','st-'+st];
    if (item.sub) cls.push('sub');
    const tags = Array.isArray(item.tags) ? item.tags : [];
    let txt = '';
    if (item.priority) txt += `<span class="prio-flag" title="Priority">⚑</span>`;
    txt += item.link
      ? `<a href="${escapeAttr(item.link)}" target="_blank" rel="noopener" draggable="false">${escapeHtml(item.t)}</a>`
      : escapeHtml(item.t);
    if (item.stars) txt += `<span class="stars">${'★'.repeat(item.stars)}</span>`;
    if (item.badge === 'udemy') txt += `<span class="badge udemy">Udemy</span>`;
    if (item.due) {
      const di=dueInfo(item.due, st);
      if (di) txt += `<span class="due ${di.cls}" title="Due ${escapeAttr(item.due)}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>${di.label}</span>`;
    }
    const noteHtml = item.note ? `<div class="inote">${escapeHtml(item.note)}</div>` : '';
    const tagsHtml = tags.length ? `<div class="itags">${tags.map(t=>`<span class="itag">#${escapeHtml(t)}</span>`).join('')}</div>` : '';
    const dataTags = tags.map(t=>t.toLowerCase()).join(' ');
    return `<div class="${cls.join(' ')}" data-id="${escapeAttr(item._id)}" data-status="${st}" data-priority="${item.priority?'1':'0'}" data-tags="${escapeAttr(dataTags)}" data-text="${escapeAttr((item.t+' '+(item.link||'')+' '+(item.note||'')+' '+tags.join(' ')).toLowerCase())}">
      <span class="drag-grip" tabindex="0" role="button" aria-label="Reorder item — focus and press arrow up or down" title="Drag, or focus + ↑/↓ to reorder">⠿</span>
      <div class="cbox" role="checkbox" tabindex="0" aria-checked="${st==='done'?'true':st==='prog'?'mixed':'false'}" aria-label="cycle status" title="Click to cycle: To do → In progress → Done">
        <svg class="ic-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        <span class="ic-prog"></span>
      </div>
      <div class="itxt">${txt}${noteHtml}${tagsHtml}</div>
      <div class="row-actions">
        <button class="mini-btn edit" title="Edit">✎</button>
        <button class="mini-btn del" title="Delete">✕</button>
      </div>
    </div>`;
  }

  function itemsStats(items){
    let total=0,done=0,prog=0;
    items.forEach(it=>{ if(it.group) return; total++; const s=statusOf(it); if(s==='done')done++; else if(s==='prog')prog++; });
    return {total,done,prog};
  }
  function topicStats(top){ return itemsStats(top.items); }
  function sectionStats(sec){
    let total=0,done=0,prog=0;
    sec.topics.forEach(top=>{ const r=itemsStats(top.items); total+=r.total; done+=r.done; prog+=r.prog; });
    return {total,done,prog};
  }

  const palette=['#ff5a3c','#ffb33c','#3cc6c2','#4ddb9e'];
  const dotColor=i=>palette[i%palette.length];

  function render(){
    MODEL = buildModel();
    board.innerHTML = MODEL.map((sec,s)=>{
      const {total,done,prog}=sectionStats(sec);
      const pct=total?Math.round(done/total*100):0;
      const pp=total?Math.round(prog/total*100):0;
      const topicsHtml=sec.topics.map(top=>{
        const r=topicStats(top);
        const tpct=r.total?Math.round(r.done/r.total*100):0;
        const tpp=r.total?Math.round(r.prog/r.total*100):0;
        const itemsHtml=top.items.map(renderItem).join('');
        return `<div class="topic" data-topic="${escapeAttr(top.title)}">
          <div class="topic-head">
            <span class="drag-grip" tabindex="0" role="button" aria-label="Reorder sub-topic — focus and press arrow up or down" title="Drag, or focus + ↑/↓ to reorder">⠿</span>
            <span class="topic-title">${escapeHtml(top.display||top.title)}</span>
            <span class="topic-actions">
              <button class="mini-btn t-edit" title="Edit / delete sub-topic" data-section="${escapeAttr(sec.title)}" data-topic="${escapeAttr(top.title)}">✎</button>
            </span>
            <span class="topic-meta">
              <span class="minibar sm"><b style="width:${tpct}%"></b><i style="width:${tpp}%"></i></span>
              <span class="topic-count">${r.done}/${r.total}</span>
              <svg class="chev sm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </div>
          <div class="topic-body">${itemsHtml}
            <button class="add-here btn ghost" data-section="${escapeAttr(sec.title)}" data-topic="${escapeAttr(top.title)}">+ Add link</button>
          </div>
        </div>`;
      }).join('');
      return `<section class="section" data-sec="${s}" data-title="${escapeAttr(sec.title)}">
        <div class="sec-head">
          <span class="drag-grip" tabindex="0" role="button" aria-label="Reorder module — focus and press arrow up or down" title="Drag, or focus + ↑/↓ to reorder">⠿</span>
          <span class="sec-dot" style="background:${dotColor(s)}"></span>
          <span class="sec-title">${escapeHtml(sec.display||sec.title)}</span>
          <span class="sec-actions">
            <button class="mini-btn s-edit" title="Edit / delete module" data-section="${escapeAttr(sec.title)}">✎</button>
          </span>
          <span class="sec-meta">
            <span class="minibar"><b style="width:${pct}%"></b><i style="width:${pp}%"></i></span>
            <span class="sec-count">${done}/${total}</span>
            <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </span>
        </div>
        <div class="sec-body">${topicsHtml}
          <button class="add-topic btn ghost" data-section="${escapeAttr(sec.title)}">+ Add sub-topic</button>
        </div>
      </section>`;
    }).join('');
    bindEvents();
    updateDash();
    renderTagBar();
    applyFilter();
  }

  function bindEvents(){
    document.querySelectorAll('.sec-head').forEach(h=>{
      h.addEventListener('click',()=>h.parentElement.classList.toggle('collapsed'));
    });
    document.querySelectorAll('.topic-head').forEach(h=>{
      h.addEventListener('click',e=>{ e.stopPropagation(); h.parentElement.classList.toggle('collapsed'); });
    });
    document.querySelectorAll('.item').forEach(row=>{
      const box=row.querySelector('.cbox');
      const cycle=e=>{ e.stopPropagation();
        const id=row.dataset.id, cur=row.dataset.status, nxt=NEXT[cur]||'prog';
        state[id]=nxt; row.dataset.status=nxt;
        row.classList.remove('st-todo','st-prog','st-done'); row.classList.add('st-'+nxt);
        box.setAttribute('aria-checked', nxt==='done'?'true':nxt==='prog'?'mixed':'false');
        if(nxt==='done' && cur!=='done'){ logCompletion(); saveData(); }
        saveState(); refreshSection(row.closest('.section')); updateDash(); applyFilter();
      };
      box.addEventListener('click',cycle);
      box.addEventListener('keydown',e=>{ if(e.key===' '||e.key==='Enter'){e.preventDefault();cycle(e);} });
      row.querySelector('.edit').addEventListener('click',e=>{ e.stopPropagation(); openEditor(row.dataset.id); });
      row.querySelector('.del').addEventListener('click',e=>{ e.stopPropagation(); deleteItem(row.dataset.id); });
      row.setAttribute('draggable','true');
      row.addEventListener('dragstart',e=>{
        if(e.target.closest('.cbox,.row-actions,button,a,input,select')){ e.preventDefault(); return; }
        e.stopPropagation();
        dragKind='item'; draggingEl=row; dragHomeBody=row.closest('.topic-body');
        row.classList.add('dragging'); e.dataTransfer.effectAllowed='move';
        try{ e.dataTransfer.setData('text/plain', row.dataset.id||''); }catch(_){}
      });
      row.addEventListener('dragend',endDrag);
    });
    document.querySelectorAll('.add-here').forEach(b=>{
      b.addEventListener('click',e=>{ e.stopPropagation(); openEditor(null, b.dataset.section, b.dataset.topic); });
    });
    document.querySelectorAll('.add-topic').forEach(b=>{
      b.addEventListener('click',e=>{ e.stopPropagation(); openEditor(null, b.dataset.section, '__new__'); });
    });
    document.querySelectorAll('.t-edit').forEach(b=>{
      b.addEventListener('click',e=>{ e.stopPropagation(); editTopic(b.dataset.section, b.dataset.topic); });
    });
    document.querySelectorAll('.s-edit').forEach(b=>{
      b.addEventListener('click',e=>{ e.stopPropagation(); editSection(b.dataset.section); });
    });
    // drag to reorder: section headers reorder modules, topic headers reorder sub-topics
    document.querySelectorAll('.sec-head').forEach(h=>{
      h.setAttribute('draggable','true');
      h.addEventListener('dragstart',e=>{
        if(e.target.closest('.mini-btn,button,a,input,select')){ e.preventDefault(); return; }
        dragKind='section'; draggingEl=h.closest('.section'); dragHomeBody=null;
        draggingEl.classList.add('dragging'); e.dataTransfer.effectAllowed='move';
        try{ e.dataTransfer.setData('text/plain', draggingEl.dataset.title||''); }catch(_){}
      });
      h.addEventListener('dragend',endDrag);
    });
    document.querySelectorAll('.topic-head').forEach(h=>{
      h.setAttribute('draggable','true');
      h.addEventListener('dragstart',e=>{
        if(e.target.closest('.mini-btn,button,a,input,select')){ e.preventDefault(); return; }
        e.stopPropagation();
        dragKind='topic'; draggingEl=h.closest('.topic'); dragHomeBody=draggingEl.closest('.sec-body');
        draggingEl.classList.add('dragging'); e.dataTransfer.effectAllowed='move';
        try{ e.dataTransfer.setData('text/plain', draggingEl.dataset.topic||''); }catch(_){}
      });
      h.addEventListener('dragend',endDrag);
    });
    document.querySelectorAll('.drag-grip').forEach(g=>{
      g.addEventListener('keydown',e=>gripKeyMove(g,e));
    });
  }

  // ---- drag-to-reorder helpers (board listeners bound once below) ----
  let dragKind=null, draggingEl=null, dragHomeBody=null;
  function endDrag(){
    document.querySelectorAll('.topic-body.drop-target').forEach(b=>b.classList.remove('drop-target'));
    if(draggingEl) draggingEl.classList.remove('dragging');
    const kind=dragKind, el=draggingEl, home=dragHomeBody;
    dragKind=null; draggingEl=null; dragHomeBody=null;
    if(kind==='item' && el && home){
      const finalBody=el.closest('.topic-body');
      if(finalBody && finalBody!==home) moveItemAcross(el, finalBody);
    }
    if(kind){ persistOrderFromDOM(); }
  }
  function getDragAfterElement(container, y, selector){
    const els=[...container.querySelectorAll(selector)].filter(el=>el!==draggingEl);
    let closest={offset:-Infinity, element:null};
    for(const child of els){
      const box=child.getBoundingClientRect();
      const offset=y - box.top - box.height/2;
      if(offset<0 && offset>closest.offset) closest={offset, element:child};
    }
    return closest.element;
  }
  function persistOrderFromDOM(skipRender){
    order.sections=[...board.querySelectorAll('.section')].map(s=>s.dataset.title);
    order.topics=order.topics||{};
    order.items=order.items||{};
    board.querySelectorAll('.section').forEach(s=>{
      order.topics[s.dataset.title]=[...s.querySelectorAll('.topic')].map(t=>t.dataset.topic);
      s.querySelectorAll('.topic').forEach(t=>{
        order.items[s.dataset.title+SEP+t.dataset.topic]=[...t.querySelectorAll('.item')].map(it=>it.dataset.id);
      });
    });
    saveData(); if(!skipRender) render();
  }

  // keyboard reorder: focus a ⠿ grip, press ↑/↓ to move its item/sub-topic/module.
  // DOM is moved in place and order persisted WITHOUT a re-render, so focus is kept.
  function gripKeyMove(grip, e){
    if(e.key!=='ArrowUp' && e.key!=='ArrowDown') return;
    e.preventDefault();
    const up=e.key==='ArrowUp';
    let el, type;
    if(grip.closest('.sec-head')){ el=grip.closest('.section'); type='section'; }
    else if(grip.closest('.topic-head')){ el=grip.closest('.topic'); type='topic'; }
    else { el=grip.closest('.item'); type='item'; }
    if(!el) return;
    const container=el.parentElement;
    const sibs=[...container.children].filter(c=>c.classList.contains(type));
    const idx=sibs.indexOf(el);
    if(up){ if(idx<=0) return; container.insertBefore(el, sibs[idx-1]); }
    else { if(idx>=sibs.length-1) return; container.insertBefore(el, sibs[idx+1].nextSibling); }
    persistOrderFromDOM(true);
    grip.focus();
  }
  board.addEventListener('dragover',e=>{
    if(!dragKind) return;
    e.preventDefault(); e.dataTransfer.dropEffect='move';
    if(dragKind==='section'){
      const after=getDragAfterElement(board, e.clientY, '.section');
      if(after==null) board.appendChild(draggingEl); else board.insertBefore(draggingEl, after);
    } else if(dragKind==='topic' && dragHomeBody){
      const after=getDragAfterElement(dragHomeBody, e.clientY, '.topic');
      const addBtn=dragHomeBody.querySelector('.add-topic');
      if(after==null) dragHomeBody.insertBefore(draggingEl, addBtn); else dragHomeBody.insertBefore(draggingEl, after);
    } else if(dragKind==='item'){
      // items may move across sub-topics (and modules): target whatever .topic-body
      // the cursor is over; if not over a body, keep it where it currently sits.
      const body = e.target.closest('.topic-body') || draggingEl.closest('.topic-body');
      if(!body) return;
      const after=getDragAfterElement(body, e.clientY, '.item');
      const addBtn=body.querySelector('.add-here');
      if(after==null) body.insertBefore(draggingEl, addBtn); else body.insertBefore(draggingEl, after);
      // highlight the target sub-topic when it's not the origin
      document.querySelectorAll('.topic-body.drop-target').forEach(b=>{ if(b!==body) b.classList.remove('drop-target'); });
      if(body!==dragHomeBody) body.classList.add('drop-target'); else body.classList.remove('drop-target');
    }
  });
  board.addEventListener('drop',e=>{ if(dragKind) e.preventDefault(); });

  // Re-home an item that was dropped into a different sub-topic: recreate it as a
  // custom item in the target (carrying its data + status) and soft-delete the
  // original. Avoids re-indexing other items. Returns the new id (or null).
  function moveItemAcross(el, targetBody){
    const origId=el.dataset.id;
    const src=MODEL_ITEM(origId); if(!src) return null;
    const targetSection=targetBody.closest('.section').dataset.title;
    const targetTopic=targetBody.closest('.topic').dataset.topic;
    const st=statusOf(src);
    const payload={t:src.t};
    if(src.link) payload.link=src.link;
    if(src.stars) payload.stars=src.stars;
    if(src.due) payload.due=src.due;
    if(src.note) payload.note=src.note;
    if(Array.isArray(src.tags)&&src.tags.length) payload.tags=src.tags.slice();
    if(src.priority) payload.priority=true;
    if(src.badge) payload.badge=src.badge;
    if(!custom[targetSection]) custom[targetSection]={};
    if(!custom[targetSection][targetTopic]) custom[targetSection][targetTopic]=[];
    const newId='c:'+targetSection+SEP+targetTopic+SEP+custom[targetSection][targetTopic].length;
    custom[targetSection][targetTopic].push(payload);
    edits[origId]=Object.assign({}, edits[origId], {deleted:true}); // tombstone original
    if(st && st!=='todo') state[newId]=st;
    delete state[origId];
    el.dataset.id=newId; // so persistOrderFromDOM records the new id at the dropped spot
    return newId;
  }

  function topicDisplayTitle(section, origTopic){
    const m=topicEdits[section+SEP+origTopic];
    return (m && m.title) || origTopic;
  }

  // ---- RENAME / DELETE SUB-TOPIC MODAL ----
  const tmodal=document.getElementById('tmodal');
  let editingTopic=null; // {section, origTopic}
  function editTopic(section, origTopic){
    editingTopic={section, origTopic};
    confirmingTopicDelete=false;
    const btn=document.getElementById('tm-delete');
    btn.textContent='Delete sub-topic'; btn.classList.remove('danger');
    document.getElementById('tm-text').value=topicDisplayTitle(section, origTopic);
    tmodal.classList.add('open');
    const inp=document.getElementById('tm-text'); inp.focus(); inp.select();
  }
  function closeTopicEditor(){ tmodal.classList.remove('open'); confirmingTopicDelete=false; editingTopic=null; }
  function saveTopicRename(){
    if(!editingTopic) return;
    const v=document.getElementById('tm-text').value.trim();
    if(!v){ document.getElementById('tm-text').focus(); return; }
    const key=editingTopic.section+SEP+editingTopic.origTopic;
    topicEdits[key]=Object.assign({}, topicEdits[key], {title:v});
    saveData(); render(); closeTopicEditor();
  }
  let confirmingTopicDelete=false;
  function onTopicDeleteClick(){
    if(!editingTopic) return;
    const btn=document.getElementById('tm-delete');
    if(!confirmingTopicDelete){
      confirmingTopicDelete=true;
      btn.textContent='Click again to confirm delete';
      btn.classList.add('danger');
      return;
    }
    const key=editingTopic.section+SEP+editingTopic.origTopic;
    topicEdits[key]=Object.assign({}, topicEdits[key], {deleted:true});
    saveData(); render(); closeTopicEditor();
  }
  document.getElementById('tm-save').addEventListener('click',saveTopicRename);
  document.getElementById('tm-delete').addEventListener('click',onTopicDeleteClick);
  document.getElementById('tm-cancel').addEventListener('click',closeTopicEditor);
  document.getElementById('tm-text').addEventListener('keydown',e=>{ if(e.key==='Enter'){e.preventDefault();saveTopicRename();} });
  tmodal.addEventListener('click',e=>{ if(e.target===tmodal) closeTopicEditor(); });

  // ---- RENAME / DELETE MODULE MODAL ----
  function sectionDisplayTitle(orig){ const m=sectionEdits[orig]; return (m && m.title) || orig; }
  const smodal=document.getElementById('smodal');
  let editingSection=null;            // original module title
  let confirmingSectionDelete=false;
  function editSection(orig){
    editingSection=orig;
    confirmingSectionDelete=false;
    const btn=document.getElementById('sm-delete');
    btn.textContent='Delete module'; btn.classList.remove('danger');
    document.getElementById('sm-text').value=sectionDisplayTitle(orig);
    smodal.classList.add('open');
    const inp=document.getElementById('sm-text'); inp.focus(); inp.select();
  }
  function closeSectionEditor(){ smodal.classList.remove('open'); confirmingSectionDelete=false; editingSection=null; }
  function saveSectionRename(){
    if(editingSection===null) return;
    const v=document.getElementById('sm-text').value.trim();
    if(!v){ document.getElementById('sm-text').focus(); return; }
    sectionEdits[editingSection]=Object.assign({}, sectionEdits[editingSection], {title:v});
    saveData(); render(); closeSectionEditor();
  }
  function onSectionDeleteClick(){
    if(editingSection===null) return;
    const btn=document.getElementById('sm-delete');
    if(!confirmingSectionDelete){
      confirmingSectionDelete=true;
      btn.textContent='Click again — deletes the whole module';
      btn.classList.add('danger');
      return;
    }
    sectionEdits[editingSection]=Object.assign({}, sectionEdits[editingSection], {deleted:true});
    saveData(); render(); closeSectionEditor();
  }
  document.getElementById('sm-save').addEventListener('click',saveSectionRename);
  document.getElementById('sm-delete').addEventListener('click',onSectionDeleteClick);
  document.getElementById('sm-cancel').addEventListener('click',closeSectionEditor);
  document.getElementById('sm-text').addEventListener('keydown',e=>{ if(e.key==='Enter'){e.preventDefault();saveSectionRename();} });
  smodal.addEventListener('click',e=>{ if(e.target===smodal) closeSectionEditor(); });

  function refreshSection(secEl){
    const title=secEl.dataset.title;
    const sec=MODEL.find(s=>s.title===title); if(!sec) return;
    const {total,done,prog}=sectionStats(sec);
    secEl.querySelector('.sec-head .minibar b').style.width=(total?Math.round(done/total*100):0)+'%';
    secEl.querySelector('.sec-head .minibar i').style.width=(total?Math.round(prog/total*100):0)+'%';
    secEl.querySelector('.sec-count').textContent=`${done}/${total}`;
    secEl.querySelectorAll('.topic').forEach(tEl=>{
      const top=sec.topics.find(t=>t.title===tEl.dataset.topic); if(!top) return;
      const r=topicStats(top);
      tEl.querySelector('.minibar b').style.width=(r.total?Math.round(r.done/r.total*100):0)+'%';
      tEl.querySelector('.minibar i').style.width=(r.total?Math.round(r.prog/r.total*100):0)+'%';
      tEl.querySelector('.topic-count').textContent=`${r.done}/${r.total}`;
    });
  }

  function totals(){ let t=0,d=0,p=0; MODEL.forEach(sec=>{const r=sectionStats(sec);t+=r.total;d+=r.done;p+=r.prog;}); return {total:t,done:d,prog:p}; }

  function updateDash(){
    const {total,done,prog}=totals();
    const pct=total?Math.round(done/total*100):0, rem=total-done-prog;
    document.getElementById('dash').innerHTML=`
      <div class="stat green"><div class="num">${done}</div><div class="lbl">Completed</div></div>
      <div class="stat gold"><div class="num">${prog}</div><div class="lbl">In progress</div></div>
      <div class="stat accent"><div class="num">${rem}</div><div class="lbl">Not started</div></div>
      <div class="stat teal"><div class="num">${total}</div><div class="lbl">Total items</div></div>`;
    document.getElementById('bigfill').style.width=pct+'%';
    const pf=document.getElementById('bigprog');
    if(pf){ pf.style.left=pct+'%'; pf.style.width=(total?Math.round(prog/total*100):0)+'%'; }
    document.getElementById('capleft').textContent=`${done} done · ${prog} in progress · ${rem} to start`;
    document.getElementById('capright').textContent=pct+'%';
  }

  // ---- filters / search ----
  let filter='all', query='', hideDone=false, priorityOnly=false;
  const activeTags=new Set();
  try{ hideDone=localStorage.getItem('cip-hide-done')==='1'; }catch(e){}
  function applyFilter(){
    const q=query.trim();
    const tags=[...activeTags];
    const filtering=q||filter!=='all'||hideDone||priorityOnly||tags.length>0;
    document.querySelectorAll('.section').forEach(secEl=>{
      let secVis=0;
      secEl.querySelectorAll('.topic').forEach(topEl=>{
        let tVis=0;
        topEl.querySelectorAll('.item').forEach(row=>{
          const st=row.dataset.status; let show=true;
          if(filter==='todo'&&st!=='todo')show=false;
          if(filter==='prog'&&st!=='prog')show=false;
          if(filter==='done'&&st!=='done')show=false;
          if(hideDone&&st==='done')show=false;
          if(priorityOnly&&row.dataset.priority!=='1')show=false;
          if(tags.length){ const rt=(row.dataset.tags||'').split(' ').filter(Boolean); if(!tags.some(t=>rt.indexOf(t)!==-1))show=false; }
          if(q&&row.dataset.text.indexOf(q)===-1)show=false;
          row.classList.toggle('hidden',!show); if(show){tVis++;secVis++;}
        });
        topEl.classList.toggle('hidden',filtering&&tVis===0);
      });
      secEl.classList.toggle('hidden',filtering&&secVis===0);
    });
  }
  function allTags(){
    const s=new Set();
    MODEL.forEach(sec=>sec.topics.forEach(t=>t.items.forEach(it=>{ (it.tags||[]).forEach(tg=>s.add(tg)); })));
    return [...s].sort((a,b)=>a.localeCompare(b));
  }
  function anyPriority(){
    return MODEL.some(sec=>sec.topics.some(t=>t.items.some(it=>it.priority)));
  }
  function renderTagBar(){
    const bar=document.getElementById('tagbar');
    const tags=allTags(), hasPrio=anyPriority();
    if(!tags.length && !hasPrio){ bar.classList.add('hidden'); bar.innerHTML=''; return; }
    let html='';
    if(hasPrio) html+=`<button class="tagchip prio${priorityOnly?' active':''}" data-prio="1" aria-pressed="${priorityOnly}">⚑ Priority</button>`;
    tags.forEach(t=>{ const on=activeTags.has(t.toLowerCase()); html+=`<button class="tagchip${on?' active':''}" data-tag="${escapeAttr(t.toLowerCase())}" aria-pressed="${on}">#${escapeHtml(t)}</button>`; });
    if(activeTags.size||priorityOnly) html+=`<button class="tagchip clear" data-clear="1">✕ clear</button>`;
    bar.innerHTML=html; bar.classList.remove('hidden');
  }
  document.getElementById('tagbar').addEventListener('click',e=>{
    const b=e.target.closest('.tagchip'); if(!b) return;
    if(b.dataset.clear){ activeTags.clear(); priorityOnly=false; }
    else if(b.dataset.prio){ priorityOnly=!priorityOnly; }
    else if(b.dataset.tag){ const t=b.dataset.tag; activeTags.has(t)?activeTags.delete(t):activeTags.add(t); }
    renderTagBar(); applyFilter();
  });
  document.getElementById('search').addEventListener('input',e=>{query=e.target.value.toLowerCase();applyFilter();});
  document.querySelectorAll('.btn[data-filter]').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('.btn[data-filter]').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); filter=b.dataset.filter; applyFilter();
    });
  });
  document.getElementById('expand').addEventListener('click',()=>document.querySelectorAll('.section,.topic').forEach(s=>s.classList.remove('collapsed')));
  document.getElementById('collapse').addEventListener('click',()=>document.querySelectorAll('.section,.topic').forEach(s=>s.classList.add('collapsed')));
  const hideDoneBtn=document.getElementById('hide-done');
  function syncHideDoneBtn(){ hideDoneBtn.classList.toggle('active',hideDone); hideDoneBtn.setAttribute('aria-pressed',hideDone?'true':'false'); hideDoneBtn.textContent=hideDone?'Show done':'Hide done'; }
  hideDoneBtn.addEventListener('click',()=>{ hideDone=!hideDone; try{localStorage.setItem('cip-hide-done',hideDone?'1':'0');}catch(e){} syncHideDoneBtn(); applyFilter(); });
  syncHideDoneBtn();
  document.getElementById('reset').addEventListener('click',()=>{
    if(confirm('Reset progress status only? (Your added/edited items stay.)')){ state={}; saveState(); render(); }
  });

  // ---- EXPORT / IMPORT (JSON backup & restore) ----
  function ymd(d){ const z=n=>String(n).padStart(2,'0'); return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate()); }
  document.getElementById('export').addEventListener('click',()=>{
    const payload={ app:'learning-tracker', track:'ai-engineering', version:2, exportedAt:new Date().toISOString(), data:localSnapshot() };
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='ai-engineering-tracker-'+ymd(new Date())+'.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  const importFile=document.getElementById('import-file');
  document.getElementById('import').addEventListener('click',()=>importFile.click());
  importFile.addEventListener('change',e=>{
    const f=e.target.files && e.target.files[0]; if(!f) return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const parsed=JSON.parse(reader.result);
        const d=parsed && parsed.data ? parsed.data : parsed; // accept raw snapshot too
        if(!d || typeof d!=='object') throw new Error('not an object');
        if(!confirm('Import this backup? It will REPLACE your current items, progress and history on this device (and sync to your account if signed in).')) { importFile.value=''; return; }
        custom=d.custom||{}; edits=d.edits||{}; topicEdits=d.topicEdits||{}; sectionEdits=d.sectionEdits||{};
        order=d.order||{}; activity=d.activity||{}; settings=d.settings||{}; state=d.state||{};
        Object.keys(custom).forEach(mod=>{ if(Array.isArray(custom[mod])) custom[mod]={ 'Added items': custom[mod] }; });
        saveData(); saveState(); render();
      }catch(err){ alert('Could not import: that file isn’t a valid tracker backup.\n\n('+err.message+')'); }
      importFile.value='';
    };
    reader.readAsText(f);
  });

  // ---- INSIGHTS (streaks, activity heatmap, per-module progress) ----
  const insightsModal=document.getElementById('insightsmodal');
  function computeStreaks(){
    const total=Object.values(activity).reduce((a,b)=>a+(b||0),0);
    let cur=0, d=new Date(); d.setHours(0,0,0,0);
    if(!activity[ymd(d)]) d.setDate(d.getDate()-1); // today may still be empty
    while(activity[ymd(d)]>0){ cur++; d.setDate(d.getDate()-1); }
    const keys=Object.keys(activity).filter(k=>activity[k]>0).sort();
    let longest=0, run=0, prev=null;
    keys.forEach(k=>{
      if(prev){ const diff=Math.round((new Date(k+'T00:00:00')-new Date(prev+'T00:00:00'))/86400000); run = diff===1?run+1:1; }
      else run=1;
      if(run>longest) longest=run; prev=k;
    });
    return {current:cur, longest, total};
  }
  function heatmapHtml(weeks){
    weeks=weeks||18;
    const today=new Date(); today.setHours(0,0,0,0);
    const end=new Date(today); end.setDate(end.getDate()+(6-end.getDay())); // Saturday of this week
    const start=new Date(end); start.setDate(start.getDate()-(weeks*7-1)); // aligns to a Sunday
    let maxC=1; Object.values(activity).forEach(v=>{ if(v>maxC) maxC=v; });
    const level=c=>{ if(!c) return 0; const r=c/maxC; return r>.75?4:r>.5?3:r>.25?2:1; };
    const cur=new Date(start); let cols='';
    for(let w=0; w<weeks; w++){
      let col='';
      for(let dow=0; dow<7; dow++){
        const k=ymd(cur), c=activity[k]||0, future=cur>today;
        col+=`<i class="hm ${future?'fut':'lvl'+level(c)}" title="${k}: ${c} done"></i>`;
        cur.setDate(cur.getDate()+1);
      }
      cols+=`<div class="hm-col">${col}</div>`;
    }
    return `<div class="hm-grid">${cols}</div>`;
  }
  function moduleBarsHtml(){
    return MODEL.map((sec,i)=>{
      const {total,done}=sectionStats(sec);
      const pct=total?Math.round(done/total*100):0;
      return `<div class="mbar"><span class="mbar-t">${escapeHtml(sec.display||sec.title)}</span>`
        +`<span class="mbar-track"><b style="width:${pct}%;background:${dotColor(i)}"></b></span>`
        +`<span class="mbar-n">${done}/${total}</span></div>`;
    }).join('');
  }
  function insStat(num,lbl){ return `<div class="ins-stat"><div class="ins-num">${escapeHtml(num)}</div><div class="ins-lbl">${escapeHtml(lbl)}</div></div>`; }
  function weekCompletions(){
    const today=new Date(); today.setHours(0,0,0,0); let n=0;
    for(let i=0;i<7;i++){ const d=new Date(today); d.setDate(d.getDate()-i); n+=activity[ymd(d)]||0; }
    return n;
  }
  function levelInfo(totalDone){
    const xp=totalDone*10;
    let level=Math.floor(Math.sqrt(xp/50))+1; if(level<1) level=1;
    const curBase=Math.pow(level-1,2)*50, nextBase=Math.pow(level,2)*50;
    const into=xp-curBase, span=nextBase-curBase;
    return {xp, level, pct: span?Math.round(into/span*100):0, toNext: Math.max(0, nextBase-xp)};
  }
  function badgeList(s,o){
    const wk=weekCompletions(), goal=settings.weeklyGoal||5;
    const moduleMaster=MODEL.some(sec=>{ const r=sectionStats(sec); return r.total>0 && r.done===r.total; });
    return [
      {icon:'🌱', name:'First step',   got:s.total>=1,    hint:'Complete 1 item'},
      {icon:'🔥', name:'On fire',      got:s.current>=3,  hint:'3-day streak'},
      {icon:'📅', name:'Consistent',   got:s.longest>=7,  hint:'7-day streak'},
      {icon:'🎯', name:'Goal crusher', got:wk>=goal,      hint:'Hit your weekly goal'},
      {icon:'💯', name:'Century',      got:o.done>=100,   hint:'100 items done'},
      {icon:'🏆', name:'Module master',got:moduleMaster,  hint:'Finish a whole module'}
    ];
  }
  function openInsights(){
    const s=computeStreaks(), o=totals();
    const goal=settings.weeklyGoal||5, wk=weekCompletions(), wkPct=Math.min(100,Math.round(wk/goal*100));
    const lv=levelInfo(o.done);
    const badgesHtml=badgeList(s,o).map(b=>
      `<div class="badge-card${b.got?' got':''}" title="${escapeAttr(b.hint)}"><div class="badge-ic">${b.icon}</div><div class="badge-nm">${escapeHtml(b.name)}</div><div class="badge-ht">${b.got?'Earned':escapeHtml(b.hint)}</div></div>`
    ).join('');
    document.getElementById('insights-body').innerHTML=
      '<h3>Insights</h3>'
      +'<div class="ins-stats">'
        +insStat(s.current+(s.current===1?' day':' days'),'Current streak')
        +insStat(s.longest+(s.longest===1?' day':' days'),'Longest streak')
        +insStat(o.done+' / '+o.total,'Items done')
        +insStat('Lv '+lv.level,'XP '+lv.xp)
      +'</div>'
      +'<div class="ins-section"><div class="ins-label">Weekly goal</div>'
        +'<div class="goal-row"><div class="goal-bar"><b style="width:'+wkPct+'%"></b></div>'
        +'<span class="goal-num">'+wk+' / <input id="ins-goal" type="number" min="1" max="99" value="'+goal+'" aria-label="Weekly goal"> this week</span></div>'
        +'<div class="lvl-bar" title="'+lv.toNext+' XP to level '+(lv.level+1)+'"><b style="width:'+lv.pct+'%"></b></div>'
        +'<div class="lvl-cap">Level '+lv.level+' · '+lv.toNext+' XP to next</div></div>'
      +'<div class="ins-section"><div class="ins-label">Badges</div><div class="badge-grid">'+badgesHtml+'</div></div>'
      +'<div class="ins-section"><div class="ins-label">Activity · last 18 weeks</div>'+heatmapHtml(18)
        +'<div class="hm-legend">Less <i class="hm lvl0"></i><i class="hm lvl1"></i><i class="hm lvl2"></i><i class="hm lvl3"></i><i class="hm lvl4"></i> More</div></div>'
      +'<div class="ins-section"><div class="ins-label">Progress by module</div>'+moduleBarsHtml()+'</div>'
      +'<div class="modal-actions"><span style="flex:1"></span><button class="btn primary" id="ins-close">Done</button></div>';
    insightsModal.classList.add('open');
    document.getElementById('ins-close').onclick=()=>insightsModal.classList.remove('open');
    document.getElementById('ins-goal').onchange=e=>{
      settings.weeklyGoal=Math.min(99,Math.max(1,parseInt(e.target.value)||5));
      saveData(); openInsights();
    };
  }
  document.getElementById('insights').addEventListener('click',openInsights);
  insightsModal.addEventListener('click',e=>{ if(e.target===insightsModal) insightsModal.classList.remove('open'); });

  // ---- ADD / EDIT MODAL ----
  const modal=document.getElementById('modal');
  let editing=null; // _id when editing, null when adding

  function moduleOptions(selected){
    return MODEL.map(s=>`<option value="${escapeAttr(s.title)}" ${s.title===selected?'selected':''}>${escapeHtml(s.display||s.title)}</option>`).join('')
      + `<option value="__new__" ${selected==='__new__'?'selected':''}>➕ New module…</option>`;
  }
  function topicOptions(moduleTitle, selected){
    const sec=MODEL.find(s=>s.title===moduleTitle);
    const titles=sec?sec.topics.map(t=>t.title):[];
    return titles.map(t=>`<option value="${escapeAttr(t)}" ${t===selected?'selected':''}>${escapeHtml(t)}</option>`).join('')
      + `<option value="__new__" ${selected==='__new__'?'selected':''}>➕ New sub-topic…</option>`;
  }
  function toggleNewInputs(){
    document.getElementById('m-newsection').classList.toggle('hidden', document.getElementById('m-section').value!=='__new__');
    document.getElementById('m-newtopic').classList.toggle('hidden', document.getElementById('m-topic').value!=='__new__');
  }
  function syncTopicSelect(){
    const mod=document.getElementById('m-section').value;
    const want=document.getElementById('m-topic').dataset.want||'';
    if(mod==='__new__'){
      document.getElementById('m-topic').innerHTML=`<option value="__new__" selected>➕ New sub-topic…</option>`;
    } else {
      document.getElementById('m-topic').innerHTML=topicOptions(mod, want||null);
    }
    document.getElementById('m-topic').dataset.want='';
    toggleNewInputs();
  }

  function openEditor(id, presetSection, presetTopic){
    editing=id;
    let item={t:'',link:'',stars:0}, section=presetSection||MODEL[0]?.title, topic=presetTopic||null;
    if(id){
      outer: for(const sec of MODEL){ for(const top of sec.topics){ const f=top.items.find(x=>x._id===id); if(f){item=f;section=sec.title;topic=top.title;break outer;} } }
    }
    document.getElementById('m-title').textContent = id?'Edit item':'Add item';
    document.getElementById('m-section').innerHTML = moduleOptions(section);
    document.getElementById('m-newsection').value='';
    document.getElementById('m-newtopic').value='';
    const topicSel=document.getElementById('m-topic');
    topicSel.dataset.want = (presetTopic==='__new__') ? '__new__' : (topic||'');
    syncTopicSelect();
    document.getElementById('m-text').value=item.t||'';
    document.getElementById('m-link').value=item.link||'';
    document.getElementById('m-stars').value=item.stars||0;
    document.getElementById('m-due').value=item.due||'';
    document.getElementById('m-note').value=item.note||'';
    document.getElementById('m-tags').value=(item.tags||[]).join(', ');
    document.getElementById('m-priority').checked=!!item.priority;
    if(id){
      document.getElementById('m-status').value=statusOf(item);
      document.getElementById('m-delete').classList.remove('hidden');
    } else {
      document.getElementById('m-status').value='todo';
      document.getElementById('m-delete').classList.add('hidden');
    }
    modal.classList.add('open');
    if(topicSel.value==='__new__') document.getElementById('m-newtopic').focus();
    else document.getElementById('m-text').focus();
  }
  function closeEditor(){ modal.classList.remove('open'); editing=null; }

  document.getElementById('m-section').addEventListener('change',syncTopicSelect);
  document.getElementById('m-topic').addEventListener('change',()=>{
    toggleNewInputs();
    if(document.getElementById('m-topic').value==='__new__') document.getElementById('m-newtopic').focus();
  });

  document.getElementById('m-save').addEventListener('click',()=>{
    const text=document.getElementById('m-text').value.trim();
    if(!text){ document.getElementById('m-text').focus(); return; }
    let section=document.getElementById('m-section').value;
    if(section==='__new__'){ section=document.getElementById('m-newsection').value.trim(); if(!section){document.getElementById('m-newsection').focus();return;} }
    let topic=document.getElementById('m-topic').value;
    if(topic==='__new__'){ topic=document.getElementById('m-newtopic').value.trim(); if(!topic){document.getElementById('m-newtopic').focus();return;} }
    if(!topic) topic='Added items';
    const link=document.getElementById('m-link').value.trim();
    const stars=parseInt(document.getElementById('m-stars').value)||0;
    const status=document.getElementById('m-status').value;
    const due=document.getElementById('m-due').value;       // '' or 'YYYY-MM-DD'
    const note=document.getElementById('m-note').value.trim();
    const tags=document.getElementById('m-tags').value.split(',').map(s=>s.trim()).filter(Boolean);
    const priority=document.getElementById('m-priority').checked;

    // due/note/tags/priority always set (incl. empty) so editing can clear them
    const payload={t:text, link:link||'', stars:stars||0, due:due||'', note:note||'', tags:tags, priority:priority};

    if(editing){
      const prev=statusOf(MODEL_ITEM(editing)||{});
      // record an edit override on existing id (built-in or custom)
      edits[editing]=Object.assign({}, edits[editing], payload);
      state[editing]=status;
      if(status==='done' && prev!=='done') logCompletion();
    } else {
      // append to custom[module][topic]
      if(!custom[section]) custom[section]={};
      if(!custom[section][topic]) custom[section][topic]=[];
      custom[section][topic].push(payload);
      // status: set after we know its id
      saveData();
      MODEL=buildModel();
      const sec=MODEL.find(s=>s.title===section);
      const top=sec&&sec.topics.find(t=>t.title===topic);
      const newId=top?top.items[top.items.length-1]._id:null;
      if(newId){ state[newId]=status; if(status==='done') logCompletion(); }
    }
    saveData(); saveState(); render(); closeEditor();
  });

  function deleteItem(id){
    if(!confirm('Delete this item?')) return;
    edits[id]=Object.assign({}, edits[id], {deleted:true});
    delete state[id];
    saveData(); saveState(); render();
  }
  document.getElementById('m-delete').addEventListener('click',()=>{ if(editing){ deleteItem(editing); closeEditor(); } });
  document.getElementById('m-cancel').addEventListener('click',closeEditor);
  modal.addEventListener('click',e=>{ if(e.target===modal) closeEditor(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(modal.classList.contains('open')) closeEditor(); if(tmodal.classList.contains('open')) closeTopicEditor(); if(smodal.classList.contains('open')) closeSectionEditor(); if(insightsModal.classList.contains('open')) insightsModal.classList.remove('open'); if(authModal.classList.contains('open')) closeAuthModal(); } });
  document.getElementById('add-global').addEventListener('click',()=>openEditor(null));

  // ===== Cloud sync + Google authentication =====
  // Each signed-in user owns exactly one row in `tracker_state`, keyed by their
  // auth user id and protected by Row-Level Security (see supabase/schema.sql).
  // Logged out, the app is fully usable and stores everything locally; signing in
  // pulls cloud data (or seeds the cloud from local on first login) and keeps both
  // in sync in realtime across devices.
  let sb=null, user=null, realtimeChan=null, syncTimer=null, applyingRemote=false;

  function cloudConfigured(){
    return !!SUPABASE_URL && !!SUPABASE_ANON_KEY && !!(window.supabase);
  }

  // --- account/status pill (bottom-right) ---
  const pill=document.createElement('button');
  pill.id='sync-pill';
  pill.style.cssText='position:fixed;right:16px;bottom:16px;z-index:9999;border:0;border-radius:999px;'
    +'padding:8px 14px;font:600 12px/1 Outfit,system-ui,sans-serif;cursor:pointer;color:#fff;'
    +'box-shadow:0 4px 14px rgba(0,0,0,.18);display:flex;gap:7px;align-items:center;letter-spacing:.02em;';
  document.body.appendChild(pill);
  pill.addEventListener('click',onPillClick);
  function setPill(kind,label){
    const c={ok:'#1f9d6b',sync:'#c98a16',err:'#d23f2f',off:'#6b7280',local:'#6b7280'}[kind]||'#6b7280';
    const dot=kind==='sync'?'◴':kind==='ok'?'✔':kind==='err'?'!':kind==='off'?'○':'•';
    pill.style.background=c; pill.textContent=dot+'  '+label;
  }
  function onPillClick(){
    if(!cloudConfigured()) return openAuthModal('unconfigured');
    openAuthModal(user?'account':'signin');
  }

  // --- auth modal ---
  const GOOGLE_SVG='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">'
    +'<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 4.5 29.5 2.5 24 2.5 12.1 2.5 2.5 12.1 2.5 24S12.1 45.5 24 45.5 45.5 35.9 45.5 24c0-1.2-.1-2.3-.4-3.5z"/>'
    +'<path fill="#FF3D00" d="M5 14.7l6.6 4.8C13.4 15.1 18.3 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 4.5 29.5 2.5 24 2.5 16 2.5 9.1 7 5 14.7z"/>'
    +'<path fill="#4CAF50" d="M24 45.5c5.4 0 10.3-2.1 14-5.4l-6.5-5.5C29.6 36 26.9 37 24 37c-5.2 0-9.6-3.3-11.3-8L6 33.9C10 41 16.4 45.5 24 45.5z"/>'
    +'<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C40.9 41.4 45.5 35.5 45.5 24c0-1.2-.1-2.3-.4-3.5z"/></svg>';
  const authModal=document.getElementById('authmodal');
  function openAuthModal(mode){
    const body=document.getElementById('auth-body');
    if(mode==='unconfigured'){
      body.innerHTML='<h3>Cloud sync not set up</h3>'
        +'<p class="auth-note">Add your Supabase URL and anon key to <code>config.js</code>, then run the SQL in <code>supabase/schema.sql</code>. Until then the tracker works locally in this browser.</p>'
        +'<div class="modal-actions"><span style="flex:1"></span><button class="btn ghost" id="auth-close">Close</button></div>';
    } else if(mode==='account'){
      body.innerHTML='<h3>Account</h3>'
        +'<p class="auth-note">Signed in as <strong>'+escapeHtml(user.email||user.id)+'</strong>. Your progress is backed up and syncs across your devices automatically.</p>'
        +'<div class="modal-actions"><button class="btn ghost" id="auth-signout">Sign out</button><span style="flex:1"></span><button class="btn primary" id="auth-close">Done</button></div>';
    } else {
      body.innerHTML='<h3>Sign in to sync</h3>'
        +'<p class="auth-note">Back up your progress and sync it across devices. Your data is private to your Google account.</p>'
        +'<button class="btn google-btn" id="auth-google">'+GOOGLE_SVG+'<span>Continue with Google</span></button>'
        +'<div class="modal-actions"><span style="flex:1"></span><button class="btn ghost" id="auth-close">Maybe later</button></div>';
    }
    authModal.classList.add('open');
    const close=document.getElementById('auth-close'); if(close) close.onclick=closeAuthModal;
    const g=document.getElementById('auth-google'); if(g) g.onclick=signInWithGoogle;
    const so=document.getElementById('auth-signout'); if(so) so.onclick=signOut;
  }
  function closeAuthModal(){ authModal.classList.remove('open'); }
  authModal.addEventListener('click',e=>{ if(e.target===authModal) closeAuthModal(); });

  async function signInWithGoogle(){
    try{
      const {error}=await sb.auth.signInWithOAuth({ provider:'google', options:{ redirectTo: window.location.href.split('#')[0] } });
      if(error) throw error;
    }catch(e){ console.error('[auth] google sign-in',e); setPill('err','Sign-in error'); }
  }
  async function signOut(){
    try{ await sb.auth.signOut(); }catch(e){ console.error('[auth] sign-out',e); }
    closeAuthModal();
  }

  function localSnapshot(){ return {custom,edits,topicEdits,sectionEdits,order,activity,settings,state}; }
  function isEmptySnapshot(d){
    if(!d) return true;
    return !Object.keys(d.custom||{}).length && !Object.keys(d.edits||{}).length
      && !Object.keys(d.topicEdits||{}).length && !Object.keys(d.order||{}).length
      && !Object.keys(d.activity||{}).length && !Object.keys(d.state||{}).length;
  }

  function applyRemote(d){
    custom = d.custom || {};
    edits  = d.edits  || {};
    topicEdits = d.topicEdits || {};
    sectionEdits = d.sectionEdits || {};
    order  = d.order  || {};
    activity = d.activity || {};
    settings = d.settings || {};
    state  = d.state  || {};
    try{ localStorage.setItem(DATA_KEY, JSON.stringify({custom,edits,topicEdits,sectionEdits,order,activity,settings})); }catch(e){}
    try{ localStorage.setItem(STATE_KEY, JSON.stringify(state)); }catch(e){}
    applyingRemote=true; render(); applyingRemote=false;
  }

  async function pull(){
    if(!sb||!user) return;
    try{
      setPill('sync','Syncing…');
      const {data,error}=await sb.from(TABLE).select('data').eq('user_id',user.id).maybeSingle();
      if(error) throw error;
      if(data && data.data && !isEmptySnapshot(data.data)){ applyRemote(data.data); setPill('ok','Synced'); }
      else { await push(); }   // no cloud data yet -> seed it from this browser
    }catch(e){ console.error('[sync] pull',e); setPill('err','Sync error'); }
  }

  async function push(){
    if(!sb||!user) return;
    try{
      setPill('sync','Saving…');
      const {error}=await sb.from(TABLE).upsert({user_id:user.id,data:localSnapshot(),updated_at:new Date().toISOString()});
      if(error) throw error;
      setPill('ok','Synced');
    }catch(e){ console.error('[sync] push',e); setPill('err','Sync error'); }
  }

  function scheduleSync(){
    if(!sb||!user||applyingRemote) return;
    clearTimeout(syncTimer);
    syncTimer=setTimeout(push,600);
  }

  function subscribe(){
    if(realtimeChan){ sb.removeChannel(realtimeChan); realtimeChan=null; }
    realtimeChan=sb.channel('tracker-'+user.id)
      .on('postgres_changes',{event:'*',schema:'public',table:TABLE,filter:'user_id=eq.'+user.id},payload=>{
        const d=payload.new && payload.new.data; if(!d) return;
        applyRemote(d); setPill('ok','Synced');
      })
      .subscribe();
  }

  async function onSignedIn(u){
    user=u; setPill('sync','Syncing…');
    await pull(); subscribe();
  }
  function onSignedOut(){
    user=null;
    if(realtimeChan){ sb.removeChannel(realtimeChan); realtimeChan=null; }
    setPill('off','Sign in to sync');
  }

  function initCloud(){
    if(!cloudConfigured()){ setPill('local','Local only'); return; }
    // Reuse the single client created by auth.js (the sign-in gate) when present,
    // so the page has exactly one Supabase client / auth session.
    sb=(window.LT_AUTH && window.LT_AUTH.client) || window.supabase.createClient(SUPABASE_URL.startsWith('http')?SUPABASE_URL:'https://'+SUPABASE_URL, SUPABASE_ANON_KEY);
    setPill('off','Sign in to sync');
    sb.auth.getSession().then(({data})=>{ if(data && data.session) onSignedIn(data.session.user); });
    sb.auth.onAuthStateChange((event,session)=>{
      if(session && session.user){ if(!user||user.id!==session.user.id) onSignedIn(session.user); }
      else if(user){ onSignedOut(); }
    });
  }

  render();
  initCloud();
})();
