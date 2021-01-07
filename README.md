## A typescript weiboo crawler
本项目可以每次备份单条微博，包括微博的图片，文字，视频，评论，评论的回复。转发的微博只会备份最根部的微博。  
此应用需要一个微博账号来启动。可以通过复制微博ID到自带的网页上备份新的微博，也可以监听其他微博账号的私信来备份新微博。  
比如我们用微博账号A来启动本应用，并监听微博账号B，C。那么B，C私信分享微博给A，就能自动备份分享的微博。
### 下载
[pre-release](https://github.com/Combo819/weiboCrawlerRxdb/releases)下载对应系统版本，下载后解压即可
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
两种方法都要右键点击窗口左上角的图标，点击属性，把快速编辑模式关闭，否则需要不断按回车来保持程序运行。  
![20200926154737](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926154737.png)
##### Linux
用terminal打开当前目录,运行`./weiboCrawlerTs-linux`
##### macOS
用terminal打开当前目录,运行`./weiboCrawlerTs-macos`或者直接鼠标双击`./weiboCrawlerTs-macos`。mac可能需要在系统偏好设置里面的安全与隐私点击允许。
#### 3. 初始化程序
如果设置了`1.创建配置文件`则不需进行此步。  
当你运行程序后，程序会引导你一步步初始化你的配置。一共两个部分，拿cookie和提供需要监听私信的名单。只有第一次启动时需要配置。
+ 第一次运行没有找到配置文件，需要新创建一个配置文件，点击键盘y
![20200926154956](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926154956.png)
+ 输入需要监听私信的用户名，如果有多个用英文逗号隔开，如果没有则直接按回车略过。只能是用户名，而不能是手机号，邮箱等等。不可监听本账号。
![20200926155216](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926155216.png)
+ 需要获取cookie。按1自动打开Chrome登录获得（仅支持Chrome），按2自行去浏览器把cookie复制粘贴过来，参照：[如何获取cookie](https://github.com/dataabc/weiboSpider/blob/master/docs/cookie.md)
![20200926155325](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926155325.png)
+ 按1之后，在打开的浏览器里输入你的微博账号和密码。登录成功后会自动拿到cookie，然后Chrome自动关闭。
![20200926155624](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926155624.png)
+ 出现提示框则表示cookie成功拿到
![20200926155847](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926155847.png)
+ 对于按2，复制粘贴cookie，按回车就可以。
当你看到`listening on port N`时，就表示启动成功了。你可以在浏览器里输入`http://localhost:N`（N默认5000）就可以看到程序自带的网页了。
![20200926160409](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926160409.png)
如果安装了Chrome，程序会自动为你打开网页。  
![20200926160706](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926160706.png)
#### 4.使用方法
+ 任意打开一个微博的页面，复制地址栏的ID
![20200926161050](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926161050.png)
+ 在程序自带的网页上，点击save按钮，然后把复制的微博ID粘贴进去，点OK就会开始拉取这条微博。
![20200926161244](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926161244.png)  
+ 过了一会儿，刷新页面就能看到刚拉取的微博。注意拉取评论和回复需要时间，评论和回复会慢慢变多。  
![20200926161321](https://raw.githubusercontent.com/kang-ut/picbed/master/img/20200926161321.png)
+ 你也可以直接把微博私信分享给那到cookie的那个账号来拉取微博。但启动后需要等2分钟再发私信，并且发了私信最长需要2分钟才开始拉取。
#### 5.出错原因
+ 如果你没办法备份微博，请确保微博ID是有效的，并且你的cookie没有过期。cookie过期后可以手动更新cookie，或直接把`credential.json`里`cookie`一项删除，程序就会带你重新初始化cookie。

### 声明
本项目仅用于学习交流，禁止商用。不可用于违反相关法律法规的用途。