# BiliDirect · B站直链书签解析工具

在 B 站视频页一键复制视频直链的小工具。纯静态页面，没有后端、没有第三方解析接口——解析完全在你自己的浏览器里完成。

**在线演示**：<https://bili.shany.cc/>

## 使用

1. 打开 <https://bili.shany.cc/>（或你自己部署的 `index.html`），按 `Ctrl + Shift + B` 显示书签栏
2. 按住页面上的「拖住我，拖到书签栏」按钮，拖进书签栏（书签会被命名为「B站解析工具」）
3. 打开任意 B 站视频播放页（网址含 `/video/BV...`），点一下书签
4. 视频直链自动复制到剪贴板

## 原理

书签是一段 `javascript:` 代码，在 bilibili.com 页面内运行，请求携带的是你自己的 IP 和登录态：

1. 从当前页面地址提取 BV 号和分 P 参数
2. 请求 `api.bilibili.com/x/web-interface/view` 获取视频 cid
3. 请求 `api.bilibili.com/x/player/playurl?platform=html5&high_quality=1&fnval=1` 获取单文件 MP4 直链
4. 把直链写入剪贴板

没有服务端，没有第三方解析站，全部逻辑都在 `bookmarklet.js` 里。

## 限制

- 最高 **720P**：这是 `html5` 单文件接口的画质上限，大会员账号也一样。1080P 需要 DASH 分离音视频流（且视频流要求 B 站 Referer），本项目不实现
- 直链带时效签名，过期后回到视频页再点一次书签即可
- 番剧、付费内容可能因权限限制解析失败

## 文件

| 文件 | 说明 |
| --- | --- |
| `index.html` | 工具页面，单文件（样式与脚本内联），兼书签安装页 |
| `bookmarklet.js` | 书签代码，与页面内嵌的完全一致 |

## 部署

无构建、无依赖，`index.html` 一个文件即可上线。GitHub Pages：仓库 Settings → Pages → 选择分支根目录部署。

## 链接

- 演示站：<https://bili.shany.cc/>
- 官网：<https://shany.cc>
- 仓库：<https://github.com/shanyaojinjn/bilidirect>

---

本项目与哔哩哔哩官方无关，仅供个人学习使用。
