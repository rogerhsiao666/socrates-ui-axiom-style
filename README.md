# PredictMarket - 预测市场应用

一个现代化的去中心化预测市场平台，支持中英文双语切换、主题切换和钱包连接功能。

## 🚀 快速部署

### Vercel 部署（推荐）

1. **Fork 或上传代码到 GitHub**
2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的仓库

3. **配置部署**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (保持默认)
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **点击 Deploy**

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## ✨ 主要功能

- 🌐 **中英文双语切换** - 完整的国际化支持
- 🎨 **深色/浅色主题** - 用户友好的主题切换
- 💰 **钱包连接界面** - 模拟Web3钱包连接
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🖼️ **封面图片展示** - 支持话题卡片展位图
- ⏰ **时间格式化** - 智能的时间显示和倒计时
- 🔥 **实时数据** - 模拟实时市场数据更新

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: React Context
- **时间处理**: Day.js
- **部署**: Vercel

## 📁 项目结构

```
prediction-market/
├── app/                 # Next.js App Router 页面
├── components/          # React 组件
├── contexts/           # React Context 状态管理
├── mock/               # 模拟数据
├── public/             # 静态资源
└── 配置文件
```

## 🌍 环境要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**预览地址**: 部署完成后，Vercel 会自动生成预览链接

**技术支持**: 如有问题，请查看 [DEPLOYMENT.md](DEPLOYMENT.md) 获取详细部署指南