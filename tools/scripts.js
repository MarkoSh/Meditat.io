// Prints the practice scripts from index.html as a recording sheet: node tools/scripts.js [ru|en|th] > voice/scripts-ru.md
const fs = require('fs'), path = require('path');
const lang = process.argv[2] || 'ru';
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const src = html.slice(html.indexOf('const PRACTICES = ['), html.indexOf('const PR = '));
const PRACTICES = new Function('tri', `${src}; return PRACTICES`)((ru, en, th) => ({ ru, en, th }));
const mm = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const out = [`# Meditat.io — сценарии для записи (${lang})`, '',
  'Один файл на практику: `audio/' + lang + '/<id>.mp3`. Время слева — когда фраза начинается; между фразами — тишина.',
  'Точность ±5 секунд не важна, важно не торопиться. Общая длина записи может отличаться от указанной: сайт возьмёт длину файла.', ''];
for (const p of PRACTICES) {
  out.push(`## ${p.t[lang]} — \`${p.id}.mp3\`, ${p.min} мин`, '');
  p.script.forEach(([sec, txt], i) => {
    const next = p.script[i + 1]?.[0] ?? p.min * 60;
    out.push(`**${mm(sec)}** ${txt[lang]}`, '', `_…тишина до ${mm(next)}_`, '');
  });
}
process.stdout.write(out.join('\n'));
