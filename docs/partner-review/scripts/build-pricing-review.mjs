import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {Workbook, SpreadsheetFile} from '@oai/artifact-tool';

const root='/Users/alexzvo/Documents/ChatGPT/isrm/isrm-insight-hub';
const out='/Users/alexzvo/Documents/ChatGPT/isrm/outputs/isrm-pricing-20261028';
const basis=JSON.parse(await fs.readFile(`${root}/src/lib/client-pricing-basis.json`,'utf8'));
await fs.mkdir(out,{recursive:true});
const wb=Workbook.create();
const sheets=Object.fromEntries(['Порівняння','Поточна розробка','Припущення','Розробка','Партнери','OSINT та операції'].map(n=>[n,wb.worksheets.add(n)]));
const navy='#143343',gold='#B59B55',ink='#173342',muted='#5A6870',cream='#F6F3E9',input='#FFF1CA';
const gbp='"£"#,##0;("£"#,##0);"—"';
const val=(s,c,v)=>s.getRange(c).values=[[v]];
const formula=(s,c,f)=>{s.getRange(c).formulas=[[f]];s.getRange(c).format.font.color=f.includes("'!")?'#187343':ink;};
const header=(s,range,labels)=>{s.getRange(range).values=[labels];s.getRange(range).format={fill:navy,font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},wrapText:true,verticalAlignment:'center',horizontalAlignment:'center',rowHeight:42};};
const title=(s,text,end=60)=>{s.showGridLines=false;s.getRange(`A1:H${end}`).format={font:{name:'Arial',size:10,color:ink},verticalAlignment:'center',rowHeight:25};val(s,'A2',text);s.getRange('A2:H2').format.rowHeight=30;s.getRange('A2').format.font={name:'Arial',size:15,bold:true,color:navy};s.getRange('A3:H3').format.borders={bottom:{style:'thin',color:gold}};};
const inputCell=(s,c)=>{s.getRange(c).format.fill=input;s.getRange(c).format.font.color='#164CB2';};
const num=(s,r)=>s.getRange(r).setNumberFormat(gbp);
for(const s of Object.values(sheets)){s.getRange('A:H').format.columnWidth=18;}
const a=sheets['Припущення'];title(a,'ISRM. Вхідні припущення та ринкові орієнтири',65);
a.getRange('A:A').format.columnWidth=43;a.getRange('B:B').format.columnWidth=14;a.getRange('C:C').format.columnWidth=20;a.getRange('D:D').format.columnWidth=16;a.getRange('E:E').format.columnWidth=44;a.getRange('F:F').format.columnWidth=8;a.getRange('G:G').format.columnWidth=80;
header(a,'A4:E4',['Параметр','Значення','Одиниця','Статус','Основа']);
const assumptions=[
 ['UK ставка для цільової ціни',basis.ukHourlyScenario,'GBP / год','Сценарій','Раніше погоджена розрахункова база; не котировка'],
 ['Тривалість дня для бенчмарку',8,'год / день','Припущення','Лише для перерахунку денних ставок'],
 ['UA розробник, верхній орієнтир',50,'USD / год','Припущення','Lemon.io strong senior: $43–50, медіана $48'],
 ['USD у гривнях',45.6008,'UAH / USD','Дані 28.10.2026','НБУ через два публічні відтворення; прямий API недоступний'],
 ['GBP у гривнях',60.7909,'UAH / GBP','Дані 28.10.2026','НБУ через два публічні відтворення; прямий API недоступний'],
 ['UA розробник у GBP',null,'GBP / год','Формула','USD ставка × UAH/USD ÷ UAH/GBP'],
 ['Накладні, нижній сценарій',basis.overheadLow,'% до розробки','Припущення','До UA та UK бази; не чиста маржа'],
 ['Накладні, верхній сценарій',basis.overheadHigh,'% до розробки','Припущення','До UA та UK бази; не чиста маржа'],
 ['Цільова знижка до UK сценарію',basis.targetDiscount,'%','Комерційна ціль','Не доведена економія відносно котировки агенції'],
 ['Fallback як частка ціни ядра',basis.fallbackShare,'%','Правило ціни','Це не оцінка залишкових годин fallback'],
 ['Алекс: клієнтські комунікації',null,'GBP / год','Погодити','Внести погоджену ставку'],
 ['Алекс / компанія: legal та privacy',null,'GBP / год','Погодити','Окрема від клієнтських комунікацій ставка'],
 ['Дмитро: OSINT та кампанії',null,'GBP / год','Погодити','Ставка не виводиться з ціни роздрібного OSINT'],
 ['Олексій: стратегія та Product Owner',null,'GBP / год','Погодити','Стратегія й PO мають різні години, без дублювання'],
 ['Компенсація поточної розробки, G',null,'GBP разово','Погодити','У межах бюджету клієнта; не додаткова ціна клієнту'],
 ['Податки проєкту',null,'GBP','Погодити','Явний 0 допускається після визначення режиму'],
 ['Окремий резерв ризиків',null,'GBP','Погодити','Не підміняє гонорари або операційні витрати'],
 ['Горизонт початкових операцій',3,'місяці','Припущення','Змінити до формування остаточної пропозиції'],
 ['Робоча валюта','GBP','валюта','Погодити','Клієнтські орієнтири в GBP'],
 ['Дата розрахунку',(Date.UTC(2026,9,28)-Date.UTC(1899,11,30))/86400000,'дата','Фіксована','Ринкові джерела перевірено 28.10.2026'],
 ['Обрати ядро',1,'1 / 0','Редагувати','Потрібне для наступних workflow'],
 ['Обрати цикл залучення',0,'1 / 0','Редагувати','Інкрементальний обсяг поверх ядра'],
 ['Обрати цикл експертизи',0,'1 / 0','Редагувати','Інкрементальний обсяг поверх ядра'],
 ['Обрати моніторинг подій',0,'1 / 0','Редагувати','Обмежений пілот; джерело не підключено'],
];
a.getRange('A5:E28').values=assumptions;
formula(a,'B10','=B7*B8/B9');a.getRange('B10').setNumberFormat('"£"0.00');
inputCell(a,'B5:B9');inputCell(a,'B11:B22');inputCell(a,'B25:B28');a.getRange('B11:B14').setNumberFormat('0.0%');a.getRange('B24').setNumberFormat('dd.mm.yyyy');a.getRange('E5:E28').format.wrapText=true;a.getRange('A5:E28').format.rowHeight=38;
a.getRange('B25:B28').dataValidation={rule:{type:'list',values:['0','1']}};
header(a,'A31:E31',['Бенчмарк','Значення','Одиниця','Зріз','Як використовувати']);
const sources=[
 ['UK Software Developer, медіана',525,'GBP / день','27.10.2026','253 денні котировки. Контрактор, не агенція','https://www.itjobswatch.co.uk/contracts/uk/software%20developer.do'],
 ['UK Software Developer, погодинна',55,'GBP / год','27.10.2026','34 котировки; база £60 — окремий наш сценарій','https://www.itjobswatch.co.uk/contracts/uk/software%20developer.do'],
 ['UA strong senior, медіана',48,'USD / год','Q3 2026','Платформна вибірка; обрані $50 не національний максимум','https://lemon.io/rate-calculator/ukraine/'],
 ['UA strong senior, верхній орієнтир',50,'USD / год','Q3 2026','Верх опублікованого типового діапазону $43–50','https://lemon.io/rate-calculator/ukraine/'],
 ['UK OSINT, контрактор',730,'GBP / день','26.10.2026','9 денних котировок. Мала вибірка, не agency fee','https://www.itjobswatch.co.uk/contracts/uk/osint.do'],
 ['UK OSINT, погодинна',87.5,'GBP / год','26.10.2026','Лише 1 котировка; не використовувати як ставку Дмитра','https://www.itjobswatch.co.uk/contracts/uk/osint.do'],
 ['UK IMSS OSINT, нижня',450,'GBP / одиницю-день','G-Cloud 14','Склад одиниці й обсяг погоджувати з постачальником','https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/192421331866638'],
 ['UK IMSS OSINT, верхня',1500,'GBP / одиницю-день','G-Cloud 14','Послуга, не вартість технічної інтеграції','https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/192421331866638'],
 ['UA базова OSINT-перевірка',750,'UAH / особу','Перевірено 28.10','Не міжнародний due diligence. Пакетну ціну не підтверджено','https://mp-polygraph.com.ua/services/onlajn-skryning-i-profajlyng-kandydativ/'],
 ['Axeten, аналіз зв’язків від',250,'GBP / особу','Прайс Dec 2024','Без VAT. Актуальна котировка потрібна','https://www.axeten.com/osint-investigation-price-guidelines'],
 ['Axeten, due diligence від',500,'GBP / особу','Прайс Dec 2024','Інша глибина, ніж базовий український скринінг','https://www.axeten.com/osint-investigation-price-guidelines'],
 ['YunoJuno client services',394,'GBP / день','Звіт 2026','Сусідній comparator, не ставка Алекса','https://www.yunojuno.com/freelancer-rates-report'],
 ['YunoJuno marketing & communications',418,'GBP / день','Звіт 2026','Платформний бенчмарк за 2024–2025','https://www.yunojuno.com/freelancer-rates-report'],
 ['YunoJuno product management',521,'GBP / день','Звіт 2026','Не погоджена ставка Олексія','https://www.yunojuno.com/freelancer-rates-report'],
 ['YunoJuno strategy',518,'GBP / день','Звіт 2026','Не оплачувати strategy та PO за ті самі години','https://www.yunojuno.com/freelancer-rates-report'],
 ['World Monitor, ліцензії',null,'за котировкою','Перевірено 28.10','Права внутрішнього та клієнтського використання різняться','https://www.worldmonitor.app/docs/eula'],
 ['FX USD, відтворення НБУ',45.6008,'UAH / USD','28.10.2026','Прямий API НБУ не відповів; звірено два відтворення','https://worldbank.org.ua/kurs-valiut/usd?period=week'],
 ['FX GBP, відтворення НБУ',60.7909,'UAH / GBP','28.10.2026','Індикативний, не банківський курс купівлі/продажу','https://worldbank.org.ua/kurs-valiut/gbp'],
 ['FX друга звірка',null,'USD та GBP','28.10.2026','USD45.6008, GBP60.7909','https://index.minfin.com.ua/ua/exchange/nbrb/curr/rub/'],
];
a.getRange(`A32:E${31+sources.length}`).values=sources.map(r=>r.slice(0,5));
sources.forEach((r,i)=>val(a,`G${32+i}`,r[5]));a.getRange(`E32:E${31+sources.length}`).format.wrapText=true;a.getRange(`A32:G${31+sources.length}`).format.rowHeight=36;
val(a,'A53','Планові години: попередні партнерські розрахунки 26–27.10.2026; моніторинг — нове припущення.');
val(a,'A55','Години не є табелем часу або погодженою котировкою розробників.');
val(a,'A57','Старі 620 / 1940 / 2810 / 4120 год не перенесені до поточного кошторису.');
a.freezePanes.freezeRows(4);a.tabColor='#56717F';

const current=sheets['Поточна розробка'];title(current,'ISRM. Кошторис поточної демонстрації',48);
current.getRange('A:A').format.columnWidth=52;current.getRange('B:C').format.columnWidth=13;current.getRange('D:G').format.columnWidth=18;
val(current,'A4','Оцінка заміщення вже створених результатів. Години нижче — припущення, не табель часу.');
header(current,'A6:G6',['Створений результат','Год, нижня','Год, верхня','UA база, нижня','UA база, верхня','UK база, нижня','UK база, верхня']);
const delivered=[
 ['Граф, зв’язки, пошук, досьє й групи',40,64],
 ['Спільний інтерфейс і дизайн картотеки',16,24],
 ['Презентація 6 слайдів і графічні переходи',16,24],
 ['Scope, калькулятор, Markdown/email/print',24,40],
 ['Підготовка вибірки й режими доступу',12,20],
 ['Адаптивність, доступність і перевірки',16,24],
 ['Cloudflare, Git sync та автоматичний deploy',8,16],
];
current.getRange('A7:C13').values=delivered;
for(let row=7;row<=13;row++){
 formula(current,`D${row}`,`=B${row}*'Припущення'!$B$10`);
 formula(current,`E${row}`,`=C${row}*'Припущення'!$B$10`);
 formula(current,`F${row}`,`=B${row}/'Припущення'!$B$6*'Припущення'!$B$32`);
 formula(current,`G${row}`,`=C${row}/'Припущення'!$B$6*'Припущення'!$B$32`);
}
val(current,'A15','Разом, оцінка заміщення');for(const col of ['B','C','D','E','F','G'])formula(current,`${col}15`,`=SUM(${col}7:${col}13)`);
val(current,'A17','Розробницькі дні при 8 год/день');formula(current,'B17',"=B15/'Припущення'!B6");formula(current,'C17',"=C15/'Припущення'!B6");
val(current,'A19','З накладними 25% /30%');formula(current,'D19',"=D15*(1+'Припущення'!B11)");formula(current,'E19',"=E15*(1+'Припущення'!B12)");formula(current,'F19',"=F15*(1+'Припущення'!B11)");formula(current,'G19',"=G15*(1+'Припущення'!B12)");
val(current,'A21','Погоджена компенсація G');formula(current,'D21',"=IF(ISNUMBER('Припущення'!B19),'Припущення'!B19,\"n.a.\")");
inputCell(current,'B7:C13');num(current,'D7:G21');current.getRange('A15:G15').format.fill=cream;current.getRange('A15:G15').format.font.bold=true;
current.getRange('A7:A13').format.wrapText=true;current.getRange('A7:G13').format.rowHeight=36;current.getRange('B17:C17').setNumberFormat('0.0');
const tracked=execFileSync('git',['ls-files','src'],{cwd:root,encoding:'utf8'}).trim().split('\n');
let lineCount=0;for(const file of tracked){lineCount+=(await fs.readFile(`${root}/${file}`,'utf8')).split('\n').length-1;}
const dates=execFileSync('git',['log','HEAD','--format=%ad','--date=short','--','src'],{cwd:root,encoding:'utf8'}).trim().split('\n');
val(current,'A24',`Git: ${tracked.length} відстежуваних src-файлів; ${lineCount.toLocaleString('en-GB')} рядків разом із шаблонним кодом.`);
val(current,'A26',`Історія поточної гілки: ${new Set(dates).size} календарних дат змін, ${dates.at(-1)} — ${dates[0]}.`);
val(current,'A28','Рядки коду та календарні дати не доводять витрачених годин і не встановлюють погодинну оплату.');
val(current,'A30','UA база: $50/год у GBP. UK база: спостережувана медіана £525/день, при 8 год/день.');
val(current,'A32','Цей кошторис не додається автоматично до ціни клієнта. Партнери погоджують G, права та строк платежу.');
val(current,'A34','Перед підтвердженням майбутніх 640 год звірити повторне використання прототипу та відняти прийняті результати.');
val(current,'A36','Накладні в рядку19 — порівняльний сценарій; у G включати лише погоджений склад робіт.');
current.freezePanes.freezeRows(6);

const d=sheets['Розробка'];title(d,'ISRM. Постатейна розробка',50);d.getRange('A:A').format.columnWidth=12;d.getRange('B:B').format.columnWidth=16;d.getRange('C:C').format.columnWidth=57;d.getRange('D:H').format.columnWidth=15;
header(d,'A6:H6',['ID','Обсяг','Результат розробки','Години','UA £/год','UA витрати','UK £/год','UK база']);
const wbs=[
 ['C01','core','Технічна архітектура',64],['C02','core','UX та адаптивний інтерфейс',48],['C03','core','Імпорт, профілі й досьє',96],['C04','core','Поля, зв’язки, групи та списки',80],['C05','core','Production-доробки графа й пошуку',40],['C06','core','Ролі доступу, зберігання та аудит',96],['C07','core','Технічна інтеграція існуючого AI OSINT',96],['C08','core','QA та перевірка безпеки',80],['C09','core','Розгортання й передача',40],
 ['E01','engagement','Маршрути залучення цільових аудиторій',64],['E02','engagement','Кампанійні форми та погоджені конектори',64],['E03','engagement','Автоматизація та аналітика циклу',48],['E04','engagement','QA й запуск циклу',40],
 ['X01','expertise','Реєстр знань та доказів',80],['X02','expertise','Погодження, трансформація й публікація',64],['X03','expertise','Погоджені knowledge/LMS-конектори',64],['X04','expertise','QA, аналітика та передача',48],
 ['M01','monitoring','Один сценарій, схема сигналу та права доступу',16],['M02','monitoring','Один серверний конектор джерела та кеш',32],['M03','monitoring','Теми, регіони та зв’язок із записаною експертизою',24],['M04','monitoring','Черга перевірки й уточнення висновків',32],['M05','monitoring','Брифінг, джерела й архів версій',24],['M06','monitoring','QA, перевірка прав, запуск пілоту та передача',32],
];
d.getRange(`A7:D${6+wbs.length}`).values=wbs;
wbs.forEach((r,i)=>{const row=i+7;formula(d,`E${row}`,"='Припущення'!$B$10");formula(d,`F${row}`,`=D${row}*E${row}`);formula(d,`G${row}`,"='Припущення'!$B$5");formula(d,`H${row}`,`=D${row}*G${row}`);});
inputCell(d,`D7:D${6+wbs.length}`);num(d,`E7:H${6+wbs.length}`);d.getRange(`E7:E${6+wbs.length}`).setNumberFormat('\"£\"0.00');d.getRange(`C7:C${6+wbs.length}`).format.wrapText=true;d.getRange(`A7:H${6+wbs.length}`).format.rowHeight=34;
val(d,'A33','OSINT 96 год уже в core640. У fallback це альтернативний додатковий обсяг, не другий платіж у full core.');
val(d,'A35','Моніторинг160год: один ліцензований провайдер, обмежений пілот, без цілодобової служби.');
val(d,'A37','Production-граф40год потрібно звірити з прийнятим прототипом до підтвердження залишкового backlog.');
val(d,'A39','Окремі AI-консультанти, невизначені конектори й project management тут не оцінені.');d.freezePanes.freezeRows(6);

const p=sheets['Партнери'];title(p,'ISRM. Відповідальність та гонорари партнерів',50);p.getRange('A:A').format.columnWidth=16;p.getRange('B:B').format.columnWidth=17;p.getRange('C:C').format.columnWidth=56;p.getRange('D:F').format.columnWidth=17;p.getRange('G:G').format.columnWidth=24;
header(p,'A6:G6',['Обсяг','Відповідальний','Робота','Планові години','Погоджена £/год','Гонорар £','Стан']);
const partner=[
 ['core','Алекс','Клієнтські комунікації',40,15],['core','Алекс / компанія','Договір, privacy та юридичний супровід',null,16],['core','Дмитро','OSINT-протокол, налаштування й тестова вибірка',48,17],['core','Олексій','Стратегія та постановка продукту',40,18],['core','Олексій','Product Owner, координація та приймання',56,18],
 ['engagement','Алекс','Клієнтські рішення й погодження кампанії',null,15],['engagement','Алекс / компанія','Права на комунікації та юридичні умови',null,16],['engagement','Дмитро','План кампанії й аудиторії',32,17],['engagement','Дмитро','Координація контенту та кампанії',64,17],['engagement','Дмитро','Follow-up і звіт за погоджену кампанію',32,17],['engagement','Дмитро','OSINT-підтримка сегментації',24,17],['engagement','Олексій','Продуктова логіка циклу',40,18],
 ['expertise','Алекс / компанія','Авторство, ліцензії й права повторного використання',null,16],['expertise','Дмитро','Запити аудиторій і розповсюдження',40,17],['expertise','Дмитро','Джерела й протокол професійної перевірки',48,17],['expertise','Олексій','Стратегія продуктів експертизи',40,18],['expertise','Олексій','Product Owner циклу',40,18],
 ['monitoring','Алекс / компанія','Права постачальника, аудиторії та умови пілоту',null,16],['monitoring','Дмитро','Теми, джерела й схема сигналів',24,17],['monitoring','Дмитро','Протокол перевірки й тестова вибірка',24,17],['monitoring','Дмитро','Редакційний процес пілоту',16,17],['monitoring','Олексій','Сценарій користувача й продуктова стратегія',24,18],['monitoring','Олексій','Product Owner і приймання пілоту',24,18],
];
p.getRange(`A7:D${6+partner.length}`).values=partner.map(r=>r.slice(0,4));
partner.forEach((r,i)=>{const row=i+7;formula(p,`E${row}`,`=IF(ISNUMBER('Припущення'!B${r[4]}),'Припущення'!B${r[4]},"")`);formula(p,`F${row}`,`=IF(AND(ISNUMBER(D${row}),ISNUMBER(E${row})),D${row}*E${row},"n.a.")`);formula(p,`G${row}`,`=IF(ISNUMBER(F${row}),"Оцінено","Потрібні години / ставка")`);});
inputCell(p,`D7:D${6+partner.length}`);num(p,`E7:F${6+partner.length}`);p.getRange(`C7:C${6+partner.length}`).format.wrapText=true;p.getRange(`A7:G${6+partner.length}`).format.rowHeight=36;
val(p,'A33','Алекс — юридична компанія та клієнтські відносини. Дмитро — OSINT і комунікаційні кампанії.');
val(p,'A35','Олексій — стратегія, Product Owner, постановка та приймання; не дублює технічну архітектуру розробників.');
val(p,'A37','Гонорари споживають бюджет накладних. У фактичному підсумку накладні вдруге не додаються.');
val(p,'A39','Моніторинг: партнерські години — нові планові припущення; legal лишається до оцінки.');p.freezePanes.freezeRows(6);

const o=sheets['OSINT та операції'];title(o,'ISRM. Прямі витрати й операції',55);o.getRange('A:A').format.columnWidth=16;o.getRange('B:B').format.columnWidth=51;o.getRange('C:C').format.columnWidth=15;o.getRange('D:F').format.columnWidth=18;o.getRange('G:G').format.columnWidth=25;
header(o,'A6:G6',['Обсяг','Позиція','Кількість','Одиниця','£ за одиницю','Витрати £','Стан']);
const ops=[
 ['core','Hosting і захищене зберігання',3,'місяці'],['core','Платні джерела та ліцензії',3,'місяці'],['core','AI/API дослідження',null,'запити'],['core','Людський review операційних запитів',null,'години'],
 ['engagement','Креатив, production і переклади',1,'пакет'],['engagement','Медіарозміщення погодженої кампанії',1,'бюджет'],
 ['expertise','Зовнішні автори й професійні рецензенти',null,'години'],['expertise','LMS та knowledge-ліцензії',3,'місяці'],
 ['monitoring','World Monitor / інший провайдер',3,'місяці'],['monitoring','Додаткові API/hosting-витрати пілоту',3,'місяці'],['monitoring','Операційні брифінги та професійний review',null,'години'],
];
o.getRange(`A7:D${6+ops.length}`).values=ops;
ops.forEach((r,i)=>{const row=i+7;if(r[3]==='місяці')formula(o,`C${row}`,"='Припущення'!$B$22");formula(o,`F${row}`,`=IF(AND(ISNUMBER(C${row}),ISNUMBER(E${row})),C${row}*E${row},"n.a.")`);formula(o,`G${row}`,`=IF(ISNUMBER(F${row}),"Оцінено","Потрібна котировка / обсяг")`);});
inputCell(o,`E7:E${6+ops.length}`);inputCell(o,'C9:C10');inputCell(o,'C13');inputCell(o,'C17');num(o,`E7:F${6+ops.length}`);o.getRange(`B7:B${6+ops.length}`).format.wrapText=true;o.getRange(`A7:G${6+ops.length}`).format.rowHeight=36;
val(o,'A20','Порожнє поле — невідомі витрати. Явний0 дозволений, якщо позиція виключена погодженим рішенням.');
header(o,'A23:E23',['OSINT-порівняння','Кількість','Ціна за особу','Валюта','Арифметична сума £']);
o.getRange('A24:D26').values=[['UA базовий скринінг',11000,750,'UAH'],['UK аналіз зв’язків від',11000,250,'GBP'],['UK due diligence від',11000,500,'GBP']];
formula(o,'E24',"=B24*C24/'Припущення'!B9");formula(o,'E25','=B25*C25');formula(o,'E26','=B26*C26');num(o,'E24:E26');inputCell(o,'B24:B26');
val(o,'A28','Різні послуги й глибина перевірки. Це не порівнянні котировки й не доведена економія платформи.');
val(o,'A30','11тис. — арифметичний сценарій, не затверджений обсяг дослідження. Пакетні ціни не підтверджено.');
header(o,'A33:E33',['Створений граф: заміщення','Developer-days','UK £/день','UK база £','Ціль −30% £']);
o.getRange('A34:B36').values=[['Обмежений модуль: нижній',3],['Обмежений модуль: базовий',5],['Обмежений модуль: верхній',7]];
for(let r=34;r<=36;r++){formula(o,`C${r}`,"='Припущення'!B32");formula(o,`D${r}`,`=B${r}*C${r}`);formula(o,`E${r}`,`=D${r}*(1-'Припущення'!B13)`);}num(o,'C34:E36');
val(o,'A38','3/5/7днів — сценарій заміщення обмеженого модуля, не виміряний час і не гонорар автора.');
val(o,'A40','Компенсацію графа погодити окремо. Не рахувати той самий прийнятий результат у640год і в G вдруге.');o.freezePanes.freezeRows(6);

const s=sheets['Порівняння'];title(s,'ISRM. Ціна, витрати та позиція партнерів',48);s.getRange('A:A').format.columnWidth=39;s.getRange('B:B').format.columnWidth=11;s.getRange('C:H').format.columnWidth=18;s.tabColor=navy;
val(s,'A4','Планова розробка. Контрактори та наші припущення, а не котировки британських агенцій.');
header(s,'A7:H7',['Обсяг','Години','Наші +25%','Наші +30%','UK +25%','UK +30%','Ціль −30%,25%','Ціль −30%,30%']);
const scopes=[['core','Ядро'],['engagement','Цикл залучення'],['expertise','Цикл експертизи'],['monitoring','Моніторинг подій і брифінги']];
scopes.forEach(([id,label],i)=>{const r=8+i;val(s,`A${r}`,label);formula(s,`B${r}`,`=SUMIFS('Розробка'!$D$7:$D$29,'Розробка'!$B$7:$B$29,"${id}")`);formula(s,`C${r}`,`=SUMIFS('Розробка'!$F$7:$F$29,'Розробка'!$B$7:$B$29,"${id}")*(1+'Припущення'!$B$11)`);formula(s,`D${r}`,`=SUMIFS('Розробка'!$F$7:$F$29,'Розробка'!$B$7:$B$29,"${id}")*(1+'Припущення'!$B$12)`);formula(s,`E${r}`,`=SUMIFS('Розробка'!$H$7:$H$29,'Розробка'!$B$7:$B$29,"${id}")*(1+'Припущення'!$B$11)`);formula(s,`F${r}`,`=SUMIFS('Розробка'!$H$7:$H$29,'Розробка'!$B$7:$B$29,"${id}")*(1+'Припущення'!$B$12)`);formula(s,`G${r}`,`=ROUND(E${r}*(1-'Припущення'!$B$13),0)`);formula(s,`H${r}`,`=ROUND(F${r}*(1-'Припущення'!$B$13),0)`);});
val(s,'A12','Ядро та всі 3 workflow');for(const col of ['B','C','D','E','F','G','H'])formula(s,`${col}12`,`=SUM(${col}8:${col}11)`);
val(s,'A14','Fallback, альтернативний обсяг');val(s,'B14','n.a.');val(s,'C14','n.a.');val(s,'D14','n.a.');formula(s,'E14',"=E8*'Припущення'!B14");formula(s,'F14',"=F8*'Припущення'!B14");formula(s,'G14',"=ROUND(G8*'Припущення'!B14,0)");formula(s,'H14',"=ROUND(H8*'Припущення'!B14,0)");
val(s,'A15','OSINT-підключення до fallback');formula(s,'B15',"='Розробка'!D13");formula(s,'C15',"='Розробка'!F13*(1+'Припущення'!B11)");formula(s,'D15',"='Розробка'!F13*(1+'Припущення'!B12)");formula(s,'E15',"='Розробка'!H13*(1+'Припущення'!B11)");formula(s,'F15',"='Розробка'!H13*(1+'Припущення'!B12)");formula(s,'G15',"=ROUND(E15*(1-'Припущення'!B13),0)");formula(s,'H15',"=ROUND(F15*(1-'Припущення'!B13),0)");
num(s,'C8:H15');s.getRange('A12:H12').format.fill=cream;s.getRange('A12:H12').format.font.bold=true;s.getRange('A8:H15').format.rowHeight=34;
val(s,'A17','Fallback 30% — правило ціни; власну собівартість fallback ще треба оцінити. OSINT 96 год уже включені до ядра.');
header(s,'A20:D20',['Обраний сценарій','Обрано1/0','25% накладних','30% накладних']);
for(let i=0;i<4;i++){val(s,`A${21+i}`,scopes[i][1]);formula(s,`B${21+i}`,`='Припущення'!B${25+i}`);}
const priceFormula=col=>scopes.map((_,i)=>`${col}${8+i}*'Припущення'!B${25+i}`).join('+');
val(s,'A26','Індикативний бюджет клієнта');formula(s,'C26','='+priceFormula('G'));formula(s,'D26','='+priceFormula('H'));
const selection=()=>scopes.map(([id],i)=>`SUMIFS('Розробка'!$F$7:$F$29,'Розробка'!$B$7:$B$29,"${id}")*'Припущення'!B${25+i}`).join('+');
val(s,'A27','Розробники, планова UA база');formula(s,'C27','='+selection());formula(s,'D27','=C27');
val(s,'A28','Резерв накладних, довідково');formula(s,'C28',"=C27*'Припущення'!B11");formula(s,'D28',"=D27*'Припущення'!B12");
val(s,'A29','Ліміт усіх нерозробницьких витрат');formula(s,'C29','=C26-C27');formula(s,'D29','=D26-D27');
function selectedKnown(sheet,col,statusCol,last){const parts=scopes.map(([id],i)=>`IF('Припущення'!B${25+i}=0,0,IF(COUNTIFS('${sheet}'!$A$7:$A$${last},"${id}",'${sheet}'!$${statusCol}$7:$${statusCol}$${last},"Оцінено")=COUNTIFS('${sheet}'!$A$7:$A$${last},"${id}"),SUMIFS('${sheet}'!$${col}$7:$${col}$${last},'${sheet}'!$A$7:$A$${last},"${id}"),"n.a."))`);return `=IF(COUNT(${parts.join(',')})=4,SUM(${parts.join(',')}),"n.a.")`;}
val(s,'A31','Погоджені гонорари партнерів');formula(s,'C31',selectedKnown('Партнери','F','G',29));formula(s,'D31','=C31');
val(s,'A32','Прямі та операційні витрати');formula(s,'C32',selectedKnown('OSINT та операції','F','G',17));formula(s,'D32','=C32');
for(const [row,inputRow,label] of [[33,19,'Поточна розробка, компенсація G'],[34,20,'Податки проєкту'],[35,21,'Окремий резерв ризиків']]){val(s,`A${row}`,label);formula(s,`C${row}`,`=IF(ISNUMBER('Припущення'!B${inputRow}),'Припущення'!B${inputRow},"n.a.")`);formula(s,`D${row}`,`=C${row}`);}
val(s,'A37','Повна оцінена собівартість');formula(s,'C37','=IF(COUNT(C27,C31:C35)=6,SUM(C27,C31:C35),"n.a.")');formula(s,'D37','=C37');
val(s,'A38','Залишок після всіх витрат');formula(s,'C38','=IF(ISNUMBER(C37),C26-C37,"n.a.")');formula(s,'D38','=IF(ISNUMBER(D37),D26-D37,"n.a.")');
val(s,'A39','Кожному, 1/3 позитивного залишку');formula(s,'C39','=IF(ISNUMBER(C38),MAX(0,C38)/3,"n.a.")');formula(s,'D39','=IF(ISNUMBER(D38),MAX(0,D38)/3,"n.a.")');
num(s,'C26:D39');s.getRange('A37:D39').format.fill=cream;s.getRange('A37:D39').format.font.bold=true;s.getRange('A26:D39').format.rowHeight=30;
val(s,'A42','n.a. означає: потрібні погоджені години, ставки або котировки. Це не нульові витрати.');
val(s,'A44','Резерв накладних у рядку 28 не додається вдруге до фактичних статей у рядках 31–35.');
val(s,'A46','Остаточну ціну погоджує Алекс. Знижка 30% — до розрахункового UK сценарію, а не доведеної ціни ринку.');
for(const range of ['C38:D38'])s.getRange(range).conditionalFormats.add('cellIs',{operator:'lessThan',formula:0,format:{fill:'#FBE1DC',font:{color:'#A12A24',bold:true}}});
for(const sh of Object.values(sheets)){sh.getUsedRange().format.verticalAlignment='center';}
// Output formulas remain dark; editable inputs are blue on pale amber.
s.getRange('B8:H39').format.font.color=ink;
header(s,'A20:D20',['Обраний сценарій','Обрано 1/0','25% накладних','30% накладних']);
wb.recalculate();
const original=s.getRange('G8:H11').values;
assert.deepEqual(original,[[33600,34944],[11340,11794],[13440,13978],[8400,8736]]);
assert.equal(s.getRange('G15').values[0][0],5040);
assert.equal(s.getRange('C37').values[0][0],'n.a.');
// Demonstrate dependency recalculation, then restore every changed input.
val(a,'B7',55);wb.recalculate();const changed=s.getRange('C27').values[0][0];
val(a,'B7',50);wb.recalculate();assert(changed>s.getRange('C27').values[0][0]);
val(a,'B26',1);wb.recalculate();assert.equal(s.getRange('C26').values[0][0],44940);val(a,'B26',0);wb.recalculate();
// Complete one prerequisite only: a partner fee becomes known but total stays unknown.
val(a,'B15',40);wb.recalculate();assert.equal(p.getRange('F7').values[0][0],1600);assert.equal(s.getRange('C37').values[0][0],'n.a.');val(a,'B15',null);wb.recalculate();
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},maxChars:1500});
console.log(errors.ndjson);
console.log((await wb.inspect({kind:'table',range:'Порівняння!A7:H15',include:'values,formulas',tableMaxRows:10,tableMaxCols:8,maxChars:2500})).ndjson);
for(const [name,range,file]of [['Порівняння','A1:H17','summary'],['Порівняння','A20:D46','economics'],['Поточна розробка','A1:G36','current-development'],['Припущення','A1:E28','inputs'],['Розробка','A1:H29','development'],['Партнери','A1:G29','partners'],['OSINT та операції','A1:G20','operations']]){
 const blob=await wb.render({sheetName:name,range,scale:1.3,format:'png'});await fs.writeFile(`/tmp/isrm-partner-workbook/${file}.png`,new Uint8Array(await blob.arrayBuffer()));
}
const output=await SpreadsheetFile.exportXlsx(wb);await output.save(`${out}/ISRM_Partner_Pricing_Review.xlsx`);
console.log(JSON.stringify({output:`${out}/ISRM_Partner_Pricing_Review.xlsx`,prices:original,checks:'input changes, selection, missing data and formulas verified'}));
