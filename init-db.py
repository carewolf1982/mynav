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
db.execute('INSERT INTO nav_category(name,sort) VALUES(?,?)', ('下载相关', 3))

db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sh000001', '上证指数', 1))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sz399001', '深证成指', 2))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sz399006', '创业板指', 3))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sh000300', '沪深300', 4))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sh000016', '上证50', 5))
db.execute('INSERT INTO nav_stock(code,name,sort) VALUES(?,?,?)', ('sh000688', '科创50', 6))

baiduIcon = '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>'
googleIcon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/><path d="M12 4.03c1.1 0 2 .9 2 2v1.16l5.51 2.75.56-1.23C19.45 6.34 16.08 4.03 12 4.03z"/></svg>'
githubIcon = '<svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
defaultIcon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/></svg>'

db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (1, '百度', 'https://www.baidu.com', baiduIcon, '百度搜索', 1))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (1, 'Google', 'https://www.google.com', googleIcon, 'Google搜索', 2))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (1, 'GitHub', 'https://github.com', githubIcon, '代码托管平台', 3))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (1, '微博', 'https://weibo.com', defaultIcon, '社交媒体', 4))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (1, 'B站', 'https://www.bilibili.com', defaultIcon, '视频弹幕网站', 5))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (2, 'MDN', 'https://developer.mozilla.org', defaultIcon, 'Web技术文档', 1))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (2, 'Stack Overflow', 'https://stackoverflow.com', defaultIcon, '程序员问答社区', 2))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (2, '掘金', 'https://juejin.cn', defaultIcon, '技术社区', 3))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (2, 'V2EX', 'https://www.v2ex.com', defaultIcon, '创意工作者社区', 4))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (2, 'CSDN', 'https://www.csdn.net', defaultIcon, '技术博客平台', 5))
db.execute('INSERT INTO nav_link(category_id,title,url,icon,desc,sort) VALUES(?,?,?,?,?,?)', (3, 'NovaHD', 'https://pt.novahd.top/index.php', defaultIcon, 'PT下载站点', 1))

db.commit()
print('Database initialized successfully')
print('Categories:', db.execute('SELECT * FROM nav_category').fetchall())
print('Links count:', db.execute('SELECT COUNT(*) FROM nav_link').fetchone()[0])
db.close()