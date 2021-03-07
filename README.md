## A typescript weiboo crawler
一个微博备份工具。本项目可以每次备份单条微博，包括微博的图片，文字，视频，评论，评论的回复，转发，并能完整地复现。数据都下载到了本地，你可以把它当成一个不会被和谐的微博收藏夹。  
你可以直接在程序的网页内粘贴微博的url/id备份，也可以通过私信分享微博备份。  
![2021-02-26 22.38.14-1](https://raw.githubusercontent.com/kang-ut/picbed/master/img/2021-02-26%2022.38.14-1.gif)
## 使用
### 下载
[pre-release-0.9.7](https://github.com/Combo819/weiboCrawlerRxdb/releases/tag/0.9.7)下载对应系统版本，下载后解压
### 账号 
准备两个微博账号，一个是日常使用的账号（大号），另一个用来爬虫（小号）。每次大号给小号私信分享一条微博，该微博就会被备份下来。  
没有小号的请下拉查看[免cookie模式](#免cookie模式)
### 创建配置文件 ([免cookie模式](#免cookie模式)请跳过)
在程序的根目录创建一个`credential.json`文件来记录微博的cookie和需要监听的用户。
```json
{
"cookie":"A_VERY_LONG_COOKIE_STRING",
"users":["van"]
}
```
其中`cookie`是小号的cookie，获取cookie的方法请参照[cookie.md](https://github.com/dataabc/weiboSpider/blob/master/docs/cookie.md)
`users`是要监听私信的用户名（大号）。只能是用户名而不能是手机或者邮箱。 比如你的微博大号是`@van`， 则`"users":["van"]`。你可以同时监听多个微博账号。

### 免cookie模式
如果你没有配置`credential.json`文件，或者文件里的`cookie`项留空了，在下一步程序启动时会询问你是否要以免cookie模式启动。到时请按`y`+回车启动程序，或者按任意键结束程序。  
![20210301173435](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210301173435.png)  
免cookie模式下，你将：
+ 每条微博最多备份200条评论，每条评论最多备份10条回复
+ 无法监听大号的私信,也就无法通过私信分享来备份微博。你只能从程序的网页上点击save按钮，并粘贴微博url/id来备份微博。

### 启动程序
<details><summary>Windows</summary>

+ 打开程序所在目录，在地址栏输入`powershell`按下回车
![20210224232313](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210224232313.png)
+ 右键点击左上角powershell图标，点属性，关闭快速编辑模式，以防止程序假死
![20210224232540](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210224232540.png)
+ 在powershell输入` .\weiboCrawlerTs-win.exe`,回车。如果你没有配置cookie，程序会问你是否进入免cookie模式。按`y`+ 回车确认，否则按任意键退出。
+ 程序启动后会自动打开浏览器。如果没有自动打开，则手动打开浏览器并进入`http://localhost:5000`（默认5000，以powershell显示为准）
![20210224232938](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210224232938.png)
![20200926160706](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926160706.png)
+ 第一次运行会弹出防火墙提示，如果你想要局域网访问，选中专有网络然后点击允许访问。  
![20210301223135](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210301223135.png)
+ 进入程序网页后，点击左上角的save按钮，在弹出的输入框中输入微博的url或者ID。如果你配置了cookie，在程序启动两分钟后私信分享一条微博给小号，程序会监听user列表中的私信，一旦接收到微博分享，就会自动开始备份。微博备份成功后要刷新页面才能看到新备份的微博。
</details>

<details><summary>Linux</summary>

+ 在terminal进入程序所在的目录，
+ 首次运行如果没有运行权限，先输入`chmod +x ./weiboCrawlerTs-linux`修改权限
+ 运行`./weiboCrawlerTs-linux`。如果你没有配置cookie，程序会问你是否进入免cookie模式。按`y`+ 回车确认，否则按任意键退出。
+ 程序启动后会自动打开浏览器。如果没有自动打开，则手动打开浏览器并进入`http://localhost:5000`（默认5000，以terminal显示为准）
+ 进入程序网页后，点击左上角的save按钮，在弹出的输入框中输入微博的url或者ID。如果你配置了cookie，在程序启动两分钟后私信分享一条微博给小号，程序会监听user列表中的私信，一旦接收到微博分享，就会自动开始备份。微博备份成功后要刷新页面才能看到新备份的微博。
</details>

<details><summary>Macos</summary>

+ 右键点击程序所在目录，点选 服务->新建位于文件夹地终端标签页.
  ![20210228164646](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210228164646.png)
+ 输入`chmod +x ./weiboCrawlerTs-macos`, 回车(第一次运行才需要)
+ 输入`./weiboCrawlerTs-macos`，回车，启动程序。如果你没有配置cookie，程序会问你是否进入免cookie模式。按`y`+ `return`确认，否则按任意键退出。
![mac-terminal](https://raw.githubusercontent.com/kang-ut/picbed/master/img/mac-terminal.png)
+ 程序启动后会自动打开浏览器。如果没有自动打开，则手动打开浏览器并进入`http://localhost:5000`（默认5000，以terminal显示为准）   
![20200926160706](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926160706.png)
+ 第一次运行可能会弹出防火墙提示，如果你希望在局域网内访问程序的网页，点击允许。
+ 进入程序网页后，点击左上角的save按钮，在弹出的输入框中输入微博的url或者ID。如果你配置了cookie，在程序启动两分钟后私信分享一条微博给小号，程序会监听user列表中的私信，一旦接收到微博分享，就会自动开始备份。微博备份成功后要刷新页面才能看到新备份的微博。
</details>


### 注意事项
+ 你可以随时打开/关闭网页，请勿关闭terminal/powershell，否则程序将停止运行。你可以使用[pm2](https://pm2.keymetrics.io/docs/usage/quick-start/), [tmux](https://github.com/tmux/tmux), [screen](https://www.gnu.org/software/screen/manual/screen.html)等工具让程序持久化运行。
+ 备份是一个漫长的过程。刚开始只有几条评论，请耐心等待备份完成。

### 项目的优势
Github上已经有很多微博的爬虫仓库了。区别于其他爬虫，本程序有以下优势
+ Github上大多数微博爬虫是Python爬虫，而本程序用Nodejs，丰富Nodejs社区。
+ 跨平台，开箱即用，不用配置环境。
+ 其他爬虫大多面向研究者，用于数据分析/语义分析。本爬虫面向个人用户，不仅备份了微博数据，还将备份的微博用网页展示出来。
+ 对比微博收藏，本程序将数据和图片/视频都下载到本地，不会被和谐。
+ 对比手机截屏，本程序的备份更加完整，也比截图更有组织性。

### 安全与隐私
+ 程序代码开源。
+ 程序运行不涉及第三方服务器。数据直接从微博服务器到你本地，数据被保存在你的电脑本地。
+ 无cookie时仅能备份公开的微博。有cookie时也只能备份小号可见的微博。
+ 请勿在无保护下开放公网访问

### 局域网访问

<details><summary>macos</summary>

+ 查找局域网下本机的ip地址。点wifi图标-> 网络偏好设置。图中的`192.168.2.18`就是本机在局域网中的ip地址
![ip](https://raw.githubusercontent.com/kang-ut/picbed/master/img/ip.png)
+ 在局域网的其他设备下打开浏览器，尝试访问`http://${ip4}:5000`。其中`${ip}`替换为你查到的ip4地址。比如上图中是`http://192.168.2.20:5000`。如果网页加载成功，则大功告成。否则下一步
+ 点击系统偏好设置->安全性与隐私
![setting](https://raw.githubusercontent.com/kang-ut/picbed/master/img/setting.png)
+ 点击防火墙，点左下角解锁，点击防火墙选项
![firewall](https://raw.githubusercontent.com/kang-ut/picbed/master/img/firewall.png)
+ 查找列表中有没有`weiboCrawlerTs-macos`，如果没有则点击加号，在目录中找到并添加，然后改成`允许传入连接`。点击 好，再把锁头锁回去。
![add-app](https://raw.githubusercontent.com/kang-ut/picbed/master/img/add-app.png)


</details>
<details><summary>Windows</summary>

+ 查找局域网下本机的ip地址。点击wifi图标->属性 找到ip4地址
![20210301152945](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210301152945.png)
![20210301153212](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210301153212.png)
+ 在局域网的其他设备下打开浏览器，尝试访问`http://${ip4}:5000`。其中`${ip}`替换为你查到的ip4地址。比如上图中是`http://192.168.2.20:5000`。如果网页加载成功，则大功告成。否则下一步
+ 打开程序所在的电脑的防火墙。按win键，搜索“防火墙”，点击`高级安全 windows defender防火墙`
![20210301153857](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210301153857.png)
+ 点击`入站规则`,找到`weiboCrawlerts-win.exe`, 点击`属性`
![20210301154046](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210301154046.png)
+ 点击允许连接，并确定
![20210301154302](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210301154302.png)
</details>
<details><summary>Linux</summary>
请参照macos或windows的教程自行摸索
</details>

## 开发
### 环境
+ nodejs
### 初始化
+ 拉取仓库
`git clone https://github.com/Combo819/weiboCrawlerRxdb.git`
+ 安装依赖 `npm i && cd ./frontend && npm i && cd ../`
+ 启动项目 `npm run start`
+ 打包成可执行文件 `npm run dist`
### 声明
本项目仅用于学习交流，不可用于违反相关法律法规的用途。