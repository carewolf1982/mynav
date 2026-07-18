CREATE TABLE IF NOT EXISTS nav_category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sort INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS nav_link (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  icon_color TEXT,
  desc TEXT,
  sort INTEGER DEFAULT 0,
  FOREIGN KEY(category_id) REFERENCES nav_category(id)
);

CREATE TABLE IF NOT EXISTS nav_stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sort INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS nav_config (
  key TEXT PRIMARY KEY,
  value TEXT
);

INSERT OR REPLACE INTO nav_config(key,value) VALUES('admin_pwd','123456');

INSERT OR IGNORE INTO nav_category(name,sort) VALUES('常用工具',1),('技术站点',2);

INSERT OR IGNORE INTO nav_stock(code,name,sort) VALUES('sh000001','上证指数',1),('sz399001','深证成指',2),('sz399006','创业板指',3),('sh000300','沪深300',4),('sh000016','上证50',5),('sh000688','科创50',6);

INSERT OR IGNORE INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES
(1,'百度','https://www.baidu.com','fa-search','#2932E1','百度搜索',1),
(1,'Google','https://www.google.com','fa-google','brand','Google搜索',2),
(1,'GitHub','https://github.com','fa-github','brand','代码托管平台',3),
(1,'微博','https://weibo.com','fa-message-circle','#E6162D','社交媒体',4),
(1,'B站','https://www.bilibili.com','fa-play-circle','#FB7299','视频弹幕网站',5),
(1,'淘宝','https://www.taobao.com','fa-shopping-bag','#FF5000','购物网站',6),
(1,'京东','https://www.jd.com','fa-shopping-cart','#E4393C','电商平台',7),
(1,'网易云音乐','https://music.163.com','fa-music','#DC1F26','音乐平台',8),
(1,'抖音','https://www.douyin.com','fa-video','#000000','短视频',9),
(1,'知乎','https://www.zhihu.com','fa-comments','#0084FF','问答社区',10),
(1,'豆瓣','https://www.douban.com','fa-book','#07294D','书影音社区',11),
(1,'QQ邮箱','https://mail.qq.com','fa-envelope','#0099FF','邮箱服务',12),
(1,'阿里云','https://www.aliyun.com','fa-cloud','#FF6A00','云计算平台',13),
(1,'M-Team','https://kp.m-team.cc/','fa-download','#6C757D','PT站点',14),
(1,'Transmission','http://192.168.31.100:9091/transmission/web/','fa-download','#6C757D','BT下载管理',15),
(2,'MDN','https://developer.mozilla.org','fa-file-code','#8D67E8','Web技术文档',1),
(2,'Stack Overflow','https://stackoverflow.com','fa-code','#F48024','程序员问答社区',2),
(2,'掘金','https://juejin.cn','fa-gem','#FF6E40','技术社区',3),
(2,'V2EX','https://www.v2ex.com','fa-comments','#3F87A6','创意工作者社区',4),
(2,'CSDN','https://www.csdn.net','fa-code','#FF5722','技术博客平台',5),
(2,'LeetCode','https://leetcode.cn','fa-sitemap','#FFA116','算法刷题',6),
(2,'牛客网','https://www.nowcoder.com','fa-users','#DC143C','编程面试',7),
(2,'Docker','https://www.docker.com','fa-box','#2496ED','容器化平台',8),
(2,'TypeScript','https://www.typescriptlang.org','fa-code','#3178C6','TypeScript文档',9),
(2,'React','https://react.dev','fa-atom','#61DAFB','React框架',10),
(2,'Vue','https://vuejs.org','fa-leaf','#42B883','Vue框架',11),
(2,'Webpack','https://webpack.js.org','fa-gear','#8DD6F9','模块打包工具',12),
(2,'Vite','https://vitejs.dev','fa-bolt','#646CFF','构建工具',13);
