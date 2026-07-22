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

INSERT OR REPLACE INTO nav_config(key,value) VALUES('admin_pwd','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92');

INSERT OR IGNORE INTO nav_category(name,sort) VALUES('常用工具',1),('技术站点',2),('生活',3),('工作',4),('学习',5);

INSERT OR IGNORE INTO nav_stock(code,name,sort) VALUES('sh000001','上证指数',1),('sz399001','深证成指',2),('sz399006','创业板指',3),('sh000300','沪深300',4);

INSERT OR IGNORE INTO nav_link(category_id,title,url,icon,icon_color,desc,sort) VALUES
(1,'百度','https://www.baidu.com','fa-search','#2932E1','搜索',1),
(1,'Google','https://www.google.com','fa-google','#4285F4','搜索',2),
(1,'GitHub','https://github.com','fa-github','#171515','代码',3),
(1,'微博','https://weibo.com','fa-message-circle','#E6162D','社交',4),
(1,'B站','https://www.bilibili.com','fa-play-circle','#FB7299','视频',5),
(1,'淘宝','https://www.taobao.com','fa-shopping-bag','#FF5000','购物',6),
(1,'京东','https://www.jd.com','fa-shopping-cart','#E4393C','购物',7),
(1,'网易云','https://music.163.com','fa-music','#DC1F26','音乐',8),
(1,'抖音','https://www.douyin.com','fa-video','#000000','视频',9),
(1,'知乎','https://www.zhihu.com','fa-comments','#0084FF','问答',10),
(1,'豆瓣','https://www.douban.com','fa-book','#07294D','社区',11),
(1,'QQ邮箱','https://mail.qq.com','fa-envelope','#0099FF','邮箱',12),
(1,'阿里云','https://www.aliyun.com','fa-cloud','#FF6A00','云服务',13),
(1,'M-Team','https://kp.m-team.cc/','fa-download','#c6e985','PT',14),
(1,'LemonHD','https://lemonhd.net/index.php','fa-download','#FFB800','PT',15),
(1,'NovaHD','https://pt.novahd.top/index.php','fa-download','#FF6B6B','PT',16),
(1,'Transmission','http://192.168.31.100:9091/transmission/web/','fa-server','#c563c5','下载',17),
(2,'MDN','https://developer.mozilla.org','fa-file-code','#8D67E8','文档',1),
(2,'Stack Overflow','https://stackoverflow.com','fa-code','#F48024','问答',2),
(2,'掘金','https://juejin.cn','fa-gem','#FF6E40','技术',3),
(2,'V2EX','https://www.v2ex.com','fa-comments','#3F87A6','社区',4),
(2,'CSDN','https://www.csdn.net','fa-code','#FF5722','技术',5),
(2,'LeetCode','https://leetcode.cn','fa-sitemap','#FFA116','刷题',6),
(2,'牛客网','https://www.nowcoder.com','fa-users','#DC143C','面试',7),
(2,'Docker','https://www.docker.com','fa-box','#2496ED','容器',8),
(2,'TypeScript','https://www.typescriptlang.org','fa-code','#3178C6','语言',9),
(2,'React','https://react.dev','fa-atom','#61DAFB','框架',10),
(2,'Vue','https://vuejs.org','fa-leaf','#42B883','框架',11),
(2,'Webpack','https://webpack.js.org','fa-gear','#8DD6F9','工具',12),
(2,'Vite','https://vitejs.dev','fa-bolt','#646CFF','工具',13),
(3,'PT邀请码','https://www.ptyqm.com/','fa-key','#E67E22','PT',1),
(3,'HDSky','https://hdsky.me/login.php','fa-download','#3498DB','PT',2),
(3,'私人导航','https://mynav-68k.pages.dev/','fa-home','#2ECC71','导航',3),
(4,'电子采购','https://sso.cnncecp.com/login/','fa-shopping-cart','#E74C3C','工作',1),
(4,'核安全注册','https://www.chinansc.cn/haqgcs/','fa-shield','#27AE60','工作',2),
(4,'EB技术','https://support.aucotec.cn/web/home/index','fa-wrench','#9B59B6','工作',3),
(4,'团标公开','http://39.104.123.74:8088/standardview/public/index.php/admin/index/index','fa-file-text','#F39C12','工作',4),
(4,'标准管理','http://39.104.123.74:8088/standard/public/index.php/admin/login.html','fa-file-check','#1ABC9C','工作',5),
(4,'核协E+','https://www.caini.cn/zhhx/1223999/szhzx/1431503/index.html','fa-mobile','#3498DB','工作',6),
(5,'MockingBird','https://gitee.com/babysor/MockingBird','fa-microphone','#E91E63','AI',1),
(5,'顶牛闯关','https://dingniu.suyangx.com/learnspace/learn/learn/xsc/au_steamList.action','fa-graduation-cap','#4CAF50','学习',2),
(5,'句乐部','https://julebu.co/','fa-book-open','#2196F3','学习',3),
(5,'玻尔','https://www.bohrium.com/','fa-atom','#FF9800','AI',4),
(5,'Datawhale','https://www.datawhale.cn/home','fa-wave-square','#9C27B0','AI',5),
(5,'uinodes','https://uinodes.com/','fa-code','#607D8B','教程',6),
(5,'IAEA CSS','https://nucleus.iaea.org/sites/committees','fa-globe','#00BCD4','标准',7),
(5,'SoybeanAdmin','https://docs.soybeanjs.cn/zh/','fa-layout','#795548','框架',8),
(5,'Pure Admin','https://pure-admin.cn/pages/start/','fa-window-maximize','#3F51B5','框架',9),
(5,'RD Web','https://cloud.aucotec.cn:888/RDWeb/Pages/zh-CN/login.aspx','fa-desktop','#673AB7','远程',10),
(5,'PMP考试','https://yun.aura.cn/Packet/detail/lid/764.html','fa-certificate','#FF5722','认证',11),
(5,'百度网盘','https://pan.baidu.com/s/1I7wJEasY79IekNO7UMlb-A','fa-cloud-download','#03A9F4','云盘',12),
(5,'入学服务','https://qryjrx.bjedu.cn/hdxsc','fa-graduation-cap','#8BC34A','教育',13),
(5,'统一认证','https://am.bjedu.cn/am/UI/Login','fa-key','#009688','认证',14);
