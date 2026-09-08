/* 子どもに 見える 文だけを しらべる（コメントや フィールド名は のぞく） */
const fs=require('fs');
const G1='一右雨円王音下火花貝学気九休玉金空月犬見五口校左三山子四糸字耳七車手十出女小上森人水正生青夕石赤千川先早草足村大男竹中虫町天田土二日入年白八百文木本名目立力林六';
const G2='引羽雲園遠何科夏家歌画回会海絵外角楽活間丸岩顔汽記帰弓牛魚京強教近兄形計元言原戸古午後語工公広交光考行高黄合谷国黒今才細作算止市矢姉思紙寺自時室社弱首秋週春書少場色食心新親図数西声星晴切雪船線前組走多太体台地池知茶昼長鳥朝直通弟店点電刀冬当東答頭同道読内南肉馬売買麦半番父風分聞米歩母方北毎妹万明鳴毛門夜野友用曜来里理話';
const OK=new Set((G1+G2).split(''));
const src=fs.readFileSync('data.js','utf8');
const G=(new Function(src+'\n;return {RULES,WORLDS,CATEGORIES,CHARACTERS,CHECKLIST:typeof CHECKLIST!=="undefined"?CHECKLIST:null,RULE_VARIANTS};'))();
const hits=[];
function scan(where, text){
  if(typeof text!=='string') return;
  const clean=text.replace(/<ruby>.*?<\/ruby>/g,'');
  const bad=[...new Set([...clean].filter(ch=>/[一-鿿]/.test(ch)&&!OK.has(ch)))];
  if(bad.length) hits.push({where, bad:bad.join(''), text});
}
/* 子どもの 目に 入る フィールド */
const VISIBLE=['title','childExplanation','correctExample','wrongExample','hint','question','statement','manuscriptLabel','skill'];
function scanRule(r, tag){
  VISIBLE.forEach(k=>scan(tag+'.'+k, r[k]));
  (r.choices||[]).forEach((c,i)=>{ scan(tag+'.choices['+i+']', c.text); (c.manuscript&&c.manuscript.rows||[]).forEach((row,j)=>scan(tag+'.choices['+i+'].rows['+j+']', row)); });
  (r.items||[]).forEach((t,i)=>scan(tag+'.items['+i+']',t));
  (r.parts||[]).forEach((t,i)=>scan(tag+'.parts['+i+']',t));
  ((r.manuscript&&r.manuscript.rows)||[]).forEach((row,j)=>scan(tag+'.rows['+j+']',row));
}
G.RULES.forEach(r=>scanRule(r,r.id));
Object.keys(G.RULE_VARIANTS).forEach(id=>G.RULE_VARIANTS[id].forEach((v,i)=>scanRule(Object.assign({},v),id+'変'+(i+1))));
G.WORLDS.forEach(w=>{ scan('WORLD'+w.no+'.name',w.name); scan('WORLD'+w.no+'.theme',w.theme); scan('WORLD'+w.no+'.enemy',w.enemy.name); });
Object.entries(G.CATEGORIES).forEach(([k,v])=>scan('CATEGORY.'+k,v.label));
Object.values(G.CHARACTERS).forEach(c=>scan('CHARACTER',c.name));
if(G.CHECKLIST) G.CHECKLIST.forEach(c=>{ scan('CHECK.'+c.id,c.text); scan('CHECK.'+c.id+'.tip',c.tip); });
hits.forEach(h=>console.log('['+h.bad+']  '+h.where+'\n      '+h.text));
console.log('--- 子どもに 見える 文で ならって いない 漢字:', hits.length, 'か所');
