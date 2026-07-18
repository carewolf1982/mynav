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
(1,'百度','https://www.baidu.com','https://cdn.simpleicons.org/baidu','百度搜索',1),
(1,'Google','https://www.google.com','https://cdn.simpleicons.org/google','Google搜索',2),
(1,'GitHub','https://github.com','https://cdn.simpleicons.org/github','代码托管平台',3),
(1,'微博','https://weibo.com','https://cdn.simpleicons.org/weibo','社交媒体',4),
(1,'B站','https://www.bilibili.com','https://cdn.simpleicons.org/bilibili','视频弹幕网站',5),
(1,'淘宝','https://www.taobao.com','https://cdn.simpleicons.org/taobao','购物网站',6),
(1,'京东','https://www.jd.com','https://cdn.simpleicons.org/jd','电商平台',7),
(1,'网易云音乐','https://music.163.com','https://cdn.simpleicons.org/neteasemusic','音乐平台',8),
(1,'抖音','https://www.douyin.com','https://cdn.simpleicons.org/douyin','短视频',9),
(1,'知乎','https://www.zhihu.com','https://cdn.simpleicons.org/zhihu','问答社区',10),
(1,'豆瓣','https://www.douban.com','https://cdn.simpleicons.org/douban','书影音社区',11),
(1,'QQ邮箱','https://mail.qq.com','https://cdn.simpleicons.org/qqmail','邮箱服务',12),
(1,'阿里云','https://www.aliyun.com','https://cdn.simpleicons.org/alibaba','云计算平台',13),
(1,'M-Team','https://kp.m-team.cc/','https://cdn.simpleicons.org/torrent','PT站点',14),
(1,'Transmission','http://192.168.31.100:9091/transmission/web/','https://cdn.simpleicons.org/transmission','BT下载管理',15),
(2,'MDN','https://developer.mozilla.org','https://cdn.simpleicons.org/mozilla','Web技术文档',1),
(2,'Stack Overflow','https://stackoverflow.com','https://cdn.simpleicons.org/stackoverflow','程序员问答社区',2),
(2,'掘金','https://juejin.cn','https://cdn.simpleicons.org/juejin','技术社区',3),
(2,'V2EX','https://www.v2ex.com','https://cdn.simpleicons.org/v2ex','创意工作者社区',4),
(2,'CSDN','https://www.csdn.net','https://cdn.simpleicons.org/csdn','技术博客平台',5),
(2,'LeetCode','https://leetcode.cn','https://cdn.simpleicons.org/leetcode','算法刷题',6),
(2,'牛客网','https://www.nowcoder.com','https://cdn.simpleicons.org/nowcoder','编程面试',7),
(2,'Docker','https://www.docker.com','https://cdn.simpleicons.org/docker','容器化平台',8),
(2,'TypeScript','https://www.typescriptlang.org','https://cdn.simpleicons.org/typescript','TypeScript文档',9),
(2,'React','https://react.dev','https://cdn.simpleicons.org/react','React框架',10),
(2,'Vue','https://vuejs.org','https://cdn.simpleicons.org/vue','Vue框架',11),
(2,'Webpack','https://webpack.js.org','https://cdn.simpleicons.org/webpack','模块打包工具',12),
(2,'Vite','https://vitejs.dev','https://cdn.simpleicons.org/vite','构建工具',13);
