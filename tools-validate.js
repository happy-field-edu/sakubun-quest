/* 問題データの 検証：形式・原稿用紙の行送り・find座標 */
const fs=require('fs');
const src=fs.readFileSync(process.argv[2]||'data.js','utf8');
const G=(new Function(src+'\n;return {RULES,WORLDS,CATEGORIES,RULE_VARIANTS:typeof RULE_VARIANTS!=="undefined"?RULE_VARIANTS:{}};'))();
const {RULES,WORLDS,CATEGORIES,RULE_VARIANTS}=G;
const RE=/[、。]/;
const err=[], warn=[];
function cellsOf(row,cols,merge){const c=[];for(const ch of row){const l=c[c.length-1];
 if(merge!==false&&l){if(ch==='」'&&!l.sub&&RE.test(l.main)){l.sub=ch;continue;}
 if(RE.test(ch)&&!l.sub&&c.length>=cols){l.sub=ch;continue;}}c.push({main:ch});}return c;}
function checkMs(where,m,allowShort){
  if(!m) return null;
  if(!m.cols) err.push(where+': cols がない');
  const cols=m.cols||20, rows=m.rows||[];
  const grid=rows.map(r=>{const c=cellsOf(r,cols,m.merge); if(c.length>cols) err.push(where+': '+cols+'マスを こえる行 「'+r+'」('+c.length+')'); return c;});
  rows.forEach((r,i)=>{ const used=grid[i].length;
    if(i<rows.length-1 && used<cols && !(allowShort&&allowShort.includes(i))) warn.push(where+': '+(i+1)+'行目が '+used+'/'+cols+'マスで 改行 「'+r+'」');
  });
  return grid;
}
const ids=new Set();
const REQ=['id','world','type','category','skill','difficulty','title','childExplanation','correctExample','wrongExample','hint','questionType','question'];
RULES.forEach(q=>{
  const w=q.id||'(id なし)';
  REQ.forEach(k=>{ if(q[k]===undefined||q[k]==='') err.push(w+': '+k+' がない'); });
  if(ids.has(q.id)) err.push(w+': id が じゅうふく'); ids.add(q.id);
  if(!WORLDS.some(x=>x.id===q.world)) err.push(w+': world 不明 '+q.world);
  if(!CATEGORIES[q.category]) err.push(w+': category 不明 '+q.category);
  if(!['rule','skill','school_rule'].includes(q.type)) err.push(w+': type 不明 '+q.type);
  const t=q.questionType;
  if(t==='ox'){
    if(typeof q.answer!=='boolean') err.push(w+': ox の answer が true/false でない');
    if(!q.statement) err.push(w+': ox に statement がない');
    checkMs(w+' 本文', q.manuscript, q.allowShort);
  } else if(t==='choice'||t==='rewrite'){
    if(!Array.isArray(q.choices)||q.choices.length<2) err.push(w+': choices が 2つ未満');
    else {
      const n=q.choices.length;
      const ans=q.answers||[q.answer];
      if(!ans.length||ans.some(i=>typeof i!=='number'||i<0||i>=n)) err.push(w+': answer が はんいがい '+JSON.stringify(ans));
      if(q.answers&&!q.anyOf) warn.push(w+': answers を つかうなら anyOf:true が ふつう');
      q.choices.forEach((c,i)=>{ if(!c.manuscript&&!c.text) err.push(w+': 選択肢'+i+' が からっぽ');
        checkMs(w+' 選択肢'+'ABCDE'[i], c.manuscript, c.allowShort); });
    }
  } else if(t==='find'){
    const grid=checkMs(w+' 本文', q.manuscript, q.allowShort);
    if(!grid) err.push(w+': find に manuscript がない');
    else if(!Array.isArray(q.answers)||!q.answers.length) err.push(w+': find の answers がない');
    else q.answers.forEach(a=>{
      if(!Array.isArray(a)||a.length!==2) { err.push(w+': answers の かたちが へん '+JSON.stringify(a)); return; }
      const [r,c]=a;
      if(r<0||r>=(q.manuscript.rows||[]).length) err.push(w+': answers の 行が はんいがい '+r);
      else if(c<0||c>=q.manuscript.cols) err.push(w+': answers の 字が はんいがい '+c);
      else { const cell=(grid[r]||[])[c];
        const ch=cell?cell.main:'';
        if(!q.emptyOk && (!ch||ch==='　')) err.push(w+': 空マスを 正かいに している ['+r+','+c+']'); }
    });
  } else if(t==='slot'){
    if(!Array.isArray(q.parts)||q.parts.length<2) err.push(w+': parts がない');
    if(!Array.isArray(q.answers)||!q.answers.length) err.push(w+': slot の answers がない');
    else q.answers.forEach(i=>{ if(i<0||i>=q.parts.length) err.push(w+': slot answers はんいがい '+i); });
    if(!q.insert) err.push(w+': insert がない');
  } else if(t==='order'){
    if(!Array.isArray(q.items)||q.items.length<2) err.push(w+': items がない');
    if(!Array.isArray(q.answer)) err.push(w+': order の answer が はいれつでない');
    else { const s=q.answer.slice().sort((a,b)=>a-b).join(',');
      if(s!==q.items.map((_,i)=>i).join(',')) err.push(w+': order の answer が 0..n-1 の ならびかえに なっていない '+JSON.stringify(q.answer)); }
  } else err.push(w+': questionType 不明 '+t);
});
Object.keys(RULE_VARIANTS).forEach(id=>{
  if(!ids.has(id)) err.push('RULE_VARIANTS: 存在しない id '+id);
  RULE_VARIANTS[id].forEach((v,i)=>{
    const base=RULES.find(r=>r.id===id), q=Object.assign({},base,v), w=id+' 変化形'+(i+1);
    checkMs(w+' 本文', q.manuscript, q.allowShort);
    (q.choices||[]).forEach((c,j)=>checkMs(w+' 選択肢'+'ABCDE'[j], c.manuscript, c.allowShort));
    if(q.questionType==='find'&&q.manuscript){
      const grid=(q.manuscript.rows||[]).map(r=>cellsOf(r,q.manuscript.cols,q.manuscript.merge));
      (q.answers||[]).forEach(([r,c])=>{ const cell=(grid[r]||[])[c];
        if(!q.emptyOk&&(!cell||!cell.main||cell.main==='　')) err.push(w+': 空マスを 正かいに している ['+r+','+c+']'); });
    }
  });
});
const byWorld={}; RULES.forEach(r=>byWorld[r.world]=(byWorld[r.world]||0)+1);
console.log('■ 問題数', RULES.length, JSON.stringify(byWorld));
console.log('■ エラー', err.length); err.forEach(e=>console.log('  ×', e));
console.log('■ 注意', warn.length); warn.forEach(e=>console.log('  ・', e));
process.exit(err.length?1:0);
