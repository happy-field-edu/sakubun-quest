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
/* 画像に さしかえるときは emoji を img: 'img/xxx.png' に かえて使う */
const CHARACTERS = {
  hero:   { name:'作文の勇者',   emoji:'🦸' },
  hakase: { name:'作文はかせ',   emoji:'🦉' },
  maou:   { name:'マチガエール魔王', emoji:'🐸' }
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
    enemy:{ name:'もりの マチガエル', emoji:'🐸' } },

  { id:'w2', no:2, emoji:'🕯️', color:'#5a7fd6',
    name:'文字の どうくつ',
    theme:'文字を 正しく 書こう',
    enemy:{ name:'どうくつ マチガエル', emoji:'🐛' } },

  { id:'w3', no:3, emoji:'🏰', color:'#e07aa8',
    name:'おしゃべり<ruby>城<rt>じょう</rt></ruby>',
    plain:'おしゃべり城',
    theme:'かい話文を 正しく 書こう',
    enemy:{ name:'おしゃべり マチガエル', emoji:'🦜' } },

  { id:'w4', no:4, emoji:'🛣️', color:'#e8933a',
    name:'文しょうロード',
    theme:'文を 分かりやすく つなごう',
    enemy:{ name:'みちまよい マチガエル', emoji:'🐌' } },

  { id:'w5', no:5, emoji:'👑', color:'#a45cd6',
    name:'マチガエール<ruby>魔王城<rt>まおうじょう</rt></ruby>',
    plain:'マチガエール魔王城',
    theme:'もっと つたわる 作文に しよう',
    boss:true,
    enemy:{ name:'マチガエール魔王', emoji:'🐸' } }
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
  manuscript:{ cols:9, rows:['　わたしわ、公園','へ行きました。'] },
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
  manuscript:{ cols:9, rows:['　ぼくは、らつぱ','をふきました。'] },
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
  manuscript:{ cols:9, rows:['　きゆうしよくの','時間です。'] },
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
  manuscript:{ cols:9, rows:['　きのう、学校え','行って、本およみ','ました。'] },
  answers:[[0,7],[1,5]]
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
    { manuscript:{ cols:9, rows:['　あさ、お母さん','が「おはよう。」','と言いました。'] } },
    { manuscript:{ cols:9, rows:['　あさ、お母さんが','言いました。','「おはよう。」'] } }
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
    { manuscript:{ cols:9, rows:['「きょうは、とて','もたのしかった','よ。」'] } },
    { manuscript:{ cols:9, rows:['「きょうは、とて','　もたのしかった','　よ。」'] } }
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
    { manuscript:{ cols:9, rows:['「おはよう。」ぼ','くも手をふりまし','た。'] } },
    { manuscript:{ cols:9, rows:['「おはよう。」','　ぼくも手をふり','ました。'] } }
  ],
  answer:1
},
{
  id:'RULE-206', world:'w3', type:'rule', category:'kaiwa',
  skill:'とじかっこの わすれ', difficulty:2,
  title:'とじかっこを わすれない',
  childExplanation:'かい話文には、はじめの「 と おわりの 」が セットで いります。かたほうだけでは、どこまで 話したのか 分かりませんね。',
  correctExample:'　弟が「見て見て。」と言いました。',
  wrongExample:'　弟が「見て見てと言いました。',
  hint:'はじめの「 は あるね。おわりの しるしは どうかな？',
  questionType:'choice',
  question:'この 作文、どこが おかしい？',
  manuscript:{ cols:9, rows:['　弟が「見て見て','と言いました。'] },
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
  correctExample:'あさ、はやくおきました。学校で走りました。夜、ぐっすりねました。',
  wrongExample:'夜、ぐっすりねました。あさ、はやくおきました。',
  hint:'あさ・ひる・よる、どれが さいしょかな？',
  questionType:'order',
  question:'あった じゅんばんに タップして ならべよう。',
  items:['学校で 走りました。','あさ、はやく おきました。','夜、ぐっすり ねました。'],
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
}

];

/* =========================================================
   お手本の げんこう用紙（たて書き 20文字 × 10行）
   だい名・名前・一マス空け・句読点・かい話文が ぜんぶ 入って います
   ========================================================= */
const SAMPLE_GENKOU = {
  cols: 20,
  minRows: 10,
  rows: [
    '　　　うみへ行った日',
    '　　　　　　　　　　　　　　山田はなこ',
    '　きのう、家ぞくでうみへ行きました。',
    '青い魚が、目の前をすいっと泳ぎました。',
    '「きれいだね。」',
    '　わたしは、お母さんに言いました。',
    '　うみの水は、しょっぱかったです。',
    'また行きたいと思いました。'
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
