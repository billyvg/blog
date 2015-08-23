# blog
一个轻量级的单页面应用博客框架。

# 一、简单介绍
说是框架其实有点牵强，只是集成了一些前端开发常用的例如Ajax，事件绑定、模块间简单通信和路由切换等功能模块，来实现前端页面所需要的基本功能，是一个非常轻量级的单页面博客系统，如果需要完成更复杂的逻辑交互，框架本身还需要完善还有N多……

本框架实现基本的博客功能：博客分类列表、栏目分页、文章、评论和留言板功能。

我自己的博客（示例网站）的后端api接口都是根据WordPress的数据库表结构来进行增删改查的，所以如果是用WordPress的站点本框架可以是“即插即用”；如果不是WP站点，`sprint`目录下的api将需要重写数据查询接口，前端部分不受影响。

框架优点：加载速度快，体验好，页面组件模块化便于管理；

框架缺点：单页面应用不利于搜索引擎收录（SEO）。

# 二、目录结构
 **`boot`** 系统入口启动文件init.js以及系统前端配置文件config.js
 
 **`controller`** 路由切换响应模块
 
 **`dist`** 系统核心模块core、第三方插件plugins和库jquery等
 
 **`lang`** 语言包文件

 **`project`** 组件modules和页面pages模块
 
 **`resources`** 图片、字体、PSD、LESS和CSS文件
 
 **`sprint`** 数据库配置、数据接口文件（如非WordPress这里的后端查询接口需要另外开发）
 
 **`view`** 视图控制模块，定义整体布局和页面容器的切换规则
 
 **`waproot`** 移动设备访问目录（待开发，可以看作是另一个独立的单页应用）
 
 **`index.php`** 主页文件
 
 **`Gruntfile.js`** grunt配置文件
 
 **`package.json`** grunt依赖的包

# 三、配置以及使用
详细的配置以及使用请看[这里](https://github.com/tangbc/blog/blob/master/docs/START.md)。

由于水平有限，框架中难免有些实现方式不是最合适的甚至是错误的地方，如果发现非常欢迎提出来一起探讨。

任何问题或者建议都可以在[这里](https://github.com/tangbc/blog/issues)发表。

# 四、目前升级ing
目前框架的功能实现过于简单，拓展性也不是很好，所以最近打算进行升级，使框架更彻底的实现模块和组件化。由于平时工作还是比较忙，只能抽出周末或者晚上的时间，升级的时间可能会持续一段不短的时间，但是我相信重新设计、升级后的框架将会很有大的改善和魅力！
