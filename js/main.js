let currentEngineUrl = 'https://www.baidu.com/s?wd=';
let allLinks = [];
let categories = [];
let stocks = [];

async function loadNavData() {
    try {
        const res = await fetch('/api/nav/list');
        const { data } = await res.json();
        categories = data.categories;
        allLinks = data.links;
        stocks = data.stocks;
        renderNav();
        renderStocks();
        fetchStockData();
    } catch (e) {
        console.log('加载导航数据失败，使用本地缓存', e);
        renderNav();
        renderStocks();
    }
}

function renderNav(filterLinks = allLinks) {
    const container = document.getElementById('nav-container');
    container.innerHTML = '';
    
    categories.sort((a, b) => (a.sort || 0) - (b.sort || 0)).forEach(cat => {
        const catLinks = filterLinks.filter(l => l.category_id === cat.id).sort((a, b) => (a.sort || 0) - (b.sort || 0));
        if (catLinks.length === 0) return;
        
        const group = document.createElement('div');
        group.className = 'nav-group';
        group.innerHTML = `<h2 class="group-title">${cat.name}</h2><div class="link-box"></div>`;
        
        const linkBox = group.querySelector('.link-box');
        catLinks.forEach(link => {
            const item = document.createElement('div');
            item.className = 'link-item';
            item.innerHTML = `<a href="${link.url}" target="_blank"><span class="icon">${link.icon || '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/></svg>'}</span>${link.title}</a>`;
            linkBox.appendChild(item);
        });
        
        container.appendChild(group);
    });
}

function renderStocks() {
    const stockBox = document.getElementById('stockBox');
    stockBox.innerHTML = '';
    
    if (stocks.length === 0) {
        stocks = [
            { id: 1, code: 'sh000001', name: '上证指数', sort: 1 },
            { id: 2, code: 'sz399001', name: '深证成指', sort: 2 },
            { id: 3, code: 'sz399006', name: '创业板指', sort: 3 },
            { id: 4, code: 'sh000300', name: '沪深300', sort: 4 },
            { id: 5, code: 'sh000016', name: '上证50', sort: 5 },
            { id: 6, code: 'sh000688', name: '科创50', sort: 6 }
        ];
    }
    
    stocks.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    
    stocks.forEach(stock => {
        const item = document.createElement('div');
        item.className = 'stock-item';
        item.setAttribute('data-code', stock.code);
        item.innerHTML = `
            <div class="stock-icon"><svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg></div>
            <div class="stock-info">
                <div class="stock-name">${stock.name}</div>
                <div class="stock-price">--</div>
                <div class="stock-change">--%</div>
            </div>
        `;
        stockBox.appendChild(item);
    });
}

document.getElementById('searchInput').oninput = e => {
    const kw = e.target.value.toLowerCase().trim();
    if (!kw) {
        renderNav();
        return;
    }
    const filtered = allLinks.filter(l => 
        l.title.toLowerCase().includes(kw) || 
        (l.desc && l.desc.toLowerCase().includes(kw))
    );
    renderNav(filtered);
};

function toggleDropdown() {
    const dropdown = document.getElementById('engineDropdown');
    dropdown.classList.toggle('show');
}

function selectEngine(element) {
    const url = element.getAttribute('data-url');
    const svgIcon = element.querySelector('.engine-icon').innerHTML;
    const name = element.textContent.trim();
    
    currentEngineUrl = url;
    document.getElementById('currentEngineIcon').innerHTML = svgIcon;
    document.getElementById('currentEngineName').textContent = name;
    
    document.querySelectorAll('.engine-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('engineDropdown').classList.remove('show');
    document.getElementById('searchInput').focus();
}

function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.open(currentEngineUrl + encodeURIComponent(query), '_blank');
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') performSearch();
}

document.addEventListener('click', e => {
    if (!e.target.closest('.engine-selector')) {
        document.getElementById('engineDropdown').classList.remove('show');
    }
});

function setBingBackground() {
    const apiUrl = 'https://bing.img.run/rand.php';
    document.body.style.backgroundImage = `url(${apiUrl})`;
}

async function fetchWeather() {
    const apiUrl = 'https://wttr.in/?format=j1&lang=zh';
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时')), 10000));
    try {
        const response = await Promise.race([fetch(apiUrl), timeout]);
        const data = await response.json();
        if (data) {
            const city = data.nearest_area[0].areaName[0].value;
            const today = data.weather[0];
            const now = new Date();
            const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
            
            const current = data.current_condition[0];
            const temp = current.temp_C;
            const desc = current.weatherDesc[0].value;
            const weatherCode = current.weatherCode;
            
            const maxTemp = today.maxtempC;
            const minTemp = today.mintempC;
            const chanceofrain = today.hourly.reduce((max, h) => Math.max(max, parseInt(h.chanceofrain) || 0), 0);
            
            document.getElementById('weatherCity').textContent = city;
            document.getElementById('weatherDate').textContent = dateStr;
            document.getElementById('weatherTemp').textContent = `${temp}°C`;
            document.getElementById('weatherDesc').textContent = desc;
            document.getElementById('weatherIcon').textContent = getWeatherIcon(weatherCode);
            document.getElementById('weatherMax').textContent = `${maxTemp}°`;
            document.getElementById('weatherMin').textContent = `${minTemp}°`;
            document.getElementById('weatherRain').textContent = `${chanceofrain}%`;
        }
    } catch (error) {
        console.log('获取天气失败:', error);
        document.getElementById('weatherCity').textContent = '获取失败';
        document.getElementById('weatherDesc').textContent = '点击刷新';
        document.getElementById('weatherCard').style.cursor = 'pointer';
        document.getElementById('weatherCard').addEventListener('click', fetchWeather);
    }
}

function getWeatherIcon(code) {
    const c = parseInt(code);
    if (c <= 116) return '☀️';
    if (c <= 122) return '☁️';
    if (c <= 185) return c >= 143 ? '🌫' : c >= 176 ? (c <= 179 ? '🌦' : c <= 182 ? '🌨' : '❄️') : '🌥';
    if (c <= 230) return c === 200 ? '⛈' : c >= 227 ? '❄️' : '🌨';
    if (c <= 266) return c >= 248 ? '🌫' : '🌧';
    if (c <= 308) return c >= 281 ? (c <= 284 ? '❄️' : '🌧') : '🌧';
    if (c <= 338) return c >= 320 ? (c <= 323 ? '🌨' : c <= 335 ? '❄️' : '⛈') : '🌧';
    if (c <= 395) return c >= 350 ? (c === 350 ? '🌨' : c >= 353 && c <= 356 ? '🌧' : c === 359 || c >= 386 ? '⛈' : c >= 365 && c <= 371 ? '❄️' : '🌨') : '🌧';
    return '🌤';
}

function fetchStockData() {
    const codes = stocks.map(s => s.code).join(',');
    if (!codes) return;
    
    const apiUrl = `https://qt.gtimg.cn/q=${codes}`;
    const script = document.createElement('script');
    
    window.stockCallback = function(data) {
        Object.keys(data).forEach(code => {
            const item = data[code];
            if (!item) return;
            
            const arr = item.split('~');
            const price = arr[3];
            const changePercent = arr[32];
            const change = parseFloat(changePercent);
            
            const stockItem = document.querySelector(`.stock-item[data-code="${code}"]`);
            if (stockItem) {
                const priceEl = stockItem.querySelector('.stock-price');
                const changeEl = stockItem.querySelector('.stock-change');
                const iconEl = stockItem.querySelector('.stock-icon');
                
                if (priceEl) priceEl.textContent = price;
                if (changeEl) {
                    changeEl.textContent = `${change >= 0 ? '+' : ''}${changePercent}%`;
                    changeEl.className = `stock-change ${change > 0 ? 'up' : change < 0 ? 'down' : ''}`;
                }
                if (iconEl) {
                    iconEl.textContent = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
                }
            }
        });
    };
    
    script.src = `${apiUrl}&callback=stockCallback`;
    script.onload = () => script.remove();
    script.onerror = () => { script.remove(); console.log('获取股票数据失败'); };
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    setBingBackground();
    fetchWeather();
    loadNavData();
    setInterval(fetchStockData, 60000);
});