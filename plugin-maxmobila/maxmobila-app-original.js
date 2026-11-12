const TODAY = new Date(2026, 8, 26);
const S = DATA.store, C = DATA.calc;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lei = n => Math.round(n).toLocaleString('ro-RO') + ' lei';
const byId = (a, id) => a.find(x => String(x.id) === String(id));
const I = {
  cart:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
  plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M12 5v14M5 12h14"/></svg>',
  phone:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  pin:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  arrow:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'
};

/* ---------- state derivat ---------- */
const CAT = Object.fromEntries(DATA.categories.map(c => [c.id, c]));
const ST = Object.fromEntries(DATA.states.map(s => [s.id, s]));
const P = DATA.products.map(p => {
  const cost = (p.buyEUR + C.transportEUR) / (1 - C.lossPct) * C.fx, mult = p.priceRON / cost;
  return { ...p, costRON: cost, profitRON: p.priceRON - cost, mult,
    verdict: mult >= C.good ? 'BUN' : mult >= C.marginal ? 'Marginal' : 'NU',
    disc: Math.round((1 - p.priceRON / p.newRON) * 100) };
});
const inCat = id => P.filter(p => p.cat === id);
const maxDisc = Math.max(...P.map(p => p.disc));
const avgDisc = Math.round(P.reduce((a, p) => a + p.disc, 0) / P.length);
const img = (p, cls) => `<img src="${IMGS[p.img]}" alt="${esc(p.name)}"${cls ? ` class="${cls}"` : ''}>`;
const stBadge = p => `<span class="st ${p.state}">${ST[p.state].name}</span>`;
const meta = p => [p.material, p.color].filter(Boolean).map(esc).join(' · ');

/* ---------- coș ---------- */
let CART = { items: {}, svc: {}, ship: null, pay: 'ramburs', type: 'pf' };
let FORM = {}, ERR = [], PQ = 1; const ORDERS = {};
try { const s = JSON.parse(localStorage.getItem('mx_cart') || 'null'); if (s) CART = { ...CART, ...s }; } catch (e) {}
const save = () => { try { localStorage.setItem('mx_cart', JSON.stringify(CART)); } catch (e) {} };
const lines = () => Object.entries(CART.items).map(([id, q]) => { const p = byId(P, id); return p ? { p, q, tot: p.priceRON * q } : null; }).filter(Boolean);
const count = () => lines().reduce((a, l) => a + l.q, 0);
function totals(){
  const L = lines(), sub = L.reduce((a, l) => a + l.tot, 0), was = L.reduce((a, l) => a + l.p.newRON * l.q, 0);
  const big = L.some(l => l.p.priceRON > DATA.shipping[0].maxRON);
  const ships = DATA.shipping.map(s => ({ ...s, disabled: s.id === 'curier' && big, cost: s.id !== 'ridicare' && sub >= S.freeShipOverRON ? 0 : s.priceRON }));
  let ship = byId(ships, CART.ship); if (!ship || ship.disabled) ship = big ? byId(ships, 'camion') : byId(ships, 'curier');
  const units = count();
  const svc = DATA.services.filter(s => CART.svc[s.id]).map(s => ({ ...s, q: units, tot: s.priceRON * units }));
  const svcTot = svc.reduce((a, s) => a + s.tot, 0);
  return { L, sub, was, big, ships, ship, svc, svcTot, total: sub + svcTot + (L.length ? ship.cost : 0) };
}
function add(id, q){ const p = byId(P, id); q = q || 1; CART.items[id] = Math.min(p.stock, (CART.items[id] || 0) + q); save(); renderTop(); toast(`Adăugat în coș: ${esc(p.name)}`, '#/cos', 'Vezi coșul'); }
function setQ(id, d){ const p = byId(P, id); const n = (CART.items[id] || 0) + d; if (n <= 0) delete CART.items[id]; else CART.items[id] = Math.min(p.stock, n); save(); render(true); }
function del(id){ delete CART.items[id]; save(); render(true); }
function toggleSvc(id){ CART.svc[id] = !CART.svc[id]; save(); render(true); }
function setShip(id){ CART.ship = id; save(); render(true); }
function setPay(id){ CART.pay = id; save(); render(true); }
function setType(t){ CART.type = t; save(); render(true); }
let tT; function toast(m, h, l){ const t = document.getElementById('toast'); t.innerHTML = `<span>${m}</span>${h ? `<a href="${h}">${l}</a>` : ''}`; t.classList.add('show'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('show'), 3000); }

/* ---------- chrome ---------- */
const logoHTML = `<span class="w">MOBE<b>X</b>A</span><span class="bar"><i></i><i></i><i></i></span><small>OUTLET · MOBILĂ DIN GERMANIA</small>`;
function renderTop(){
  const { page, q } = parse(); const cat = page === 'produse' ? q.get('cat') : page === 'produs' ? (byId(P, parse().id) || {}).cat : '';
  document.getElementById('promo').innerHTML = `<span>OUTLET · până la −${maxDisc}% față de prețul nou din Germania</span><span class="sp"></span><span class="o">Showroom & depozit în ${S.city} · Livrare în toată țara</span>`;
  document.getElementById('hdr').innerHTML = `<a class="logo" href="#/acasa" aria-label="Mobexa, acasă">${logoHTML}</a>
    <form class="search" onsubmit="event.preventDefault();go('#/produse?s='+encodeURIComponent(this.s.value))"><input id="s" name="s" placeholder="Caută: canapea, pat 160, masă extensibilă…" value="${page === 'produse' ? esc(q.get('s') || '') : ''}"><button>Caută</button></form>
    <div class="hlinks"><a class="hl" href="#/contact">${I.pin}<span class="t">Showroom</span></a><a class="hl cartb" href="#/cos">${I.cart}<span class="t">Coș</span>${count() ? `<span class="n">${count()}</span>` : ''}</a></div>`;
  document.getElementById('cats').innerHTML = DATA.categories.map(c => `<a href="#/produse?cat=${c.id}" class="${cat === c.id ? 'on' : ''}">${c.name}</a>`).join('') + `<a class="hot" href="#/produse?sort=disc">Reduceri −${maxDisc}%</a>`;
}
function renderStatic(){
  document.getElementById('ftr').innerHTML = `<div class="wrap"><div class="cols">
    <div><a class="logo" href="#/acasa">${logoHTML}</a><p style="font-size:14px;max-width:320px;margin-top:14px">Mobilă adusă direct din Germania: surplus de stoc, colecții trecute, retururi și expoziție. Showroom și depozit în ${S.city}.</p></div>
    <div><h5>Categorii</h5>${DATA.categories.slice(0, 6).map(c => `<a href="#/produse?cat=${c.id}">${c.name}</a>`).join('')}</div>
    <div><h5>Informații</h5><a href="#/despre">Cum funcționează outlet-ul</a><a href="#/acasa?f=1">Întrebări frecvente</a><a href="#/contact">Showroom & contact</a><a href="#/cos">Coșul meu</a></div>
    <div><h5>Contact</h5><span style="display:block;font-size:14px;user-select:all">${S.phone}</span><span style="display:block;font-size:14px;user-select:all">${S.email}</span><span style="display:block;font-size:14px">${S.address}</span></div>
  </div><div class="bot"><span>© ${TODAY.getFullYear()} Mobexa · Prototip — poze demonstrative, înlocuite cu produsele Mobexa la lansare</span></div></div>`;
}

/* ---------- componente ---------- */
const card = p => `<article class="pc">
  <a class="ph" href="#/produs/${p.id}">${img(p)}</a>
  <span class="tl">${stBadge(p)}</span><span class="tr off">−${p.disc}%</span>
  <div class="bd"><a href="#/produs/${p.id}"><h3>${esc(p.name)}</h3></a>
    <div class="meta">${meta(p)}${p.dims ? `<br>${esc(p.dims)}` : ''}</div>
    <div class="pr"><div><div class="was">Preț nou: <s>${lei(p.newRON)}</s></div><div class="price num">${lei(p.priceRON)}</div></div>
      <button class="addb" onclick="add('${p.id}')" aria-label="Adaugă în coș">${I.plus}</button></div></div></article>`;
const head = (title, sub, crumbs) => `<section class="pagehead"><div class="wrap"><div class="crumb"><a href="#/acasa">Acasă</a>${(crumbs || []).map(([h, l]) => ` / ${h ? `<a href="${h}">${l}</a>` : l}`).join('')}</div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></section>`;

/* ========================= VIEWS ========================= */
const V = {};
V.acasa = () => {
  const hero = [byId(P, 'm00'), byId(P, 'm43'), byId(P, 'm04')];
  const top = [...P].sort((a, b) => b.disc - a.disc).slice(0, 8);
  return `
<section class="hero"><div class="wrap g">
  <div><div class="eyebrow">Direct din Germania</div>
    <h1>Mobilă nemțească.<br><em>Preț de outlet.</em></h1>
    <p class="lead">Canapele, paturi, mese și dulapuri din surplusul magazinelor din Germania. Fiecare piesă are starea scrisă clar: nou, resigilat, expus sau cu mici defecte.</p>
    <div class="ctas"><a class="btn red" href="#/produse?sort=disc">Vezi reducerile ${I.arrow}</a><a class="btn outl" href="#/produse">Toate produsele</a></div>
    <div class="hstats"><div><b class="num">${P.length}</b><span>produse în stoc</span></div><div><b class="num">−${avgDisc}%</b><span>reducere medie</span></div><div><b>2 ani</b><span>garanție</span></div></div>
  </div>
  <div class="collage">${hero.map((p, i) => `<a class="tile ${i ? '' : 'big'}" href="#/produs/${p.id}">${img(p)}<span class="off">−${p.disc}%</span><span class="tag"><small>${lei(p.newRON)}</small><b class="num">${lei(p.priceRON)}</b></span></a>`).join('')}</div>
</div></section>

<section class="sec white"><div class="wrap">
  <div class="sh"><div><h2>Categorii</h2><p>Alege camera, noi avem piesa.</p></div><a class="more" href="#/produse">Toate cele ${P.length} de produse</a></div>
  <div class="catgrid">${DATA.categories.map(c => { const ps = inCat(c.id); return `<a class="cat" href="#/produse?cat=${c.id}"><span class="im">${img(ps[0])}</span><b>${c.name}</b><span>${ps.length} produse · de la ${lei(Math.min(...ps.map(p => p.priceRON)))}</span></a>`; }).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sh"><div><h2>Cele mai mari reduceri</h2><p>Față de prețul nou din Germania.</p></div><a class="more" href="#/produse?sort=disc">Vezi toate</a></div>
  <div class="grid">${top.map(card).join('')}</div>
</div></section>

<section class="sec white"><div class="wrap">
  <div class="sh"><div><h2>Știi exact ce cumperi</h2><p>Fiecare produs are una din cele 4 stări. Filtrezi după ea în catalog.</p></div></div>
  <div class="states">${DATA.states.map(s => `<a href="#/produse?st=${s.id}"><span class="st ${s.id}">${s.name}</span><b>${s.short}</b><p>${s.desc}</p><span class="cnt">${P.filter(p => p.state === s.id).length} produse ${I.arrow}</span></a>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap"><div class="band">
  <div><div class="eyebrow" style="color:var(--gold)">Showroom ${S.city}</div><h2>Vezi mobila pe viu înainte să o cumperi</h2><p>Toate produsele sunt în depozitul nostru. Sună, programăm vizita și testezi canapeaua înainte să plătești.</p></div>
  <div><div class="ph">${S.phone}</div><div class="row"><a class="btn red" href="tel:${S.phoneRaw}">Sună acum</a><a class="btn outl" href="#/contact" style="background:transparent;color:#fff;border-color:#fff">Programează vizita</a></div></div>
</div></div></section>

<section class="sec white" id="faq"><div class="wrap"><div class="sh"><div><h2>Întrebări frecvente</h2></div></div>
  <div class="faq">${DATA.faq.map(([qq, a], i) => `<details class="card" ${i ? '' : 'open'}><summary>${esc(qq)}</summary><div>${esc(a)}</div></details>`).join('')}</div>
</div></section>`;
};

V.produse = (q) => {
  const cat = q.get('cat') || '', st = q.get('st') || '', s = (q.get('s') || '').trim().toLowerCase(), max = +q.get('max') || 0, sort = q.get('sort') || 'rec';
  const base = P.filter(p => !s || (p.name + ' ' + p.material + ' ' + p.color + ' ' + CAT[p.cat].name).toLowerCase().includes(s));
  const f1 = base.filter(p => !cat || p.cat === cat);
  let list = f1.filter(p => (!st || p.state === st) && (!max || p.priceRON <= max));
  const sorts = { rec: (a, b) => a.cat.localeCompare(b.cat) || b.disc - a.disc, disc: (a, b) => b.disc - a.disc, pa: (a, b) => a.priceRON - b.priceRON, pd: (a, b) => b.priceRON - a.priceRON };
  list.sort(sorts[sort] || sorts.rec);
  const o = (k, v, l, n) => `<button class="opt ${String(q.get(k) || '') === String(v) ? 'on' : ''}" onclick="qset('${k}','${v}')">${l}${n != null ? `<em>${n}</em>` : ''}</button>`;
  const chips = [cat && ['cat', CAT[cat].name], st && ['st', ST[st].name], s && ['s', `„${esc(s)}”`], max && ['max', `sub ${lei(max)}`]].filter(Boolean);
  const title = cat ? CAT[cat].name : s ? `Rezultate: „${esc(s)}”` : sort === 'disc' ? 'Reduceri' : 'Toate produsele';
  return head(title, `${list.length} produse · reduceri de până la −${list.length ? Math.max(...list.map(p => p.disc)) : 0}%`, [['#/produse', 'Produse'], ...(cat ? [[null, CAT[cat].name]] : [])]) + `
  <div class="wrap shop"><aside class="filters">
    <h4>Categorie</h4>${o('cat', '', 'Toate', base.length)}${DATA.categories.map(c => o('cat', c.id, c.name, base.filter(p => p.cat === c.id).length)).join('')}
    <h4>Stare</h4>${o('st', '', 'Oricare')}${DATA.states.map(x => o('st', x.id, x.name, f1.filter(p => p.state === x.id).length)).join('')}
    <h4>Buget</h4>${o('max', '', 'Oricât')}${[300, 800, 1500, 3000].map(m => o('max', m, `până la ${lei(m)}`)).join('')}
  </aside><div>
    <div class="toolbar"><b>${list.length} produse</b><select class="inp" id="sort" onchange="qset('sort',this.value)">${[['rec','Recomandate'],['disc','Reducere maximă'],['pa','Preț crescător'],['pd','Preț descrescător']].map(([k, l]) => `<option value="${k}" ${sort === k ? 'selected' : ''}>Sortare: ${l}</option>`).join('')}</select></div>
    ${chips.length ? `<div class="chips">${chips.map(([k, l]) => `<button onclick="qset('${k}','')">${l} ✕</button>`).join('')}<button class="clr" onclick="go('#/produse')">Șterge filtrele</button></div>` : ''}
    ${list.length ? `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${list.map(card).join('')}</div>` : `<div class="empty"><h3>Niciun produs pentru filtrele alese</h3><p>Scoate un filtru sau sună-ne: poate avem piesa în depozit, încă nefotografiată.</p><button class="btn ink sm" onclick="go('#/produse')">Șterge filtrele</button></div>`}
  </div></div>`;
};

V.produs = (id) => {
  const p = byId(P, id); if (!p) return V.nf();
  const rel = inCat(p.cat).filter(x => x.id !== p.id).slice(0, 4), s = ST[p.state];
  return head(esc(p.name), null, [['#/produse', 'Produse'], [`#/produse?cat=${p.cat}`, CAT[p.cat].name]]).replace('<h1>', '<h1 style="display:none">') + `
  <div class="wrap"><div class="pp">
    <div><div class="gal">${img(p)}<span class="tl">${stBadge(p)}</span><span class="tr off">−${p.disc}%</span></div>
      <div class="trust"><div>Garanție ${S.warrantyYears} ani</div><div>Retur 14 zile</div><div>Vezi-l în showroom</div></div></div>
    <div><div class="eyebrow">${CAT[p.cat].name}</div><h1>${esc(p.name)}</h1><div class="meta">${meta(p)}</div>
      <div class="stbox ${p.state}">${stBadge(p)}<span>${s.desc}</span>${p.defect ? `<span class="def">Defect: ${esc(p.defect)}</span>` : ''}</div>
      <div class="pbox"><div class="was">Preț nou în Germania: <s>${lei(p.newRON)}</s></div>
        <div><span class="price num">${lei(p.priceRON)}</span><span class="save">Economisești ${lei(p.newRON - p.priceRON)}</span></div>
        <div class="vat">TVA inclus · montaj opțional ${lei(DATA.services[0].priceRON)}</div>
        <div class="qtyrow"><div class="qty"><button onclick="PQ=Math.max(1,PQ-1);document.getElementById('pq').textContent=PQ" aria-label="Mai puțin">−</button><span id="pq">${PQ}</span><button onclick="PQ=Math.min(${p.stock},PQ+1);document.getElementById('pq').textContent=PQ" aria-label="Mai mult">+</button></div>
          <button class="btn ink" style="flex:1" onclick="add('${p.id}',PQ)">${I.cart} Adaugă în coș</button><button class="btn red" onclick="add('${p.id}',PQ);go('#/checkout')">Cumpără acum</button></div>
        <div class="stock ${p.stock <= 1 ? 'low' : ''}">${p.stock <= 1 ? 'Ultima bucată' : `${p.stock} bucăți în depozit`} · ${S.city}</div></div>
      <details class="card" open style="margin-top:16px"><summary>Detalii produs</summary><div><table class="spec">
        ${[['Dimensiuni (L × Î × A)', p.dims || 'la cerere'], ['Material', p.material], ['Culoare', p.color], ['Stare', s.name + ' — ' + s.short], ['Garanție', `${S.warrantyYears} ani`], ['Cod produs', p.id.toUpperCase()]].map(([a, b]) => `<tr><td>${a}</td><td>${esc(b)}</td></tr>`).join('')}</table></div></details>
      <details class="card"><summary>Livrare și montaj</summary><div>${DATA.shipping.map(x => `<b>${x.name}</b>: ${x.priceRON ? lei(x.priceRON) : 'gratuit'} · ${x.days}${x.maxRON ? ` (produse sub ${lei(x.maxRON)})` : ''}`).join('<br>')}<br>Livrare gratuită pentru comenzi peste ${lei(S.freeShipOverRON)}. Montaj la domiciliu: ${lei(DATA.services[0].priceRON)} / produs.</div></details>
    </div></div></div>
  ${rel.length ? `<section class="sec white"><div class="wrap"><div class="sh"><h2>Din aceeași categorie</h2><a class="more" href="#/produse?cat=${p.cat}">Toate ${CAT[p.cat].name.toLowerCase()}</a></div><div class="grid">${rel.map(card).join('')}</div></div></section>` : ''}`;
};

const shipHTML = T => T.ships.map(s => `<button class="radio ${T.ship.id === s.id ? 'on' : ''} ${s.disabled ? 'dis' : ''}" ${s.disabled ? 'disabled' : `onclick="setShip('${s.id}')"`}><span class="dot"></span><span><b>${s.name}</b><small>${s.days}${s.disabled ? ` · doar pentru produse sub ${lei(s.maxRON)}` : ''}</small></span><span class="pr">${s.cost ? lei(s.cost) : 'Gratuit'}</span></button>`).join('');
const sumHTML = (T, act) => `<aside class="panel sum"><h3>Sumar comandă</h3>
  <div class="r"><span>Produse (${count()})</span><b class="num">${lei(T.sub)}</b></div>
  ${T.svc.map(s => `<div class="r"><span>${s.name} ×${s.q}</span><b class="num">${lei(s.tot)}</b></div>`).join('')}
  <div class="r"><span>${T.ship.name}</span><b class="num">${T.ship.cost ? lei(T.ship.cost) : 'Gratuit'}</b></div>
  <div class="r sv"><span>Economisești față de prețul nou</span><span class="num">${lei(T.was - T.sub)}</span></div>
  <div class="r t"><span>Total</span><span class="num">${lei(T.total)}</span></div>
  <div class="note">TVA inclus.${T.sub < S.freeShipOverRON ? ` Mai adaugă ${lei(S.freeShipOverRON - T.sub)} pentru livrare gratuită.` : ' Ai livrare gratuită.'}</div>${act}</aside>`;

V.cos = () => {
  const T = totals();
  if (!T.L.length) return head('Coșul tău', null, [[null, 'Coș']]) + `<div class="wrap" style="padding:40px 20px 70px"><div class="empty"><h3>Coșul e gol</h3><p>Începe cu cele mai mari reduceri sau alege o categorie.</p><a class="btn red" href="#/produse?sort=disc">Vezi reducerile</a></div></div>`;
  return head('Coșul tău', `${count()} produse · economisești ${lei(T.was - T.sub)}`, [[null, 'Coș']]) + `<div class="wrap two"><div style="display:grid;gap:16px">
    <div class="panel"><h3>Produse</h3>${T.L.map(({ p, q, tot }) => `<div class="line"><a class="im" href="#/produs/${p.id}">${img(p)}</a>
      <div><a href="#/produs/${p.id}"><h4>${esc(p.name)}</h4></a><div class="m">${stBadge(p)} · ${lei(p.priceRON)} / buc.</div><button class="link" onclick="del('${p.id}')">Șterge</button></div>
      <div class="qty" style="height:40px"><button onclick="setQ('${p.id}',-1)" aria-label="Mai puțin">−</button><span>${q}</span><button onclick="setQ('${p.id}',1)" ${q >= p.stock ? 'disabled' : ''} aria-label="Mai mult">+</button></div><div class="tot num">${lei(tot)}</div></div>`).join('')}</div>
    <div class="panel"><h3>Servicii</h3>${DATA.services.map(s => `<label class="check"><input type="checkbox" id="svc-${s.id}" ${CART.svc[s.id] ? 'checked' : ''} onchange="toggleSvc('${s.id}')"><span><b>${s.name}</b> — ${lei(s.priceRON)} / produs</span></label>`).join('')}</div>
    <div class="panel"><h3>Livrare</h3>${shipHTML(T)}</div></div>
    ${sumHTML(T, `<a class="btn red block" href="#/checkout">Finalizează comanda ${I.arrow}</a><a class="btn outl block" href="#/produse" style="margin-top:8px">Continuă cumpărăturile</a>`)}</div>`;
};

const JUD = ['Alba','Arad','Argeș','Bacău','Bihor','Bistrița-Năsăud','Botoșani','Brașov','Brăila','București','Buzău','Caraș-Severin','Călărași','Cluj','Constanța','Covasna','Dâmbovița','Dolj','Galați','Giurgiu','Gorj','Harghita','Hunedoara','Ialomița','Iași','Ilfov','Maramureș','Mehedinți','Mureș','Neamț','Olt','Prahova','Satu Mare','Sălaj','Sibiu','Suceava','Teleorman','Timiș','Tulcea','Vaslui','Vâlcea','Vrancea'];
V.checkout = () => {
  const T = totals(); if (!T.L.length) return V.cos();
  const f = (k, l, req, x) => { x = x || {}; const cls = `inp ${ERR.includes(k) ? 'err' : ''}`;
    const ctl = x.select ? `<select id="f-${k}" class="${cls}" onchange="FORM.${k}=this.value"><option value="">Alege…</option>${x.select.map(o => `<option ${FORM[k] === o ? 'selected' : ''}>${o}</option>`).join('')}</select>`
      : x.area ? `<textarea id="f-${k}" class="inp" rows="3" oninput="FORM.${k}=this.value" placeholder="${x.ph || ''}">${esc(FORM[k])}</textarea>`
      : `<input id="f-${k}" class="${cls}" value="${esc(FORM[k])}" oninput="FORM.${k}=this.value" placeholder="${x.ph || ''}" type="${x.type || 'text'}">`;
    return `<div class="${x.full ? 'full' : ''}"><label for="f-${k}">${l}${req ? ' <i>*</i>' : ''}</label>${ctl}</div>`; };
  return head('Finalizează comanda', 'O singură pagină. Te sunăm în 24h să confirmăm livrarea.', [['#/cos', 'Coș'], [null, 'Comandă']]) + `<div class="wrap two"><div style="display:grid;gap:16px">
    ${ERR.length ? `<div class="alert err">Completează câmpurile marcate cu roșu${ERR.includes('terms') ? ' și bifează acordul cu termenii' : ''}.</div>` : ''}
    <div class="panel"><h3>1. Datele tale</h3><div class="tog"><button class="${CART.type === 'pf' ? 'on' : ''}" onclick="setType('pf')">Persoană fizică</button><button class="${CART.type === 'pj' ? 'on' : ''}" onclick="setType('pj')">Firmă</button></div>
      <div class="frm">${CART.type === 'pj' ? f('firma', 'Denumire firmă', 1, { ph: 'SC Exemplu SRL' }) + f('cui', 'CUI', 1, { ph: 'RO12345678' }) : ''}
      ${f('nume', 'Nume și prenume', 1, { ph: 'Maria Ionescu' })}${f('tel', 'Telefon', 1, { ph: '07xx xxx xxx', type: 'tel' })}${f('email', 'Email', 1, { ph: 'nume@email.ro', type: 'email', full: 1 })}
      ${f('jud', 'Județ', 1, { select: JUD })}${f('loc', 'Localitate', 1, { ph: 'Satu Mare' })}${f('adr', 'Adresă de livrare', 1, { ph: 'Strada, număr, bloc, etaj, apartament', full: 1 })}
      ${f('obs', 'Observații (opțional)', 0, { area: 1, full: 1, ph: 'Ex: etaj 4 fără lift, sunați cu o zi înainte…' })}</div></div>
    <div class="panel"><h3>2. Livrare</h3>${shipHTML(T)}</div>
    <div class="panel"><h3>3. Plată</h3>${DATA.payments.map(m => `<button class="radio ${CART.pay === m.id ? 'on' : ''}" onclick="setPay('${m.id}')"><span class="dot"></span><span><b>${m.name}</b><small>${m.note}</small></span></button>`).join('')}
      ${CART.pay === 'card' ? '<div class="alert info">Pe site-ul real, aici se deschide pagina securizată a procesatorului de plăți. În prototip nu se încasează nimic.</div>' : ''}
      <label class="check" style="margin-top:12px"><input type="checkbox" id="terms" ${FORM.terms ? 'checked' : ''} onchange="FORM.terms=this.checked"><span>Sunt de acord cu termenii și condițiile și am citit starea fiecărui produs din coș. <i style="color:var(--red);font-style:normal">*</i></span></label></div>
  </div>${sumHTML(T, `<button class="btn red block" onclick="placeOrder()">Plasează comanda · ${lei(T.total)}</button><div class="note" style="text-align:center;margin:10px 0 0">Prototip: nu se încasează nimic.</div>`)}</div>`;
};
function placeOrder(){
  const req = ['nume', 'tel', 'email', 'jud', 'loc', 'adr'].concat(CART.type === 'pj' ? ['firma', 'cui'] : []);
  ERR = req.filter(k => !String(FORM[k] || '').trim());
  if (FORM.email && !/^\S+@\S+\.\S+$/.test(FORM.email)) ERR.push('email');
  if (FORM.tel && String(FORM.tel).replace(/\D/g, '').length < 10) ERR.push('tel');
  if (!FORM.terms) ERR.push('terms');
  if (ERR.length){ render(true); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const id = 'MX-' + (41000 + Object.keys(ORDERS).length + 1);
  ORDERS[id] = { id, T: totals(), form: { ...FORM }, pay: byId(DATA.payments, CART.pay), type: CART.type };
  CART.items = {}; CART.svc = {}; save(); go('#/comanda/' + id);
}
V.comanda = (id) => { const o = ORDERS[id]; if (!o) return V.nf('Comanda nu mai e în memorie. Prototipul nu salvează comenzile după refresh.');
  return `<div class="wrap"><div class="ok"><div class="ic">✓</div><div class="eyebrow">Comanda ${id}</div><h1>Mulțumim, ${esc(o.form.nume.split(' ')[0])}!</h1><p style="color:var(--mut)">Confirmarea a plecat pe <b>${esc(o.form.email)}</b>. Ai economisit <b style="color:var(--red)">${lei(o.T.was - o.T.sub)}</b> față de prețul nou.</p></div>
  <div class="steps4"><div><i>1</i><b>Te sunăm</b><span>În 24h la ${esc(o.form.tel)}, confirmăm stocul și data.</span></div><div><i>2</i><b>${o.pay.id === 'op' ? 'Proforma' : 'Pregătim marfa'}</b><span>${o.pay.id === 'op' ? 'O primești pe email; livrăm după plată.' : 'Verificăm și ambalăm fiecare piesă.'}</span></div><div><i>3</i><b>Livrare</b><span>${o.T.ship.name} · ${o.T.ship.days}.</span></div><div><i>4</i><b>${o.T.svc.length ? 'Montaj' : 'Gata'}</b><span>${o.T.svc.length ? 'Echipa noastră montează la tine acasă.' : 'Garanție 2 ani pe tot.'}</span></div></div>
  <div class="two" style="padding-top:0"><div class="panel"><h3>Produse</h3>${o.T.L.map(({ p, q, tot }) => `<div class="line"><div class="im">${img(p)}</div><div><h4>${esc(p.name)}</h4><div class="m">${q} × ${lei(p.priceRON)}</div></div><div></div><div class="tot num">${lei(tot)}</div></div>`).join('')}
  <p style="font-size:13.5px;color:var(--mut)"><b>Livrare la:</b> ${esc(o.form.adr)}, ${esc(o.form.loc)}, jud. ${esc(o.form.jud)}${o.type === 'pj' ? `<br><b>Factură:</b> ${esc(o.form.firma)} (${esc(o.form.cui)})` : ''}<br><b>Plată:</b> ${o.pay.name}</p></div>
  <aside class="panel"><div class="sum" style="position:static"><div class="r t" style="border:0;margin:0;padding:0"><span>Total</span><span class="num">${lei(o.T.total)}</span></div></div><a class="btn ink block" href="#/acasa" style="margin-top:14px">Înapoi la magazin</a></aside></div></div>`; };

V.despre = () => head('Cum funcționează outlet-ul', 'De unde vine mobila și ce înseamnă fiecare stare.', [[null, 'Despre']]) + `
<section class="sec"><div class="wrap" style="display:grid;gap:22px;max-width:980px">
  <div class="panel"><h3>De unde vine mobila</h3><p style="margin:0">Cumpărăm direct din Germania surplus de stoc, colecții scoase din catalog, retururi și mobilier din expoziție. Marfa ajunge în depozitul nostru din ${S.city}, o verificăm bucată cu bucată, o fotografiem și o punem pe site cu starea ei reală.</p></div>
  <div class="states">${DATA.states.map(s => `<a href="#/produse?st=${s.id}"><span class="st ${s.id}">${s.name}</span><b>${s.short}</b><p>${s.desc}</p></a>`).join('')}</div>
  <div class="panel"><h3>De ce e mai ieftin</h3><p style="margin:0">Magazinele din Germania plătesc depozitare pentru fiecare zi în care o canapea nu se vinde. Pentru ele e mai ieftin să elibereze spațiul. Noi o cumpărăm la preț de lot și o vindem cu o reducere medie de ${avgDisc}% față de prețul nou.</p></div>
</div></section>`;

V.contact = () => head('Showroom & contact', `Vino să vezi mobila pe viu, în ${S.city}.`, [[null, 'Contact']]) + `
<section class="sec"><div class="wrap two" style="padding-block:0">
  <div class="panel"><h3>Programează o vizită sau pune o întrebare</h3>
    <form class="frm" onsubmit="event.preventDefault();this.reset();toast('Mesaj trimis. Revenim în 24h (demo)')">
      <div><label for="c-n">Nume <i>*</i></label><input id="c-n" class="inp" required placeholder="Maria Ionescu"></div>
      <div><label for="c-t">Telefon <i>*</i></label><input id="c-t" class="inp" required placeholder="07xx xxx xxx"></div>
      <div class="full"><label for="c-s">Subiect</label><select id="c-s" class="inp"><option>Vreau să văd un produs în showroom</option><option>Întrebare despre un produs</option><option>Livrare / montaj</option><option>Altceva</option></select></div>
      <div class="full"><label for="c-m">Mesaj</label><textarea id="c-m" class="inp" rows="4" placeholder="Ex: aș vrea să văd colțarul Bruno sâmbătă dimineață"></textarea></div>
      <div class="full"><button class="btn red block">Trimite</button></div></form></div>
  <aside class="panel" style="display:grid;gap:14px">
    <div><div class="eyebrow">Telefon</div><div style="font:900 24px var(--fd);user-select:all">${S.phone}</div></div>
    <div><div class="eyebrow">Email</div><div style="font-weight:800;user-select:all">${S.email}</div></div>
    <div><div class="eyebrow">Adresă</div><div style="font-weight:700">${S.address}</div></div>
    <div><div class="eyebrow">Program</div><div>Luni–Vineri 9–18 · Sâmbătă 9–14</div></div>
    <a class="btn outl" href="https://www.google.com/maps/search/?api=1&query=Satu+Mare" target="_blank" rel="noopener">${I.pin} Deschide în Google Maps</a>
  </aside></div></section>`;

V.intern = () => V.nf('Aceast? pagin? a fost scoas? din func?iune.');
V.nf = (m) => `<div class="wrap" style="padding:70px 20px"><div class="empty"><h3>Pagina nu a fost găsită</h3><p>${m || 'Linkul nu mai e valid.'}</p><a class="btn ink" href="#/acasa">Înapoi acasă</a></div></div>`;

/* ========================= ROUTER ========================= */
function parse(){ const m = (location.hash || '#/acasa').match(/^#\/([a-z]+)(?:\/([\w-]+))?(?:\?(.*))?$/) || [, 'acasa']; return { page: m[1], id: m[2], q: new URLSearchParams(m[3] || '') }; }
function qset(k, v){ const { page, id, q } = parse(); if (v === '' || v == null) q.delete(k); else q.set(k, v); const s = q.toString(); go(`#/${page}${id ? '/' + id : ''}${s ? '?' + s : ''}`); }
function go(h){ if (location.hash === h) render(); else location.hash = h; }
let LAST = '';
function render(keep){
  const { page, id, q } = parse(), key = page + '/' + (id || ''), y = window.scrollY;
  if (key !== LAST){ PQ = 1; if (page !== 'checkout') ERR = []; }
  const v = document.getElementById('view');
  v.innerHTML = (page === 'produs' || page === 'comanda') ? V[page](id) : (V[page] || V.acasa)(q);
  renderTop();
  if (keep || key === LAST) window.scrollTo(0, y);
  else if (page === 'acasa' && q.get('f')) document.getElementById('faq').scrollIntoView();
  else window.scrollTo(0, 0);
  LAST = key;
}
window.addEventListener('hashchange', () => render());
renderStatic(); render();