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
(1,'M-Team','https://kp.m-team.cc/','fa-download','#c6e985','PT站点',14),
(1,'LemonHD','https://lemonhd.net/index.php','fa-download','#FFB800','PT站点',15),
(1,'Transmission','http://192.168.31.100:9091/transmission/web/','fa-download','#c563c5','BT下载管理',16),
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
(2,'Vite','https://vitejs.dev','fa-bolt','#646CFF','构建工具',13),
(3,'PT邀请码网','https://www.ptyqm.com/','fa-globe','#666','PT站点邀请码',1),
(3,'HDSky','https://hdsky.me/login.php','fa-globe','#666','高清PT站点',2),
(3,'我的私人导航','https://mynav-68k.pages.dev/','fa-globe','#666','私人导航',3),
(4,'中核集团电子采购统一登录','https://sso.cnncecp.com/login/','fa-globe','#666','采购系统',1),
(4,'生态环境部核安全执业资格注册办公室','https://www.chinansc.cn/haqgcs/','fa-globe','#666','核安全注册',2),
(4,'EB技术支持网站','https://support.aucotec.cn/web/home/index','fa-globe','#666','技术支持',3),
(4,'核协团标全文公开系统','http://39.104.123.74:8088/standardview/public/index.php/admin/index/index','fa-globe','#666','标准系统',4),
(4,'中国核能行业协会团体标准信息管理系统','http://39.104.123.74:8088/standard/public/index.php/admin/login.html','fa-globe','#666','标准管理',5),
(4,'核协E+','https://www.caini.cn/zhhx/1223999/szhzx/1431503/index.html','fa-globe','#666','移动办公',6),
(5,'MockingBird','https://gitee.com/babysor/MockingBird','fa-globe','#666','AI拟声',1),
(5,'顶牛闯关','https://dingniu.suyangx.com/learnspace/learn/learn/xsc/au_steamList.action?params.projectId=402882fd946eb3a601952289139301fd','fa-globe','#666','学习平台',2),
(5,'句乐部','https://julebu.co/','fa-globe','#666','学习社区',3),
(5,'玻尔','https://www.bohrium.com/','fa-globe','#666','AI科学',4),
(5,'Datawhale','https://www.datawhale.cn/home','fa-globe','#666','AI学习',5),
(5,'uinodes','https://uinodes.com/','fa-globe','#666','ComfyUI教程',6),
(5,'IAEA CSS','https://nucleus.iaea.org/sites/committees','fa-globe','#666','核安全标准',7),
(5,'SoybeanAdmin','https://docs.soybeanjs.cn/zh/','fa-globe','#666','中后台模板',8),
(5,'Pure Admin','https://pure-admin.cn/pages/start/','fa-globe','#666','后台框架',9),
(5,'RD Web','https://cloud.aucotec.cn:888/RDWeb/Pages/zh-CN/login.aspx?ReturnUrl=/RDWeb/Pages/zh-CN/Default.aspx','fa-globe','#666','远程桌面',10),
(5,'PMP考试','https://yun.aura.cn/Packet/detail/lid/764.html','fa-globe','#666','PMP学习',11),
(5,'百度网盘','https://pan.baidu.com/s/1I7wJEasY79IekNO7UMlb-A','fa-globe','#666','资料下载',12),
(5,'北京市义务教育初中入学服务平台','https://qryjrx.bjedu.cn/hdxsc','fa-globe','#666','教育平台',13),
(5,'统一认证管理系统','https://am.bjedu.cn/am/UI/Login','fa-globe','#666','统一认证',14);
