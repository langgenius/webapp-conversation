# GitLab OAuth 认证配置指南

## 概述
本应用支持通过GitLab OAuth 2.0进行用户认证。认证功能可以通过环境变量开关控制。

## 配置步骤

### 1. 在GitLab中创建OAuth应用

1. 登录GitLab，进入 `Settings` > `Applications`
2. 点击 "New application"
3. 填写应用信息：
   - **Name**: `WebApp Conversation` (或其他描述性名称)
   - **Redirect URI**: `http://localhost:3000/api/auth/gitlab/callback` (开发环境)
   - **Scopes**: 选择 `read_user` (基础权限)
4. 保存后记录 `Application ID` 和 `Secret`

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并配置以下变量：

```bash
# 启用GitLab认证 (设置为true启用)
NEXT_PUBLIC_GITLAB_AUTH_ENABLED=false

# GitLab OAuth配置
GITLAB_CLIENT_ID=your_application_id_from_gitlab
GITLAB_CLIENT_SECRET=your_secret_from_gitlab
GITLAB_BASE_URL=https://gitlab.com  # 或自托管GitLab地址
```

### 3. 自托管GitLab配置

如果使用自托管GitLab实例，需要设置：
```bash
GITLAB_BASE_URL=https://your-gitlab-instance.com
```

并确保重定向URI正确配置。

## 功能说明

### 认证开关
- `NEXT_PUBLIC_GITLAB_AUTH_ENABLED=false`: 禁用认证，显示标准匿名界面
- `NEXT_PUBLIC_GITLAB_AUTH_ENABLED=true`: 启用认证，显示登录按钮

### 用户标识映射
- 匿名用户: `user_APP_ID:session_id`
- GitLab认证用户: `user_APP_ID:gitlab_user_id`

### 会话管理
- 认证状态通过HTTP-only cookies管理
- 会话有效期: 7天
- 登出时清除所有认证信息

## 故障排除

### 常见问题

1. **认证失败**
   - 检查GitLab应用配置是否正确
   - 验证重定向URI是否匹配
   - 检查环境变量是否正确设置

2. **用户信息显示异常**
   - 清除浏览器缓存和cookies
   - 检查GitLab用户权限设置

3. **自托管GitLab问题**
   - 确认GitLab实例可访问
   - 检查网络连接和防火墙设置

## 安全注意事项

- 确保 `GITLAB_CLIENT_SECRET` 保密
- 在生产环境使用HTTPS
- 定期更新OAuth应用密钥
- 监控认证日志和异常

## 开发说明

认证功能采用渐进式设计：
- 默认禁用，不影响现有功能
- 启用后可平滑切换认证模式
- 支持GitLab.com和自托管实例
- 完整的错误处理和用户反馈