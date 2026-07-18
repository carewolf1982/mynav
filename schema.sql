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

INSERT OR IGNORE INTO nav_link(category_id,title,url,icon,desc,sort) VALUES
(1,'百度','https://www.baidu.com','fa-search','百度搜索',1),
(1,'Google','https://www.google.com','fa-google','Google搜索',2),
(1,'GitHub','https://github.com','fa-github','代码托管平台',3),
(1,'微博','https://weibo.com','fa-message-circle','社交媒体',4),
(1,'B站','https://www.bilibili.com','fa-play-circle','视频弹幕网站',5),
(1,'淘宝','https://www.taobao.com','fa-shopping-bag','购物网站',6),
(1,'京东','https://www.jd.com','fa-shopping-cart','电商平台',7),
(1,'网易云音乐','https://music.163.com','fa-music','音乐平台',8),
(1,'抖音','https://www.douyin.com','fa-video','短视频',9),
(1,'知乎','https://www.zhihu.com','fa-comments','问答社区',10),
(1,'豆瓣','https://www.douban.com','fa-book','书影音社区',11),
(1,'QQ邮箱','https://mail.qq.com','fa-envelope','邮箱服务',12),
(1,'阿里云','https://www.aliyun.com','fa-cloud','云计算平台',13),
(1,'M-Team','https://kp.m-team.cc/','fa-download','PT站点',14),
(1,'Transmission','http://192.168.31.100:9091/transmission/web/','fa-download','BT下载管理',15),
(2,'MDN','https://developer.mozilla.org','fa-file-code','Web技术文档',1),
(2,'Stack Overflow','https://stackoverflow.com','fa-code','程序员问答社区',2),
(2,'掘金','https://juejin.cn','fa-gem','技术社区',3),
(2,'V2EX','https://www.v2ex.com','fa-comments','创意工作者社区',4),
(2,'CSDN','https://www.csdn.net','fa-code','技术博客平台',5),
(2,'LeetCode','https://leetcode.cn','fa-sitemap','算法刷题',6),
(2,'牛客网','https://www.nowcoder.com','fa-users','编程面试',7),
(2,'Docker','https://www.docker.com','fa-box','容器化平台',8),
(2,'TypeScript','https://www.typescriptlang.org','fa-code','TypeScript文档',9),
(2,'React','https://react.dev','fa-atom','React框架',10),
(2,'Vue','https://vuejs.org','fa-leaf','Vue框架',11),
(2,'Webpack','https://webpack.js.org','fa-gear','模块打包工具',12),
(2,'Vite','https://vitejs.dev','fa-bolt','构建工具',13);
