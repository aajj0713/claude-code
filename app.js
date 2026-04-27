const BOOKS = [
  {
    id: 1,
    title: "容疑者Xの献身",
    author: "東野圭吾",
    genre: "ミステリー",
    cover: "🔍",
    coverColor: "#e0f2fe",
    description: "天才数学者・石神が隣人の殺人を隠蔽するために張り巡らせた完全犯罪。刑事ガリレオこと湯川学が真相に迫る傑作ミステリ。",
    tags: ["ミステリー", "推理", "謎解き", "感動", "天才", "犯罪", "論理"],
  },
  {
    id: 2,
    title: "1Q84",
    author: "村上春樹",
    genre: "文学",
    cover: "🌙",
    coverColor: "#fdf4ff",
    description: "1984年の東京が舞台の幻想的な世界。二つの月が輝く「1Q84年」に迷い込んだ二人の男女の運命的な物語。",
    tags: ["幻想", "哲学", "恋愛", "謎", "現代文学", "宗教", "社会"],
  },
  {
    id: 3,
    title: "ハリー・ポッターと賢者の石",
    author: "J.K.ローリング",
    genre: "ファンタジー",
    cover: "🧙",
    coverColor: "#fff7ed",
    description: "魔法使いの少年ハリーが魔法学校ホグワーツで友情と勇気を育む冒険ファンタジー。世界中で愛される名作。",
    tags: ["ファンタジー", "魔法", "冒険", "友情", "成長", "学校", "少年"],
  },
  {
    id: 4,
    title: "ノルウェイの森",
    author: "村上春樹",
    genre: "恋愛",
    cover: "🌲",
    coverColor: "#f0fdf4",
    description: "喪失と再生をテーマに、複雑な恋愛と青春の痛みを描いた純文学の傑作。読者の心に深く刻まれる一冊。",
    tags: ["恋愛", "青春", "喪失", "感動", "切ない", "大学生", "現代文学"],
  },
  {
    id: 5,
    title: "鬼滅の刃（小説版）",
    author: "吾峠呼世晴",
    genre: "ファンタジー",
    cover: "⚔️",
    coverColor: "#fff1f2",
    description: "大正時代を舞台に、家族を鬼に殺された少年・炭治郎が妹を人間に戻すため鬼殺隊として戦う壮大な物語。",
    tags: ["ファンタジー", "アクション", "家族", "感動", "成長", "歴史", "鬼"],
  },
  {
    id: 6,
    title: "雪国",
    author: "川端康成",
    genre: "文学",
    cover: "❄️",
    coverColor: "#f0f9ff",
    description: "「国境の長いトンネルを抜けると雪国であった」で始まる日本文学の金字塔。雪深い温泉地の芸者との儚い恋愛。",
    tags: ["恋愛", "切ない", "日本文学", "感動", "自然", "哲学", "古典"],
  },
  {
    id: 7,
    title: "十二国記 月の影 影の海",
    author: "小野不由美",
    genre: "ファンタジー",
    cover: "🐉",
    coverColor: "#fefce8",
    description: "異世界に飛ばされた少女・陽子が真の自分を見つけ、王として成長していく壮大なファンタジー。深い世界観が魅力。",
    tags: ["ファンタジー", "異世界", "成長", "冒険", "女性主人公", "政治", "王"],
  },
  {
    id: 8,
    title: "あの花が咲く丘で、君とまた出会えたら",
    author: "汐見夏衛",
    genre: "恋愛",
    cover: "🌸",
    coverColor: "#fdf2f8",
    description: "現代の少女が太平洋戦争時代にタイムスリップし、特攻隊員の青年と恋に落ちる感涙の恋愛小説。",
    tags: ["恋愛", "感動", "泣ける", "歴史", "戦争", "タイムスリップ", "切ない"],
  },
  {
    id: 9,
    title: "砂の女",
    author: "安部公房",
    genre: "文学",
    cover: "🏜️",
    coverColor: "#fffbeb",
    description: "砂丘の穴に閉じ込められた男と謎の女。逃げ場のない不条理な状況に哲学的な問いが交錯する不思議な名作。",
    tags: ["哲学", "不条理", "謎", "心理", "サスペンス", "現代文学", "逃亡"],
  },
  {
    id: 10,
    title: "三体",
    author: "劉慈欣",
    genre: "SF",
    cover: "🌌",
    coverColor: "#eff6ff",
    description: "中国の文化大革命から始まり、三つの太陽を持つ惑星の文明と人類の接触を描くスケールの大きいSF巨編。",
    tags: ["SF", "宇宙", "科学", "哲学", "歴史", "文明", "接触"],
  },
  {
    id: 11,
    title: "ソードアート・オンライン",
    author: "川原礫",
    genre: "SF・ファンタジー",
    cover: "🎮",
    coverColor: "#eef2ff",
    description: "VRMMORPGに閉じ込められた少年キリトが攻略を目指す人気ライトノベル。仮想世界のリアルな戦闘と恋愛が魅力。",
    tags: ["SF", "ファンタジー", "ゲーム", "冒険", "恋愛", "仮想現実", "成長"],
  },
  {
    id: 12,
    title: "夜は短し歩けよ乙女",
    author: "森見登美彦",
    genre: "文学・ファンタジー",
    cover: "🦊",
    coverColor: "#fff7ed",
    description: "京都を舞台に「黒髪の乙女」を追いかける男の恋愛物語。独特の文体と幻想的な京都の世界観が癖になる。",
    tags: ["恋愛", "ファンタジー", "ユーモア", "青春", "京都", "幻想", "コメディ"],
  },
  {
    id: 13,
    title: "告白",
    author: "湊かなえ",
    genre: "サスペンス・ミステリー",
    cover: "😈",
    coverColor: "#fdf4ff",
    description: "中学校で起きた幼女殺人事件。母親である教師による衝撃の「告白」から始まる複数視点のダークサスペンス。",
    tags: ["ミステリー", "サスペンス", "心理", "学校", "復讐", "ダーク", "衝撃"],
  },
  {
    id: 14,
    title: "かがみの孤城",
    author: "辻村深月",
    genre: "ファンタジー",
    cover: "🏰",
    coverColor: "#f0fdf4",
    description: "学校に行けない七人の少年少女が鏡の世界の孤城に集まる。謎を解きながら互いを支え合う感動のファンタジー。",
    tags: ["ファンタジー", "感動", "青春", "友情", "謎解き", "不登校", "成長"],
  },
  {
    id: 15,
    title: "坊っちゃん",
    author: "夏目漱石",
    genre: "文学",
    cover: "🍊",
    coverColor: "#fff7ed",
    description: "江戸っ子気質の直情型教師が四国の中学に赴任し、周囲と衝突する様子を軽快なユーモアで描いた国民的名作。",
    tags: ["日本文学", "ユーモア", "青春", "教師", "友情", "古典", "成長"],
  },
  {
    id: 16,
    title: "鍵のない夢を見る",
    author: "辻村深月",
    genre: "サスペンス",
    cover: "🔑",
    coverColor: "#fdf2f8",
    description: "5つの短編からなる連作集。地方の閉塞した日常に生きる女性たちの「逃れられない現実」を描く社会派サスペンス。",
    tags: ["サスペンス", "女性", "社会", "心理", "リアル", "短編", "衝撃"],
  },
  {
    id: 17,
    title: "銀河鉄道の夜",
    author: "宮沢賢治",
    genre: "文学・ファンタジー",
    cover: "🚂",
    coverColor: "#eff6ff",
    description: "孤独な少年ジョバンニが親友カンパネルラと銀河を旅する幻想的な物語。生と死、孤独と愛を詩的に描く名作。",
    tags: ["ファンタジー", "感動", "哲学", "友情", "死", "幻想", "詩的"],
  },
  {
    id: 18,
    title: "アルジャーノンに花束を",
    author: "ダニエル・キイス",
    genre: "SF",
    cover: "🐭",
    coverColor: "#f0fdf4",
    description: "知的障害を持つ青年チャーリーが手術で天才になり、また失っていく過程を日記形式で描く感涙のSF名作。",
    tags: ["SF", "感動", "泣ける", "成長", "哲学", "切ない", "人間性"],
  },
  {
    id: 19,
    title: "氷菓",
    author: "米澤穂信",
    genre: "ミステリー",
    cover: "🧊",
    coverColor: "#f0f9ff",
    description: "「省エネ主義」の高校生・折木奉太郎が日常の謎を解く青春ミステリ。過去の事件の真相に迫るクライマックスも見事。",
    tags: ["ミステリー", "青春", "学校", "謎解き", "日常", "高校生", "友情"],
  },
  {
    id: 20,
    title: "星の王子さま",
    author: "サン＝テグジュペリ",
    genre: "文学・ファンタジー",
    cover: "⭐",
    coverColor: "#fefce8",
    description: "小さな星からやってきた王子と砂漠で出会った飛行士の物語。「大切なものは目には見えない」という普遍的な真理。",
    tags: ["ファンタジー", "哲学", "感動", "子供", "純粋", "友情", "孤独"],
  },
  {
    id: 21,
    title: "リング",
    author: "鈴木光司",
    genre: "ホラー",
    cover: "📺",
    coverColor: "#f1f5f9",
    description: "見ると一週間後に死ぬ呪いのビデオ。記者の浅川が謎の真相を追う恐怖のホラー小説。映像化でも世界的に有名。",
    tags: ["ホラー", "怖い", "謎解き", "恐怖", "呪い", "サスペンス", "心理"],
  },
  {
    id: 22,
    title: "風の谷のナウシカ（原作コミック）",
    author: "宮崎駿",
    genre: "SF・ファンタジー",
    cover: "🌿",
    coverColor: "#f0fdf4",
    description: "文明崩壊後の世界で腐海と人間の共存を模索するナウシカの壮大な物語。映画より深い哲学的テーマが展開する。",
    tags: ["ファンタジー", "SF", "環境", "冒険", "哲学", "女性主人公", "戦争"],
  },
  {
    id: 23,
    title: "博士の愛した数式",
    author: "小川洋子",
    genre: "文学",
    cover: "🔢",
    coverColor: "#fdf4ff",
    description: "記憶が80分しか続かない数学博士と家政婦・その息子の温かな交流。数式の美しさと人間の絆を描いた感動作。",
    tags: ["感動", "数学", "家族", "温かい", "切ない", "絆", "日常"],
  },
  {
    id: 24,
    title: "君の名は。",
    author: "新海誠",
    genre: "SF・恋愛",
    cover: "🌠",
    coverColor: "#eff6ff",
    description: "東京の少年と田舎の少女が夢の中で入れ替わり、時空を超えた恋愛が始まる感動的な青春ラブストーリー。",
    tags: ["恋愛", "SF", "青春", "感動", "泣ける", "タイムスリップ", "運命"],
  },
  {
    id: 25,
    title: "火花",
    author: "又吉直樹",
    genre: "文学",
    cover: "🎤",
    coverColor: "#fdf4ff",
    description: "芸人を目指す若者の青春と挫折を描いた芥川賞受賞作。笑いと孤独、師弟関係のリアルな人間ドラマ。",
    tags: ["青春", "友情", "挫折", "成長", "コメディ", "芸能", "感動"],
  },
];

const KEYWORD_MAP = {
  ミステリー: ["ミステリー", "謎解き", "推理", "犯罪", "サスペンス", "謎", "論理"],
  恋愛: ["恋愛", "ロマンス", "切ない", "運命", "ときめき", "恋", "片思い"],
  ファンタジー: ["ファンタジー", "魔法", "冒険", "異世界", "ドラゴン", "剣", "魔王", "騎士"],
  SF: ["SF", "未来", "宇宙", "科学", "ロボット", "AI", "仮想現実", "ゲーム", "タイムスリップ"],
  ホラー: ["ホラー", "怖い", "恐怖", "呪い", "幽霊", "ゾンビ", "心霊"],
  歴史: ["歴史", "時代小説", "武士", "戦国", "江戸", "明治", "大正", "戦争", "侍"],
  青春: ["青春", "学校", "高校", "大学", "部活", "友情", "恋", "受験"],
  感動: ["感動", "泣ける", "涙", "心温まる", "感涙", "絆"],
  哲学: ["哲学", "人生", "存在", "意味", "宗教", "深い"],
  サスペンス: ["サスペンス", "スリル", "緊張", "心理", "ダーク", "衝撃"],
  成長: ["成長", "主人公", "強くなる", "学ぶ", "変わる", "乗り越える"],
  家族: ["家族", "親子", "兄弟", "絆", "温かい", "ほのぼの"],
};

function tokenize(text) {
  return text
    .replace(/[、。！？,.!?\s]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((t) => t.toLowerCase());
}

function scoreBook(book, tokens) {
  let score = 0;
  const allTags = book.tags.map((t) => t.toLowerCase());
  const genreLower = book.genre.toLowerCase();
  const titleLower = book.title.toLowerCase();
  const descLower = book.description.toLowerCase();

  for (const token of tokens) {
    if (token.length < 2) continue;

    // Direct tag match
    for (const tag of allTags) {
      if (tag.includes(token) || token.includes(tag)) score += 3;
    }

    // Genre match
    if (genreLower.includes(token) || token.includes(genreLower)) score += 2;

    // Title/description partial match
    if (titleLower.includes(token)) score += 1;
    if (descLower.includes(token)) score += 1;

    // Keyword map lookup
    for (const [, synonyms] of Object.entries(KEYWORD_MAP)) {
      const synonymsLower = synonyms.map((s) => s.toLowerCase());
      if (synonymsLower.some((s) => s.includes(token) || token.includes(s))) {
        for (const tag of allTags) {
          const tagLower = tag.toLowerCase();
          if (synonymsLower.some((s) => s === tagLower || tagLower === s)) {
            score += 2;
          }
        }
      }
    }
  }

  return score;
}

function getMatchedKeywords(tokens) {
  const matched = new Set();
  for (const token of tokens) {
    if (token.length < 2) continue;
    for (const [category, synonyms] of Object.entries(KEYWORD_MAP)) {
      if (synonyms.some((s) => s.toLowerCase().includes(token) || token.includes(s.toLowerCase()))) {
        matched.add(category);
      }
    }
  }
  return [...matched];
}

function recommend() {
  const input = document.getElementById("description").value.trim();
  if (!input) {
    document.getElementById("description").focus();
    document.getElementById("description").style.borderColor = "#ef4444";
    setTimeout(() => {
      document.getElementById("description").style.borderColor = "";
    }, 1500);
    return;
  }

  const tokens = tokenize(input);
  const matchedCategories = getMatchedKeywords(tokens);

  const scored = BOOKS.map((book) => ({
    ...book,
    score: scoreBook(book, tokens),
  }))
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const resultsSection = document.getElementById("results-section");
  const emptyState = document.getElementById("empty-state");
  const grid = document.getElementById("results-grid");
  const countEl = document.getElementById("results-count");
  const summaryEl = document.getElementById("results-summary");

  if (scored.length === 0) {
    resultsSection.classList.add("hidden");
    emptyState.classList.remove("hidden");
    emptyState.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  emptyState.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  const maxScore = scored[0].score;
  countEl.textContent = `（${scored.length}件）`;

  if (matchedCategories.length > 0) {
    summaryEl.textContent = `「${matchedCategories.join("・")}」に関連する作品をおすすめします`;
  } else {
    summaryEl.textContent = "入力内容に関連する作品をおすすめします";
  }

  grid.innerHTML = "";

  scored.forEach((book, i) => {
    const pct = Math.round((book.score / maxScore) * 100);
    const card = document.createElement("div");
    card.className = "book-card";
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="book-cover" style="background:${book.coverColor}">${book.cover}</div>
      <div class="book-info">
        <span class="book-genre">${book.genre}</span>
        <div class="book-title">${book.title}</div>
        <div class="book-author">著者：${book.author}</div>
        <div class="book-description">${book.description}</div>
        <div class="match-score">
          <span class="match-label">一致度</span>
          <div class="match-bar-bg">
            <div class="match-bar" style="width:${pct}%"></div>
          </div>
          <span class="match-percent">${pct}%</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setTag(text) {
  document.getElementById("description").value = text;
}

function clearSearch() {
  document.getElementById("description").value = "";
  document.getElementById("results-section").classList.add("hidden");
  document.getElementById("empty-state").classList.add("hidden");
  document.getElementById("description").focus();
}

document.getElementById("description").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    recommend();
  }
});
