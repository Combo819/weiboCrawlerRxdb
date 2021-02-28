## A typescript weiboo crawler
本项目可以每次备份单条微博，包括微博的图片，文字，视频，评论，评论的回复，转发，并能完整地复现。数据都下载到了本地，你可以把它当成一个不会被和谐的微博收藏夹。  
![2021-02-26 22.38.14-1](https://raw.githubusercontent.com/kang-ut/picbed/master/img/2021-02-26%2022.38.14-1.gif)
## 使用
### 下载
[pre-release-0.9](https://github.com/Combo819/weiboCrawlerRxdb/releases/tag/0.9)下载对应系统版本，下载后解压
### 账号
准备两个微博账号，一个是日常使用的账号（大号），另一个用来爬虫（小号）。每次大号给小号私信分享一条微博，该微博就会被备份下来。
### 创建配置文件
在程序的根目录创建一个`credential.json`文件来记录微博的cookie和需要监听的用户。
```json
{
"cookie":"A_VERY_LONG_COOKIE_STRING",
"users":["van"]
}
```
其中`cookie`是小号的cookie，获取cookie的方法请参照[cookie.md](https://github.com/dataabc/weiboSpider/blob/master/docs/cookie.md)
`users`是要监听私信的用户名（大号）。只能是用户名而不能是手机或者邮箱。 比如你的微博大号是`@van`， 则`"users":["van"]`。你可以同时监听多个微博账号。

### 启动程序
<details><summary>windows</summary>

+ 打开程序所在目录，在地址栏输入`powershell`按下回车
![20210224232313](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210224232313.png)
+ 右键点击左上角powershell图标，点属性，关闭快速编辑模式，以防止程序假死
![20210224232540](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210224232540.png)
+ 在powershell输入` .\weiboCrawlerTs-win.exe`,回车。程序启动后会自动打开浏览器。如果没有自动打开，则手动打开浏览器并进入`http://localhost:5000`（默认5000，以powershell显示为准）
![20210224232938](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210224232938.png)
![20200926160706](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926160706.png)

</details>

<details><summary>Linux</summary>


+ 在terminal进入程序所在的目录，运行`./weiboCrawlerTs-linux`。程序启动后会自动打开浏览器。如果没有自动打开，则手动打开浏览器并进入`http://localhost:5000`（默认5000，以terminal显示为准）
+ 如果没有运行权限，先输入`chmod +x ./weiboCrawlerTs-linux`修改权限再重试
</details>

<details><summary>macos</summary>

+ 右键点击程序所在目录，点选 服务->新建位于文件夹地终端标签页.
  ![20210228164646](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210228164646.png)
+ 输入`chmod +x ./weiboCrawlerTs-macos`, 回车(第一次运行才需要)
+ 输入`./weiboCrawlerTs-macos`，回车，启动程序
![20210228164727](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20210228164727.png)
+ 程序启动后会自动打开浏览器。如果没有自动打开，则手动打开浏览器并进入`http://localhost:5000`（默认5000，以terminal显示为准）   
![20200926160706](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926160706.png)

</details>

### 注意事项
+ 程序启动后大约2分钟，大号私信分享一条微博给小号。不久程序会开始爬虫，这时刷新`localhost:5000`会能看到新备份的微博。过早分享的微博不一定能备份上
+ 你可以随时打开/关闭网页，请勿关闭terminal/powershell，否则程序将停止运行。
+ 备份是一个漫长的过程。刚开始只有几条评论，请耐心等待备份完成。

### 项目的优势
Github上已经有很多微博的爬虫仓库了。区别于其他爬虫，本程序有以下优势
+ Github上大多数微博爬虫是Python爬虫，而本程序用Nodejs，丰富Nodejs社区。
+ 跨平台，开箱即用，不用配置环境。
+ 其他爬虫大多面向研究者，用于数据分析/语义分析。本爬虫面向个人用户，不仅备份了微博数据，还将备份的微博用网页展示出来。
+ 对比收藏，本程序将数据和图片/视频都下载到本地，不会被和谐。
+ 对比手机截屏，本程序的备份更加完整，也比截图更有组织性。

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