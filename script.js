'use strict';
/* =========================================================
   作文マスター・クエスト  script.js  ―― ゲームのしくみ
   ---------------------------------------------------------
   ・もんだいは data.js に あります（ここは 書きかえなくて OK）
   ・つくり： セーブ → がめん → げんこう用紙 → もんだい → バトル → きろく
   ========================================================= */

/* ========== 0. ちいさな どうぐ ========== */
const $  = (id) => document.getElementById(id);
const ce = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

/* 画像を 読みこめない ときだけ、もとの 絵文字を 見せる */
function setCharacter(el, character) {
  if (!el || !character) return el;
  el.innerHTML = '';
  el.classList.add('character-slot');
  el.classList.remove('is-loaded');
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', character.name);

  const fallback = ce('span', 'character-fallback');
  fallback.textContent = character.emoji || '？';
  el.appendChild(fallback);

  if (character.img) {
    const img = ce('img', 'character-art');
    img.alt = '';
    img.draggable = false;
    img.addEventListener('load', () => el.classList.add('is-loaded'), { once: true });
    img.addEventListener('error', () => {
      el.classList.remove('is-loaded');
      img.remove();
    }, { once: true });
    img.src = character.img;
    el.appendChild(img);
  }
  return el;
}
function characterEl(character, cls) {
  return setCharacter(ce('span', cls), character);
}
function hydrateCharacters(root) {
  (root || document).querySelectorAll('[data-character]').forEach(el => {
    setCharacter(el, CHARACTERS[el.dataset.character]);
    delete el.dataset.character;
  });
}

/* ========== 1. セーブデータ（LocalStorage） ========== */
const SAVE_KEY = 'sakubun-quest-v1';

function blankSave() {
  return {
    version: 1,
    power: 0,          // 作文パワー
    worlds: {},        // w1:{ cleared:true, stars:3, first:6, total:7 }
    categories: {},    // genkou:{ first:5, total:7 }
    variants: {},      // RULE-001: 直前に 出した もんだいパターン
    asked: {},         // RULE-001: 何回 出したか（まだ 出て いない もんだいを ゆうせん）
    check: {},         // 作文チェックの チェック じょうたい
    sound: true
  };
}
let save = loadSave();

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return Object.assign(blankSave(), JSON.parse(raw));
  } catch (e) { /* つかえない ときは 何もしない */ }
  return blankSave();
}
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {}
}
function addPower(n) {
  save.power += n;
  $('power-num').textContent = save.power;
  persist();
}
/* カテゴリ（身につき度）の きろく */
function bumpCategory(cat, first) {
  const c = save.categories[cat] || (save.categories[cat] = { first: 0, total: 0 });
  c.total++;
  if (first) c.first++;
  persist();
}
/* 星の 計算：一回で 正かい できた わりあい */
/* ========= ステージの 解放（前を クリアすると つぎが ひらく）========= */
function isWorldUnlocked(worldId) {
  const i = WORLDS.findIndex(w => w.id === worldId);
  if (i <= 0) return true;                       // WORLD 1 は さいしょから ひらいて いる
  return !!(save.worlds[WORLDS[i - 1].id] || {}).cleared;
}
function prevWorldOf(worldId) {
  const i = WORLDS.findIndex(w => w.id === worldId);
  return i > 0 ? WORLDS[i - 1] : null;
}
function nextWorldOf(worldId) {
  const i = WORLDS.findIndex(w => w.id === worldId);
  return (i >= 0 && i + 1 < WORLDS.length) ? WORLDS[i + 1] : null;
}

/* ========= 1回の バトルに 出す もんだいを えらぶ =========
   ワールドには もんだいが たくさん あるので、1回では ぜんぶ 出しません。
   まだ 出て いない もんだいから ゆうせんして えらぶので、
   くりかえし あそぶと ワールドじゅうの もんだいに 出会えます。 */
const QUESTIONS_PER_BATTLE = 10;
function pickQuestions(worldId) {
  const pool = RULES.filter(r => r.world === worldId);
  if (!pool.length) return [];
  const asked = save.asked || (save.asked = {});
  const chosen = pool
    .map(r => ({ r: r, n: asked[r.id] || 0, k: Math.random() }))
    .sort((a, b) => (a.n - b.n) || (a.k - b.k))   // 出した回数が 少ない ものから
    .slice(0, Math.min(QUESTIONS_PER_BATTLE, pool.length))
    .map(x => x.r);
  chosen.forEach(r => { asked[r.id] = (asked[r.id] || 0) + 1; });
  const order = shuffledIndexes(chosen.length);   // 出る じゅんばんも まぜる
  return order.map(i => chosen[i]).map(materializeQuestion);
}

function starsFor(first, total) {
  if (!total) return 0;
  const r = first / total;
  if (r >= 0.95) return 5;
  if (r >= 0.8)  return 4;
  if (r >= 0.6)  return 3;
  if (r >= 0.4)  return 2;
  return 1;
}
const starStr = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
const totalStars = () => WORLDS.reduce((s, w) => s + ((save.worlds[w.id] || {}).stars || 0), 0);

/* ========== 2. 音（がいぶファイル なしの かんたんな音） ========== */
const Sound = {
  ctx: null,
  init() {
    if (this.ctx) return;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  },
  tone(freq, t0, dur, type, vol) {
    if (!save.sound || !this.ctx) return;
    const ctx = this.ctx, now = ctx.currentTime + t0;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(vol || 0.12, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(now); o.stop(now + dur + 0.03);
  },
  tap()  { this.tone(720, 0, 0.08, 'sine', 0.07); },
  ok()   { this.tone(880, 0, 0.12); this.tone(1320, 0.09, 0.2); },
  ng()   { this.tone(320, 0, 0.16, 'triangle', 0.09); },
  win()  { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * 0.12, 0.32)); }
};

/* ========== 3. がめんの きりかえ ========== */
const SCREENS = ['title', 'map', 'battle', 'result', 'check', 'record'];
let current = 'title';

function go(name) {
  SCREENS.forEach(s => $('screen-' + s).classList.toggle('is-active', s === name));
  current = name;
  $('btn-back').classList.toggle('is-on', name !== 'title');
  window.scrollTo(0, 0);
  if (name === 'map')    renderMap();
  if (name === 'check')  renderCheck();
  if (name === 'record') renderRecord();
  if (name !== 'battle') { document.body.style.removeProperty('--w'); hideVerdict(); }
  requestAnimationFrame(fitAllGenkou);
}
function back() {
  if (current === 'battle') { hideVerdict(); go('map'); return; }
  if (current === 'result') { go('map'); return; }
  go('title');
}

/* ========== 4. げんこう用紙 びょうが ========== */
const RE_PUNCT = /[、。]/;
const RE_SMALL = /[ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ]/;

/* 1行の 文字を マスに 分ける
   ・行の さいごに あふれた「、」「。」は 前の字と 同じマスへ
   ・「。」の あとの「」」も 同じマスへ                        */
function rowToCells(row, cols, merge) {
  const cells = [];
  for (const ch of row) {
    const last = cells[cells.length - 1];
    if (merge !== false && last) {
      if (ch === '」' && !last.sub && RE_PUNCT.test(last.main)) { last.sub = ch; last.kind = 'pair'; continue; }
      if (RE_PUNCT.test(ch) && !last.sub && cells.length >= cols) { last.sub = ch; last.kind = 'tail'; continue; }
    }
    cells.push({ main: ch });
  }
  return cells;
}
function cellEl(c, r, ci, opts) {
  const d = ce('div', 'gcell');
  d.dataset.r = r; d.dataset.c = ci;
  const m = c.main || '';
  if (m && m !== '　') {
    const s = ce('span', 'gc-main');
    s.textContent = m;
    d.appendChild(s);
    if (RE_PUNCT.test(m)) d.classList.add('k-punct');
    else if (RE_SMALL.test(m)) d.classList.add('k-small');
  }
  if (c.sub) {
    const s2 = ce('span', 'gc-sub');
    s2.textContent = c.sub;
    d.appendChild(s2);
  }
  if (c.kind === 'pair') d.classList.add('k-pair');
  if (c.kind === 'tail') d.classList.add('k-tail');
  if (opts.tapable) d.classList.add('tapable');
  return d;
}
/* げんこう用紙を つくる。opts.onCell(r,c,el) で マスの タップを うけとる */
function genkouEl(spec, opts) {
  opts = opts || {};
  const cols = spec.cols || 20;
  const rows = spec.rows || [];
  const nRows = Math.max(spec.minRows || 0, rows.length);
  const g = ce('div', 'genkou');
  g.dataset.chars = cols;        // 1行の 文字数（たてに ならぶ マスの数）
  g.dataset.lines = nRows;       // 行の数（右から 左へ ならぶ）
  g.style.setProperty('--chars', cols);
  g.style.setProperty('--lines', nRows);
  for (let r = 0; r < nRows; r++) {
    const cells = rowToCells(rows[r] || '', cols, spec.merge);
    if (cells.length > cols) cells.length = cols;   // 書きすぎ ぼうし
    while (cells.length < cols) cells.push({ main: '' });
    cells.forEach((c, ci) => g.appendChild(cellEl(c, r, ci, opts)));
  }
  if (opts.onCell) {
    g.addEventListener('click', (e) => {
      const t = e.target.closest ? e.target.closest('.gcell') : null;
      if (t && g.contains(t)) opts.onCell(+t.dataset.r, +t.dataset.c, t);
    });
  }
  return g;
}
function genkouWrap(spec, opts) {
  opts = opts || {};
  const w = ce('div', 'genkou-wrap' + (opts.big ? ' is-big' : '') + (opts.sample ? ' is-sample' : ''));
  w.appendChild(genkouEl(spec, opts));
  if (!opts.label) return w;
  /* 「お手本」などの 見出しを 上に つける */
  const box = ce('div', 'genkou-box');
  const lb = ce('p', 'genkou-label');
  lb.textContent = opts.label;
  box.appendChild(lb);
  box.appendChild(w);
  return box;
}
/* マスの 大きさを 計算する
   たて書きなので「よこ＝行の数」「たて＝1行の文字数」で 大きさが きまる。
   画面から はみ出さないように、たて・よこ 両方から 小さいほうを えらぶ。 */
function fitAllGenkou() {
  const vh = window.innerHeight || 800;
  document.querySelectorAll('.genkou').forEach(g => {
    const chars = +g.dataset.chars || 20;
    const lines = +g.dataset.lines || 1;
    const wrap = g.parentElement;
    const availW = ((wrap ? wrap.clientWidth : g.clientWidth) || 300) - 16;
    let maxH, maxCell;
    if (wrap && wrap.classList.contains('is-sample')) { maxH = Math.min(vh * 0.62, 640); maxCell = 34; }
    else if (g.closest('.ans'))                       { maxH = Math.min(vh * 0.34, 340); maxCell = 40; }
    else if (wrap && wrap.classList.contains('is-big')){ maxH = Math.min(vh * 0.40, 380); maxCell = 46; }
    else                                              { maxH = Math.min(vh * 0.40, 380); maxCell = 44; }
    const cell = Math.max(14, Math.min(maxCell, availW / lines, maxH / chars));
    g.style.setProperty('--cell', (Math.floor(cell * 10) / 10) + 'px');
  });
}
let fitTimer = null;
window.addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitAllGenkou, 80); });
window.addEventListener('orientationchange', () => setTimeout(fitAllGenkou, 250));

/* ========== 5. ワールドマップ ========== */
function renderMap() {
  const list = $('world-list');
  list.innerHTML = '';
  WORLDS.forEach(w => {
    const rec = save.worlds[w.id] || {};
    const open = isWorldUnlocked(w.id);
    const prev = prevWorldOf(w.id);
    const card = ce('button', 'world-card' + (open ? '' : ' is-locked'));
    card.style.setProperty('--w', w.color);
    card.innerHTML =
      '<div class="wc-main">' +
        '<span class="wc-no">WORLD ' + w.no + '</span>' +
        '<div class="wc-name">' + w.name + '</div>' +
        '<div class="wc-theme">' +
          (open ? w.theme : '🔒 WORLD ' + prev.no + 'を クリアすると ひらくよ') +
        '</div>' +
        '<div class="wc-stars">' + starStr(rec.stars || 0) + '</div>' +
      '</div>' +
      (rec.cleared ? '<span class="wc-clear">クリア</span>'
                   : (open ? '' : '<span class="wc-lock">🔒</span>'));
    const visual = ce('span', 'wc-visual');
    visual.appendChild(characterEl(w.enemy, 'wc-character'));
    const badge = ce('span', 'wc-world-icon');
    badge.textContent = w.emoji;
    visual.appendChild(badge);
    card.insertBefore(visual, card.firstChild);
    card.addEventListener('click', () => {
      if (!isWorldUnlocked(w.id)) {              // まだ ひらいて いない ステージ
        Sound.ng();
        card.classList.remove('is-shake');
        void card.offsetWidth;                   // アニメを やりなおす ための おまじない
        card.classList.add('is-shake');
        $('map-talk').textContent =
          'WORLD ' + prev.no + '「' + (prev.plain || prev.name) + '」を クリアすると ひらくよ。';
        return;
      }
      Sound.tap();
      startBattle(w.id);
    });
    list.appendChild(card);
  });
  const t = totalStars();
  const openCount = WORLDS.filter(w => isWorldUnlocked(w.id)).length;
  $('map-talk').textContent = t
    ? 'いま 星が ' + t + 'こ！ ' + (openCount < WORLDS.length
        ? 'クリアすると つぎの ステージが ひらくよ。'
        : 'ぜんぶの ステージが ひらいて いるよ！')
    : 'まずは WORLD 1 から。クリアすると つぎの ステージが ひらくよ。';
}

/* ========== 6. バトル ========== */
const battle = { world: null, qs: [], idx: 0, hp: 0, maxHp: 0, dmg: 10, first: 0, tries: 0, locked: false };

/* 同じルールでも、文と こたえの ばしょを かえて 出す */
function shuffledIndexes(length) {
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

function materializeQuestion(rule) {
  const variants = (typeof RULE_VARIANTS !== 'undefined' && RULE_VARIANTS[rule.id]) || [];
  const count = variants.length + 1; // 0 は もとの もんだい
  const last = save.variants[rule.id];
  const candidates = Array.from({ length: count }, (_, i) => i).filter(i => count < 2 || i !== last);
  const variantIndex = candidates[Math.floor(Math.random() * candidates.length)];
  save.variants[rule.id] = variantIndex;

  const q = Object.assign({}, rule, variantIndex ? variants[variantIndex - 1] : {});
  q.variantIndex = variantIndex;

  /* 正かいが「いつも B」のように ならないよう、せんたくしを まぜる */
  if (q.choices && q.choices.length > 1) {
    const order = shuffledIndexes(q.choices.length);
    const correct = q.answers ? q.answers.slice() : [q.answer];
    q.choices = order.map(i => q.choices[i]);
    const remapped = correct.map(i => order.indexOf(i));
    if (q.answers) q.answers = remapped;
    else q.answer = remapped[0];
  }

  /* ならべかえも、カードが いつも 同じ位置に 出ないようにする */
  if (q.items && q.answer) {
    const order = shuffledIndexes(q.items.length);
    q.items = order.map(i => q.items[i]);
    q.answer = q.answer.map(i => order.indexOf(i));
  }
  return q;
}

function startBattle(worldId) {
  const w = WORLDS.find(x => x.id === worldId);
  if (!w || !isWorldUnlocked(worldId)) return;   // ひらいて いない ステージには 入れない
  const qs = pickQuestions(worldId);
  if (!qs.length) return;
  battle.world = w;
  battle.qs = qs;
  battle.idx = 0;
  battle.first = 0;
  battle.tries = 0;
  battle.dmg = 10;
  battle.maxHp = qs.length * battle.dmg;
  battle.hp = battle.maxHp;
  persist();
  document.body.style.setProperty('--w', w.color);
  setCharacter($('enemy-face'), w.enemy);
  $('enemy-name').textContent = (w.boss ? '👑 ' : '') + w.enemy.name;
  $('hp-fill').style.width = '100%';
  hideVerdict();
  go('battle');
  renderQuestion();
}

function renderQuestion() {
  const q = battle.qs[battle.idx];
  battle.tries = 0;
  battle.locked = false;
  $('q-count').textContent = (battle.idx + 1) + 'もん目 / ' + battle.qs.length + 'もん';
  setTalk(q.question);
  const body = $('q-body');
  const ans = $('answers');
  body.innerHTML = '';
  ans.innerHTML = '';
  ans.className = 'answers';

  /* 見せる 作文（あれば） */
  if (q.statement) {
    const s = ce('div', 'statement');
    s.textContent = q.statement;
    body.appendChild(s);
  }
  if (q.manuscript && q.questionType !== 'find') {
    body.appendChild(genkouWrap(q.manuscript, { big: true, label: q.manuscriptLabel }));
  }

  (RENDER[q.questionType] || RENDER.choice)(q, body, ans);
  requestAnimationFrame(fitAllGenkou);
}
function setTalk(text) { $('q-text').textContent = text; }

/* ========== 7. もんだいの かたち べつ びょうが ========== */
const MARKS = ['A', 'B', 'C', 'D', 'E'];
const RENDER = {

  /* ①○×もんだい */
  ox(q, body, ans) {
    const wrap = ce('div', 'ox-wrap');
    [['○', true, 'o'], ['×', false, 'x']].forEach(([label, val, cls]) => {
      const b = ce('button', 'ox ' + cls);
      b.textContent = label;
      b.addEventListener('click', () => {
        if (battle.locked) return;
        if (val === q.answer) { judge(true, q); }
        else { b.classList.add('is-ng'); b.disabled = true; judge(false, q); }
      });
      wrap.appendChild(b);
    });
    ans.appendChild(wrap);
  },

  /* ②二たく・④えらぶ・⑥書きかえ（せんたく式） */
  choice(q, body, ans) {
    const oks = q.answers ? q.answers.slice() : [q.answer];
    const hasGenkou = q.choices.some(c => c.manuscript);
    if (hasGenkou) ans.className = 'answers two-col';
    q.choices.forEach((c, i) => {
      const b = ce('button', 'ans' + (c.manuscript ? ' ans-genkou' : ''));
      const mark = ce('span', 'ans-mark');
      mark.textContent = MARKS[i];
      b.appendChild(mark);
      if (c.manuscript) b.appendChild(genkouWrap(c.manuscript));
      else { const t = ce('span'); t.textContent = c.text; b.appendChild(t); }
      b.addEventListener('click', () => {
        if (battle.locked) return;
        if (oks.indexOf(i) >= 0) { b.classList.add('is-ok'); judge(true, q); }
        else { b.classList.add('is-ng', 'wrong-shake'); b.disabled = true; judge(false, q); }
      });
      ans.appendChild(b);
    });
  },
  rewrite(q, body, ans) { RENDER.choice(q, body, ans); },

  /* ③まちがいさがし（マスを タップ） */
  find(q, body, ans) {
    const need = q.answers.map(a => a.join(','));
    const found = {};
    const wrap = genkouWrap(q.manuscript, {
      big: true,
      tapable: true,
      onCell: (r, c, el) => {
        if (battle.locked) return;
        const key = r + ',' + c;
        if (found[key]) return;
        if (need.indexOf(key) >= 0) {
          found[key] = true;
          el.classList.add('hit');
          Sound.tap();
          const rest = need.length - Object.keys(found).length;
          if (rest === 0) judge(true, q);
          else flash('あと ' + rest + 'こ！', '');
        } else {
          el.classList.add('miss');
          setTimeout(() => el.classList.remove('miss'), 420);
          judge(false, q);
        }
      }
    });
    body.appendChild(wrap);
    const tip = ce('p', 'genkou-label');
    tip.textContent = 'マスを タップして えらぼう（右の行から 読むよ）';
    body.insertBefore(tip, wrap);
  },

  /* ④正しい ばしょを えらぶ（「、」を どこに 入れる？） */
  slot(q, body, ans) {
    const oks = q.answers ? q.answers.slice() : [q.answer];
    const line = ce('div', 'slot-sentence');
    q.parts.forEach((p, i) => {
      const sp = ce('span');
      sp.textContent = p;
      line.appendChild(sp);
      if (i < q.parts.length - 1) {
        const b = ce('button', 'slot-btn');
        b.textContent = '▽';
        b.addEventListener('click', () => {
          if (battle.locked) return;
          if (oks.indexOf(i) >= 0) {
            b.classList.add('is-ok');
            b.textContent = q.insert || '、';
            judge(true, q);
          } else {
            b.classList.add('is-ng');
            b.disabled = true;
            judge(false, q);
          }
        });
        line.appendChild(b);
      }
    });
    ans.appendChild(line);
  },

  /* ⑤ならべかえ */
  order(q, body, ans) {
    const picked = [];
    const slots = ce('div', 'order-slots');
    const btns = [];
    const draw = () => {
      slots.innerHTML = '';
      for (let i = 0; i < q.items.length; i++) {
        const s = ce('div', 'order-slot' + (picked[i] !== undefined ? ' is-filled' : ''));
        s.innerHTML = '<span class="order-num">' + (i + 1) + 'ばんめ</span>' +
                      (picked[i] !== undefined ? q.items[picked[i]] : '');
        slots.appendChild(s);
      }
    };
    q.items.forEach((text, i) => {
      const b = ce('button', 'ans');
      const mark = ce('span', 'ans-mark');
      mark.textContent = MARKS[i];
      b.appendChild(mark);
      const t = ce('span'); t.textContent = text; b.appendChild(t);
      b.addEventListener('click', () => {
        if (battle.locked || b.classList.contains('is-picked')) return;
        b.classList.add('is-picked');
        picked.push(i);
        Sound.tap();
        draw();
        if (picked.length === q.items.length) {
          const ok = picked.every((v, k) => v === q.answer[k]);
          if (ok) judge(true, q);
          else {
            judge(false, q);
            picked.length = 0;
            btns.forEach(x => x.classList.remove('is-picked'));
            draw();
          }
        }
      });
      btns.push(b);
      ans.appendChild(b);
    });
    draw();
    body.appendChild(slots);
  }
};

/* ========== 8. はんてい と えんしゅつ ========== */
function judge(ok, q) {
  if (battle.locked) return;
  if (!ok) {
    battle.tries++;
    Sound.ng();
    flash('おしい！', 'ng');
    setTalk('おしい！ ' + q.hint);
    return;
  }
  battle.locked = true;
  const first = battle.tries === 0;
  if (first) battle.first++;
  bumpCategory(q.category, first);
  addPower(1);
  Sound.ok();
  flash(first ? 'せいかい！' : 'できた！', '');
  hitEnemy(battle.dmg);
  setTimeout(() => showVerdict(q, first), 620);
}

function hitEnemy(dmg) {
  battle.hp = clamp(battle.hp - dmg, 0, battle.maxHp);
  $('hp-fill').style.width = (battle.hp / battle.maxHp * 100) + '%';
  const face = $('enemy-face');
  face.classList.remove('is-hit');
  void face.offsetWidth;
  face.classList.add('is-hit');
  const r = face.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  /* ダメージの すうじ */
  const d = ce('div', 'dmg');
  d.textContent = '-' + dmg;
  d.style.left = cx + 'px';
  d.style.top = cy + 'px';
  $('fx-layer').appendChild(d);
  setTimeout(() => d.remove(), 1000);
  /* キラキラ */
  for (let i = 0; i < 10; i++) {
    const s = ce('div', 'spark');
    s.textContent = ['✨', '⭐', '💫'][i % 3];
    s.style.left = (cx - 12 + (Math.random() * 60 - 30)) + 'px';
    s.style.top  = (cy - 12 + (Math.random() * 40 - 20)) + 'px';
    s.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    s.style.setProperty('--dy', (-40 - Math.random() * 90) + 'px');
    s.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
    s.style.animationDelay = (i * 0.03) + 's';
    $('fx-layer').appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}

let flashTimer = null;
function flash(text, cls) {
  const f = $('flash');
  $('flash-text').textContent = text;
  f.className = 'flash' + (cls ? ' ' + cls : '');
  f.hidden = false;
  void f.offsetWidth;
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => { f.hidden = true; }, 900);
}

/* こたえ合わせパネル */
/* かいせつを 読む 時間。この あいだ「つぎへ」は おせない。
   文字が 多い もんだいほど すこし 長く なる（2.0〜5.0びょう）。
   時間を かえたい ときは この 2つの 数字を なおす。 */
const READ_BASE_MS = 2000;   // さいてい これだけは 読む 時間を とる
const READ_PER_CHAR_MS = 45; // 1文字ごとに ふえる 時間
let readTimer = null;

/* 「つぎへ」を 読みおわるまで おせなく する */
function holdNextButton(chars) {
  const btn = $('btn-next');
  const wait = Math.min(5000, READ_BASE_MS + chars * READ_PER_CHAR_MS);
  clearTimeout(readTimer);
  btn.disabled = true;
  btn.classList.add('is-waiting');
  btn.style.setProperty('--wait', wait + 'ms');
  btn.textContent = 'かいせつを よもう…';
  readTimer = setTimeout(() => {
    btn.disabled = false;
    btn.classList.remove('is-waiting');
    btn.classList.add('is-ready');
    btn.textContent = 'つぎへ ▶';
    setTimeout(() => btn.classList.remove('is-ready'), 600);
  }, wait);
}

function showVerdict(q, first) {
  $('verdict-title').textContent = first ? 'せいかい！' : 'できた！ ナイス。';
  $('verdict-rule').innerHTML =
    '<span style="color:var(--ok)">作文パワー +1！　' + battle.dmg + 'ダメージ！</span><br>' +
    '📘 ' + q.id + '　' + q.title;
  const cmp = $('verdict-compare');
  cmp.innerHTML = '';
  const box = (cls, tag, text) => {
    const b = ce('div', 'cmp-box ' + cls);
    const t = ce('div', 'cmp-tag'); t.textContent = tag;
    const x = ce('div', 'cmp-text'); x.textContent = text;
    b.appendChild(t); b.appendChild(x);
    return b;
  };
  const grid = ce('div', 'compare');
  grid.appendChild(box('ng', '✕ こうすると まちがい', q.wrongExample));
  grid.appendChild(box('ok', '◯ 正しい 書きかた', q.correctExample));
  cmp.appendChild(grid);
  const exp = q.childExplanation + (q.anyOf ? '　※ 正かいは 一つだけでは ありません。' : '');
  $('verdict-exp').textContent = exp;
  $('verdict').hidden = false;
  holdNextButton((q.title + exp).length);   // 読む 時間を とってから おせるように
}
function hideVerdict() {
  clearTimeout(readTimer);
  const btn = $('btn-next');
  btn.disabled = false;
  btn.classList.remove('is-waiting', 'is-ready');
  btn.textContent = 'つぎへ ▶';
  $('verdict').hidden = true;
}

function nextQuestion() {
  hideVerdict();
  battle.idx++;
  if (battle.idx >= battle.qs.length) { endBattle(); return; }
  renderQuestion();
}

/* ========== 9. バトルの おわり と けっか ========== */
function endBattle() {
  const w = battle.world;
  const total = battle.qs.length;
  const stars = starsFor(battle.first, total);
  const rec = save.worlds[w.id] || (save.worlds[w.id] = { cleared: false, stars: 0, first: 0, total: 0 });
  const firstClear = !rec.cleared;               // はじめて クリアした ときだけ ステージが ひらく
  rec.cleared = true;
  rec.stars = Math.max(rec.stars || 0, stars);
  rec.first = battle.first;
  rec.total = total;
  persist();
  Sound.win();

  const allClear = WORLDS.every(x => (save.worlds[x.id] || {}).cleared);
  const body = $('result-body');
  body.innerHTML = '';

  const emo = characterEl(w.enemy, 'result-character');
  const ttl = ce('div', 'result-title');
  ttl.textContent = w.boss ? 'マチガエールまおうを たおした！' : w.enemy.name + 'を たおした！';
  const st = ce('div', 'result-stars');
  st.textContent = starStr(stars);
  body.appendChild(emo); body.appendChild(ttl); body.appendChild(st);

  const panel = ce('div', 'result-panel');
  const row = (a, b) => {
    const r = ce('div', 'result-row');
    const x = ce('span'); x.textContent = a;
    const y = ce('span'); y.textContent = b;
    r.appendChild(x); r.appendChild(y);
    return r;
  };
  panel.appendChild(row('一回で 正かい', battle.first + ' / ' + total + 'もん'));
  panel.appendChild(row('もらった 作文パワー', '✨ ' + total));
  panel.appendChild(row('ぜんぶの 星', '⭐ ' + totalStars() + ' / ' + (WORLDS.length * 5)));
  body.appendChild(panel);

  const talk = ce('div', 'talk-bar');
  talk.appendChild(characterEl(CHARACTERS.hakase, 'talk-face'));
  const talkText = ce('p', 'talk-text');
  talkText.innerHTML = w.boss
    ? 'よく やりましたね！「すごかった」の 中みを 書けるように なりましたね。<br>つぎは、じぶんの 作文で ためして みましょう。'
    : (battle.first === total
        ? 'ぜんぶ 一回で 正かい！ すばらしい！'
        : 'まちがいを 見つけられた ことも、りっぱな 力ですよ。');
  talk.appendChild(talkText);
  body.appendChild(talk);

  /* つぎの ステージが ひらいた おしらせ */
  const next = nextWorldOf(w.id);
  if (next && firstClear) {
    const unlock = ce('div', 'result-unlock');
    unlock.innerHTML =
      '<div class="ru-key">🔓</div>' +
      '<div class="ru-text">あたらしい ステージが ひらいた！<br>' +
      '<b>WORLD ' + next.no + '　' + (next.plain || next.name) + '</b></div>';
    body.appendChild(unlock);
  }

  if (allClear) {
    const end = ce('div', 'result-panel');
    end.innerHTML = '<div style="text-align:center;font-weight:900;font-size:18px;line-height:1.9">' +
      '🏆 ぜんステージ クリア！<br>きみは <b>作文マスター</b> だ！<br>' +
      '<span style="font-size:14px;font-weight:700">つぎは、じぶんの 作文を「作文チェック」で 見なおして みよう。</span></div>';
    body.appendChild(end);
  }

  const btns = ce('div', 'result-btns');
  const mk = (label, cls, fn) => {
    const b = ce('button', 'btn' + (cls ? ' ' + cls : ''));
    b.textContent = label;
    b.addEventListener('click', fn);
    return b;
  };
  if (next && isWorldUnlocked(next.id)) {
    btns.appendChild(mk('▶ WORLD ' + next.no + ' へ すすむ', 'btn-main', () => startBattle(next.id)));
    btns.appendChild(mk('🗺 ステージを えらぶ', '', () => go('map')));
  } else {
    btns.appendChild(mk('▶ べつの ステージへ', 'btn-main', () => go('map')));
  }
  btns.appendChild(mk('🔁 もう一かい やる', '', () => startBattle(w.id)));
  btns.appendChild(mk('⭐ きろくを 見る', '', () => go('record')));
  body.appendChild(btns);

  go('result');
}

/* ========== 10. 作文チェックモード ========== */
function renderCheck() {
  const list = $('check-list');
  list.innerHTML = '';
  CHECK_ITEMS.forEach(item => {
    const rule = RULES.find(r => r.id === item.ruleId);
    const b = ce('button', 'check-item' + (save.check[item.id] ? ' is-on' : ''));
    const box = ce('span', 'check-box');
    box.textContent = '✓';
    const wrap = ce('span');
    const t = ce('div'); t.textContent = item.text;
    wrap.appendChild(t);
    if (rule) {
      const tip = ce('div', 'check-tip');
      tip.textContent = '🦉 ' + rule.title;
      wrap.appendChild(tip);
    }
    b.appendChild(box); b.appendChild(wrap);
    b.addEventListener('click', () => {
      save.check[item.id] = !save.check[item.id];
      b.classList.toggle('is-on', !!save.check[item.id]);
      persist();
      Sound.tap();
      updateCheckMeter();
      if (CHECK_ITEMS.every(i => save.check[i.id])) {
        Sound.win();
        flash('ぜんぶ できた！', '');
      }
    });
    list.appendChild(b);
  });
  updateCheckMeter();
}
/* お手本の げんこう用紙（20文字×10行）を 出す・かくす */
function toggleSample() {
  const box = $('sample-body');
  const show = box.hidden;
  if (show && !box.childElementCount) {
    const label = ce('p', 'genkou-label');
    label.textContent = 'だい名・名前・一マス空け・かい話文の お手本です';
    box.appendChild(label);
    box.appendChild(genkouWrap(SAMPLE_GENKOU, { sample: true }));
  }
  box.hidden = !show;
  $('btn-sample').textContent = show ? '📄 お手本の げんこう用紙を とじる　▲' : '📄 お手本の げんこう用紙を 見る　▼';
  if (show) requestAnimationFrame(fitAllGenkou);
}

function updateCheckMeter() {
  const done = CHECK_ITEMS.filter(i => save.check[i.id]).length;
  $('check-meter-fill').style.width = (done / CHECK_ITEMS.length * 100) + '%';
}

/* ========== 11. きろく（身につき度） ========== */
function renderRecord() {
  const body = $('record-body');
  body.innerHTML = '';

  const h1 = ce('h2'); h1.textContent = '⭐ できるように なった 力';
  body.appendChild(h1);
  const p1 = ce('div', 'rec-panel');
  Object.keys(CATEGORIES).forEach(key => {
    const c = CATEGORIES[key];
    const rec = save.categories[key] || { first: 0, total: 0 };
    const s = starsFor(rec.first, rec.total);
    const r = ce('div', 'rec-row');
    r.innerHTML =
      '<span class="rec-icon">' + c.emoji + '</span>' +
      '<span class="rec-label">' + c.label +
        '<div class="rec-sub">' + (rec.total ? '一回で正かい ' + rec.first + '/' + rec.total + 'もん' : 'まだ ちょうせん して いないよ') + '</div>' +
      '</span>' +
      '<span class="rec-stars">' + starStr(s) + '</span>';
    p1.appendChild(r);
  });
  body.appendChild(p1);

  const h2 = ce('h2'); h2.textContent = '🗺️ ステージの すすみぐあい';
  body.appendChild(h2);
  const p2 = ce('div', 'rec-panel');
  WORLDS.forEach(w => {
    const rec = save.worlds[w.id] || {};
    const r = ce('div', 'rec-row');
    r.innerHTML =
      '<span class="rec-icon">' + w.emoji + '</span>' +
      '<span class="rec-label">' + (w.plain || w.name) +
        '<div class="rec-sub">' + (rec.cleared ? 'クリア ずみ' : 'まだ クリアして いないよ') + '</div>' +
      '</span>' +
      '<span class="rec-stars">' + starStr(rec.stars || 0) + '</span>';
    p2.appendChild(r);
  });
  body.appendChild(p2);

  const tot = ce('p', 'rec-total');
  tot.textContent = '✨ 作文パワー ' + save.power + '　　⭐ 星 ' + totalStars() + ' / ' + (WORLDS.length * 5);
  body.appendChild(tot);
}

/* ========== 12. はじめの せってい ========== */
function boot() {
  hydrateCharacters(document);
  $('power-num').textContent = save.power;
  $('btn-sound').textContent = save.sound ? '🔊' : '🔇';

  document.querySelectorAll('[data-go]').forEach(b => {
    b.addEventListener('click', () => { Sound.tap(); go(b.dataset.go); });
  });
  $('btn-back').addEventListener('click', () => { Sound.tap(); back(); });
  $('btn-next').addEventListener('click', () => { Sound.tap(); nextQuestion(); });
  $('btn-sound').addEventListener('click', () => {
    save.sound = !save.sound;
    $('btn-sound').textContent = save.sound ? '🔊' : '🔇';
    persist();
  });
  $('btn-sample').addEventListener('click', () => { Sound.tap(); toggleSample(); });
  $('btn-check-clear').addEventListener('click', () => {
    save.check = {};
    persist();
    renderCheck();
  });
  $('btn-reset').addEventListener('click', () => {
    if (confirm('きろくを ぜんぶ けして、さいしょから やりなおしますか？')) {
      save = blankSave();
      persist();
      $('power-num').textContent = 0;
      go('title');
    }
  });
  /* iPad は さいしょの タップで 音を つかえるように する */
  document.addEventListener('touchstart', () => Sound.init(), { once: true });
  document.addEventListener('click', () => Sound.init(), { once: true });

  go('title');
}
document.addEventListener('DOMContentLoaded', boot);
