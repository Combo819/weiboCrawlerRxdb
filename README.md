## A typescript weiboo crawler
本项目可以每次备份单条微博，包括微博的图片，文字，视频，评论，评论的回复。转发的微博只会备份最根部的微博。  
此应用需要一个微博账号来启动。可以通过复制微博ID到自带的网页上备份新的微博，也可以监听其他微博账号的私信来备份新微博。  
比如我们用微博账号A来启动本应用，并监听微博账号B，C。那么B，C私信分享微博给A，就能自动备份分享的微博。
### 下载
[pre-release-v0.1](https://github.com/Combo819/weiboCrawlerRxdb/releases)下载对应系统版本，下载后解压即可
### 使用
#### 1. 创建配置文件(可选)
此程序的根目录需要创建一个`credential.json`文件来记录微博的cookie和需要监听的用户。
```json
{
"cookie":"A_VERY_LONG_COOKIE_STRING",
"users":["van","billy"]
}
```
`cookie`先登录微博账号，再从控制台复制出cookie。具体可参考：  
`users`是要监听私信的用户名。只能是用户名而不能是手机或者邮箱。  
你也可以跳过这一步，启动程序后如果检测不到这个JSON文件，程序会引导你设置
#### 2. 启动程序
##### Windows
方法一：双击`weiboCrawlerTs-win.exe`  
方法二：用在当前目录下打开Powershell或者cmd，然后运行`.\weiboCrawlerTs-win.exe`
##### Linux
用terminal打开当前目录,运行`./weiboCrawlerTs-linux`
##### macOS
用terminal打开当前目录,运行`./weiboCrawlerTs-macos`