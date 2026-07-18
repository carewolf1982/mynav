let token = "";
let categories = [];
let links = [];
let stocks = [];

async function apiRequest(path, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(`/api/nav${path}`, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function login() {
    const pwd = document.getElementById("pwdInput").value.trim();
    if (!pwd) { alert("请输入密码"); return; }
    
    try {
        const ret = await apiRequest('/login', 'POST', { pwd });
        
        if (ret.code === 403) {
            alert("密码错误");
            return;
        }
        
        token = pwd;
        document.getElementById("login").classList.add("hidden");
        document.getElementById("adminPanel").classList.remove("hidden");
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
        renderCategories();
        renderLinks();
        renderStocks();
    } catch (e) {
        alert("加载数据失败");
    }
}

function renderCatSelect() {
    const sel = document.getElementById("newCat");
    sel.innerHTML = '<option value="">请选择分类</option>';
    categories.forEach(c => {
        sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

function renderCategories() {
    const tbody = document.getElementById("catTable").querySelector("tbody");
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
    const tbody = document.getElementById("linkTable").querySelector("tbody");
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
                <td><span class="badge badge-primary">${cat?.name || '未分类'}</span></td>
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
    const tbody = document.getElementById("stockTable").querySelector("tbody");
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
    const desc = document.getElementById("newDesc").value.trim();
    
    if (!catId || !title || !url) {
        alert("请填写分类、名称和网址");
        return;
    }
    
    try {
        await apiRequest('/link', 'POST', { category_id: catId, title, url, icon, desc, sort: 0 });
        document.getElementById("newTitle").value = "";
        document.getElementById("newUrl").value = "";
        document.getElementById("newIcon").value = "";
        document.getElementById("newDesc").value = "";
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
            row.innerHTML = `
                <td>${link.id}</td>
                <td>
                    <select id="e_cat_${link.id}">
                        ${categories.map(c => `<option value="${c.id}" ${c.id === link.category_id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </td>
                <td><input id="e_title_${link.id}" value="${link.title}"></td>
                <td><input id="e_url_${link.id}" value="${link.url}"></td>
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
        icon: link.icon || "",
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
    document.getElementById("pwdModal").classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
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
        closeModal("pwdModal");
        document.getElementById("oldPwd").value = "";
        document.getElementById("newPwd").value = "";
        document.getElementById("confirmPwd").value = "";
        alert("密码修改成功");
    } catch (e) {
        alert("修改失败");
    }
}

document.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});