'use strict';
/* =========================================================
   作文マスター・クエスト  data.js  ―― もんだいデータ
   ---------------------------------------------------------
   ★ このファイルに データを ふやすだけで もんだいが ふえます。
     script.js（ゲームのしくみ）は 書きかえなくて OK。

   【ルール1つの かたち】
     id               : RULE-0xx  （かならず ちがう名前に）
     world            : w1〜w5     （どのワールドに 出すか）
     type             : 'rule' | 'skill' | 'school_rule'
     category         : genkou / moji / kaiwa / bun / kuwashiku（身につき度の分け方）
     skill            : 身につく力（みじかい ことば）
     difficulty       : 1〜3
     title            : ルールの 名前
     childExplanation : 子ども向けの せつめい（作文はかせが 話す）
     correctExample   : 正しい 書きかた
     wrongExample     : まちがった 書きかた
     hint             : まちがえた ときの ヒント
     questionType     : 'ox' | 'choice' | 'find' | 'slot' | 'order' | 'rewrite'

   【げんこう用紙（manuscript）の 書きかた】※ たて書きです
     { cols: 9, rows: ['　きのう、公園へ','行きました。'] }
       ・cols  = 1行に 入る 文字数（たてに ならぶ マスの数）
       ・rows  = 行。はいれつの さいしょが いちばん右の行、つぎが その左…
       ・rows の 1文字が 1マス。字は 上から 下へ ならぶ
       ・'　'（全角スペース）は 空きマス
       ・行の さいご（いちばん下）に 「、」「。」が あふれたら、じどうで 同じマスに 入る
       ・'。' の あとの '」' も じどうで 同じマスに 入る
       ・merge:false にすると わざと ルール違反の 見た目に できる（まちがい例よう）
   ========================================================= */

/* ---------- とうじょう キャラクター ---------- */
/* emoji は 画像を 読みこめないときの 代わり。img が ゲーム内で ひょうじされます。 */
const CHARACTERS = {
  hero:   { name:'作文の勇者', emoji:'🦸', img:'assets/characters/hero.png' },
  hakase: { name:'作文はかせ', emoji:'🦉', img:'assets/characters/hakase.png' },
  maou:   { name:'マチガエール魔王', emoji:'🐸', img:'assets/characters/maou.png' }
};

/* ---------- 身につき度の カテゴリ ---------- */
const CATEGORIES = {
  genkou:    { label:'げんこう用紙', emoji:'📄' },
  moji:      { label:'文字',        emoji:'✏️' },
  kaiwa:     { label:'かい話',      emoji:'💬' },
  bun:       { label:'文',          emoji:'🔗' },
  kuwashiku: { label:'くわしく',    emoji:'🔍' }
};

/* ---------- ワールド（ステージ） ---------- */
const WORLDS = [
  { id:'w1', no:1, emoji:'🌳', color:'#3fa96a',
    name:'げんこう用紙の森',
    theme:'正しく書くための きほんルール',
    enemy:{ name:'もりの マチガエル', emoji:'🐸', img:'assets/characters/enemy-forest.png' } },

  { id:'w2', no:2, emoji:'🕯️', color:'#5a7fd6',
    name:'文字の どうくつ',
    theme:'文字を 正しく 書こう',
    enemy:{ name:'どうくつ マチガエル', emoji:'🐛', img:'assets/characters/enemy-cave.png' } },

  { id:'w3', no:3, emoji:'🏰', color:'#e07aa8',
    name:'おしゃべり<ruby>城<rt>じょう</rt></ruby>',
    plain:'おしゃべり城',
    theme:'かい話文を 正しく 書こう',
    enemy:{ name:'おしゃべり マチガエル', emoji:'🦜', img:'assets/characters/enemy-castle.png' } },

  { id:'w4', no:4, emoji:'🛣️', color:'#e8933a',
    name:'文しょうロード',
    theme:'文を 分かりやすく つなごう',
    enemy:{ name:'みちまよい マチガエル', emoji:'🐌', img:'assets/characters/enemy-road.png' } },

  { id:'w5', no:5, emoji:'👑', color:'#a45cd6',
    name:'マチガエール<ruby>魔王城<rt>まおうじょう</rt></ruby>',
    plain:'マチガエール魔王城',
    theme:'もっと つたわる 作文に しよう',
    boss:true,
    enemy:CHARACTERS.maou }
];

/* =========================================================
   もんだいデータ
   ========================================================= */
const RULES = [

/* ===================== WORLD 1 げんこう用紙の森 ===================== */
{
  id:'RULE-001', world:'w1', type:'school_rule', category:'genkou',
  skill:'だい名の 書きかた', difficulty:1,
  title:'だい名は 上を 2〜3マス あけて 書く',
  childExplanation:'だい名は 1行目に 書きます。上を 2〜3マス あけて 書くと、とても 見やすく なりますよ。',
  correctExample:'　　　なつやすみの日',
  wrongExample:'なつやすみの日',
  hint:'お手本の 1行目を 見てみよう。上に 空いている マスは いくつ あるかな？',
  questionType:'ox',
  question:'お手本を 見ながら こたえよう。これは 正しい？',
  statement:'だい名は、1行目の 上を 2〜3マス あけて 書く。',
  // お手本（正しい 書きかた）を げんこう用紙で 見せる
  manuscript:{ cols:10, rows:['　　　なつやすみの日'] },
  manuscriptLabel:'お手本：上を 3マス あけた だい名',
  answer:true
},
{
  id:'RULE-002', world:'w1', type:'school_rule', category:'genkou',
  skill:'名前の 書きかた', difficulty:1,
  title:'名前は 2行目に、名字と 名前の あいだを あけて 書く',
  childExplanation:'名前は 2行目に 書きます。名字と 名前の あいだを 1マス あけて、下も 1マス あけて 書くと、とても きれいに そろいますよ。',
  correctExample:'下を 1マス あけて　山田　たろう',
  wrongExample:'いちばん上から　山田たろう',
  hint:'名前は 行の 上と 下、どちらに よせると きれいかな？ 名字と 名前の あいだも 見てみよう。',
  questionType:'choice',
  question:'名前の 書きかたで 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:12, rows:['山田たろう'] } },
    { manuscript:{ cols:12, rows:['　　　　　山田　たろう'] } }
  ],
  answer:1
},
{
  id:'RULE-012', world:'w1', type:'rule', category:'genkou',
  skill:'だんらくの 一マス空け', difficulty:1,
  title:'だんらくの さいしょは 一マス あける',
  childExplanation:'あたらしい だんらくの さいしょは、かならず 一マス あけて 書きはじめます。ここが 作文の きほんですよ！',
  correctExample:'　きのう、公園へ行きました。',
  wrongExample:'きのう、公園へ行きました。',
  hint:'いちばん さいしょの マスを よーく 見てみよう。',
  questionType:'choice',
  question:'書きはじめが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['きのう、公園へ行き','ました。'] } },
    { manuscript:{ cols:9, rows:['　きのう、公園へ行','きました。'] } }
  ],
  answer:1
},
{
  id:'RULE-004', world:'w1', type:'rule', category:'genkou',
  skill:'行のさいごの 句読点', difficulty:2,
  title:'「、」「。」は つぎの行の 上に 書かない',
  childExplanation:'「、」や「。」は、つぎの行の いちばん上には 書きません。行の さいごに なったら、さいごの 字と 同じマスに 入れます。',
  correctExample:'たのしかった。\n← さいごの「た」と「。」を 同じマスに 入れる',
  wrongExample:'たのしかった\n。 ← 「。」だけ つぎの行の いちばん上',
  hint:'「。」が つぎの行の いちばん上に きて いないかな？',
  questionType:'choice',
  question:'「。」の 入れかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:7, rows:['　きょうはとて','もたのしかった','。'] } },
    { manuscript:{ cols:7, rows:['　きょうはとて','もたのしかった。'] } }
  ],
  answer:1
},
{
  id:'RULE-005', world:'w1', type:'rule', category:'genkou',
  skill:'読点（、）の いれどころ', difficulty:2,
  title:'「、」は ことばの まとまりで 入れる',
  childExplanation:'「、」は 読むときに 一息 つくところに 入れます。ことばの まとまりの とちゅうで 切ってしまうと、読みにくく なりますよ。入れる ばしょは 一つだけとは かぎりません。',
  correctExample:'あさ、はやくおきて学校へ行きました。',
  wrongExample:'あさはやく、おきて学校へ行きました。',
  hint:'「はやくおきて」の まん中で 切ると 読みにくいね。ことばの まとまりを 見てみよう。',
  questionType:'slot',
  question:'「、」を 入れると 読みやすい ところは どこ？',
  parts:['あさ','はやく','おきて','学校へ行きました。'],
  answers:[0,2], anyOf:true,
  insert:'、'
},
{
  id:'RULE-006', world:'w1', type:'rule', category:'genkou',
  skill:'一マス空けの 見なおし', difficulty:2,
  title:'書きはじめの マスを たしかめる',
  childExplanation:'この 作文は、だんらくの さいしょが 一マス あいて いませんでした。書きおわったら さいしょの マスを たしかめましょう。',
  correctExample:'　きょう、学校でなわとびをしました。',
  wrongExample:'きょう、学校でなわとびをしました。',
  hint:'1行目の いちばん さいしょの マスだよ。',
  questionType:'find',
  question:'おかしい マスを タップしよう。',
  manuscript:{ cols:9, rows:['きょう、学校でなわ','とびをしました。'] },
  answers:[[0,0]]
},
{
  id:'RULE-007', world:'w1', type:'rule', category:'genkou',
  skill:'文の おわりの 句点', difficulty:1,
  title:'文の おわりには「。」をつける',
  childExplanation:'文が おわったら、かならず「。」を つけます。「。」も 一マス つかいますよ。',
  correctExample:'　きょうは犬とあそびました。',
  wrongExample:'　きょうは犬とあそびました',
  hint:'さいごの 字の つぎの マスを 見てみよう。',
  questionType:'find',
  question:'「。」を わすれて いるよ。「。」が 入る マスを タップしよう。',
  manuscript:{ cols:9, rows:['　きょうは犬とあそ','びました'] },
  emptyOk:true,          // 空マスを えらぶ もんだい
  answers:[[1,4]]
},

/* ===================== WORLD 2 文字のどうくつ ===================== */
{
  id:'RULE-101', world:'w2', type:'rule', category:'moji',
  skill:'じょし「は」', difficulty:1,
  title:'「わ」と 読んでも「は」と 書く',
  childExplanation:'「わたしは」の「は」は、「わ」と 読みますが「は」と 書きます。「〜は」は 文の 主語に つく しるしです。',
  correctExample:'わたしは、公園へ行きました。',
  wrongExample:'わたしわ、公園へ行きました。',
  hint:'「わたし◯」の ところだよ。声に 出して 読んでみよう。',
  questionType:'find',
  question:'おかしい 字の マスを タップしよう。',
  manuscript:{ cols:9, rows:['　わたしわ、公園へ','行きました。'] },
  answers:[[0,4]]
},
{
  id:'RULE-102', world:'w2', type:'rule', category:'moji',
  skill:'じょし「へ」', difficulty:1,
  title:'「え」と 読んでも「へ」と 書く',
  childExplanation:'「学校へ」の「へ」は、「え」と 読みますが「へ」と 書きます。行く ばしょの あとに つきますよ。',
  correctExample:'学校へ 行きます。',
  wrongExample:'学校え 行きます。',
  hint:'「どこへ 行く」の ときに つかう 字だよ。',
  questionType:'choice',
  question:'正しいのは どっち？',
  choices:[ { text:'学校え 行きます。' }, { text:'学校へ 行きます。' } ],
  answer:1
},
{
  id:'RULE-103', world:'w2', type:'rule', category:'moji',
  skill:'じょし「を」', difficulty:1,
  title:'「お」と 読んでも「を」と 書く',
  childExplanation:'「パンを 食べる」の「を」は、「お」と 読みますが「を」と 書きます。「何を するか」を あらわす ときに つかいます。',
  correctExample:'パンを 食べました。',
  wrongExample:'パンお 食べました。',
  hint:'「何を したか」を あらわす 字だよ。',
  questionType:'choice',
  question:'正しいのは どっち？',
  choices:[ { text:'パンお 食べました。' }, { text:'パンを 食べました。' } ],
  answer:1
},
{
  id:'RULE-104', world:'w2', type:'rule', category:'moji',
  skill:'小さい「っ」', difficulty:2,
  title:'つまる音は 小さい「っ」で 書く',
  childExplanation:'「らっぱ」「がっこう」のように、つまる音は 小さい「っ」で 書きます。大きい「つ」だと 読みかたが かわって しまいますよ。',
  correctExample:'ぼくは、らっぱをふきました。',
  wrongExample:'ぼくは、らつぱをふきました。',
  hint:'「ら◯ぱ」の ところ。声に 出すと つまる音が するね。',
  questionType:'find',
  question:'おかしい 字の マスを タップしよう。',
  manuscript:{ cols:9, rows:['　ぼくは、らつぱを','ふきました。'] },
  answers:[[0,6]]
},
{
  id:'RULE-105', world:'w2', type:'rule', category:'moji',
  skill:'小さい「ゃ・ゅ・ょ」', difficulty:2,
  title:'ねじれる音は 小さい「ゃ・ゅ・ょ」',
  childExplanation:'「きゅうしょく」のように、ねじれる音は 小さい「ゃ・ゅ・ょ」で 書きます。2つ ありますよ。よく さがしてね。',
  correctExample:'きゅうしょくの時間です。',
  wrongExample:'きゆうしよくの時間です。',
  hint:'「き◯うし◯く」。小さく 書く 字が 2つ あるよ。',
  questionType:'find',
  question:'おかしい 字の マスを ぜんぶ タップしよう。（2つ）',
  manuscript:{ cols:9, rows:['　きゆうしよくの時','間です。'] },
  answers:[[0,2],[0,5]]
},
{
  id:'RULE-106', world:'w2', type:'rule', category:'moji',
  skill:'長音「ー」', difficulty:2,
  title:'カタカナの のばす音は「ー」',
  childExplanation:'カタカナで のばす音は「ー」を つかいます。「ラーメン」「カード」「ケーキ」みたいに ですね。',
  correctExample:'ラーメンを 食べました。',
  wrongExample:'ラあメンを 食べました。',
  hint:'カタカナで のばす音を 書くときの しるしだよ。',
  questionType:'choice',
  question:'正しいのは どっち？',
  choices:[ { text:'ラーメンを 食べました。' }, { text:'ラあメンを 食べました。' } ],
  answer:0
},
{
  id:'RULE-107', world:'w2', type:'school_rule', category:'moji',
  skill:'小さい字の マス', difficulty:1,
  title:'小さい字も 一マス つかう',
  childExplanation:'小さい「っ」や「ゃ」「ゅ」「ょ」も、げんこう用紙では 一マス つかって 書きます。マスの 左下に 小さく 書きましょう。',
  correctExample:'「がっこう」は 4マス つかう',
  wrongExample:'「がっこう」を 3マスに 書く',
  hint:'小さい字も、ちゃんと 一つの マスに 入るよ。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'小さい「っ」や「ゃ」も、一マス つかって 書く。',
  answer:true
},
{
  id:'RULE-108', world:'w2', type:'rule', category:'moji',
  skill:'は・へ・を の 見なおし', difficulty:3,
  title:'は・へ・を を 見なおそう',
  childExplanation:'「学校へ」の「へ」、「本を」の「を」。声に 出して 読むと 見つけやすく なりますよ。',
  correctExample:'　きのう、学校へ行って、本をよみました。',
  wrongExample:'　きのう、学校え行って、本およみました。',
  hint:'「学校◯」と「本◯」の ところを 見てみよう。',
  questionType:'find',
  question:'おかしい 字の マスを ぜんぶ タップしよう。（2つ）',
  manuscript:{ cols:9, rows:['　きのう、学校え行','って、本およみまし','た。'] },
  answers:[[0,7],[1,4]]
},

/* ===================== WORLD 3 おしゃべり城 ===================== */
{
  id:'RULE-201', world:'w3', type:'rule', category:'kaiwa',
  skill:'かぎかっこ', difficulty:1,
  title:'話した ことばは「　」で かこむ',
  childExplanation:'人が 話した ことばは、かぎかっこ「　」で かこんで 書きます。だれかの 声が 聞こえてくる みたいですね。',
  correctExample:'「おはよう。」と言いました。',
  wrongExample:'おはよう。と言いました。',
  hint:'話した ことばの はじめと おわりに つける しるしだよ。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'人が 話した ことばは、「　」で かこんで 書く。',
  answer:true
},
{
  id:'RULE-202', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の 改行', difficulty:2,
  title:'かい話文は 行を かえて 書く',
  childExplanation:'かい話文は、行を かえて 書きはじめます。そうすると、だれかが 話しはじめたことが すぐに 分かりますよ。',
  correctExample:'　あさ、お母さんが言いました。\n「おはよう。」',
  wrongExample:'　あさ、お母さんが「おはよう。」と言いました。',
  hint:'話した ことばは、あたらしい 行から 書きはじめよう。',
  questionType:'choice',
  question:'かい話文の 書きかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　あさ、お母さんが','「おはよう。」と言い','ました。'] } },
    { manuscript:{ cols:9, rows:['　あさ、お母さんが','「おはよう。」','と言いました。'] } }
  ],
  answer:1
},
{
  id:'RULE-203', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文2行目の 一字下げ', difficulty:3,
  title:'かい話文が 2行に なったら 2行目も 一字下げる',
  childExplanation:'かい話文が 2行いじょうに なったら、2行目からも 一マス あけて 書きます。どこまでが 話した ことばか、はっきり 分かりますよ。',
  correctExample:'「きょうは、とて\n　もたのしかった\n　よ。」',
  wrongExample:'「きょうは、とて\nもたのしかった\nよ。」',
  hint:'2行目の さいしょの マスを 見てみよう。かい話は まだ つづいて いるね。',
  questionType:'choice',
  question:'2行に なった かい話文。正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['「きょうは、とても','たのしかったよ。」'] } },
    { manuscript:{ cols:9, rows:['「きょうは、とても','　たのしかったよ。」'] } }
  ],
  answer:1
},
{
  id:'RULE-204', world:'w3', type:'rule', category:'kaiwa',
  skill:'「。」と とじかっこ', difficulty:2,
  title:'「。」と とじかっこは 同じマスに 入れる',
  childExplanation:'かい話文の おわりの「。」と とじかっこ「」」は、同じマスに いっしょに 入れます。2マス つかっては いけませんよ。',
  correctExample:'「ありがとう。」 ← さいごは 1マスに「。」」',
  wrongExample:'「ありがとう。」 ← 「。」と「」」が べつのマス',
  hint:'さいごの 2つの しるしは、なかよく 同じマスに 入るよ。',
  questionType:'choice',
  question:'さいごの マスが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:8, merge:false, rows:['「ありがとう。」'] } },
    { manuscript:{ cols:8, rows:['「ありがとう。」'] } }
  ],
  answer:1
},
{
  id:'RULE-205', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の あとの文', difficulty:2,
  title:'かい話文の あとは 行を かえて 一マス あける',
  childExplanation:'かい話文が おわったら、つづきの 文は また 行を かえて、一マス あけて 書きます。作文が とても 読みやすく なりますよ。',
  correctExample:'「おはよう。」\n　ぼくも手をふりました。',
  wrongExample:'「おはよう。」ぼくも手をふりました。',
  hint:'とじかっこの あとに、そのまま つづきを 書いて いないかな？',
  questionType:'choice',
  question:'かい話文の あとの つづきかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['「おはよう。」ぼくも','手をふりました。'] } },
    { manuscript:{ cols:9, rows:['「おはよう。」','　ぼくも手をふりま','した。'] } }
  ],
  answer:1
},
{
  id:'RULE-206', world:'w3', type:'rule', category:'kaiwa',
  skill:'とじかっこの わすれ', difficulty:2,
  title:'とじかっこを わすれない',
  childExplanation:'かい話文には、はじめの「 と おわりの 」が セットで いります。かたほうだけでは、どこまで 話したのか 分かりませんね。',
  correctExample:'　おとうとが「見て見て。」と言いました。',
  wrongExample:'　おとうとが「見て見てと言いました。',
  hint:'はじめの「 は あるね。おわりの しるしは どうかな？',
  questionType:'choice',
  question:'この 作文、どこが おかしい？',
  manuscript:{ cols:9, rows:['　おとうとが「見て','見てと言いました。'] },
  choices:[
    { text:'とじかっこ「」」が ぬけている' },
    { text:'「、」が 足りない' },
    { text:'さいしょの 一マス空けが ない' }
  ],
  answer:0
},
{
  id:'RULE-207', world:'w3', type:'school_rule', category:'kaiwa',
  skill:'「 の ばしょ', difficulty:2,
  title:'かい話文の「 は 行の いちばん上から',
  childExplanation:'だんらくの さいしょは 一マス あけますが、かい話文の「 は 一マス あけずに、行の いちばん上の マスから 書きます。',
  correctExample:'「おはよう。」 ← 行の 上から',
  wrongExample:'　「おはよう。」 ← 一マス あけて しまった',
  hint:'かい話文だけは、一マス あけずに 上から 書くよ。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'かい話文の 「 は、行の いちばん上の マスから 書く。',
  answer:true
},

/* ===================== WORLD 4 文しょうロード ===================== */
{
  id:'RULE-301', world:'w4', type:'skill', category:'bun',
  skill:'主語と述語', difficulty:1,
  title:'「だれが」を 書くと 分かりやすい',
  childExplanation:'「だれが」「どうした」が そろっていると、読む人に よく つたわります。「ぼくは」「わたしは」を 入れて みましょう。',
  correctExample:'ぼくは、公園でサッカーをしました。',
  wrongExample:'公園でサッカーをしました。',
  hint:'サッカーを したのは だれかな？ それが 書いてあると 分かりやすいね。',
  questionType:'choice',
  question:'「だれが したのか」が よく 分かるのは どっち？',
  choices:[
    { text:'公園で サッカーを しました。' },
    { text:'ぼくは、公園で サッカーを しました。' }
  ],
  answer:1
},
{
  id:'RULE-302', world:'w4', type:'skill', category:'bun',
  skill:'一文の 長さ', difficulty:2,
  title:'一つの文を 長くしすぎない',
  childExplanation:'「〜て、〜て、〜て」と つづけると、長すぎて 分かりにくく なります。「。」で 切って、みじかい文に 分けましょう。',
  correctExample:'あさおきて、ごはんを食べました。学校へ行って、サッカーをしました。とてもたのしかったです。',
  wrongExample:'あさおきて、ごはんを食べて、学校へ行って、サッカーをして、たのしかったです。',
  hint:'「〜て、〜て」が つづいて いないかな？「。」で 切って みよう。',
  questionType:'choice',
  question:'読みやすいのは どっち？',
  choices:[
    { text:'あさおきて、ごはんを食べて、学校へ行って、サッカーをして、たのしかったです。' },
    { text:'あさおきて、ごはんを食べました。学校へ行って、サッカーをしました。とてもたのしかったです。' }
  ],
  answer:1
},
{
  id:'RULE-303', world:'w4', type:'skill', category:'bun',
  skill:'出来事の じゅんばん', difficulty:2,
  title:'あった じゅんばんに 書く',
  childExplanation:'作文は、あった じゅんばんに 書くと 分かりやすく なります。「あさ→ひる→よる」の ように 時間で ならべましょう。',
  correctExample:'あさ、はやくおきました。学校ではしりました。夜、ぐっすりねました。',
  wrongExample:'夜、ぐっすりねました。あさ、はやくおきました。',
  hint:'あさ・ひる・よる、どれが さいしょかな？',
  questionType:'order',
  question:'あった じゅんばんに タップして ならべよう。',
  items:['学校で はしりました。','あさ、はやく おきました。','夜、ぐっすり ねました。'],
  answer:[1,0,2]
},
{
  id:'RULE-304', world:'w4', type:'skill', category:'bun',
  skill:'「そして」', difficulty:2,
  title:'「そして」は ならべる・つけ足す ときに つかう',
  childExplanation:'「そして」は、ならべたり、あとから つけ足したり する ときに つかいます。',
  correctExample:'妹は五さいです。そして、とても元気です。',
  wrongExample:'妹は五さいです。それから、とても元気です。',
  hint:'「つけ足す」のは どちらの ことばかな？',
  questionType:'choice',
  question:'あてはまるのは どっち？　「妹は 五さいです。◯◯◯、とても 元気です。」',
  choices:[ { text:'そして' }, { text:'それから' } ],
  answer:0
},
{
  id:'RULE-305', world:'w4', type:'skill', category:'bun',
  skill:'「それから」', difficulty:2,
  title:'「それから」は つぎに おきた ことに つかう',
  childExplanation:'「それから」は、「つぎに」という いみです。時間の じゅんばんを あらわす ときに つかいます。',
  correctExample:'先にしゅくだいをしました。それから、公園へ行きました。',
  wrongExample:'先にしゅくだいをしました。そして、公園へ行きました。',
  hint:'「つぎに」と いいかえられる ことばは どっちかな？',
  questionType:'choice',
  question:'あてはまるのは どっち？　「先に しゅくだいを しました。◯◯◯◯、公園へ 行きました。」',
  choices:[ { text:'そして' }, { text:'それから' } ],
  answer:1
},
{
  id:'RULE-306', world:'w4', type:'skill', category:'bun',
  skill:'つなぎことばの つかい分け', difficulty:2,
  title:'「それから」は じゅんばんの ことば',
  childExplanation:'「そして」は ならべる・つけ足す とき。「それから」は つぎに おきた ことを 書く とき。おぼえて おきましょう。',
  correctExample:'ごはんを食べました。それから、はをみがきました。',
  wrongExample:'（じゅんばんが ないのに つかう）',
  hint:'「つぎに おきた こと」を あらわす ことばだよ。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'「それから」は、つぎに おきた ことを 書くときに つかう。',
  answer:true
},
{
  id:'RULE-307', world:'w4', type:'school_rule', category:'bun',
  skill:'だんらくを 分ける', difficulty:2,
  title:'話が かわったら だんらくを 分ける',
  childExplanation:'話が かわる ところで 行を かえて、一マス あけて 書きはじめます。これが「だんらくを 分ける」ですよ。',
  correctExample:'　あさ、公園へ行きました。（…）\n　ひるからは、家で本をよみました。',
  wrongExample:'（ぜんぶ つづけて 書く）',
  hint:'あたらしい 話に なったら、行を かえて 一マス あけよう。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'話が かわったら、行を かえて 一マス あけて 書く。',
  answer:true
},
{
  id:'RULE-308', world:'w4', type:'skill', category:'bun',
  skill:'出来事の じゅんばん（4つ）', difficulty:3,
  title:'一日の できごとを じゅんばんに',
  childExplanation:'できごとを 時間の じゅんばんに ならべると、読む人が 目に うかべやすく なりますよ。',
  correctExample:'あさ、学校にあつまりました。バスにのりました。山の上でおべんとうを食べました。家にかえって、しゃしんを見ました。',
  wrongExample:'（じゅんばんが ばらばら）',
  hint:'まずは 学校に あつまる ところからだね。',
  questionType:'order',
  question:'えん足の 出来事を じゅんばんに ならべよう。',
  items:['バスに のりました。','山の上で おべんとうを 食べました。','あさ、学校に あつまりました。','家に かえって、しゃしんを 見ました。'],
  answer:[2,0,1,3]
},

/* ===================== WORLD 5 マチガエール魔王城 ===================== */
{
  id:'RULE-401', world:'w5', type:'skill', category:'kuwashiku',
  skill:'出来事を くわしく', difficulty:2,
  title:'書いたら、もう一歩 くわしく',
  childExplanation:'出来事を 書いたら、そこで おわりに しないで「もう一歩！」。大きさ・色・数などを 足すと、読む人の 目に うかびますよ。答えは 一つでは ありません。',
  correctExample:'大きなどんぐりがありました。ぼくの親ゆびくらいの大きさでした。',
  wrongExample:'どんぐりがありました。',
  hint:'どんな どんぐり だったのかな？ 大きさや 色を 思い出して みよう。',
  questionType:'rewrite',
  question:'「どんぐりが ありました。」の つぎに 書くと よいのは？（いくつも 正かい）',
  choices:[
    { text:'大きな どんぐりが ありました。' },
    { text:'どんぐりです。' },
    { text:'ぼくの 親ゆびくらいの 大きさでした。' }
  ],
  answers:[0,2], anyOf:true
},
{
  id:'RULE-402', world:'w5', type:'skill', category:'kuwashiku',
  skill:'気もちを 書く', difficulty:2,
  title:'そのときの 気もちを 書く',
  childExplanation:'出来事の あとに 気もちを 書くと、作文が ぐっと よくなります。うれしかった・どきどきした・びっくりした…いろいろな 気もちが ありますね。',
  correctExample:'はじめて一りん車にのれました。うれしかったです。',
  wrongExample:'はじめて一りん車にのれました。',
  hint:'のれた とき、心の 中は どんな 気もち だったかな？',
  questionType:'choice',
  question:'「はじめて 一りん車に のれました。」の あとに あう 気もちは？（いくつも 正かい）',
  choices:[
    { text:'うれしかったです。' },
    { text:'どきどきしました。' },
    { text:'ねむかったです。' },
    { text:'おなかが すきました。' }
  ],
  answers:[0,1], anyOf:true
},
{
  id:'RULE-403', world:'w5', type:'skill', category:'kuwashiku',
  skill:'気もちの りゆう', difficulty:2,
  title:'「どうして そう思ったの？」を 書く',
  childExplanation:'気もちを 書いたら、つぎは「どうして そう思ったのか」。りゆうが あると、読む人に 気もちが つたわりますよ。',
  correctExample:'うれしかったです。どうしてかというと、はじめてさかあがりができたからです。',
  wrongExample:'うれしかったです。',
  hint:'「どうしてかというと…」で つづけて みよう。',
  questionType:'choice',
  question:'「うれしかったです。」の つぎに 書くと よいのは？',
  choices:[
    { text:'どうしてかというと、はじめて さかあがりが できたからです。' },
    { text:'うれしかったです。' },
    { text:'おわり。' }
  ],
  answer:0
},
{
  id:'RULE-404', world:'w5', type:'skill', category:'kuwashiku',
  skill:'五かん（音・見た目）', difficulty:2,
  title:'どんな音？ 何が 見えた？',
  childExplanation:'「どんな音だった？」「何が 見えた？」を 思い出して 書くと、その場に いるような 作文に なります。',
  correctExample:'ドーンと大きな音がしました。空が赤く光りました。',
  wrongExample:'花火を見ました。',
  hint:'耳で 聞いた音、目で 見た色を 思い出して みよう。',
  questionType:'rewrite',
  question:'「花火を 見ました。」を くわしく するには？（いくつも 正かい）',
  choices:[
    { text:'ドーンと 大きな音が しました。' },
    { text:'空が 赤く 光りました。' },
    { text:'花火でした。' },
    { text:'すごかったです。' }
  ],
  answers:[0,1], anyOf:true
},
{
  id:'RULE-405', world:'w5', type:'skill', category:'kuwashiku',
  skill:'五かん（におい・さわる）', difficulty:2,
  title:'どんな におい？ さわると どんな かんじ？',
  childExplanation:'においや、さわった かんじも 作文に できます。目で 見た ことだけで なく、鼻や 手で かんじた ことも 書いて みましょう。',
  correctExample:'やきたてのパンの あまいにおいがしました。',
  wrongExample:'パンやさんに入りました。',
  hint:'パンやさんに 入った とき、どんな においが したかな？',
  questionType:'choice',
  question:'「パンやさんに 入りました。」を くわしく するのは どれ？',
  choices:[
    { text:'やきたてのパンの あまい においが しました。' },
    { text:'パンやさんでした。' },
    { text:'すごかったです。' }
  ],
  answer:0
},
{
  id:'RULE-406', world:'w5', type:'skill', category:'kuwashiku',
  skill:'同じことばの くりかえし', difficulty:3,
  title:'同じことばが つづいたら 書きかえる',
  childExplanation:'同じ ことばが 何かいも 出てくると、よみにくく なります。ほかの ことばに かえたり、くわしく 書きかえたり しましょう。',
  correctExample:'たのしかったです。とくに、リレーで一いになれたときは うれしくてとびはねました。',
  wrongExample:'たのしかったです。たのしかったです。たのしかったです。',
  hint:'ことばを けすのでは なくて、ちがう 書きかたに かえて みよう。',
  questionType:'choice',
  question:'「たのしかったです。」が 3かいも つづいて いるよ。どうする？',
  choices:[
    { text:'ちがう ことばや、くわしい 書きかたに かえる。' },
    { text:'ぜんぶ けして しまう。' },
    { text:'もっと ふやして 5かいに する。' }
  ],
  answer:0
},
{
  id:'RULE-407', world:'w5', type:'school_rule', category:'kuwashiku',
  skill:'読みかえし', difficulty:1,
  title:'書きおわったら 読みかえす',
  childExplanation:'書きおわったら、さいごに もう一かい 読みかえします。一マス空け・「。」・は へ を。じぶんで 見つけられたら、それは すごい 力ですよ！',
  correctExample:'書きおわったら 声に 出して 読みかえす。',
  wrongExample:'書いたら そのまま 出して しまう。',
  hint:'じぶんで 見なおすと、まちがいが 見つかるよ。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'作文を 書いたら、さいごに 読みかえして たしかめる。',
  answer:true
},
{
  id:'RULE-408', world:'w5', type:'skill', category:'kuwashiku',
  skill:'「すごかった」の 具体化', difficulty:3, boss:true,
  title:'「すごかった」の 中みを 書く',
  childExplanation:'「すごかった」は いい ことばです。つかっては いけない わけでは ありません。でも、そのあとに「何が どう すごかったのか」を 書くと、読む人にも すごさが つたわりますよ。',
  correctExample:'花火が空いっぱいに広がって、びっくりしました。ドーンと大きな音がして、体にひびきました。',
  wrongExample:'花火がすごかったです。',
  hint:'「何が」「どう」すごかったのかな？ 大きさ・音・色・はやさを 思い出そう。',
  questionType:'rewrite',
  question:'魔王「花火が すごかったです。だけで じゅうぶんなのだ！」…もっと つたわるのは どれ？（いくつも 正かい）',
  choices:[
    { text:'花火が 空いっぱいに 広がって、びっくりしました。' },
    { text:'花火が すごくて、すごくて、すごかったです。' },
    { text:'ドーンと 大きな音が して、体に ひびきました。' },
    { text:'花火は すごかったです。' }
  ],
  answers:[0,2], anyOf:true
},

/* ---------- WORLD 2 ついか分 ---------- */
{
  id:'RULE-109', world:'w2', type:'rule', category:'moji',
  skill:'小さい「っ」', difficulty:1,
  title:'つまる音は 小さい「っ」で 書く',
  childExplanation:'「がっこう」の ように、つまる音は 小さい「っ」で 書きます。大きい「つ」に すると、ぜんぜん ちがう ことばに なって しまいますよ。',
  correctExample:'　あしたはがっこうへ行きます。',
  wrongExample:'　あしたはがつこうへ行きます。',
  hint:'声に 出して 読んで みよう。「がつこう」と 読んで いるかな？',
  questionType:'find',
  question:'おかしい 字の マスを タップしよう。',
  manuscript:{ cols:9, rows:['　あしたはがつこう','へ行きます。'] },
  answers:[[0,6]]
},
{
  id:'RULE-110', world:'w2', type:'rule', category:'moji',
  skill:'小さい「っ」', difficulty:1,
  title:'「きって」の「っ」も 小さく 書く',
  childExplanation:'「きって」「きっぷ」「まって」など、つまる音は ぜんぶ 小さい「っ」です。読む ときの リズムが かわりますよ。',
  correctExample:'　きってをはりました。',
  wrongExample:'　きつてをはりました。',
  hint:'「きつて」と「きって」、声に 出すと どちらが 正しい かな？',
  questionType:'choice',
  question:'正しく 書けて いるのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　きつてをはりまし','た。'] } },
    { manuscript:{ cols:9, rows:['　きってをはりまし','た。'] } }
  ],
  answer:1
},
{
  id:'RULE-111', world:'w2', type:'rule', category:'moji',
  skill:'小さい「ゅ」', difficulty:1,
  title:'ねじれる音は 小さい「ゅ」で 書く',
  childExplanation:'「しゅくだい」の「しゅ」は、「し」と 小さい「ゅ」で 書きます。大きい「ゆ」だと「しゆくだい」と 読めて しまいますね。',
  correctExample:'　しゅくだいを先にしました。',
  wrongExample:'　しゆくだいを先にしました。',
  hint:'「しゆ」と 一字ずつ 読んで いないかな？',
  questionType:'find',
  question:'おかしい 字の マスを タップしよう。',
  manuscript:{ cols:9, rows:['　しゆくだいを先に','しました。'] },
  answers:[[0,2]]
},
{
  id:'RULE-112', world:'w2', type:'rule', category:'moji',
  skill:'小さい「ょ」', difficulty:1,
  title:'「きょうしつ」の「ょ」は 小さく 書く',
  childExplanation:'「きょう」「きょうしつ」「じょうず」などの ねじれる音は、小さい「ょ」で 書きます。',
  correctExample:'　きょうしつのそうじをしました。',
  wrongExample:'　きようしつのそうじをしました。',
  hint:'「きよう」と 読めて しまう ほうは、まちがいだね。',
  questionType:'choice',
  question:'正しく 書けて いるのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　きようしつのそう','じをしました。'] } },
    { manuscript:{ cols:9, rows:['　きょうしつのそう','じをしました。'] } }
  ],
  answer:1
},
{
  id:'RULE-113', world:'w2', type:'rule', category:'moji',
  skill:'小さい「ゃ」', difficulty:1,
  title:'「おもちゃ」の「ゃ」は 小さく 書く',
  childExplanation:'「おもちゃ」「おきゃくさん」などの「ゃ」も 小さく 書きます。小さい字は 右上に よせて 書きますよ。',
  correctExample:'　おもちゃで弟とあそびました。',
  wrongExample:'　おもちやで弟とあそびました。',
  hint:'「おもちや」と 読んで いないかな？',
  questionType:'find',
  question:'おかしい 字の マスを タップしよう。',
  manuscript:{ cols:9, rows:['　おもちやで弟とあ','そびました。'] },
  answers:[[0,4]]
},
{
  id:'RULE-114', world:'w2', type:'rule', category:'moji',
  skill:'のばす音「ー」', difficulty:2,
  title:'カタカナの のばす音は「ー」で 書く',
  childExplanation:'カタカナの ことばで 音を のばす ときは「ー」を つかいます。たて書きでは、この「ー」も たてむきに なりますよ。',
  correctExample:'　ラーメンを食べました。',
  wrongExample:'　ラアメンを食べました。',
  hint:'カタカナで のばす音は、ひらがなと 書きかたが ちがうよ。',
  questionType:'choice',
  question:'正しく 書けて いるのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　ラアメンを食べま','した。'] } },
    { manuscript:{ cols:9, rows:['　ラーメンを食べま','した。'] } }
  ],
  answer:1
},
{
  id:'RULE-115', world:'w2', type:'rule', category:'moji',
  skill:'のばす音の きまり', difficulty:2,
  title:'ひらがなでは「ー」を つかわない',
  childExplanation:'「おかあさん」「おにいさん」の ように、ひらがなの ことばでは「ー」を つかわず、「あ」や「い」を 書いて のばします。',
  correctExample:'おかあさん',
  wrongExample:'おかーさん',
  hint:'国語の 本で「おかあさん」が どう 書いて あるか 思い出して みよう。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'「おかあさん」は「おかーさん」と 書く。',
  answer:false
},
{
  id:'RULE-116', world:'w2', type:'rule', category:'moji',
  skill:'じょし「は」', difficulty:2,
  title:'「わ」と 読んでも「は」と 書く',
  childExplanation:'「ぼくは」の「は」は「わ」と 読みますが、書く ときは「は」です。ことばを つなぐ「は」は いつも「は」と おぼえましょう。',
  correctExample:'　ぼくは本を読むのがすきです。',
  wrongExample:'　ぼくわ本を読むのがすきです。',
  hint:'「ぼく」の つぎの 字を 見てみよう。',
  questionType:'find',
  question:'おかしい 字の マスを タップしよう。',
  manuscript:{ cols:9, rows:['　ぼくわ本を読むの','がすきです。'] },
  answers:[[0,3]]
},
{
  id:'RULE-117', world:'w2', type:'rule', category:'moji',
  skill:'じょし「は」', difficulty:1,
  title:'「わたしは」の「は」',
  childExplanation:'じぶんの ことを 話す ときの「わたしは」も、「は」と 書きます。声と 字が ちがうので、気を つけましょう。',
  correctExample:'　わたしは二年生です。',
  wrongExample:'　わたしわ二年生です。',
  hint:'「わたし」の つぎの 字だよ。',
  questionType:'choice',
  question:'正しく 書けて いるのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　わたしわ二年生で','す。'] } },
    { manuscript:{ cols:9, rows:['　わたしは二年生で','す。'] } }
  ],
  answer:1
},
{
  id:'RULE-118', world:'w2', type:'rule', category:'moji',
  skill:'じょし「へ」', difficulty:2,
  title:'「え」と 読んでも「へ」と 書く',
  childExplanation:'「うみへ行く」の「へ」は「え」と 読みますが、書く ときは「へ」です。行く さきを あらわす ときの「へ」ですね。',
  correctExample:'　あしたうみへ行きます。',
  wrongExample:'　あしたうみえ行きます。',
  hint:'「うみ」の つぎの 字を 見てみよう。行く さきを あらわす 字だよ。',
  questionType:'find',
  question:'おかしい 字の マスを タップしよう。',
  manuscript:{ cols:9, rows:['　あしたうみえ行き','ます。'] },
  answers:[[0,6]]
},
{
  id:'RULE-119', world:'w2', type:'rule', category:'moji',
  skill:'じょし「へ」', difficulty:1,
  title:'行く さきの「へ」',
  childExplanation:'「家へ」「学校へ」の ように、行く さきの あとには「へ」を 書きます。',
  correctExample:'　友だちの家へ行きました。',
  wrongExample:'　友だちの家え行きました。',
  hint:'「家」の つぎの 字だよ。',
  questionType:'choice',
  question:'正しく 書けて いるのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　友だちの家え行き','ました。'] } },
    { manuscript:{ cols:9, rows:['　友だちの家へ行き','ました。'] } }
  ],
  answer:1
},
{
  id:'RULE-120', world:'w2', type:'rule', category:'moji',
  skill:'じょし「を」', difficulty:2,
  title:'「お」と 読んでも「を」と 書く',
  childExplanation:'「ごはんを たべる」の「を」は「お」と 読みますが、書く ときは「を」です。「なにを」に あたる ことばの あとに つきます。',
  correctExample:'　朝ごはんをたべました。',
  wrongExample:'　朝ごはんおたべました。',
  hint:'「なにを たべた？」の「を」だよ。',
  questionType:'find',
  question:'おかしい 字の マスを タップしよう。',
  manuscript:{ cols:9, rows:['　朝ごはんおたべま','した。'] },
  answers:[[0,5]]
},
{
  id:'RULE-121', world:'w2', type:'rule', category:'moji',
  skill:'じょし「を」', difficulty:1,
  title:'「なにを」の「を」',
  childExplanation:'「花を見つける」「本を読む」の ように、「なにを」に あたる ことばの あとには「を」を 書きます。',
  correctExample:'　きれいな花を見つけました。',
  wrongExample:'　きれいな花お見つけました。',
  hint:'「花」の つぎの 字だよ。',
  questionType:'choice',
  question:'正しく 書けて いるのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　きれいな花お見つ','けました。'] } },
    { manuscript:{ cols:9, rows:['　きれいな花を見つ','けました。'] } }
  ],
  answer:1
},
{
  id:'RULE-122', world:'w2', type:'rule', category:'moji',
  skill:'じょしの きまり', difficulty:2,
  title:'読みかたと 書きかたが ちがう じょし',
  childExplanation:'「は」「へ」「を」は、読みかたと 書きかたが ちがいます。「わ・え・お」と 読んでも、「は・へ・を」と 書きましょう。',
  correctExample:'わたしは／学校へ／本を',
  wrongExample:'わたしわ／学校え／本お',
  hint:'「わたしは」を 声に 出して 読んで みよう。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'「わたしは」の「は」は、「わ」と 読むけれど「は」と 書く。',
  answer:true
},
{
  id:'RULE-123', world:'w2', type:'rule', category:'moji',
  skill:'のばす音「ー」', difficulty:2,
  title:'カタカナの のばす音を たしかめる',
  childExplanation:'「プール」「ケーキ」「スカート」など、カタカナの のばす音は「ー」で 書きます。「ウ」や「エ」で 書かない ように しましょう。',
  correctExample:'　プールでおよぎました。',
  wrongExample:'　プウルでおよぎました。',
  hint:'「プウル」と 読んで いないかな？ のばす音の 書きかただよ。',
  questionType:'find',
  question:'おかしい 字の マスを タップしよう。',
  manuscript:{ cols:9, rows:['　プウルでおよぎま','した。'] },
  answers:[[0,2]]
},
{
  id:'RULE-124', world:'w2', type:'rule', category:'moji',
  skill:'じょしの 見なおし', difficulty:3,
  title:'「は」と「へ」を まとめて たしかめる',
  childExplanation:'一つの 文に、まちがえやすい じょしが 2つ あることも あります。書きおわったら、声に 出して 読みかえして みましょう。',
  correctExample:'　わたしは公園へ行きました。',
  wrongExample:'　わたしわ公園え行きました。',
  hint:'声に 出して 読むと 正しく 聞こえるけれど、字が ちがう ところが 2つ あるよ。',
  questionType:'find',
  question:'おかしい 字の マスを ぜんぶ タップしよう。（2つ）',
  manuscript:{ cols:9, rows:['　わたしわ公園え行','きました。'] },
  answers:[[0,4],[0,7]]
},

/* ---------- WORLD 3 ついか分 ---------- */
{
  id:'RULE-208', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の 書きはじめ', difficulty:2,
  title:'話した ことばは かぎかっこで かこむ',
  childExplanation:'だれかが 話した ことばは「　」で かこみ、行を かえて 書きます。だれの 声か ひと目で 分かるように なりますよ。',
  correctExample:'行を かえて 「おはよう。」と 書く',
  wrongExample:'おはようと そのまま つづけて 書く',
  hint:'話した ことばは、どんな しるしで かこむのかな？',
  questionType:'choice',
  question:'かい話文の 書きかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　朝おきると、母が','おはようと言いまし','た。'] } },
    { manuscript:{ cols:9, rows:['　朝おきると、母が','「おはよう。」','と言いました。'] }, allowShort:[1] }
  ],
  answer:1
},
{
  id:'RULE-209', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の 改行', difficulty:1,
  title:'かい話文は 行を かえて 書く',
  childExplanation:'かい話文は、前の 文の つづきに 書かず、行を かえて 書きはじめます。読む 人が 声を 見つけやすく なりますよ。',
  correctExample:'　母が　→　行をかえて　「おはよう。」',
  wrongExample:'　母がおはようと言いました。',
  hint:'これまでに 出てきた かい話文は、どこから 書きはじめて いたかな？',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'かい話文は、行を かえて 書きはじめる。',
  answer:true
},
{
  id:'RULE-210', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の 一字下げ', difficulty:3,
  title:'かい話文の 2行目も 一字 下げる',
  childExplanation:'かい話文が 2行に なった ときは、2行目も 一マス あけて 書きはじめます。どこまでが 話した ことばか、はっきり 分かりますよ。',
  correctExample:'2行目を 一マス あけて 「　だね。」',
  wrongExample:'2行目を いちばん上から 書く',
  hint:'2行目の いちばん 上の マスを くらべて みよう。',
  questionType:'choice',
  question:'2行に なった かい話文。正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['「あしたはえんそく','だね。」'] } },
    { manuscript:{ cols:9, rows:['「あしたはえんそく','　だね。」'] } }
  ],
  answer:1
},
{
  id:'RULE-211', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の おわり', difficulty:2,
  title:'「。」と とじかっこは 同じマス',
  childExplanation:'かい話文の おわりの「。」と とじかっこ「」」は、同じマスに いっしょに 入れます。マスの 左上に とじかっこ、右上に「。」を 書きますよ。',
  correctExample:'さいごの マスに 「。」と「」」を いっしょに',
  wrongExample:'「。」と「」」を べつべつの マスに',
  hint:'さいごの マスを 思い出して みよう。2つの しるしは どこに 入るかな？',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'かい話文の おわりの「。」と「」」は、同じマスに 入れる。',
  answer:true
},
{
  id:'RULE-212', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の 中の 句点', difficulty:2,
  title:'かい話文の 中にも「。」を つける',
  childExplanation:'かい話文の 中の 文も、おわりに「。」を つけます。「。」を つけてから とじかっこを 書きましょう。',
  correctExample:'「見て見て。」',
  wrongExample:'「見て見て」',
  hint:'とじかっこの 前を 見てみよう。「。」は ついて いるかな？',
  questionType:'choice',
  question:'かい話文の おわりかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　弟が大きな声で、','「見て見て」','と言いました。'] }, allowShort:[1] },
    { manuscript:{ cols:9, rows:['　弟が大きな声で、','「見て見て。」','と言いました。'] }, allowShort:[1] }
  ],
  answer:1
},
{
  id:'RULE-213', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の あとの 文', difficulty:3,
  title:'かい話文の あとは 行を かえる',
  childExplanation:'かい話文が おわったら、つづきの 文は 行を かえて、一マス あけて 書きます。話と 気もちが ごちゃごちゃに なりませんよ。',
  correctExample:'「ありがとう。」→ 行をかえて　「　ぼくは…」',
  wrongExample:'「ありがとう。」ぼくは…と つづけて 書く',
  hint:'とじかっこの あとを 見てみよう。すぐ つづけて いる ほうは まちがいだね。',
  questionType:'choice',
  question:'かい話文の あとの つづきかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['「ありがとう。」ぼく','はうれしくなりまし','た。'] } },
    { manuscript:{ cols:9, rows:['「ありがとう。」','　ぼくはうれしくな','りました。'] }, allowShort:[0] }
  ],
  answer:1
},
{
  id:'RULE-214', world:'w3', type:'skill', category:'kaiwa',
  skill:'だれが 言ったか 書く', difficulty:2,
  title:'だれが 言ったのかを 書きそえる',
  childExplanation:'かい話文だけでは、だれが 話したのか 分かりません。「〜と 友だちが 言いました。」の ように 書きそえると、ばめんが よく 見えますよ。',
  correctExample:'「たのしいね。」と 友だちが 言いました。',
  wrongExample:'「たのしいね。」',
  hint:'この ことばを 言ったのは だれかな？ 読む 人に 分かるように 書こう。',
  questionType:'choice',
  question:'読む 人に よく つたわるのは どっち？',
  choices:[
    { text:'「たのしいね。」' },
    { text:'「たのしいね。」と 友だちが 言いました。' }
  ],
  answer:1
},
{
  id:'RULE-215', world:'w3', type:'rule', category:'kaiwa',
  skill:'つづく かい話文', difficulty:3,
  title:'かい話文が 2つ つづく ときも 行を かえる',
  childExplanation:'ちがう 人の ことばは、それぞれ 行を かえて 書きます。だれと だれが 話して いるか、はっきり しますよ。',
  correctExample:'「おはよう。」→ 行をかえて →「おはようございます。」',
  wrongExample:'「おはよう。」「おはようございます。」と つづけて 書く',
  hint:'話す 人が かわった ときは、どうするのかな？',
  questionType:'choice',
  question:'2人の かい話。正しい 書きかたは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['「おはよう。」「おは','ようございます。」'] } },
    { manuscript:{ cols:9, rows:['「おはよう。」','「おはようございま','す。」'] }, allowShort:[0] }
  ],
  answer:1
},
{
  id:'RULE-216', world:'w3', type:'skill', category:'kaiwa',
  skill:'心の中の ことば', difficulty:2,
  title:'心の中で 思った ことも かぎかっこで 書ける',
  childExplanation:'声に 出さずに 思った ことも、「　」を つかって 書くと、その ときの 気もちが よく つたわります。',
  correctExample:'「まけないぞ。」と 心の中で 思いました。',
  wrongExample:'まけないぞと 思いました。',
  hint:'思った ことばを、そのまま 書いて みると どうかな？',
  questionType:'choice',
  question:'思った ことが よく つたわるのは どっち？',
  choices:[
    { text:'まけないぞと 思いました。' },
    { text:'「まけないぞ。」と 心の中で 思いました。' }
  ],
  answer:1
},
{
  id:'RULE-217', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の 行のはじめ', difficulty:3,
  title:'かい話文の 行は 一マス あけない',
  childExplanation:'だんらくの さいしょは 一マス あけますが、かい話文の 行は あけません。かぎかっこ「から すぐに 書きはじめます。',
  correctExample:'「おはよう。」（いちばん上の マスから）',
  wrongExample:'　「おはよう。」（一マス あけて しまう）',
  hint:'かい話文の 行の いちばん 上の マスを 見てみよう。あいて いないかな？',
  questionType:'find',
  question:'かい話文の 書きはじめが おかしいよ。おかしい マスを タップしよう。',
  manuscript:{ cols:9, rows:['　朝おきると、母が','　「おはよう。」','と言いました。'] },
  allowShort:[1],
  emptyOk:true,
  answers:[[1,0]]
},
{
  id:'RULE-218', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の 行のはじめ', difficulty:2,
  title:'かい話文の 行は 上から 書く',
  childExplanation:'かい話文の 行は、一マス あけずに いちばん 上から 書きはじめます。だんらくの 書きはじめとは ちがう ところです。',
  correctExample:'「おはよう。」を いちばん上の マスから 書く',
  wrongExample:'「おはよう。」の 前を 一マス あける',
  hint:'だんらくの はじめと、かい話文の はじめ。同じかな？ ちがうかな？',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'かい話文の 行も、はじめを 一マス あけて 書く。',
  answer:false
},
{
  id:'RULE-219', world:'w3', type:'skill', category:'kaiwa',
  skill:'かい話の じゅんばん', difficulty:2,
  title:'かい話を 出来事の じゅんに 書く',
  childExplanation:'かい話文も、あった じゅんばんに 書きます。することの まえと あとが 分かると、ばめんが うかびますよ。',
  correctExample:'家に かえる →「ただいま。」→ 手を あらう',
  wrongExample:'手を あらってから 家に かえる',
  hint:'家に つくのが さきかな？「ただいま。」と 言うのが さきかな？',
  questionType:'order',
  question:'あった じゅんばんに タップして ならべよう。',
  items:['「ただいま。」と 言いました。','　学校から 家に かえりました。','　手を あらいました。'],
  answer:[1,0,2]
},
{
  id:'RULE-220', world:'w3', type:'rule', category:'kaiwa',
  skill:'とじかっこ', difficulty:2,
  title:'とじかっこを わすれない',
  childExplanation:'かい話文には、はじめの「と おわりの」が セットで いります。どちらか かたほうだけでは、どこまでが 話した ことばか 分かりません。',
  correctExample:'「あそぼう。」',
  wrongExample:'「あそぼう。',
  hint:'話した ことばの おわりに、しるしは ついて いるかな？',
  questionType:'choice',
  question:'かい話文が 正しく 書けて いるのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　弟がにこにこして','「あそぼう。','と言いました。'] }, allowShort:[1] },
    { manuscript:{ cols:9, rows:['　弟がにこにこして','「あそぼう。」','と言いました。'] }, allowShort:[1] }
  ],
  answer:1
},
{
  id:'RULE-221', world:'w3', type:'rule', category:'kaiwa',
  skill:'かい話文の まとめ', difficulty:2,
  title:'かい話文の きまりを たしかめる',
  childExplanation:'かい話文の きまりは 3つ。行を かえる、2行目は 一字 下げる、おわりの「。」と「」」は 同じマス。この 3つを おぼえましょう。',
  correctExample:'2行目も 一字 下げて 書く',
  wrongExample:'2行目を いちばん上から 書く',
  hint:'2行に なった かい話文の もんだいを 思い出して みよう。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'かい話文が 2行に なった ときは、2行目も 一字 下げて 書く。',
  answer:true
},

/* ---------- WORLD 4 ついか分 ---------- */
{
  id:'RULE-309', world:'w4', type:'skill', category:'bun',
  skill:'主語を 書く', difficulty:1,
  title:'「だれが」を 書く',
  childExplanation:'「だれが」に あたる ことばを 主語と いいます。主語が ないと、だれの 話なのか 分からなく なりますよ。',
  correctExample:'ぼくが 走りました。',
  wrongExample:'走りました。',
  hint:'走ったのは だれかな？ それを 書きたそう。',
  questionType:'choice',
  question:'「だれが」が 分かるのは どっち？',
  choices:[
    { text:'走りました。' },
    { text:'ぼくが 走りました。' }
  ],
  answer:1
},
{
  id:'RULE-310', world:'w4', type:'skill', category:'bun',
  skill:'じゅつ語を 書く', difficulty:1,
  title:'「どうした」を 書く',
  childExplanation:'「どうした」に あたる ことばを じゅつ語と いいます。じゅつ語が ないと、文が とちゅうで おわって しまいます。',
  correctExample:'　きのう、公園で 弟と あそびました。',
  wrongExample:'　きのう、公園で 弟と。',
  hint:'弟と 公園で、何を したのかな？',
  questionType:'choice',
  question:'文が さいごまで 書けて いるのは どっち？',
  choices:[
    { text:'きのう、公園で 弟と。' },
    { text:'きのう、公園で 弟と あそびました。' }
  ],
  answer:1
},
{
  id:'RULE-311', world:'w4', type:'skill', category:'bun',
  skill:'主語と じゅつ語を あわせる', difficulty:3,
  title:'主語と じゅつ語を あわせる',
  childExplanation:'「〜は」で はじめたら、さいごの ことばと ぴったり あうように します。声に 出して 読むと、へんな ところに 気づけますよ。',
  correctExample:'ぼくの ゆめは 先生に なる ことです。',
  wrongExample:'ぼくの ゆめは 走ります。',
  hint:'「ゆめは…」の さいごは どう おわると ぴったり くるかな？',
  questionType:'choice',
  question:'ことばが ぴったり あって いるのは どっち？',
  choices:[
    { text:'ぼくの ゆめは 走ります。' },
    { text:'ぼくの ゆめは 先生に なる ことです。' }
  ],
  answer:1
},
{
  id:'RULE-312', world:'w4', type:'skill', category:'bun',
  skill:'一文を 短く', difficulty:2,
  title:'一文を 長くしすぎない',
  childExplanation:'一つの 文に たくさん つめこむと、読む 人が つかれて しまいます。「。」で 切って、みじかい 文を いくつか つくりましょう。',
  correctExample:'　朝おきて、ごはんを 食べました。それから 学校へ 行きました。',
  wrongExample:'　朝おきて、ごはんを食べて、学校へ行って、体いくをして、かえりました。',
  hint:'ひといきで 読めない ほうは、長すぎるね。',
  questionType:'choice',
  question:'読みやすいのは どっち？',
  choices:[
    { text:'朝おきて、ごはんを食べて、学校へ行って、体いくをして、かえりました。' },
    { text:'朝おきて、ごはんを 食べました。それから 学校へ 行きました。' }
  ],
  answer:1
},
{
  id:'RULE-313', world:'w4', type:'skill', category:'bun',
  skill:'つなぎことば「そして」', difficulty:2,
  title:'ならべる ときは「そして」',
  childExplanation:'「そして」は、同じような ことを ならべたり、話を つけくわえたり する ときに つかいます。',
  correctExample:'なわとびを しました。そして ブランコにも のりました。',
  wrongExample:'なわとびを しました。だから ブランコにも のりました。',
  hint:'2つとも 公園で した あそびだね。ならべる ときの ことばは どれかな？',
  questionType:'choice',
  question:'「公園で なわとびを しました。（　）ブランコにも のりました。」（　）に 入るのは？',
  choices:[
    { text:'そして' },
    { text:'でも' },
    { text:'だから' }
  ],
  answer:0
},
{
  id:'RULE-314', world:'w4', type:'skill', category:'bun',
  skill:'つなぎことば「それから」', difficulty:2,
  title:'つぎに した ことは「それから」',
  childExplanation:'「それから」は、つぎに おきた ことや、じゅんばんに した ことを 書く ときに つかいます。',
  correctExample:'かおを あらいました。それから ごはんを 食べました。',
  wrongExample:'かおを あらいました。でも ごはんを 食べました。',
  hint:'あらう → 食べる。時間の じゅんばんに つづいて いるね。',
  questionType:'choice',
  question:'「かおを あらいました。（　）ごはんを 食べました。」（　）に 入るのは？',
  choices:[
    { text:'それから' },
    { text:'でも' },
    { text:'それとも' }
  ],
  answer:0
},
{
  id:'RULE-315', world:'w4', type:'skill', category:'bun',
  skill:'「そして」と「それから」', difficulty:3,
  title:'「そして」と「それから」を つかい分ける',
  childExplanation:'「そして」は ならべる とき、「それから」は つぎに おきた ことを 書く ときに つかいます。にて いますが、はたらきが ちがいます。',
  correctExample:'プールで およぎました。それから シャワーを あびました。',
  wrongExample:'プールで およぎました。そのあとに およぎました。',
  hint:'およぐ → シャワー。じかんの じゅんばんだね。どちらの ことばが ぴったり かな？',
  questionType:'choice',
  question:'「プールで およぎました。（　）シャワーを あびました。」（　）に ぴったりなのは？',
  choices:[
    { text:'それから' },
    { text:'でも' }
  ],
  answer:0
},
{
  id:'RULE-316', world:'w4', type:'skill', category:'bun',
  skill:'時間の じゅんばん', difficulty:1,
  title:'朝・ひる・夜の じゅんに 書く',
  childExplanation:'一日の ことを 書く ときは、朝から じゅんばんに 書くと 分かりやすく なります。',
  correctExample:'朝 → ひる → 夜',
  wrongExample:'夜 → 朝 → ひる',
  hint:'一日の はじまりは いつかな？',
  questionType:'order',
  question:'一日の じゅんばんに タップして ならべよう。',
  items:['ひるに 給食を 食べました。','夜、早く ねました。','朝、六時に おきました。'],
  answer:[2,0,1]
},
{
  id:'RULE-317', world:'w4', type:'skill', category:'bun',
  skill:'だんらくの 分けかた', difficulty:2,
  title:'話が かわったら だんらくを かえる',
  childExplanation:'べつの 話に なる ときは、だんらくを かえます。まとまりが 見えて、読む 人が とても 楽に なりますよ。',
  correctExample:'えんそくの 話　→　だんらくを かえて　→　かえってからの 話',
  wrongExample:'ぜんぶ つづけて 書く',
  hint:'話の まとまりが かわる ところで、行を かえて みよう。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'べつの 話に なる ときは、だんらくを かえて 書く。',
  answer:true
},
{
  id:'RULE-318', world:'w4', type:'skill', category:'bun',
  skill:'一文を 短く', difficulty:2,
  title:'「〜て、〜て」で つなぎすぎない',
  childExplanation:'「〜て、〜て、〜て」と つづけると、どこで 息を つけば よいか 分からなく なります。「。」で 切って みましょう。',
  correctExample:'　海へ 行きました。魚を 見つけました。',
  wrongExample:'　海へ行って、魚を見つけて、うれしくて、ずっと見ていて…',
  hint:'「て、」が いくつも つづいて いる ほうは 読みにくいね。',
  questionType:'choice',
  question:'読みやすいのは どっち？',
  choices:[
    { text:'海へ行って、魚を見つけて、うれしくて、ずっと見ていました。' },
    { text:'海へ 行きました。魚を 見つけて、うれしく なりました。' }
  ],
  answer:1
},
{
  id:'RULE-319', world:'w4', type:'skill', category:'bun',
  skill:'出来事の じゅんばん', difficulty:2,
  title:'した じゅんばんに 書く',
  childExplanation:'出来事は、じっさいに した じゅんばんに 書きます。じゅんばんが 入れかわると、読む 人が こんらんして しまいます。',
  correctExample:'バスに のる → 山に つく → お弁当を 食べる',
  wrongExample:'お弁当を 食べる → バスに のる',
  hint:'えんそくは、まず 何から はじまるかな？',
  questionType:'order',
  question:'えんそくの じゅんばんに タップして ならべよう。',
  items:['山に つきました。','バスに のりました。','お弁当を 食べました。'],
  answer:[1,0,2]
},
{
  id:'RULE-320', world:'w4', type:'skill', category:'bun',
  skill:'主語を 書く', difficulty:2,
  title:'だれの ことか 分かるように 書く',
  childExplanation:'とちゅうで 話す 人が かわる ときは、「妹が」「わたしが」の ように 主語を 書きます。だれの ことか はっきりしますよ。',
  correctExample:'　妹が わらいました。わたしも うれしく なりました。',
  wrongExample:'　わらいました。うれしく なりました。',
  hint:'わらったのは だれ？ うれしく なったのは だれ？',
  questionType:'choice',
  question:'だれの ことか 分かるのは どっち？',
  choices:[
    { text:'わらいました。うれしく なりました。' },
    { text:'妹が わらいました。わたしも うれしく なりました。' }
  ],
  answer:1
},
{
  id:'RULE-321', world:'w4', type:'skill', category:'bun',
  skill:'同じ ことばの くりかえし', difficulty:3,
  title:'同じ ことばを つかいすぎない',
  childExplanation:'同じ ことばが 何回も 出て くると、たいくつに なります。べつの 言いかたに かえると、読む 人が あきませんよ。',
  correctExample:'　楽しかったです。とくに おにごっこが おもしろかったです。',
  wrongExample:'　楽しかったです。楽しかったです。とても 楽しかったです。',
  hint:'同じ ことばが 何回も 出て いる ほうは、どちらかな？',
  questionType:'choice',
  question:'読んで あきないのは どっち？',
  choices:[
    { text:'楽しかったです。楽しかったです。とても 楽しかったです。' },
    { text:'楽しかったです。とくに おにごっこが おもしろかったです。' }
  ],
  answer:1
},
{
  id:'RULE-322', world:'w4', type:'skill', category:'bun',
  skill:'だんらくの 見なおし', difficulty:2,
  title:'だんらくの はじめは 一マス あける',
  childExplanation:'だんらくを かえた ときも、そのはじめは 一マス あけます。だんらくの 数だけ、一マス空けが ありますよ。',
  correctExample:'あたらしい だんらくも 一マス あけて はじめる',
  wrongExample:'2つ目の だんらくを いちばん上から 書く',
  hint:'げんこう用紙の 森で ならった きまりを 思い出して みよう。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'2つ目の だんらくの はじめも、一マス あけて 書く。',
  answer:true
},
{
  id:'RULE-323', world:'w4', type:'skill', category:'bun',
  skill:'つなぎことば「だから」', difficulty:3,
  title:'わけを つなぐ ときは「だから」',
  childExplanation:'前の ことが りゆうに なって いる ときは「だから」で つなぎます。りゆうと けっかが はっきりしますよ。',
  correctExample:'雨が ふりました。だから えんそくは 中止に なりました。',
  wrongExample:'雨が ふりました。それから えんそくは 中止に なりました。',
  hint:'雨が ふった ことが、中止の りゆうだね。',
  questionType:'choice',
  question:'「雨が ふりました。（　）えんそくは 中止に なりました。」（　）に 入るのは？',
  choices:[
    { text:'だから' },
    { text:'そして' },
    { text:'それから' }
  ],
  answer:0
},
{
  id:'RULE-324', world:'w4', type:'skill', category:'bun',
  skill:'出来事の じゅんばん', difficulty:2,
  title:'はじめ・なか・おわりの じゅんに 書く',
  childExplanation:'作文は「はじめ（いつ・どこで）」「なか（した こと）」「おわり（気もち）」の じゅんに 書くと、まとまりますよ。',
  correctExample:'日よう日に プールへ 行った → いっぱい およいだ → また 行きたい',
  wrongExample:'また 行きたい → プールへ 行った',
  hint:'さいごに くるのは、じぶんの 気もちだね。',
  questionType:'order',
  question:'作文の じゅんばんに タップして ならべよう。',
  items:['二十五メートル およげました。','日よう日に プールへ 行きました。','また 行きたいと 思いました。'],
  answer:[1,0,2]
},

/* ---------- WORLD 5 ついか分 ---------- */
{
  id:'RULE-409', world:'w5', type:'skill', category:'kuwashiku',
  skill:'「すごかった」を くわしく', difficulty:2,
  title:'何が どう すごかったのかを 書く',
  childExplanation:'「すごかった」は つかっても いい ことばです。でも その あとに「何が どう すごかったのか」を 書くと、読む 人にも 見えて きますよ。答えは 一つでは ありません。',
  correctExample:'　山が すごかったです。雲より 高く 見えました。',
  wrongExample:'　山が すごかったです。',
  hint:'どのくらい 大きかった？ 何と くらべると 分かるかな？',
  questionType:'rewrite',
  question:'「山が すごかったです。」の つぎに 書くと よいのは？（いくつも 正かい）',
  choices:[
    { text:'雲より 高く 見えました。' },
    { text:'とても すごかったです。' },
    { text:'上を 見あげても てっぺんが 見えませんでした。' }
  ],
  answers:[0,2], anyOf:true
},
{
  id:'RULE-410', world:'w5', type:'skill', category:'kuwashiku',
  skill:'気もちを 書く', difficulty:2,
  title:'出来事の あとに 気もちを 書く',
  childExplanation:'出来事を 書いたら、その ときの 気もちを 書きたします。おなじ 出来事でも、気もちは 人それぞれ。きみの ことばで 書きましょう。',
  correctExample:'　さか上がりが できました。とびあがるほど うれしかったです。',
  wrongExample:'　さか上がりが できました。',
  hint:'できた とき、心の中は どんな かんじだった？',
  questionType:'rewrite',
  question:'「さか上がりが できました。」の つぎに 書くと よいのは？（いくつも 正かい）',
  choices:[
    { text:'とびあがるほど うれしかったです。' },
    { text:'できました。' },
    { text:'むねが どきどきして、体が かるく なった 気が しました。' }
  ],
  answers:[0,2], anyOf:true
},
{
  id:'RULE-411', world:'w5', type:'skill', category:'kuwashiku',
  skill:'りゆうを 書く', difficulty:3,
  title:'「どうして そう思ったの？」を 書く',
  childExplanation:'気もちを 書いたら、もう一歩。「どうして そう 思ったのか」を 書くと、読む 人が きみの 心の 中まで 分かりますよ。',
  correctExample:'　うれしかったです。何回も れんしゅうした かいが あったからです。',
  wrongExample:'　うれしかったです。',
  hint:'どうして うれしかったのかな？ その わけを 書こう。',
  questionType:'rewrite',
  question:'「うれしかったです。」の つぎに 書くと よいのは？（いくつも 正かい）',
  choices:[
    { text:'何回も れんしゅうした かいが あったからです。' },
    { text:'すごく うれしかったです。' },
    { text:'先生が「よく がんばったね。」と ほめて くれたからです。' }
  ],
  answers:[0,2], anyOf:true
},
{
  id:'RULE-412', world:'w5', type:'skill', category:'kuwashiku',
  skill:'五かん（見る）', difficulty:2,
  title:'目で 見た ことを 書く',
  childExplanation:'色・形・大きさ・動きなど、目で 見た ことを 書くと、読む 人の あたまに ばめんが うかびます。',
  correctExample:'　空が オレンジ色に そまって いました。',
  wrongExample:'　空が きれいでした。',
  hint:'どんな 色だった？ どんな 形だった？',
  questionType:'choice',
  question:'見た ようすが よく 分かるのは どっち？',
  choices:[
    { text:'空が きれいでした。' },
    { text:'空が オレンジ色に そまって いました。' }
  ],
  answer:1
},
{
  id:'RULE-413', world:'w5', type:'skill', category:'kuwashiku',
  skill:'五かん（音）', difficulty:2,
  title:'聞こえた 音を 書く',
  childExplanation:'「ザーザー」「シャリシャリ」など、聞こえた 音を 書くと、その ばしょに いる ような 気もちに なります。',
  correctExample:'　雨が ザーザーと やねを たたいて いました。',
  wrongExample:'　雨が ふって いました。',
  hint:'その とき、どんな 音が 聞こえた？',
  questionType:'rewrite',
  question:'「雨が ふって いました。」を くわしく するには？（いくつも 正かい）',
  choices:[
    { text:'雨が ザーザーと やねを たたいて いました。' },
    { text:'雨が たくさん ふって いました。' },
    { text:'かさに あたる 雨の 音が、ぱらぱらと 聞こえました。' }
  ],
  answers:[0,2], anyOf:true
},
{
  id:'RULE-414', world:'w5', type:'skill', category:'kuwashiku',
  skill:'五かん（におい・あじ）', difficulty:2,
  title:'においや あじも 書いて みる',
  childExplanation:'においや あじを 書くと、読む 人まで 食べたく なります。「あまい」「すっぱい」「香ばしい」など、思い出して みましょう。',
  correctExample:'　やきたての パンの においが、家じゅうに 広がりました。',
  wrongExample:'　パンが おいしかったです。',
  hint:'どんな においだった？ 口の 中は どんな かんじ？',
  questionType:'choice',
  question:'その ばめんが うかぶのは どっち？',
  choices:[
    { text:'パンが おいしかったです。' },
    { text:'やきたての パンの においが、家じゅうに 広がりました。' }
  ],
  answer:1
},
{
  id:'RULE-415', world:'w5', type:'skill', category:'kuwashiku',
  skill:'五かん（さわる）', difficulty:2,
  title:'さわった かんじを 書く',
  childExplanation:'つめたい・ふわふわ・ざらざらなど、さわった かんじを 書くと、読む 人の 手にも つたわります。',
  correctExample:'　海の 水は 手が しびれるほど つめたかったです。',
  wrongExample:'　海の 水は つめたかったです。',
  hint:'さわった とき、手は どんな かんじに なった？',
  questionType:'rewrite',
  question:'「海の 水は つめたかったです。」を くわしく するには？（いくつも 正かい）',
  choices:[
    { text:'手が しびれるほど つめたかったです。' },
    { text:'とても つめたかったです。' },
    { text:'足を 入れた しゅんかん、ぴりっと するほど つめたく 感じました。' }
  ],
  answers:[0,2], anyOf:true
},
{
  id:'RULE-416', world:'w5', type:'skill', category:'kuwashiku',
  skill:'気もちの ことば', difficulty:2,
  title:'気もちの ことばを えらぶ',
  childExplanation:'「楽しかった」だけで なく、「どきどきした」「ほっとした」「ふしぎだった」など、ぴったりの ことばを えらぶと 気もちが つたわります。',
  correctExample:'はじめての はっぴょうで、むねが どきどきしました。',
  wrongExample:'はじめての はっぴょうで、楽しかったです。',
  hint:'はじめての はっぴょう。どんな 気もちに なるかな？',
  questionType:'choice',
  question:'はじめて はっぴょうする ときの 気もちに ぴったりなのは どっち？',
  choices:[
    { text:'楽しかったです。' },
    { text:'むねが どきどきしました。' }
  ],
  answer:1
},
{
  id:'RULE-417', world:'w5', type:'skill', category:'kuwashiku',
  skill:'りゆうを 書く', difficulty:3,
  title:'「〜からです。」で わけを 書く',
  childExplanation:'わけを 書く ときは「〜からです。」と 書くと、はっきり つたわります。気もちと わけは セットで 書きましょう。',
  correctExample:'　また 行きたいです。魚を たくさん 見られたからです。',
  wrongExample:'　また 行きたいです。',
  hint:'どうして また 行きたいと 思ったのかな？',
  questionType:'rewrite',
  question:'「また 行きたいです。」の つぎに 書くと よいのは？（いくつも 正かい）',
  choices:[
    { text:'魚を たくさん 見られたからです。' },
    { text:'とても 行きたいです。' },
    { text:'こんどは 家ぞく みんなで 行きたいからです。' }
  ],
  answers:[0,2], anyOf:true
},
{
  id:'RULE-418', world:'w5', type:'skill', category:'kuwashiku',
  skill:'数や 大きさで くわしく', difficulty:2,
  title:'数や 大きさを 入れて 書く',
  childExplanation:'「たくさん」より「十こ」、「大きい」より「かおと 同じくらい」。数や くらべる ものを 入れると、ぐっと はっきりします。',
  correctExample:'　どんぐりを 二十こ ひろいました。',
  wrongExample:'　どんぐりを たくさん ひろいました。',
  hint:'いくつ ひろった？ どのくらいの 大きさ だった？',
  questionType:'rewrite',
  question:'「どんぐりを たくさん ひろいました。」を くわしく するには？（いくつも 正かい）',
  choices:[
    { text:'どんぐりを 二十こ ひろいました。' },
    { text:'どんぐりを いっぱい ひろいました。' },
    { text:'ポケットが ふくらむほど どんぐりを ひろいました。' }
  ],
  answers:[0,2], anyOf:true
},
{
  id:'RULE-419', world:'w5', type:'skill', category:'kuwashiku',
  skill:'かい話で くわしく', difficulty:3,
  title:'かい話を 入れると ばめんが 見える',
  childExplanation:'その とき 言った ことばを そのまま 書くと、ばめんが 目に うかびます。かい話文の きまりも 思い出して 書きましょう。',
  correctExample:'　母が「よく できたね。」と ほめて くれました。',
  wrongExample:'　母に ほめられました。',
  hint:'お母さんは、なんと 言って くれたのかな？',
  questionType:'choice',
  question:'ばめんが よく 見えるのは どっち？',
  choices:[
    { text:'母に ほめられました。' },
    { text:'母が「よく できたね。」と ほめて くれました。' }
  ],
  answer:1
},
{
  id:'RULE-420', world:'w5', type:'skill', category:'kuwashiku',
  skill:'同じ ことばの くりかえし', difficulty:2,
  title:'同じ ことばで おわらせない',
  childExplanation:'「楽しかった」「すごかった」ばかりだと、どこが よかったのか 分かりません。一つでも 中みを 書きたして みましょう。',
  correctExample:'　うんどう会は 楽しかったです。とくに リレーで ぬかせた ときが うれしかったです。',
  wrongExample:'　楽しかったです。すごかったです。楽しかったです。',
  hint:'とくに よかったのは どこ？ 一つ えらんで くわしく 書こう。',
  questionType:'choice',
  question:'読む 人に つたわるのは どっち？',
  choices:[
    { text:'楽しかったです。すごかったです。楽しかったです。' },
    { text:'とくに リレーで ぬかせた ときが うれしかったです。' }
  ],
  answer:1
},
{
  id:'RULE-421', world:'w5', type:'skill', category:'kuwashiku',
  skill:'読みかえして 直す', difficulty:2,
  title:'書きおわったら 読みかえす',
  childExplanation:'書きおわったら、はじめから 声に 出して 読みかえします。字の まちがいや、足りない ところが 見つかりますよ。',
  correctExample:'書きおわってから 読みかえして 直す',
  wrongExample:'書いたら そのまま 出す',
  hint:'これまでの もんだいで 見つけた まちがいも、読みかえせば 気づけたね。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'作文は 書きおわったら、はじめから 読みかえして たしかめる。',
  answer:true
},
{
  id:'RULE-422', world:'w5', type:'skill', category:'kuwashiku',
  skill:'「楽しかった」を くわしく', difficulty:3,
  title:'「楽しかった」の 中みを 書く',
  childExplanation:'「楽しかった」で おわらせずに、どこが どう 楽しかったのかを 書きます。それが きみだけの 作文に なりますよ。',
  correctExample:'　楽しかったです。友だちと 大なわを 百回 とべたからです。',
  wrongExample:'　楽しかったです。',
  hint:'何を して いる ときが いちばん 楽しかった？',
  questionType:'rewrite',
  question:'「きのうは 楽しかったです。」の つぎに 書くと よいのは？（いくつも 正かい）',
  choices:[
    { text:'友だちと 大なわを 百回 とべたからです。' },
    { text:'ほんとうに 楽しかったです。' },
    { text:'にがてだった さかあがりが、はじめて できたからです。' }
  ],
  answers:[0,2], anyOf:true
},
{
  id:'RULE-423', world:'w5', type:'skill', category:'kuwashiku',
  skill:'書き出しの くふう', difficulty:3,
  title:'いつ・どこで から 書きはじめる',
  childExplanation:'書き出しに「いつ」「どこで」を 入れると、読む 人が すぐに ばめんを 思いうかべられます。',
  correctExample:'　日よう日に、家ぞくで 川へ 行きました。',
  wrongExample:'　行きました。',
  hint:'いつの こと？ どこへ 行ったの？',
  questionType:'choice',
  question:'書き出しに よいのは どっち？',
  choices:[
    { text:'川へ 行きました。' },
    { text:'日よう日に、家ぞくで 川へ 行きました。' }
  ],
  answer:1
},
{
  id:'RULE-424', world:'w5', type:'skill', category:'kuwashiku',
  skill:'作文の しあげ', difficulty:2,
  title:'「書いたら、もう一歩！」',
  childExplanation:'出来事を 書いたら もう一歩。「くわしく する」「気もちを 書く」「どうして そう思ったかを 書く」。この 三つを 思い出しましょう。',
  correctExample:'出来事 → くわしく → 気もち → りゆう',
  wrongExample:'出来事だけ 書いて おわり',
  hint:'出来事を 書いた あとに、もう一歩 すすめられるね。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'出来事を 書いたら、くわしく したり 気もちを 書いたり して、もう一歩 すすめる。',
  answer:true
},

/* ---------- WORLD 1 ついか分 ---------- */
{
  id:'RULE-003', world:'w1', type:'school_rule', category:'genkou',
  skill:'だい名の 書きはじめ', difficulty:1,
  title:'だい名は 上から 書かない',
  childExplanation:'だい名を 1マス目から 書くと、つまって 見えます。上を 2〜3マス あけると、ぐっと 読みやすく なりますよ。',
  correctExample:'　　　はるのえんそく',
  wrongExample:'はるのえんそく',
  hint:'1行目の いちばん 上の マスを 見てみよう。',
  questionType:'find',
  question:'だい名の 書きはじめが おかしいよ。おかしい マスを タップしよう。',
  manuscript:{ cols:12, rows:['はるのえんそく'] },
  answers:[[0,0]]
},
{
  id:'RULE-008', world:'w1', type:'school_rule', category:'genkou',
  skill:'名前の そろえかた', difficulty:1,
  title:'名前は 下を 1マス あけて そろえる',
  childExplanation:'名前は 2行目に 書きます。下を 1マス あけて とめると、どの子の 作文も きれいに そろいますよ。',
  correctExample:'下を 1マス あけて　山田　たろう',
  wrongExample:'いちばん下まで 書く',
  hint:'お手本の いちばん 下の マスを 見てみよう。空いて いるかな？',
  questionType:'ox',
  question:'お手本を 見ながら こたえよう。これは 正しい？',
  statement:'名前は 2行目に 書き、下を 1マス あけて そろえる。',
  manuscript:{ cols:12, rows:['　　　　　山田　たろう'] },
  manuscriptLabel:'お手本：下を 1マス あけた 名前',
  answer:true
},
{
  id:'RULE-009', world:'w1', type:'rule', category:'genkou',
  skill:'だんらくの 一マス空け', difficulty:1,
  title:'書きはじめは かならず 一マス あける',
  childExplanation:'作文の 書きはじめは、かならず 一マス あけます。ここが そろうと、読む人が「はじまったな」と すぐ 分かります。',
  correctExample:'　きょうは、雨がふりました。',
  wrongExample:'きょうは、雨がふりました。',
  hint:'いちばん さいしょの マスに 字が 入って いないかな？',
  questionType:'choice',
  question:'書きはじめが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['きょうは、雨がふり','ました。'] } },
    { manuscript:{ cols:9, rows:['　きょうは、雨がふ','りました。'] } }
  ],
  answer:1
},
{
  id:'RULE-010', world:'w1', type:'rule', category:'genkou',
  skill:'行のさいごの 読点', difficulty:2,
  title:'「、」も つぎの行の 上に 書かない',
  childExplanation:'「。」と 同じで、「、」も つぎの行の いちばん上には 書きません。行の さいごの 字と 同じマスに 入れましょう。',
  correctExample:'　あさおきて、← 「て」と「、」を 同じマスに',
  wrongExample:'つぎの行の いちばん上に 「、」だけ 書く',
  hint:'「、」が 行の いちばん 上に きて いないかな？',
  questionType:'choice',
  question:'「、」の 入れかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:6, rows:['　あさおきて','、かおをあら','いました。'] } },
    { manuscript:{ cols:6, rows:['　あさおきて、','かおをあらい','ました。'] } }
  ],
  answer:1
},
{
  id:'RULE-011', world:'w1', type:'rule', category:'genkou',
  skill:'文の おわりの 句点', difficulty:1,
  title:'文の おわりに「。」を わすれない',
  childExplanation:'文が おわったら「。」を つけます。「。」が ないと、どこで 文が おわったのか 分からなく なりますよ。',
  correctExample:'　あさから雨がふりました。',
  wrongExample:'　あさから雨がふりました',
  hint:'さいごの 字の つぎの マスが 空いて いるね。そこに 何が 入るかな？',
  questionType:'find',
  question:'「。」を わすれて いるよ。「。」が 入る マスを タップしよう。',
  manuscript:{ cols:9, rows:['　あさから雨がふり','ました'] },
  emptyOk:true,
  answers:[[1,3]]
},
{
  id:'RULE-013', world:'w1', type:'rule', category:'genkou',
  skill:'一マス一文字', difficulty:1,
  title:'小さい字も 1マス つかう',
  childExplanation:'小さい「っ」「ゃ」「ゅ」「ょ」も、1つで 1マス つかいます。前の 字と 同じマスには 入れませんよ。',
  correctExample:'「がっこう」は 4マス',
  wrongExample:'「がっこう」を 3マスで 書く',
  hint:'お手本の 小さい「っ」は、いくつの マスを つかって いるかな？',
  questionType:'ox',
  question:'お手本を 見ながら こたえよう。これは 正しい？',
  statement:'小さい「っ」や「ょ」も、1つで 1マス つかう。',
  manuscript:{ cols:4, rows:['がっこう'] },
  manuscriptLabel:'お手本：小さい「っ」も 1マス',
  answer:true
},
{
  id:'RULE-014', world:'w1', type:'rule', category:'genkou',
  skill:'だんらくの かえかた', difficulty:3,
  title:'話が かわったら だんらくを かえる',
  childExplanation:'べつの 話に なったら、行を かえて、また 一マス あけて 書きはじめます。まとまりが 見えて、とても 読みやすく なりますよ。',
  correctExample:'あさの話の あとで 行を かえ、一マス あけて ひるの話を 書く',
  wrongExample:'あさの話と ひるの話を ずっと つづけて 書く',
  hint:'あさの 話と ひるの 話、べつの まとまりだね。行を かえた ほうは どっち？',
  questionType:'choice',
  question:'だんらくの 分けかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　あさ、そうじをし','ました。ひるは百マ','スをしました。'] } },
    { manuscript:{ cols:9, rows:['　あさ、そうじをし','ました。','　ひるは百マスをし','ました。'], }, allowShort:[1] }
  ],
  answer:1
},
{
  id:'RULE-015', world:'w1', type:'rule', category:'genkou',
  skill:'読点（、）の いれどころ', difficulty:2,
  title:'「、」は 一息 つく ところに 入れる',
  childExplanation:'「、」は 声に 出して 読んだ とき、一息 つく ところに 入れます。ことばの まとまりを こわさない ように しましょう。入れる ばしょは 一つとは かぎりません。',
  correctExample:'夕がた、雨がふったのでかさをさしました。',
  wrongExample:'夕がた雨が、ふったのでかさをさしました。',
  hint:'声に 出して 読んで みよう。どこで 息を つく かな？',
  questionType:'slot',
  question:'「、」を 入れると 読みやすい ところは どこ？',
  parts:['夕がた','雨がふったので','かさを','さしました。'],
  answers:[0,1], anyOf:true,
  insert:'、'
},
{
  id:'RULE-016', world:'w1', type:'rule', category:'genkou',
  skill:'行の つかいかた', difficulty:2,
  title:'行の とちゅうで 意味なく 改行しない',
  childExplanation:'文が つづいて いる ときは、行の さいごの マスまで 字を つめて 書きます。とちゅうで 行を かえると、あなが 空いて 読みにくく なりますよ。',
  correctExample:'　ぼくは公園へ行き（行の さいごまで つめる）',
  wrongExample:'　ぼくは公園へ（と中で 行を かえる）',
  hint:'1行目の 下の ほうに、空いた マスが ないか 見てみよう。',
  questionType:'choice',
  question:'行の さいごまで 字を つめて 書いて いるのは どっち？',
  choices:[
    { manuscript:{ cols:9, rows:['　ぼくは公園へ','行きました。'] }, allowShort:[0] },
    { manuscript:{ cols:9, rows:['　ぼくは公園へ行き','ました。'] } }
  ],
  answer:1
},
{
  id:'RULE-017', world:'w1', type:'rule', category:'genkou',
  skill:'句読点の きまり', difficulty:2,
  title:'句読点は 行の いちばん上に 書かない',
  childExplanation:'「、」や「。」が 行の いちばん上に くるのは よく ありません。前の行の さいごの 字と 同じマスに 入れましょう。',
  correctExample:'さいごの 字と 同じマスに 入れる',
  wrongExample:'つぎの行の いちばん上に 書く',
  hint:'これまでに ならった「、」「。」の きまりを 思い出して みよう。',
  questionType:'ox',
  question:'これは 正しい？',
  statement:'「。」が 行の いちばん上に きても、そのまま 書いて よい。',
  answer:false
},
{
  id:'RULE-018', world:'w1', type:'school_rule', category:'genkou',
  skill:'作文の 組み立て', difficulty:1,
  title:'だい名・名前・本文の じゅんばん',
  childExplanation:'げんこう用紙は、1行目に だい名、2行目に 名前、3行目から 本文の じゅんに 書きます。',
  correctExample:'だい名 → 名前 → 本文',
  wrongExample:'本文から 書きはじめる',
  hint:'げんこう用紙の いちばん 右の 行から 見て いこう。',
  questionType:'order',
  question:'げんこう用紙に 書く じゅんばんに タップして ならべよう。',
  items:['本文を 書く','だい名を 書く','名前を 書く'],
  answer:[1,2,0]
},
{
  id:'RULE-019', world:'w1', type:'school_rule', category:'genkou',
  skill:'だい名の 書きかた', difficulty:1,
  title:'だい名は 上を あけて 書く',
  childExplanation:'だい名は 上を 2〜3マス あけて 書きます。まん中あたりから はじまる ように 見えて、かっこよく なりますよ。',
  correctExample:'　　　はるのえんそく',
  wrongExample:'はるのえんそく',
  hint:'上に 空いて いる マスが あるのは どっちかな？',
  questionType:'choice',
  question:'だい名の 書きかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:10, rows:['はるのえんそく'] } },
    { manuscript:{ cols:10, rows:['　　　はるのえんそく'] } }
  ],
  answer:1
},
{
  id:'RULE-021', world:'w1', type:'school_rule', category:'genkou',
  skill:'名前の 書きかた', difficulty:2,
  title:'名字と 名前の あいだを 1マス あける',
  childExplanation:'名前は、名字と 名前の あいだを 1マス あけて 書きます。どこまでが 名字か、ひと目で 分かりますよ。',
  correctExample:'山田　はなこ',
  wrongExample:'山田はなこ',
  hint:'「山田」と「はなこ」の あいだを 見てみよう。',
  questionType:'choice',
  question:'名前の 書きかたが 正しいのは どっち？',
  choices:[
    { manuscript:{ cols:12, rows:['　　　　　　山田はなこ'] } },
    { manuscript:{ cols:12, rows:['　　　　　山田　はなこ'] } }
  ],
  answer:1
},
{
  id:'RULE-022', world:'w1', type:'rule', category:'genkou',
  skill:'一マス空けの 見なおし', difficulty:2,
  title:'書きおわったら 書きはじめを たしかめる',
  childExplanation:'書きおわったら、さいしょの マスを たしかめる くせを つけましょう。一マス あいて いれば ばっちりです。',
  correctExample:'　あしたは学校で百マスをします。',
  wrongExample:'あしたは学校で百マスをします。',
  hint:'1行目の いちばん さいしょの マスだよ。',
  questionType:'find',
  question:'おかしい マスを タップしよう。',
  manuscript:{ cols:9, rows:['あしたは学校で百マ','スをします。'] },
  answers:[[0,0]]
},
];

/* =========================================================
   もんだいの べつパターン
   ---------------------------------------------------------
   ・もとの もんだいと ここにある パターンを こうたいで 出します。
   ・せんたくしと ならべかえカードの 位置は script.js が 毎回 まぜます。
   ・ルールの せつめいは 同じまま、文や ばめんだけを かえます。
   ========================================================= */
const RULE_VARIANTS = {

  /* WORLD 1 げんこう用紙の森 */
  'RULE-001': [{
    statement:'だい名は、1行目の いちばん上の マスから 書きはじめる。',
    manuscript:{ cols:10, rows:['　　ぼくの宝もの'] },
    manuscriptLabel:'お手本：上を 2マス あけた だい名',
    answer:false,
    correctExample:'　　ぼくの宝もの', wrongExample:'ぼくの宝もの'
  }],
  'RULE-002': [{
    choices:[
      { manuscript:{ cols:12, rows:['　　　　　佐藤　みほ'] } },
      { manuscript:{ cols:12, rows:['佐藤みほ'] } }
    ],
    answer:0,
    correctExample:'下を 1マス あけて　佐藤　みほ', wrongExample:'いちばん上から　佐藤みほ'
  }],
  'RULE-012': [{
    choices:[
      { manuscript:{ cols:9, rows:['　きょう、図書館へ','行きました。'] } },
      { manuscript:{ cols:9, rows:['きょう、図書館へ行','きました。'] } }
    ],
    answer:0,
    correctExample:'　きょう、図書館へ行きました。', wrongExample:'きょう、図書館へ行きました。'
  }],
  'RULE-004': [{
    choices:[
      { manuscript:{ cols:7, rows:['　大きな声でう','たいおわった。'] } },
      { manuscript:{ cols:7, rows:['　大きな声でう','たいおわった','。'] } }
    ],
    answer:0,
    correctExample:'うたいおわった。\n← さいごの字と「。」は 同じマス', wrongExample:'うたいおわった\n。 ← つぎの行の 上に「。」'
  }],
  'RULE-005': [{
    parts:['きのう','おとうとといっしょに','図書館へ行きました。'],
    answers:[0,1],
    hint:'「きのう」の あとや、「だれと」の まとまりの あとで 一息 つけるね。',
    correctExample:'きのう、おとうとといっしょに、図書館へ行きました。', wrongExample:'きのうおとうとと、いっしょに図書館へ行きました。'
  }],
  'RULE-006': [{
    manuscript:{ cols:9, rows:['あさ、おとうとと公','園へ行きました。'] },
    answers:[[0,0]],
    correctExample:'　あさ、おとうとと公園へ行きました。', wrongExample:'あさ、おとうとと公園へ行きました。'
  }],
  'RULE-007': [{
    manuscript:{ cols:9, rows:['　わたしは本を読み','ました'] },
    answers:[[1,3]],
    correctExample:'　わたしは本を読みました。', wrongExample:'　わたしは本を読みました'
  }],

  /* WORLD 2 文字の どうくつ */
  'RULE-101': [{
    manuscript:{ cols:9, rows:['　ぼくわ、ねこが好','きです。'] },
    answers:[[0,3]],
    hint:'「ぼく◯」の ところだよ。「ぼくは」と 書くね。',
    correctExample:'ぼくは、ねこが好きです。', wrongExample:'ぼくわ、ねこが好きです。'
  }],
  'RULE-102': [{
    choices:[ { text:'公園へ はしりました。' }, { text:'公園え はしりました。' } ],
    answer:0,
    correctExample:'公園へ はしりました。', wrongExample:'公園え はしりました。'
  }],
  'RULE-103': [{
    choices:[ { text:'手紙お 書きました。' }, { text:'手紙を 書きました。' } ],
    answer:1,
    correctExample:'手紙を 書きました。', wrongExample:'手紙お 書きました。'
  }],
  'RULE-104': [{
    manuscript:{ cols:9, rows:['　学校でサツカーを','しました。'] },
    answers:[[0,5]],
    hint:'「サ◯カー」の つまる音は、小さい「ッ」だよ。',
    correctExample:'学校でサッカーをしました。', wrongExample:'学校でサツカーをしました。'
  }],
  'RULE-105': [{
    manuscript:{ cols:9, rows:['　しゆくだいをして','きようしつへ行きま','した。'] },
    answers:[[0,2],[1,1]],
    hint:'「し◯くだい」と「き◯うしつ」。小さい字が 2つ あるよ。',
    correctExample:'しゅくだいをして、きょうしつへ行きました。', wrongExample:'しゆくだいをして、きようしつへ行きました。'
  }],
  'RULE-106': [{
    choices:[ { text:'ケーキを 食べました。' }, { text:'ケえキを 食べました。' } ],
    answer:0,
    correctExample:'ケーキを 食べました。', wrongExample:'ケえキを 食べました。'
  }],
  'RULE-107': [{
    statement:'小さい「っ」や「ょ」は、前の字と 同じマスに 書く。',
    answer:false
  }],
  'RULE-108': [{
    manuscript:{ cols:9, rows:['　ぼくわ、海え行き','ました。'] },
    answers:[[0,3],[0,6]],
    hint:'「ぼく◯」と「海◯行く」の 2か所を 見なおそう。',
    correctExample:'ぼくは、海へ行きました。', wrongExample:'ぼくわ、海え行きました。'
  }],

  /* WORLD 3 おしゃべり城 */
  'RULE-201': [{
    statement:'人が 話した ことばも、かぎかっこを つけずに 書く。',
    answer:false
  }],
  'RULE-202': [{
    choices:[
      { manuscript:{ cols:9, rows:['　お父さんがかえっ','て「ただいま。」と言','いました。'] } },
      { manuscript:{ cols:9, rows:['　お父さんがかえっ','てきました。','「ただいま。」'] } }
    ],
    answer:1,
    correctExample:'　お父さんがかえってきました。\n「ただいま。」', wrongExample:'　お父さんが「ただいま。」と言いました。'
  }],
  'RULE-203': [{
    choices:[
      { manuscript:{ cols:9, rows:['「あしたも、いっし','ょにあそぼうね。」'] } },
      { manuscript:{ cols:9, rows:['「あしたも、いっし','　ょにあそぼうね。」'] } }
    ],
    answer:1,
    correctExample:'「あしたも、いっし\n　ょにあそぼうね。」', wrongExample:'「あしたも、いっし\nょにあそぼうね。」'
  }],
  'RULE-204': [{
    choices:[
      { manuscript:{ cols:7, rows:['「またね。」'] } },
      { manuscript:{ cols:7, merge:false, rows:['「またね。」'] } }
    ],
    answer:0,
    correctExample:'「またね。」 ← 「。」と「」」は 同じマス', wrongExample:'「またね。」 ← さいごを 2マスに 分ける'
  }],
  'RULE-205': [{
    choices:[
      { manuscript:{ cols:9, rows:['「がんばってね。」','　姉が手をふりまし','た。'] } },
      { manuscript:{ cols:9, rows:['「がんばってね。」姉','が手をふりました。'] } }
    ],
    answer:0,
    correctExample:'「がんばってね。」\n　姉が手をふりました。', wrongExample:'「がんばってね。」姉が手をふりました。'
  }],
  'RULE-206': [{
    manuscript:{ cols:9, rows:['　姉がまたね。」と言','いました。'] },
    choices:[
      { text:'はじめの かぎかっこ「 が ぬけている' },
      { text:'「、」が 足りない' },
      { text:'文の おわりの「。」が ない' }
    ],
    answer:0,
    hint:'おわりの 」は あるね。では、はじめの しるしは あるかな？',
    correctExample:'　姉が「またね。」と言いました。', wrongExample:'　姉がまたね。」と言いました。'
  }],
  'RULE-207': [{
    statement:'かい話文の はじめの「 は、一マス あけてから 書く。',
    answer:false
  }],

  /* WORLD 4 文しょうロード */
  'RULE-301': [{
    choices:[
      { text:'大きな 絵を かきました。' },
      { text:'わたしは、大きな 絵を かきました。' }
    ],
    answer:1,
    hint:'絵を かいたのは だれかな？ それが 書いてある 文を えらぼう。',
    correctExample:'わたしは、大きな絵をかきました。', wrongExample:'大きな絵をかきました。'
  }],
  'RULE-302': [{
    choices:[
      { text:'公園へ行って、友だちに会って、おにごっこをして、ジュースを飲んで、家へかえりました。' },
      { text:'公園へ行って、友だちに会いました。いっしょに、おにごっこをしました。ジュースを飲んで、家へかえりました。' }
    ],
    answer:1,
    correctExample:'公園へ行って、友だちに会いました。いっしょに、おにごっこをしました。', wrongExample:'公園へ行って、友だちに会って、おにごっこをして、ジュースを飲んで…'
  }],
  'RULE-303': [{
    items:['学校へ 行きました。','あさごはんを 食べました。','目を さましました。'],
    answer:[2,1,0],
    hint:'まず 目を さまして、それから あさごはんだね。',
    correctExample:'目をさましました。あさごはんを食べました。学校へ行きました。', wrongExample:'学校へ行きました。目をさましました。'
  }],
  'RULE-304': [{
    question:'あてはまるのは どっち？　「この花は 赤いです。◯◯◯、とても いい においです。」',
    choices:[ { text:'そして' }, { text:'それから' } ],
    answer:0,
    correctExample:'この花は赤いです。そして、とてもいいにおいです。', wrongExample:'この花は赤いです。それから、とてもいいにおいです。'
  }],
  'RULE-305': [{
    question:'あてはまるのは どっち？　「手を あらいました。◯◯◯◯、ごはんを 食べました。」',
    choices:[ { text:'それから' }, { text:'そして' } ],
    answer:0,
    correctExample:'手をあらいました。それから、ごはんを食べました。', wrongExample:'手をあらいました。そして、ごはんを食べました。'
  }],
  'RULE-306': [{
    statement:'「それから」は、二つの ものの ようすを つけ足す ときに つかう。',
    answer:false
  }],
  'RULE-307': [{
    statement:'話が かわっても、行を かえずに そのまま つづけて 書く。',
    answer:false
  }],
  'RULE-308': [{
    question:'学校の 一日を じゅんばんに ならべよう。',
    items:['きゅう食を 食べました。','朝の会を しました。','家に かえりました。','国語の べんきょうを しました。'],
    answer:[1,3,0,2],
    hint:'学校に ついたら、まず 朝の会から はじまるね。',
    correctExample:'朝の会をしました。国語をべんきょうしました。きゅう食を食べました。家にかえりました。', wrongExample:'家にかえってから、朝の会をしました。'
  }],

  /* WORLD 5 マチガエール魔王城 */
  'RULE-401': [{
    question:'「石を 見つけました。」を くわしく するには？（いくつも 正かい）',
    choices:[
      { text:'手のひらくらいの 大きさでした。' },
      { text:'石でした。' },
      { text:'白い しまもようが ありました。' }
    ],
    answers:[0,2],
    hint:'大きさや 色、もようを 書くと、どんな 石か 目に うかぶね。',
    correctExample:'手のひらくらいで、白いしまもようの石でした。', wrongExample:'石を見つけました。'
  }],
  'RULE-402': [{
    question:'「ずっと れんしゅうした 曲が ひけました。」の あとに あう 気もちは？（いくつも 正かい）',
    choices:[
      { text:'ほっと しました。' },
      { text:'うれしく なりました。' },
      { text:'おなかが すきました。' },
      { text:'えんぴつを けずりました。' }
    ],
    answers:[0,1],
    hint:'できた しゅんかんの 心の 中を 思い出そう。',
    correctExample:'曲がひけて、ほっとしました。うれしくなりました。', wrongExample:'曲がひけました。'
  }],
  'RULE-403': [{
    question:'「どきどき しました。」の つぎに 書くと よいのは？',
    choices:[
      { text:'どきどき しました。' },
      { text:'はじめて 大ぜいの 前で 発表したからです。' },
      { text:'おわり。' }
    ],
    answer:1,
    hint:'どうして どきどきしたのかが 分かる 文を えらぼう。',
    correctExample:'どきどきしました。はじめて大ぜいの前で発表したからです。', wrongExample:'どきどきしました。'
  }],
  'RULE-404': [{
    question:'「海を 見ました。」を くわしく するには？（いくつも 正かい）',
    choices:[
      { text:'波が ザブーンと 音を 立てていました。' },
      { text:'水が 日の光で きらきら 光っていました。' },
      { text:'海でした。' },
      { text:'すごかったです。' }
    ],
    answers:[0,1],
    hint:'耳で 聞いた 波の音と、目で 見た 光を 書けるね。',
    correctExample:'波がザブーンと音を立て、水がきらきら光っていました。', wrongExample:'海を見ました。'
  }],
  'RULE-405': [{
    question:'「雪を さわりました。」を くわしく するのは どれ？',
    choices:[
      { text:'手のひらが ひんやりして、雪は やわらかかったです。' },
      { text:'雪でした。' },
      { text:'たのしかったです。' }
    ],
    answer:0,
    hint:'手で さわったときの つめたさや、かたさを 書こう。',
    correctExample:'手のひらがひんやりして、雪はやわらかかったです。', wrongExample:'雪をさわりました。'
  }],
  'RULE-406': [{
    question:'「おもしろかったです。」が 3かい つづいて いるよ。どうする？',
    choices:[
      { text:'どこが おもしろかったのか、くわしく 書きかえる。' },
      { text:'同じ文を もう一つ 足す。' },
      { text:'作文を ぜんぶ けす。' }
    ],
    answer:0,
    correctExample:'とくに、主人公が大声で歌うところでわらいました。', wrongExample:'おもしろかったです。おもしろかったです。おもしろかったです。'
  }],
  'RULE-407': [{
    statement:'作文を 書きおわったら、読みかえさずに すぐ 出してよい。',
    answer:false
  }],
  'RULE-408': [{
    question:'魔王「ジェットコースターが すごかった！だけで よいのだ！」…もっと つたわるのは どれ？（いくつも 正かい）',
    choices:[
      { text:'風が 顔に あたるほど はやくて、目を あけるのも たいへんでした。' },
      { text:'すごくて、すごくて、すごかったです。' },
      { text:'高い ところから 一気に おりて、思わず 声が 出ました。' },
      { text:'ジェットコースターは すごかったです。' }
    ],
    answers:[0,2],
    hint:'どのくらい はやかった？ 体や 声は どうなった？',
    correctExample:'風が顔にあたるほど速く、高いところから一気におりて声が出ました。', wrongExample:'ジェットコースターがすごかったです。'
  }]
};

/* =========================================================
   お手本の げんこう用紙（たて書き 20文字 × 10行）
   だい名・名前・一マス空け・句読点・かい話文が ぜんぶ 入って います
   ========================================================= */
const SAMPLE_GENKOU = {
  cols: 20,
  minRows: 10,
  rows: [
    // 1行目：だい名（上を 3マス あける）
    '　　　うみへ行った日',
    // 2行目：名前（名字と 名前の あいだと、下を 1マス あける）
    '　　　　　　　　　　　　　山田　はなこ',
    // 本文：文が おわっても 行の さいごまで つづけて 書く
    '　きのう、家ぞくでうみへ行きました。青い',
    '魚が、目の前をすいっと泳ぎました。',
    // かい話文は 行を かえて 書く
    '「きれいだね。」',
    // かい話文の あとは 行を かえて、一マス あけて 書く
    '　わたしは、お母さんに言いました。うみの',
    '水は、しょっぱかったです。また行きたいと',
    '思いました。'
  ]
};

/* =========================================================
   作文チェックモード（じぶんで 見なおす チェックリスト）
   ruleId を 書いておくと、はかせの せつめいが 見られます。
   ========================================================= */
const CHECK_ITEMS = [
  { id:'c1', text:'だい名を 書いた？',                 ruleId:'RULE-001' },
  { id:'c2', text:'名前を 書いた？',                   ruleId:'RULE-002' },
  { id:'c3', text:'さいしょを 一マス あけた？',         ruleId:'RULE-012' },
  { id:'c4', text:'文の おわりに「。」を つけた？',      ruleId:'RULE-007' },
  { id:'c5', text:'「は」「へ」「を」は 正しい？',        ruleId:'RULE-108' },
  { id:'c6', text:'かい話文の「　」は 正しい？',         ruleId:'RULE-203' },
  { id:'c7', text:'出来事の あとを くわしく 書いた？',   ruleId:'RULE-401' },
  { id:'c8', text:'気もちを 書いた？',                 ruleId:'RULE-402' },
  { id:'c9', text:'「どうして？」も 書いた？',           ruleId:'RULE-403' },
  { id:'c10',text:'「すごかった」だけで おわって いない？', ruleId:'RULE-408' }
];
