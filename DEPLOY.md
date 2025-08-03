# 🚀 部署指南

这是一个已经整理好的、可以直接部署的 PredictMarket 项目文件夹。

## 📦 包含内容

✅ 完整的源代码  
✅ 所有必要的配置文件  
✅ 优化的 package.json  
✅ 清理过的 .gitignore  
✅ 简化的 README.md  

## 🎯 快速部署到 Vercel

### 方法一：GitHub + Vercel（推荐）

1. **上传到 GitHub**
   ```bash
   cd prediction-market-deploy
   git init
   git add .
   git commit -m "Initial commit: PredictMarket deployment ready"
   git branch -M main
   git remote add origin https://github.com/你的用户名/prediction-market.git
   git push -u origin main
   ```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"

### 方法二：Vercel CLI

```bash
cd prediction-market-deploy
npm install -g vercel
vercel
```

## 🔧 本地测试

部署前建议先本地测试：

```bash
cd prediction-market-deploy
npm install
npm run build
npm start
```

## 📋 部署检查清单

- [ ] 代码已复制到 `prediction-market-deploy` 文件夹
- [ ] 删除了 `node_modules` 和 `.next` 文件夹
- [ ] package.json 包含所有必要依赖
- [ ] .gitignore 文件已优化
- [ ] 本地构建测试通过
- [ ] 准备上传到 GitHub

## 🌟 项目特色

- 🌐 中英文双语切换
- 🎨 深色/浅色主题
- 💰 钱包连接界面
- 📱 完全响应式设计
- ⚡ Next.js 14 + TypeScript
- 🎯 零配置部署

---

**注意**: 这个文件夹已经过优化，可以直接用于生产部署。无需额外配置。