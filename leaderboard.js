/* ============================================================
   LEADERBOARD.JS — Dünya Zənginlər Siyahısı
   ============================================================ */

const LEADERBOARD_STORAGE_KEY = "borsa_leaderboard_v1";

const COUNTRY_FLAGS = {
  "ABŞ": "🇺🇸", "Almaniya": "🇩🇪", "Braziliya": "🇧🇷", "Polşa": "🇵🇱",
  "İsveç": "🇸🇪", "Türkiyə": "🇹🇷", "İtaliya": "🇮🇹", "İspaniya": "🇪🇸",
  "Rusiya": "🇷🇺", "BƏƏ": "🇦🇪", "İrlandiya": "🇮🇪", "Macarıstan": "🇭🇺",
  "Misir": "🇪🇬", "Argentina": "🇦🇷", "Fransa": "🇫🇷", "Livan": "🇱🇧",
  "Norveç": "🇳🇴", "Azərbaycan": "🇦🇿", "Kanada": "🇨🇦", "Mərakeş": "🇲🇦",
  "İngiltərə": "🇬🇧", "Avstraliya": "🇦🇺", "Pakistan": "🇵🇰", "Danimarka": "🇩🇰",
  "İskoçiya": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Sinqapur": "🇸🇬", "İsveçrə": "🇨🇭", "Çin": "🇨🇳",
  "Hindistan": "🇮🇳", "Yaponiya": "🇯🇵", "Honq Konq": "🇭🇰", "Meksika": "🇲🇽",
  "Çili": "🇨🇱", "Kolumbiya": "🇨🇴", "Avstriya": "🇦🇹", "Tailand": "🇹🇭",
  "Kipr": "🇨🇾", "Global": "🌍"
};

const RAW_LEADERBOARD = [
  ["Leon Musk","ABŞ",1100000000000],["Loren Paige","ABŞ",323000000000],
  ["Serge Bronn","ABŞ",300000000000],["Jeffrey Bezon","ABŞ",290000000000],
  ["Larry Elisson","ABŞ",233000000000],["Marcus Zucker","ABŞ",217000000000],
  ["Jason Huang","ABŞ",191000000000],["Mikel Dallen","ABŞ",179000000000],
  ["James Walton","ABŞ",156000000000],["Bernard Arnaud","Fransa",145000000000],
  ["Robert Walton","ABŞ",150000000000],["Amaro Ortega","İspaniya",140000000000],
  ["Steven Ballard","ABŞ",135000000000],["Warren Bufford","ABŞ",130000000000],
  ["Carlos Helios","Meksika",125000000000],["Charles Zhao","Kanada",110000000000],
  ["Michael Bloom","ABŞ",109000000000],["William Gateson","ABŞ",108000000000],
  ["Alicia Walton","ABŞ",104000000000],["Francoise Betton","Fransa",100000000000],
  ["Mukesh Amban","Hindistan",99700000000],["Giancarlo Devani","İtaliya",89300000000],
  ["Thomas Petrov","ABŞ",82900000000],["Julia Kocher","ABŞ",81200000000],
  ["Charles Kochman","ABŞ",73800000000],["Zhang Yiman","Çin",69300000000],
  ["Zhong Shanli","Çin",68100000000],["Jeffrey Yates","ABŞ",67400000000],
  ["Dietrich Schwartz","Almaniya",67200000000],["German Larenzo","Meksika",67100000000],
  ["Gautam Adari","Hindistan",63800000000],["Tadashi Yano","Yaponiya",61800000000],
  ["Pony Mah","Çin",53800000000],["Robin Zheng","Honq Konq",53200000000],
  ["Iris Fontana","Çili",52600000000],["Masao Soni","Yaponiya",51500000000],
  ["Kenneth Griffinson","ABŞ",49800000000],["Jacqueline Marsh","ABŞ",49100000000],
  ["Jonathan Marsden","ABŞ",49100000000],["Lucas Walton","ABŞ",47000000000],
  ["Shiva Nadaran","Hindistan",46000000000],["He Xiang","Çin",45000000000],
  ["Leonard Blavat","İngiltərə",44000000000],["Lee Shao","Honq Konq",43000000000],
  ["Miriam Adelman","ABŞ",42000000000],["Giovanni Ferro","İtaliya",41000000000],
  ["Cyrus Poona","Hindistan",40000000000],["Alain Wertham","Fransa",39000000000],
  ["Gerard Wertham","Fransa",39000000000],["Philip Knighton","ABŞ",38000000000],
  ["Laksh Mittal","Hindistan",37000000000],["Wang Chuang","Çin",36000000000],
  ["Li Kashen","Honq Konq",36000000000],["Harold Harmon","ABŞ",35000000000],
  ["Abigail Johns","ABŞ",35000000000],["Peter Wu","Honq Konq",34000000000],
  ["Klaus Kuhner","İsveçrə",34000000000],["Gina Reinhart","Avstraliya",33000000000],
  ["Viktor Alekov","Rusiya",33000000000],["Andrei Melnik","Rusiya",32000000000],
  ["Stephen Blackman","ABŞ",32000000000],["Vladimir Lisov","Rusiya",31000000000],
  ["Raymond Daley","ABŞ",30000000000],["Alex Mordan","Rusiya",30000000000],
  ["James Simmons","ABŞ",30000000000],["Leonid Michelov","Rusiya",29000000000],
  ["Wang Weihan","Çin",29000000000],["Dustin Mosker","ABŞ",28000000000],
  ["Eric Schmidtson","ABŞ",28000000000],["John Menardson","ABŞ",27000000000],
  ["Rupert Murdock","ABŞ",27000000000],["Elaine Marsh","ABŞ",27000000000],
  ["Huang Zhen","Çin",26000000000],["Gennady Timov","Rusiya",26000000000],
  ["Michael Arison","ABŞ",25000000000],["Daniel Gilbertson","ABŞ",25000000000],
  ["Donald Brenton","ABŞ",25000000000],["William Dingman","Çin",24000000000],
  ["Savitri Jindan","Hindistan",24000000000],["Xavier Neilson","Fransa",24000000000],
  ["Reinhold Worth","Almaniya",23000000000],["Pan Dongli","Çin",23000000000],
  ["Henry Chengton","Honq Konq",23000000000],["Thomas Friston","ABŞ",22000000000],
  ["Hasso Platner","Almaniya",22000000000],["Klaus Tschiran","Almaniya",22000000000],
  ["Patrick Drahen","Fransa",21000000000],["Dietrich Mateson","Avstriya",21000000000],
  ["Kwong Shing","Honq Konq",21000000000],["John Frederik","Kipr",21000000000],
  ["Charoen Sirivat","Tailand",20000000000],["Jan Kovan","ABŞ",20000000000],
  ["Stanley Drucker","ABŞ",20000000000],["Carl Ichanov","ABŞ",19000000000],
  ["Julio Domingo","Kolumbiya",19000000000],["Susanne Klattenberg","Almaniya",19000000000],
  ["Stefan Quandor","Almaniya",19000000000],["Dilip Shangar","Hindistan",19000000000],
  ["Pallonji Mistral","İrlandiya",18000000000],["Richard Liuzen","Çin",18000000000],
  ["Alexander Stone","Kanada",17900000000],["Victor Hayes","ABŞ",17700000000],
  ["Daniel Parker","İngiltərə",17500000000],["Michael Turner","Almaniya",17300000000],
  ["Robert Walker","Avstraliya",17100000000],["Ethan Brooks","ABŞ",16900000000],
  ["Nathan Fisher","Kanada",16700000000],["Lucas Coleman","Fransa",16500000000],
  ["Oliver Mason","İsveçrə",16300000000],["Adam Clark","Yaponiya",16100000000],
  ["Ryan Anderson","Sinqapur",15900000000],["Kevin Hunter","ABŞ",15700000000],
  ["Leo Bennett","Almaniya",15500000000],["Oscar Hayes","İngiltərə",15300000000],
  ["David Stone","Kanada",15100000000],["James Parker","ABŞ",14900000000],
  ["Aaron Brooks","Fransa",14700000000],["Brandon Fisher","Avstraliya",14500000000],
  ["Christopher Hall","ABŞ",14300000000],["Derek Cooper","İsveçrə",14100000000],
  ["Evan Porter","Yaponiya",13900000000],["Frank Lawson","ABŞ",13700000000],
  ["George Reed","Almaniya",13500000000],["Henry Sutton","Kanada",13300000000],
  ["Isaac Palmer","İngiltərə",13100000000],["Jack Morrison","ABŞ",12900000000],
  ["Kyle Warren","Fransa",12700000000],["Logan Harper","Sinqapur",12500000000],
  ["Mason Turner","Avstraliya",12300000000],["Noah Griffin","ABŞ",12100000000],
  ["Owen Mitchell","Almaniya",11900000000],["Patrick Cole","Kanada",11700000000],
  ["Quentin Hayes","İngiltərə",11500000000],["Ryan Walker","ABŞ",11300000000],
  ["Samuel Brooks","Yaponiya",11100000000],["Tyler Fisher","Fransa",10900000000],
  ["Ulysses Stone","İsveçrə",10700000000],["Vincent Parker","ABŞ",10500000000],
  ["William Hunter","Almaniya",10300000000],["Xavier Reed","Kanada",10100000000],
  ["Zachary Clark","Avstraliya",9900000000],["Adrian Bennett","ABŞ",9700000000],
  ["Blake Cooper","Fransa",9500000000],["Colin Sutton","İngiltərə",9300000000],
  ["Damian Harper","Yaponiya",9100000000],["Edward Lawson","ABŞ",8900000000],
  ["Felix Palmer","Almaniya",8700000000],["Gavin Turner","Kanada",8500000000],
  ["Harrison Mitchell","Sinqapur",8300000000],["Ian Griffin","ABŞ",8100000000],
  ["Jordan Cole","Fransa",7900000000],["Kevin Reed","İngiltərə",7700000000],
  ["Liam Brooks","Avstraliya",7500000000],["Marcus Fisher","ABŞ",7300000000],
  ["Nolan Parker","Kanada",7100000000],["Oliver Stone","Almaniya",6900000000],
  ["Preston Hayes","Yaponiya",6700000000],["Quentin Walker","ABŞ",6500000000],
  ["Ryan Hunter","Fransa",6300000000],["Sebastian Clark","İngiltərə",6100000000],
  ["Tristan Cooper","ABŞ",5900000000],["Ulrich Bennett","İsveçrə",5700000000],
  ["Victor Lawson","Almaniya",5500000000],["Wesley Sutton","Kanada",5300000000],
  ["Xavier Harper","ABŞ",5100000000],["Yusuf Palmer","Türkiyə",4900000000],
  ["Zach Turner","Avstraliya",4700000000],["Aaron Mitchell","ABŞ",4500000000],
  ["Brian Griffin","Fransa",4300000000],["Connor Reed","İngiltərə",4100000000],
  ["Dylan Stone","ABŞ",3900000000],["Eric Walker","Kanada",3700000000],
  ["Finn Hayes","Almaniya",3500000000],["Grant Hunter","Yaponiya",3300000000],
  ["Hudson Clark","ABŞ",3100000000],["Ivan Cooper","İsveçrə",2900000000],
  ["Jason Bennett","Fransa",2700000000],["Kevin Sutton","İngiltərə",2500000000],
  ["Logan Lawson","ABŞ",2300000000],["Mason Harper","Kanada",2100000000],
  ["Nathan Palmer","Almaniya",1900000000],["Owen Turner","ABŞ",1700000000],
  ["Parker Mitchell","Yaponiya",1500000000],["Quentin Griffin","Fransa",1300000000],
  ["Ryan Cole","İngiltərə",1200000000],["Samuel Reed","ABŞ",1100000000],
  ["Tyler Stone","Kanada",1000000000],["Uriel Walker","İsveçrə",900000000],
  ["Victor Hayes","Almaniya",800000000],["William Hunter","ABŞ",700000000],
  ["Xavier Clark","Fransa",600000000],["Zach Bennett","İngiltərə",500000000],
  ["Adam Cooper","ABŞ",400000000],["Brandon Lawson","Kanada",300000000],
  ["Caleb Sutton","Almaniya",250000000],["Dominic Harper","Yaponiya",200000000],
  ["Ethan Palmer","ABŞ",175000000],["Felix Turner","Fransa",150000000],
  ["Gavin Mitchell","İngiltərə",125000000],["Henry Griffin","ABŞ",100000000],
  ["Adrian Keller","ABŞ",99000000],["Bruno Meyer","Almaniya",98670000],
  ["Carlos Silva","Braziliya",98340000],["Daniel Novak","Polşa",98010000],
  ["Emil Johansson","İsveç",97680000],["Farid Hasan","Türkiyə",97350000],
  ["Gabriel Rossi","İtaliya",97020000],["Hugo Martinez","İspaniya",96690000],
  ["Ivan Petrov","Rusiya",96360000],["Julian Becker","Almaniya",96030000],
  ["Karim Al-Sayed","BƏƏ",95700000],["Liam O'Connor","İrlandiya",95370000],
  ["Matteo Ricci","İtaliya",95040000],["Niko Varga","Macarıstan",94710000],
  ["Omar Khalid","Misir",94380000],["Pablo Herrera","Argentina",94050000],
  ["Quentin Laurent","Fransa",93720000],["Rami Haddad","Livan",93390000],
  ["Stefan Muller","Almaniya",93060000],["Tomas Eriksen","Norveç",92730000],
  ["Usman Aliyev","Azərbaycan",92400000],["Victor Ivanov","Rusiya",92070000],
  ["William Brown","Kanada",91740000],["Xavier Dupont","Fransa",91410000],
  ["Youssef Karim","Mərakeş",91080000],["Zoltan Kovacs","Macarıstan",90750000],
  ["Aaron Blake","ABŞ",90420000],["Benjamin Scott","İngiltərə",90090000],
  ["Charles Green","Avstraliya",89760000],["David White","Kanada",89430000],
  ["Ethan Moore","ABŞ",89100000],["Felix Weber","Almaniya",88770000],
  ["George Hall","İngiltərə",88440000],["Henry Clark","ABŞ",88110000],
  ["Isaac Turner","Kanada",87780000],["Jack Lewis","Avstraliya",87450000],
  ["Kyle Adams","ABŞ",87120000],["Logan Baker","İrlandiya",86790000],
  ["Mason Wright","İngiltərə",86460000],["Noah Collins","ABŞ",86130000],
  ["Owen Murphy","Kanada",85800000],["Patrick Hughes","İsveç",85470000],
  ["Quentin Reed","Almaniya",85140000],["Ryan Foster","ABŞ",84810000],
  ["Samuel Gray","Fransa",84480000],["Tyler Scott","İtaliya",84150000],
  ["Umar Khan","Pakistan",83820000],["Victor Lopez","İspaniya",83490000],
  ["William Martin","ABŞ",83160000],["Xavier Nelson","Kanada",82830000],
  ["Yusuf Demir","Türkiyə",82500000],["Zachary Hill","ABŞ",82170000],
  ["Adam Young","İngiltərə",81840000],["Brian King","İrlandiya",81510000],
  ["Colin Ward","Avstraliya",81180000],["Dylan Scott","Kanada",80850000],
  ["Eric Johnson","ABŞ",80520000],["Finn Andersen","Danimarka",80190000],
  ["Gavin Ross","İskoçiya",79860000],["Harrison Lee","Sinqapur",79530000],
  ["Ian Carter","ABŞ",79200000],["Jason Bell","İngiltərə",78870000],
  ["Kevin Wood","Kanada",78540000],["Liam Carter","Avstraliya",78210000],
  ["Marcus Young","ABŞ",77880000],["Nathan King","Almaniya",77550000],
  ["Oliver Scott","Fransa",77220000],["Peter Morgan","İsveçrə",76890000],
  ["Quentin Adams","ABŞ",76560000],["Ryan Brooks","Kanada",76230000],
  ["Simon Walker","İngiltərə",75900000],["Thomas Green","ABŞ",75570000],
  ["Uriel Stone","Almaniya",75240000],["Victor Moore","İspaniya",74910000],
  ["William Reed","Fransa",74580000],["Xavier Clark","ABŞ",74250000],
  ["Yusuf Ali","BƏƏ",73920000],["Zach Bennett","Kanada",73590000],
  ["Aaron Cooper","İngiltərə",73260000],["Brandon Scott","ABŞ",72930000],
  ["Caleb Wright","Avstraliya",72600000],["Dominic Hall","Kanada",72270000],
  ["Ethan Turner","ABŞ",71940000],["Felix Brown","Almaniya",71610000],
  ["Gavin Murphy","İrlandiya",71280000],["Henry Adams","İngiltərə",70950000],
  ["Isaac Scott","ABŞ",70620000],["Jack Morgan","Fransa",70290000],
  ["Kyle Ross","Kanada",69960000],["Logan Hill","ABŞ",69630000],
  ["Mason Green","Almaniya",69300000],["Noah Carter","İngiltərə",68970000],
  ["Owen Bell","Avstraliya",68640000],["Patrick Wood","Kanada",68310000],
  ["Quentin Moore","ABŞ",67980000],["Ryan Young","Fransa",67650000],
  ["Samuel King","İngiltərə",67320000],["Tyler Lee","Almaniya",66990000],
  ["Uriel Baker","ABŞ",66660000],["Victor Foster","Kanada",66330000],
  ["Adrian Wolf","İsveç",30000000],["Brian Cole","Norveç",28500000],
  ["Chris Nolan","ABŞ",27000000],["Derek Miles","Almaniya",25500000],
  ["Ethan Blake","Fransa",24000000],["Frank Harris","İtaliya",22500000],
  ["George Mason","Kanada",21000000],["Henry Fox","İngiltərə",19500000],
  ["Ivan Stone","Rusiya",18000000],["Jack Hunter","ABŞ",17000000],
  ["Kyle Reed","Avstraliya",16000000],["Liam Foster","İrlandiya",15000000],
  ["Mason Gray","İsveçrə",14000000],["Noah Brooks","ABŞ",13000000],
  ["Oliver King","Almaniya",12000000],["Peter Hall","Fransa",11000000],
  ["Quentin Ward","Kanada",10000000],["Ryan Cole","İngiltərə",9000000],
  ["Simon Bell","ABŞ",8000000],["Thomas Wood","Avstraliya",7000000],
  ["Victor Adams","Almaniya",6000000],["William Scott","Fransa",5500000],
  ["Xavier Moore","Kanada",5000000],["Yusuf Khan","Türkiyə",4500000],
  ["Zachary Reed","ABŞ",4000000],["Aaron Hill","İngiltərə",3500000],
  ["Brandon Fox","İsveç",3000000],["Colin Stone","Norveç",2500000],
  ["Dylan King","Danimarka",2000000],["Eric Brooks","ABŞ",1800000],
  ["Finn Ward","İrlandiya",1600000],["Gavin Hall","Kanada",1400000],
  ["Harrison Reed","Almaniya",1200000],["Ian Moore","Fransa",1000000],
  ["Jason Clark","ABŞ",900000],["Kevin Stone","İngiltərə",800000],
  ["Logan Fox","Avstraliya",700000],["Marcus Hill","Kanada",600000],
  ["Nathan Ward","Almaniya",500000],["Owen Brooks","ABŞ",450000],
  ["Patrick Reed","Fransa",400000],["Quentin Moore","İngiltərə",350000],
  ["Ryan Fox","İsveç",300000],["Samuel Hill","Norveç",280000],
  ["Tyler Stone","Danimarka",260000],["Uriel King","Kanada",240000],
  ["Victor Brooks","ABŞ",220000],["William Ward","Almaniya",200000],
  ["Xavier Hall","Fransa",180000],["Yusuf Moore","Türkiyə",160000],
  ["Zach Hill","İngiltərə",150000],["Adam Stone","Kanada",145000],
  ["Brian Reed","ABŞ",140000],["Colin Fox","Almaniya",135000],
  ["Derek Ward","Fransa",130000],["Ethan Moore","İsveç",125000],
  ["Frank King","Norveç",120000],["George Brooks","Danimarka",118000],
  ["Henry Hill","Kanada",116000],["Ivan Reed","ABŞ",114000],
  ["Jack Stone","Almaniya",112000],["Kyle Fox","Fransa",110000],
  ["Liam Ward","İngiltərə",108000],["Mason Brooks","Kanada",106000],
  ["Noah Hill","ABŞ",104000],["Oliver Reed","Almaniya",103000],
  ["Peter Fox","Fransa",102500],["Quentin Stone","İsveç",102000],
  ["Ryan Ward","Norveç",101500],["Simon Brooks","Danimarka",101000],
  ["Thomas Hill","Kanada",100800],["Uriel Reed","ABŞ",100600],
  ["Victor Fox","Almaniya",100500],["William Stone","Fransa",100400],
  ["Xavier Ward","İngiltərə",100300],["Yusuf Brooks","İsveç",100250],
  ["Zach Reed","Norveç",100200],["Aaron Stone","Danimarka",100150],
  ["Brandon Fox","Kanada",100120],["Colin Hill","ABŞ",100110],
  ["Dylan Ward","Almaniya",100105],["Eric Brooks","Fransa",100104],
  ["Finn Stone","İsveç",100103],["Gavin Fox","Norveç",100102],
  ["Harrison Ward","Danimarka",100101],["Ian Brooks","Kanada",100100],
  ["Jason Hill","ABŞ",100099],["Kevin Stone","Almaniya",100098],
  ["Logan Fox","Fransa",100097],["Marcus Ward","İsveç",100096],
  ["Nathan Brooks","Norveç",100095],["Owen Hill","Danimarka",100094],
  ["Patrick Stone","Kanada",100093],["Quentin Fox","ABŞ",100092],
  ["Ryan Ward","Almaniya",100091],["Samuel Brooks","Fransa",100090],
  ["Tyler Hill","İsveç",100089],["Uriel Stone","Norveç",100088],
  ["Final Markov","Global",100000]
];

const Leaderboard = (() => {
  let _entries = [];
  let _lastUpdatedDay = 0;

  function _seededRand(seed) {
    let s = seed;
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >>> 17)) >>> 0;
    s = (s ^ (s << 5)) >>> 0;
    return s / 4294967296;
  }

  function init(savedData) {
    if (savedData && savedData.entries && savedData.entries.length === 499) {
      _entries = savedData.entries;
      _lastUpdatedDay = savedData.lastUpdatedDay || 0;
    } else {
      _entries = RAW_LEADERBOARD.map(([name, country, wealth]) => ({
        name, country, wealth
      }));
      _lastUpdatedDay = 0;
    }
  }

  function updateForDay(day) {
    if (_lastUpdatedDay >= day) return;
    for (let d = _lastUpdatedDay + 1; d <= day; d++) {
      _entries = _entries.map((e, i) => {
        const seed = d * 9973 + i * 1657;
        const rand = _seededRand(seed);
        const change = (rand - 0.5) * 0.01; // ±0.5%
        return { ...e, wealth: Math.max(e.wealth * (1 + change), 100000) };
      });
    }
    _lastUpdatedDay = day;
  }

  function getState() {
    return { entries: _entries, lastUpdatedDay: _lastUpdatedDay };
  }

  function getSortedList(playerWealth) {
    const playerEntry = {
      name: "Sən",
      country: "Azərbaycan",
      wealth: playerWealth,
      isPlayer: true
    };
    const combined = [..._entries.map(e => ({ ...e, isPlayer: false })), playerEntry];
    combined.sort((a, b) => b.wealth - a.wealth);
    return combined.map((e, i) => ({ ...e, rank: i + 1 }));
  }

  function getPlayerRank(playerWealth) {
    const sorted = getSortedList(playerWealth);
    const p = sorted.find(e => e.isPlayer);
    return p ? p.rank : 500;
  }

  return { init, updateForDay, getState, getSortedList, getPlayerRank };
})();

/* ──────────────────────────────────────────────────────────
   LEADERBOARD UI
────────────────────────────────────────────────────────── */
function fmtWealth(val) {
  if (val >= 1e12) return "$" + (val / 1e12).toFixed(2) + "T";
  if (val >= 1e9)  return "$" + (val / 1e9).toFixed(2)  + "B";
  if (val >= 1e6)  return "$" + (val / 1e6).toFixed(2)  + "M";
  if (val >= 1e3)  return "$" + (val / 1e3).toFixed(1)  + "K";
  return "$" + Math.round(val).toLocaleString("en-US");
}

function renderLeaderboard() {
  const playerWealth = calcNetWorth();
  Leaderboard.updateForDay(state.day);

  const sorted = Leaderboard.getSortedList(playerWealth);
  const playerRank = sorted.find(e => e.isPlayer)?.rank || 500;

  const headerEl = document.getElementById("lb-player-rank");
  if (headerEl) {
    headerEl.textContent = "#" + playerRank + " / 500";
  }
  const wealthEl = document.getElementById("lb-player-wealth");
  if (wealthEl) {
    wealthEl.textContent = fmtWealth(playerWealth);
  }

  const container = document.getElementById("lb-list");
  if (!container) return;

  // Yalnız görünən aralıqdan render et — performance üçün virtual scroll
  const CHUNK = 30; // başlanğıcda 30 nəfər + oyunçunun ətrafı
  let html = "";

  // İlk 30
  const top = sorted.slice(0, CHUNK);
  // Oyunçunun ətrafı (əgər top-30-da deyilsə)
  const playerIdx = sorted.findIndex(e => e.isPlayer);
  const showSeparator = playerIdx >= CHUNK;
  const nearby = showSeparator
    ? sorted.slice(Math.max(playerIdx - 2, CHUNK), playerIdx + 3)
    : [];

  function rowHtml(e) {
    const flag = COUNTRY_FLAGS[e.country] || "🌍";
    const rankClass = e.rank <= 3
      ? ["lb-gold","lb-silver","lb-bronze"][e.rank - 1]
      : "";
    const playerClass = e.isPlayer ? "lb-player-row" : "";
    const rankDisplay = e.rank <= 3
      ? ["🥇","🥈","🥉"][e.rank - 1]
      : e.rank;
    return `
      <div class="lb-row ${rankClass} ${playerClass}">
        <div class="lb-rank">${rankDisplay}</div>
        <div class="lb-name-wrap">
          <span class="lb-flag">${flag}</span>
          <span class="lb-name">${e.isPlayer ? "👤 Sən" : e.name}</span>
        </div>
        <div class="lb-wealth">${fmtWealth(e.wealth)}</div>
      </div>`;
  }

  top.forEach(e => { html += rowHtml(e); });

  if (showSeparator) {
    html += `<div class="lb-separator">• • •</div>`;
    nearby.forEach(e => { html += rowHtml(e); });
  }

  container.innerHTML = html;

  // "Hamısını göstər" düyməsi
  const showAllBtn = document.getElementById("lb-show-all");
  if (showAllBtn) {
    showAllBtn.onclick = () => {
      container.innerHTML = sorted.map(e => rowHtml(e)).join("");
      showAllBtn.style.display = "none";
    };
  }

  // Saxla
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(Leaderboard.getState()));
  } catch(e) {}
}

function initLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    Leaderboard.init(saved);
  } catch(e) {
    Leaderboard.init(null);
  }
}

function calcPropertyIncomeForLB() {
  // Bu funksiya app.js-dəki calcNetWorth() istifadə edir
  // Xüsusi bir şey lazım deyil
}
