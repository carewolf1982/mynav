let token = "";
let categories = [];
let links = [];
let stocks = [];
let parsedBookmarks = [];

async function apiRequest(path, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(`/api/nav${path}`, options);
    const data = await response.json();
    if (!response.ok) {
        if (data.msg === '密码错误') {
            token = '';
            document.getElementById("login").classList.remove("d-none");
            document.getElementById("adminPanel").classList.add("d-none");
            alert(data.msg);
        }
        throw new Error(data.msg || `HTTP error! status: ${response.status}`);
    }
    return data;
}

async function login() {
    const pwd = document.getElementById("pwdInput").value.trim();
    if (!pwd) { alert("请输入密码"); return; }
    
    try {
        const ret = await apiRequest('/login', 'POST', { pwd });
        
        token = pwd;
        document.getElementById("login").classList.add("d-none");
        document.getElementById("adminPanel").classList.remove("d-none");
        loadAll();
    } catch (e) {
        alert("登录失败，请检查网络");
    }
}

async function loadAll() {
    try {
        const { data } = await apiRequest('/list');
        categories = data.categories;
        links = data.links;
        stocks = data.stocks;
        renderCatSelect();
        renderIconSelect();
        renderImportCatSelect();
        renderCategories();
        renderLinks();
        renderStocks();
    } catch (e) {
        alert("加载数据失败: " + e.message);
        console.error("加载数据失败:", e);
    }
}

function renderImportCatSelect() {
    const sel = document.getElementById("importCat");
    if (!sel) return;
    sel.innerHTML = '<option value="">选择导入到分类</option>';
    categories.forEach(c => {
        sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

function handleBookmarkFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        parsedBookmarks = parseBookmarks(e.target.result);
        const preview = document.getElementById("importPreview");
        const count = document.getElementById("previewCount");
        if (parsedBookmarks.length > 0) {
            preview.classList.remove("d-none");
            count.textContent = parsedBookmarks.length;
        } else {
            preview.classList.add("d-none");
            alert("未解析到书签链接，请确保文件格式正确");
        }
    };
    reader.readAsText(file);
}

function parseBookmarks(html) {
    const result = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const anchors = doc.querySelectorAll('a');
    
    anchors.forEach(a => {
        const url = a.getAttribute('href');
        const title = a.textContent.trim();
        if (url && title && url.startsWith('http')) {
            result.push({
                title: title,
                url: url,
                desc: a.getAttribute('description') || ''
            });
        }
    });
    
    return result;
}

async function importBookmarks() {
    if (parsedBookmarks.length === 0) {
        alert("请先选择书签文件");
        return;
    }
    
    const catId = document.getElementById("importCat").value;
    const category_id = catId ? parseInt(catId) : 1;
    
    const importLinks = parsedBookmarks.map((link, index) => ({
        ...link,
        category_id: category_id,
        sort: links.length + index + 1
    }));
    
    try {
        const result = await apiRequest('/import', 'POST', { links: importLinks });
        alert(result.msg);
        loadAll();
        parsedBookmarks = [];
        document.getElementById("bookmarkFile").value = "";
        document.getElementById("importPreview").classList.add("d-none");
    } catch (e) {
        alert("导入失败: " + e.message);
    }
}

const iconOptions = [
    { value: 'fa-search', label: '🔍 搜索' },
    { value: 'fa-google', label: '🔷 Google' },
    { value: 'fa-github', label: '🐙 GitHub' },
    { value: 'fa-message-circle', label: '💬 微博' },
    { value: 'fa-play-circle', label: '▶️ B站' },
    { value: 'fa-shopping-bag', label: '🛍️ 淘宝' },
    { value: 'fa-shopping-cart', label: '🛒 京东' },
    { value: 'fa-music', label: '🎵 音乐' },
    { value: 'fa-video', label: '📹 视频' },
    { value: 'fa-comments', label: '💬 知乎' },
    { value: 'fa-book', label: '📚 豆瓣' },
    { value: 'fa-envelope', label: '✉️ 邮箱' },
    { value: 'fa-cloud', label: '☁️ 云服务' },
    { value: 'fa-box', label: '📦 Docker' },
    { value: 'fa-code', label: '💻 代码' },
    { value: 'fa-atom', label: '⚛️ React' },
    { value: 'fa-leaf', label: '🍃 Vue' },
    { value: 'fa-bolt', label: '⚡ Vite' },
    { value: 'fa-network-wired', label: '🔗 Webpack' },
    { value: 'fa-server', label: '🖥️ 服务器' },
    { value: 'fa-database', label: '🗄️ 数据库' },
    { value: 'fa-file-code', label: '📝 文档' },
    { value: 'fa-chart-line', label: '📈 图表' },
    { value: 'fa-download', label: '⬇️ 下载' },
    { value: 'fa-home', label: '🏠 主页' },
    { value: 'fa-globe', label: '🌐 网站' },
    { value: 'fa-external-link', label: '🔗 链接' },
    { value: 'fa-star', label: '⭐ 收藏' },
    { value: 'fa-heart', label: '❤️ 喜欢' },
    { value: 'fa-bell', label: '🔔 通知' },
    { value: 'fa-user', label: '👤 用户' },
    { value: 'fa-cog', label: '⚙️ 设置' },
];

function renderCatSelect() {
    const sel = document.getElementById("newCat");
    if (!sel) return;
    sel.innerHTML = '<option value="">请选择分类</option>';
    categories.forEach(c => {
        sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

function renderIconSelect() {
    const sel = document.getElementById("newIcon");
    if (!sel) return;
    sel.innerHTML = '<option value="">请选择图标</option>';
    iconOptions.forEach(icon => {
        sel.innerHTML += `<option value="${icon.value}">${icon.label}</option>`;
    });
}

function renderCategories() {
    const table = document.getElementById("catTable");
    if (!table) return;
    let tbody = table.querySelector("tbody");
    if (!tbody) {
        tbody = document.createElement("tbody");
        table.appendChild(tbody);
    }
    tbody.innerHTML = "";
    
    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">暂无分类</td></tr>';
        return;
    }
    
    categories.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    categories.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.sort || 0}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editCat(${c.id})">编辑</button>
                    <button class="btn btn-danger btn-sm" onclick="delCat(${c.id})">删除</button>
                </td>
            </tr>
        `;
    });
}

function renderLinks() {
    const table = document.getElementById("linkTable");
    if (!table) return;
    let tbody = table.querySelector("tbody");
    if (!tbody) {
        tbody = document.createElement("tbody");
        table.appendChild(tbody);
    }
    tbody.innerHTML = "";
    
    if (links.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">暂无站点</td></tr>';
        return;
    }
    
    links.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    links.forEach(l => {
        const cat = categories.find(c => c.id === l.category_id);
        tbody.innerHTML += `
            <tr>
                <td>${l.id}</td>
                <td><span class="badge bg-primary">${cat?.name || '未分类'}</span></td>
                <td>${l.title}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${l.url}">${l.url}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editLink(${l.id})">编辑</button>
                    <button class="btn btn-danger btn-sm" onclick="delLink(${l.id})">删除</button>
                </td>
            </tr>
        `;
    });
}

function renderStocks() {
    const table = document.getElementById("stockTable");
    if (!table) return;
    let tbody = table.querySelector("tbody");
    if (!tbody) {
        tbody = document.createElement("tbody");
        table.appendChild(tbody);
    }
    tbody.innerHTML = "";
    
    if (stocks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">暂无股票</td></tr>';
        return;
    }
    
    stocks.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    stocks.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.code}</td>
                <td>${s.name}</td>
                <td>${s.sort || 0}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editStock(${s.id})">编辑</button>
                    <button class="btn btn-danger btn-sm" onclick="delStock(${s.id})">删除</button>
                </td>
            </tr>
        `;
    });
}

async function addLink() {
    const catId = document.getElementById("newCat").value;
    const title = document.getElementById("newTitle").value.trim();
    const url = document.getElementById("newUrl").value.trim();
    const icon = document.getElementById("newIcon").value.trim();
    const icon_color = document.getElementById("newIconColor").value.trim();
    const desc = document.getElementById("newDesc").value.trim();
    const sort = document.getElementById("newSort").value || 0;
    
    if (!catId || !title || !url) {
        alert("请填写分类、名称和网址");
        return;
    }
    
    try {
        await apiRequest('/link', 'POST', { category_id: catId, title, url, icon, icon_color, desc, sort });
        document.getElementById("newTitle").value = "";
        document.getElementById("newUrl").value = "";
        document.getElementById("newIcon").value = "";
        document.getElementById("newIconColor").value = "#007bff";
        document.getElementById("newDesc").value = "";
        document.getElementById("newSort").value = "0";
        loadAll();
        alert("添加成功");
    } catch (e) {
        alert("添加失败");
    }
}

async function addCategory() {
    const name = document.getElementById("newCatName").value.trim();
    const sort = document.getElementById("newCatSort").value || 0;
    
    if (!name) {
        alert("请输入分类名称");
        return;
    }
    
    try {
        await apiRequest('/category', 'POST', { name, sort });
        document.getElementById("newCatName").value = "";
        document.getElementById("newCatSort").value = "0";
        loadAll();
        alert("添加成功");
    } catch (e) {
        alert("添加失败");
    }
}

async function addStock() {
    const code = document.getElementById("newStockCode").value.trim();
    const name = document.getElementById("newStockName").value.trim();
    const sort = document.getElementById("newStockSort").value || 0;
    
    if (!code || !name) {
        alert("请输入股票代码和名称");
        return;
    }
    
    try {
        await apiRequest('/stock', 'POST', { code, name, sort });
        document.getElementById("newStockCode").value = "";
        document.getElementById("newStockName").value = "";
        document.getElementById("newStockSort").value = "0";
        loadAll();
        alert("添加成功");
    } catch (e) {
        alert("添加失败");
    }
}

async function delLink(id) {
    if (!confirm("确定删除该站点？")) return;
    try {
        await apiRequest(`/link?id=${id}`, 'DELETE');
        loadAll();
    } catch (e) {
        alert("删除失败");
    }
}

async function delCat(id) {
    if (!confirm("确定删除该分类？分类下的站点也会被删除！")) return;
    try {
        await apiRequest(`/category?id=${id}`, 'DELETE');
        loadAll();
    } catch (e) {
        alert("删除失败");
    }
}

async function delStock(id) {
    if (!confirm("确定删除该股票？")) return;
    try {
        await apiRequest(`/stock?id=${id}`, 'DELETE');
        loadAll();
    } catch (e) {
        alert("删除失败");
    }
}

function editLink(id) {
    const link = links.find(l => l.id === id);
    if (!link) return;
    
    const tbody = document.getElementById("linkTable").querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
    
    rows.forEach(row => {
        if (row.querySelector("td:first-child").textContent == id) {
            const cat = categories.find(c => c.id === link.category_id);
            const iconOptionsHtml = iconOptions.map(icon => 
                `<option value="${icon.value}" ${icon.value === link.icon ? 'selected' : ''}>${icon.label}</option>`
            ).join('');
            row.innerHTML = `
                <td>${link.id}</td>
                <td>
                    <select id="e_cat_${link.id}" class="form-select">
                        ${categories.map(c => `<option value="${c.id}" ${c.id === link.category_id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </td>
                <td><input id="e_title_${link.id}" class="form-control" value="${link.title}"></td>
                <td><input id="e_url_${link.id}" class="form-control" value="${link.url}"></td>
                <td>
                    <select id="e_icon_${link.id}" class="form-select">
                        <option value="">请选择图标</option>
                        ${iconOptionsHtml}
                    </select>
                </td>
                <td>
                    <input id="e_icon_color_${link.id}" type="color" class="form-control" value="${link.icon_color || '#007bff'}">
                </td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="saveLink(${link.id})">保存</button>
                    <button class="btn btn-secondary btn-sm" onclick="loadAll()">取消</button>
                </td>
            `;
        }
    });
}

async function saveLink(id) {
    const link = links.find(l => l.id === id);
    if (!link) return;
    
    const payload = {
        id,
        category_id: document.getElementById(`e_cat_${id}`).value,
        title: document.getElementById(`e_title_${id}`).value.trim(),
        url: document.getElementById(`e_url_${id}`).value.trim(),
        icon: document.getElementById(`e_icon_${id}`).value || "",
        icon_color: document.getElementById(`e_icon_color_${id}`).value || "",
        desc: link.desc || "",
        sort: link.sort || 0
    };
    
    if (!payload.title || !payload.url) {
        alert("请填写名称和网址");
        return;
    }
    
    try {
        await apiRequest('/link', 'PUT', payload);
        loadAll();
        alert("修改成功");
    } catch (e) {
        alert("修改失败");
    }
}

function editCat(id) {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    
    const tbody = document.getElementById("catTable").querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
    
    rows.forEach(row => {
        if (row.querySelector("td:first-child").textContent == id) {
            row.innerHTML = `
                <td>${cat.id}</td>
                <td><input id="e_cname_${cat.id}" value="${cat.name}"></td>
                <td><input id="e_csort_${cat.id}" type="number" value="${cat.sort || 0}"></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="saveCat(${cat.id})">保存</button>
                    <button class="btn btn-secondary btn-sm" onclick="loadAll()">取消</button>
                </td>
            `;
        }
    });
}

async function saveCat(id) {
    const payload = {
        id,
        name: document.getElementById(`e_cname_${id}`).value.trim(),
        sort: document.getElementById(`e_csort_${id}`).value || 0
    };
    
    if (!payload.name) {
        alert("请输入分类名称");
        return;
    }
    
    try {
        await apiRequest('/category', 'PUT', payload);
        loadAll();
        alert("修改成功");
    } catch (e) {
        alert("修改失败");
    }
}

function editStock(id) {
    const stock = stocks.find(s => s.id === id);
    if (!stock) return;
    
    const tbody = document.getElementById("stockTable").querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
    
    rows.forEach(row => {
        if (row.querySelector("td:first-child").textContent == id) {
            row.innerHTML = `
                <td>${stock.id}</td>
                <td><input id="e_scode_${stock.id}" value="${stock.code}"></td>
                <td><input id="e_sname_${stock.id}" value="${stock.name}"></td>
                <td><input id="e_ssort_${stock.id}" type="number" value="${stock.sort || 0}"></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="saveStock(${stock.id})">保存</button>
                    <button class="btn btn-secondary btn-sm" onclick="loadAll()">取消</button>
                </td>
            `;
        }
    });
}

async function saveStock(id) {
    const payload = {
        id,
        code: document.getElementById(`e_scode_${id}`).value.trim(),
        name: document.getElementById(`e_sname_${id}`).value.trim(),
        sort: document.getElementById(`e_ssort_${id}`).value || 0
    };
    
    if (!payload.code || !payload.name) {
        alert("请输入股票代码和名称");
        return;
    }
    
    try {
        await apiRequest('/stock', 'PUT', payload);
        loadAll();
        alert("修改成功");
    } catch (e) {
        alert("修改失败");
    }
}

function showPwdModal() {
    const modal = new bootstrap.Modal(document.getElementById("pwdModal"));
    modal.show();
}

async function changePwd() {
    const oldPwd = document.getElementById("oldPwd").value;
    const newPwd = document.getElementById("newPwd").value;
    const confirmPwd = document.getElementById("confirmPwd").value;
    
    if (oldPwd !== token) {
        alert("当前密码错误");
        return;
    }
    if (newPwd !== confirmPwd) {
        alert("两次输入的新密码不一致");
        return;
    }
    if (!newPwd) {
        alert("新密码不能为空");
        return;
    }
    
    try {
        await apiRequest('/pwd', 'POST', { newPwd });
        token = newPwd;
        const modal = bootstrap.Modal.getInstance(document.getElementById("pwdModal"));
        modal.hide();
        document.getElementById("oldPwd").value = "";
        document.getElementById("newPwd").value = "";
        document.getElementById("confirmPwd").value = "";
        alert("密码修改成功");
    } catch (e) {
        alert("修改失败");
    }
}