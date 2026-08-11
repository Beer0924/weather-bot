const fs = require('fs');

const coords = {
  '台北': [25.03, 121.56], '臺北': [25.03, 121.56],
  '新北': [25.01, 121.46], '基隆': [25.12, 121.74],
  '桃園': [24.99, 121.30], '新竹': [24.81, 120.96],
  '苗栗': [24.56, 120.82], '台中': [24.14, 120.68], '臺中': [24.14, 120.68],
  '彰化': [24.08, 120.53], '南投': [23.90, 120.68],
  '雲林': [23.70, 120.53], '嘉義': [23.48, 120.44],
  '台南': [22.99, 120.21], '臺南': [22.99, 120.21],
  '高雄': [22.62, 120.31], '屏東': [22.67, 120.48],
  '宜蘭': [24.75, 121.75], '花蓮': [23.98, 121.60],
  '台東': [22.75, 121.15], '臺東': [22.75, 121.15]
};

const getWeatherText = (code) => {
  if (code === 0) return '晴朗';
  if ([1, 2, 3].includes(code)) return '多雲';
  if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code)) return '陣雨';
  if ([95, 96, 99].includes(code)) return '雷陣雨';
  return '多雲';
};

async function main() {
  const result = {};
  for (const [city, [lat, lon]] of Object.entries(coords)) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTaipei`;
      const res = await fetch(url);
      const data = await res.json();
      const tom = data.daily;
      const cond = getWeatherText(tom.weather_code[1]);
      const minT = Math.round(tom.temperature_2m_min[1]);
      const maxT = Math.round(tom.temperature_2m_max[1]);
      const pop = tom.precipitation_probability_max[1] ?? 0;
      result[city] = `${cond} ${minT}°C ~ ${maxT}°C (降雨機率 ${pop}%)`;
    } catch (e) {
      result[city] = '天氣資料更新中';
    }
  }
  fs.writeFileSync('weather.json', JSON.stringify(result, null, 2), 'utf-8');
  console.log('weather.json updated successfully!');
}

main();
