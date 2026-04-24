const TOKYO = { lat: 35.6762, lon: 139.6503 };

const WMO_CODES = {
  0:  { desc: '快晴',         icon: '☀️' },
  1:  { desc: 'ほぼ快晴',     icon: '🌤️' },
  2:  { desc: '一部曇り',     icon: '⛅' },
  3:  { desc: '曇り',         icon: '☁️' },
  45: { desc: '霧',           icon: '🌫️' },
  48: { desc: '霧氷',         icon: '🌫️' },
  51: { desc: '霧雨（弱）',   icon: '🌦️' },
  53: { desc: '霧雨',         icon: '🌦️' },
  55: { desc: '霧雨（強）',   icon: '🌧️' },
  61: { desc: '小雨',         icon: '🌧️' },
  63: { desc: '雨',           icon: '🌧️' },
  65: { desc: '大雨',         icon: '🌧️' },
  71: { desc: '小雪',         icon: '🌨️' },
  73: { desc: '雪',           icon: '❄️' },
  75: { desc: '大雪',         icon: '❄️' },
  77: { desc: '霰',           icon: '🌨️' },
  80: { desc: 'にわか雨（弱）', icon: '🌦️' },
  81: { desc: 'にわか雨',     icon: '🌧️' },
  82: { desc: 'にわか大雨',   icon: '⛈️' },
  85: { desc: 'にわか雪（弱）', icon: '🌨️' },
  86: { desc: 'にわか大雪',   icon: '❄️' },
  95: { desc: '雷雨',         icon: '⛈️' },
  96: { desc: '雷雨（雹あり）', icon: '⛈️' },
  99: { desc: '激しい雷雨',   icon: '🌩️' },
};

const WIND_DIRS = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東',
                   '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西'];

function windDirection(deg) {
  return WIND_DIRS[Math.round(deg / 22.5) % 16];
}

function weatherInfo(code) {
  return WMO_CODES[code] ?? { desc: '不明', icon: '❓' };
}

function formatDate(dateStr, opts = {}) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ja-JP', opts);
}

function dayOfWeek(dateStr) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const d = new Date(dateStr + 'T00:00:00');
  return days[d.getDay()] + '曜日';
}

function setCurrentDate() {
  const now = new Date();
  document.getElementById('current-date').textContent =
    now.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

async function loadWeather() {
  document.getElementById('current-section').innerHTML = '<div class="loading">読み込み中...</div>';
  document.getElementById('details-section').innerHTML = '';
  document.getElementById('forecast-section').innerHTML = '';
  document.getElementById('error-msg').classList.add('hidden');

  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${TOKYO.lat}&longitude=${TOKYO.lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
    `precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum` +
    `&timezone=Asia%2FTokyo&forecast_days=7`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    renderCurrent(data.current);
    renderDetails(data.current);
    renderForecast(data.daily);
  } catch {
    document.getElementById('current-section').innerHTML = '';
    document.getElementById('error-msg').classList.remove('hidden');
  }
}

function renderCurrent(c) {
  const { desc, icon } = weatherInfo(c.weather_code);
  const temp = Math.round(c.temperature_2m);
  const feels = Math.round(c.apparent_temperature);

  document.getElementById('current-section').innerHTML = `
    <div class="weather-icon">${icon}</div>
    <div class="temp-main">${temp}<span class="temp-unit">°C</span></div>
    <div class="weather-desc">${desc}</div>
    <div class="feels-like">体感温度 ${feels}°C</div>
  `;
}

function renderDetails(c) {
  const details = [
    { label: '💧 湿度',       value: `${c.relative_humidity_2m}%`,  sub: '相対湿度' },
    { label: '💨 風速',       value: `${c.wind_speed_10m} km/h`,    sub: windDirection(c.wind_direction_10m) },
    { label: '🌧️ 降水量',     value: `${c.precipitation} mm`,       sub: '現在' },
    { label: '☀️ UV指数',     value: `${c.uv_index ?? '—'}`,        sub: uvLabel(c.uv_index) },
  ];

  document.getElementById('details-section').innerHTML = details.map(d => `
    <div class="detail-card">
      <div class="detail-label">${d.label}</div>
      <div class="detail-value">${d.value}</div>
      <div class="detail-sub">${d.sub}</div>
    </div>
  `).join('');
}

function uvLabel(uv) {
  if (uv == null) return '';
  if (uv <= 2)  return '低い';
  if (uv <= 5)  return '中程度';
  if (uv <= 7)  return '高い';
  if (uv <= 10) return '非常に高い';
  return '危険';
}

function renderForecast(daily) {
  const today = daily.time[0];
  const items = daily.time.map((dateStr, i) => {
    const { icon } = weatherInfo(daily.weather_code[i]);
    const high = Math.round(daily.temperature_2m_max[i]);
    const low  = Math.round(daily.temperature_2m_min[i]);
    const label = dateStr === today ? '今日' : dayOfWeek(dateStr);
    return `
      <div class="forecast-item">
        <div class="forecast-day">${label}</div>
        <div class="forecast-icon">${icon}</div>
        <div class="forecast-high">${high}°</div>
        <div class="forecast-low">${low}°</div>
      </div>
    `;
  });
  document.getElementById('forecast-section').innerHTML = items.join('');
}

setCurrentDate();
loadWeather();
