import sqlite3
import os

if os.path.exists('nav.db'):
    os.remove('nav.db')

db = sqlite3.connect('nav.db')
db.execute("PRAGMA encoding='UTF-8'")

db.execute('''
CREATE TABLE IF NOT EXISTS nav_category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sort INTEGER DEFAULT 0
)
''')

db.execute('''
CREATE TABLE IF NOT EXISTS nav_link (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  icon_color TEXT,
  desc TEXT,
  sort INTEGER DEFAULT 0
)
''')

db.execute('''
CREATE TABLE IF NOT EXISTS nav_stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sort INTEGER DEFAULT 0
)
''')

db.execute('''
CREATE TABLE IF NOT EXISTS nav_config (
  key TEXT PRIMARY KEY,
  value TEXT
)
''')

db.execute("INSERT OR REPLACE INTO nav_config(key,value) VALUES('admin_pwd','123456')")

db.execute('INSERT INTO nav_category(name,sort) VALUES(?,?)', ('常用工具', 1))
db.execute('INSERT INTO nav_category(name,sort) VALUES(?,?)', ('技术站点', 2))
db.execute('INSERT INTO nav_category(name,sort) VALUES(?,?)', ('生活', 3))
db.execute('INSERT INTO nav_category(name,sort) VALUES(?,?)', ('工作', 4))
db.execute('INSERT INTO nav_category(name,sort) VALUES(?,?)', ('学习', 5))
db.execute('INSERT INTO nav_category(name,sort) VALUES(?,?)', ('下载相关', 6))

db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sh000001', '上证指数', 1))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sz399001', '深证成指', 2))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sz399006', '创业板指', 3))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sh000300', '沪深300', 4))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sh000016', '上证50', 5))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sh000688', '科创50', 6))

db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, '百度', 'https://www.baidu.com', 'fa-globe', '#2932E1', '百度搜索', 1))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, 'Google', 'https://www.google.com', 'fa-globe', '#4285F4', 'Google搜索', 2))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, 'GitHub', 'https://github.com', 'fa-github', '#171515', '代码托管平台', 3))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, '微博', 'https://weibo.com', 'fa-globe', '#E6162D', '社交媒体', 4))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, 'B站', 'https://www.bilibili.com', 'fa-globe', '#FB7299', '视频弹幕网站', 5))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, '豆瓣', 'https://www.douban.com', 'fa-book', '#07294D', '书影音社区', 11))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, 'QQ邮箱', 'https://mail.qq.com', 'fa-envelope', '#0099FF', '邮箱服务', 12))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, '阿里云', 'https://www.aliyun.com', 'fa-cloud', '#FF6A00', '云计算平台', 13))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, 'M-Team', 'https://kp.m-team.cc/', 'fa-download', '#c6e985', 'PT站点', 14))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, 'LemonHD', 'https://lemonhd.net/index.php', 'fa-download', '#FFB800', 'PT站点', 15))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (1, 'Transmission', 'http://192.168.31.100:9091/transmission/web/', 'fa-download', '#c563c5', 'BT下载管理', 16))

db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (2, 'MDN', 'https://developer.mozilla.org', 'fa-file-code', '#8D67E8', 'Web技术文档', 1))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (2, 'Stack Overflow', 'https://stackoverflow.com', 'fa-code', '#F48024', '程序员问答社区', 2))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (2, '掘金', 'https://juejin.cn', 'fa-gem', '#FF6E40', '技术社区', 3))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (2, 'V2EX', 'https://www.v2ex.com', 'fa-globe', '#666', '创意工作者社区', 4))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (2, 'CSDN', 'https://www.csdn.net', 'fa-globe', '#EB1923', '技术博客平台', 5))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (2, 'React', 'https://react.dev', 'fa-atom', '#61DAFB', 'React框架', 10))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (2, 'Vue', 'https://vuejs.org', 'fa-leaf', '#42B883', 'Vue框架', 11))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (2, 'Webpack', 'https://webpack.js.org', 'fa-gear', '#8DD6F9', '模块打包工具', 12))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (2, 'Vite', 'https://vitejs.dev', 'fa-bolt', '#646CFF', '构建工具', 13))

db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (3, 'PT邀请码网', 'https://www.ptyqm.com/', 'fa-globe', '#666', 'PT站点邀请码', 1))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (3, 'HDSky', 'https://hdsky.me/login.php', 'fa-globe', '#666', '高清PT站点', 2))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (3, '我的私人导航', 'https://mynav-68k.pages.dev/', 'fa-globe', '#666', '私人导航', 3))

db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (4, '中核电子采购', 'https://sso.cnncecp.com/login/', 'fa-globe', '#666', '采购系统', 1))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (4, '核安全注册', 'https://www.chinansc.cn/haqgcs/', 'fa-globe', '#666', '核安全注册', 2))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (4, 'EB技术支持', 'https://support.aucotec.cn/web/home/index', 'fa-globe', '#666', '技术支持', 3))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (4, '核协团标公开', 'http://39.104.123.74:8088/standardview/public/index.php/admin/index/index', 'fa-globe', '#666', '标准系统', 4))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (4, '核协标准管理', 'http://39.104.123.74:8088/standard/public/index.php/admin/login.html', 'fa-globe', '#666', '标准管理', 5))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (4, '核协E+', 'https://www.caini.cn/zhhx/1223999/szhzx/1431503/index.html', 'fa-globe', '#666', '移动办公', 6))

db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, 'MockingBird', 'https://gitee.com/babysor/MockingBird', 'fa-globe', '#666', 'AI拟声', 1))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, '顶牛闯关', 'https://dingniu.suyangx.com/learnspace/learn/learn/xsc/au_steamList.action?params.projectId=402882fd946eb3a601952289139301fd', 'fa-globe', '#666', '学习平台', 2))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, '句乐部', 'https://julebu.co/', 'fa-globe', '#666', '学习社区', 3))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, '玻尔', 'https://www.bohrium.com/', 'fa-globe', '#666', 'AI科学', 4))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, 'Datawhale', 'https://www.datawhale.cn/home', 'fa-globe', '#666', 'AI学习', 5))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, 'uinodes', 'https://uinodes.com/', 'fa-globe', '#666', 'ComfyUI教程', 6))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, 'IAEA CSS', 'https://nucleus.iaea.org/sites/committees', 'fa-globe', '#666', '核安全标准', 7))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, 'SoybeanAdmin', 'https://docs.soybeanjs.cn/zh/', 'fa-globe', '#666', '中后台模板', 8))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, 'Pure Admin', 'https://pure-admin.cn/pages/start/', 'fa-globe', '#666', '后台框架', 9))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, 'RD Web', 'https://cloud.aucotec.cn:888/RDWeb/Pages/zh-CN/login.aspx?ReturnUrl=/RDWeb/Pages/zh-CN/Default.aspx', 'fa-globe', '#666', '远程桌面', 10))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, 'PMP考试', 'https://yun.aura.cn/Packet/detail/lid/764.html', 'fa-globe', '#666', 'PMP学习', 11))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, '百度网盘', 'https://pan.baidu.com/s/1I7wJEasY79IekNO7UMlb-A', 'fa-globe', '#666', '资料下载', 12))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, '北京义务教育入学', 'https://qryjrx.bjedu.cn/hdxsc', 'fa-globe', '#666', '教育平台', 13))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (5, '统一认证', 'https://am.bjedu.cn/am/UI/Login', 'fa-globe', '#666', '统一认证', 14))

db.execute('INSERT INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES(?,?,?,?,?,?,?)', (6, 'NovaHD', 'https://pt.novahd.top/index.php', 'fa-download', '#666', 'PT下载站点', 1))

db.commit()
print('Database initialized successfully')
print('Categories:', db.execute('SELECT * FROM nav_category').fetchall())
print('Links count:', db.execute('SELECT COUNT(*) FROM nav_link').fetchone()[0])
db.close()
