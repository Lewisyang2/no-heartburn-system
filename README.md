# 《不烧心系统》参赛网页

主题：**如果程序员来设计世界**

这是一个零依赖、可离线运行的中文单页网站。视觉方向为“深夜烟火气 × 程序员终端”，通过滚动叙事同步呈现夜市进程、顾客请求、技术债累积、系统报错与世界恢复。

## 本地打开

最简单的方式：直接双击 `index.html`。

也可以使用任意静态文件服务器预览，例如 VS Code 的 Live Server。网站不需要数据库、构建工具或第三方脚本。

## 文件说明

- `index.html`：完整页面结构和故事内容
- `styles.css`：视觉、动画与移动端适配
- `script.js`：滚动叙事、实时监控、恢复系统等交互
- `assets/hero-night-market.png`：原创深夜馄饨摊主视觉
- `.nojekyll`：确保 GitHub Pages 原样发布静态文件

## GitHub Pages 部署

1. 在 GitHub 新建一个仓库，例如 `no-heartburn-system`。
2. 把本目录中的全部文件上传到仓库根目录并提交。
3. 打开仓库的 `Settings` → `Pages`。
4. 在 `Build and deployment` 中把来源选为 `Deploy from a branch`。
5. 分支选择 `main`，目录选择 `/ (root)`，点击 `Save`。
6. 等待约 1—3 分钟，GitHub 会在同一页面显示公开网址。

## 自定义

- 改标题或故事：编辑 `index.html`。
- 改颜色：编辑 `styles.css` 顶部 `:root` 中的颜色变量。
- 改各章节系统数据：编辑 `script.js` 顶部的 `sceneData`。

## 浏览器支持

建议使用最新版 Chrome、Edge、Safari 或 Firefox。页面已适配手机、平板和桌面设备，并支持系统“减少动态效果”设置。
