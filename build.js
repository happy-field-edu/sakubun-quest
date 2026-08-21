/* =========================================================
   build.js — 1ファイルに まとめる ビルドスクリプト
   つかいかた:  node build.js
     dist/sakubun-quest.html … そのまま ひらける 完全版（配布・iPad用）
     dist/artifact.html      … Artifact公開用（<html>などを のぞいたもの）
   ========================================================= */
const fs = require('fs');
const path = require('path');

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');
const css = read('style.css').replace(/^@charset[^;]*;\s*/, ''); // インラインでは ふよう
const js  = [read('data.js'), read('script.js')].join('\n');
let html  = read('index.html');

// <link> と <script src> を 中身そのものに 入れかえる
html = html.replace(/[ \t]*<link rel="stylesheet" href="style\.css">\n/,
  '<style>\n' + css + '\n</style>\n');
html = html.replace(/[ \t]*<script src="data\.js"><\/script>\n[ \t]*<script src="script\.js"><\/script>\n/,
  '<script>\n' + js + '\n<\/script>\n');

fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist/sakubun-quest.html'), html);

// Artifact公開用：<!DOCTYPE>・<html>・<head>・<body> は 公開時に つけられるので のぞく
const body = html
  .replace(/^[\s\S]*?<title>/, '<title>')                 // titleより 前を すてる
  .replace(/<\/head>\s*<body>\s*/, '')                    // head/body の さかいめ
  .replace(/\s*<\/body>\s*<\/html>\s*$/, '\n')            // おわりの タグ
  .replace(/^[ \t]*<meta[^>]*>\n/gm, '');                 // meta は 公開側で つく
fs.writeFileSync(path.join(__dirname, 'dist/artifact.html'), body);

const kb = (f) => (fs.statSync(path.join(__dirname, f)).size / 1024).toFixed(1) + 'KB';
console.log('dist/sakubun-quest.html', kb('dist/sakubun-quest.html'));
console.log('dist/artifact.html     ', kb('dist/artifact.html'));
