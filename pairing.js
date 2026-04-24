const drinkColors = {
  beer:        { color: '#f59e0b', rgb: '245,158,11' },
  whiskey:     { color: '#d97706', rgb: '217,119,6' },
  shochu:      { color: '#10b981', rgb: '16,185,129' },
  'red-wine':  { color: '#f87171', rgb: '248,113,113' },
  'white-wine':{ color: '#f472b6', rgb: '244,114,182' },
  sake:        { color: '#a78bfa', rgb: '167,139,250' },
};

const pairings = {
  beer: {
    name: 'ビール',
    icon: '🍺',
    description: 'ビールの苦みと炭酸が、揚げ物や塩気のある料理と絶妙にマッチします。軽やかな喉ごしで脂をさっぱりと流してくれます。',
    foods: [
      { emoji: '🍗', name: 'から揚げ', note: '定番の組み合わせ。衣の香ばしさとよく合う' },
      { emoji: '🫛', name: '枝豆', note: '塩気が苦みを引き立てる黄金ペア' },
      { emoji: '🌭', name: 'ソーセージ', note: 'スモーキーな香りがビールを引き立てる' },
      { emoji: '🍟', name: 'ポテトフライ', note: '塩気と炭酸の相性は抜群' },
      { emoji: '🧀', name: 'チーズ', note: 'クリーミーさが苦みをまろやかに中和' },
      { emoji: '🦐', name: 'エビフライ', note: '衣のサクサク感とよく合う' },
    ],
  },
  whiskey: {
    name: 'ウイスキー',
    icon: '🥃',
    description: 'ウイスキーの複雑な香りと熟成感は、スモーキーな料理や濃厚な風味の食材と深い相性を持ちます。チョコレートや燻製との相乗効果も楽しめます。',
    foods: [
      { emoji: '🍣', name: 'スモークサーモン', note: '燻製の香りがウイスキーと共鳴する' },
      { emoji: '🍫', name: 'チョコレート', note: 'カカオの苦みと樽香の相性が格別' },
      { emoji: '🧀', name: '熟成チーズ', note: 'コンテやゴーダなど濃厚な味わいと' },
      { emoji: '🥩', name: 'ステーキ', note: '熟成肉の旨味がモルトと調和する' },
      { emoji: '🐟', name: '燻製料理', note: 'スモーキーさを共有する最高の相棒' },
      { emoji: '🥜', name: 'ミックスナッツ', note: 'ローストの香ばしさが風味を高める' },
    ],
  },
  shochu: {
    name: '焼酎',
    icon: '🍶',
    description: '焼酎はクセが少なく素材の味を活かす蒸留酒です。水割りやお湯割りにすることで、和食全般と穏やかに寄り添います。',
    foods: [
      { emoji: '🐟', name: '刺身', note: '素材の鮮度を引き立てる透明感ある味' },
      { emoji: '🍢', name: '焼き鳥', note: 'タレ・塩どちらとも相性が良い' },
      { emoji: '🥒', name: '漬物', note: '発酵の旨味と焼酎の相性は抜群' },
      { emoji: '🫕', name: 'もつ煮', note: 'コクのある煮込みをすっきり流す' },
      { emoji: '🫘', name: '豆腐料理', note: '繊細な味わいを壊さない優しい香り' },
      { emoji: '🥬', name: '野菜炒め', note: '素材の風味をそのまま楽しめる' },
    ],
  },
  'red-wine': {
    name: '赤ワイン',
    icon: '🍷',
    description: '赤ワインのタンニンと酸味は、タンパク質豊富な肉料理と化学的に相性が良く、脂の旨味を引き出しながら後味をすっきりさせます。',
    foods: [
      { emoji: '🥩', name: 'ビーフステーキ', note: 'タンニンが肉の脂を包み込む王道ペア' },
      { emoji: '🍝', name: 'ボロネーゼ', note: '肉の旨味とトマトの酸味が調和' },
      { emoji: '🧀', name: 'ブルーチーズ', note: '強烈な個性同士がぶつかり昇華する' },
      { emoji: '🍖', name: 'ラムチョップ', note: '羊の独特な香りと果実味が重なる' },
      { emoji: '🍫', name: 'ダークチョコ', note: '渋みとカカオが重厚感を演出' },
      { emoji: '🫒', name: 'オリーブ', note: '塩気と渋みが互いを引き立て合う' },
    ],
  },
  'white-wine': {
    name: '白ワイン',
    icon: '🥂',
    description: '白ワインの爽やかな酸味と軽やかなボディは、魚介類や白身肉、クリーム系の料理と絶妙に調和します。食前酒としても最適です。',
    foods: [
      { emoji: '🦞', name: 'オマール海老', note: '繊細な甘みを酸味が優しく包む' },
      { emoji: '🐟', name: '白身魚のソテー', note: 'バターとハーブの香りと相性が良い' },
      { emoji: '🦪', name: '牡蠣', note: '潮の香りとミネラル感が共鳴する' },
      { emoji: '🍝', name: 'クリームパスタ', note: '酸味がクリームの重さを中和する' },
      { emoji: '🥗', name: 'シーザーサラダ', note: 'フレッシュな野菜の爽やかさと調和' },
      { emoji: '🧀', name: 'モッツァレラ', note: 'フレッシュチーズのミルク感と好相性' },
    ],
  },
  sake: {
    name: '日本酒',
    icon: '🍾',
    description: '日本酒のまろやかな旨味と豊かな米の風味は、繊細な和食の素材の味を引き立てます。特に発酵食品との相性は抜群です。',
    foods: [
      { emoji: '🐟', name: '刺身・寿司', note: '魚の旨味と日本酒の旨味が重なる' },
      { emoji: '🍱', name: '焼き魚', note: '醤油と塩のシンプルな味付けと調和' },
      { emoji: '🦑', name: '天ぷら', note: '軽やかな衣と淡麗な辛口が合う' },
      { emoji: '🍲', name: '湯豆腐', note: 'じっくり引いた出汁の旨味と共鳴' },
      { emoji: '🧆', name: '揚げ出し豆腐', note: '出汁のコクが日本酒を引き立てる' },
      { emoji: '🫙', name: '塩辛・珍味', note: '発酵の深い旨味同士が響き合う' },
    ],
  },
};

let currentDrink = null;

function selectDrink(drinkKey) {
  currentDrink = drinkKey;

  document.querySelectorAll('.drink-card').forEach(card => {
    card.classList.toggle('active', card.dataset.drink === drinkKey);
  });

  const data = pairings[drinkKey];
  const { color, rgb } = drinkColors[drinkKey];
  const root = document.documentElement;
  root.style.setProperty('--drink-color', color);
  root.style.setProperty('--drink-rgb', rgb);

  document.getElementById('result-icon').textContent = data.icon;
  document.getElementById('result-drink-name').textContent = data.name;
  document.getElementById('result-description').textContent = data.description;

  const foodGrid = document.getElementById('food-grid');
  foodGrid.innerHTML = '';

  data.foods.forEach((food, i) => {
    const item = document.createElement('div');
    item.className = 'food-item';
    item.style.animationDelay = `${i * 0.06}s`;
    item.innerHTML = `
      <span class="food-emoji">${food.emoji}</span>
      <div class="food-info">
        <span class="food-name">${food.name}</span>
        <span class="food-note">${food.note}</span>
      </div>
    `;
    foodGrid.appendChild(item);
  });

  const resultSection = document.getElementById('result-section');
  resultSection.classList.remove('visible');
  void resultSection.offsetWidth;
  resultSection.classList.add('visible');

  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
