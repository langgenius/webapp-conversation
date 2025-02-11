# 未来变量观测局

基于 Next.js 14 开发的现代命理预测平台，提供精准的八字分析和运势预测功能。

## 功能特点

- 支持公历/农历日期转换
- 八字信息计算
- 五行纳音分析
- 大运流年预测
- 多维度运势分析
- 响应式界面设计

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Ant Design
- lunar-typescript

## 开发环境要求

- Node.js >= 18
- npm >= 9

## 安装部署

1. 克隆项目

```bash
git clone https://github.com/yourusername/future-var-observatory.git
cd future-var-observatory
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入必要的配置信息：
# - NEXT_PUBLIC_APP_ID: Dify 应用 ID
# - NEXT_PUBLIC_APP_KEY: Dify API 密钥
# - NEXT_PUBLIC_API_URL: Dify API 地址
```

4. 开发模式运行

```bash
npm run dev
# 访问 http://localhost:33896
```

5. 生产环境构建

```bash
npm run build
npm start
```

## Docker 部署

### 方法一：使用预构建镜像（推荐小白用户）

1. 安装 Docker
   - Windows 用户：
     - 访问 [Docker Desktop 官网](https://www.docker.com/products/docker-desktop)
     - 下载并安装 Docker Desktop for Windows
     - 安装完成后，在系统托盘中可以看到 Docker 图标
     - 右键点击 Docker 图标，确认 Docker Desktop 正在运行
     - 首次运行可能需要重启电脑

   - Mac 用户：
     - 访问 [Docker Desktop 官网](https://www.docker.com/products/docker-desktop)
     - 下载并安装 Docker Desktop for Mac
     - 安装完成后，在菜单栏可以看到 Docker 图标
     - 点击 Docker 图标，确认 Docker Desktop 正在运行

   - Linux 用户：

     ```bash
     # Ubuntu/Debian
     sudo apt update
     sudo apt install docker.io
     sudo systemctl start docker
     sudo systemctl enable docker
     
     # CentOS
     sudo yum install docker
     sudo systemctl start docker
     sudo systemctl enable docker
     ```

2. 验证 Docker 安装

   ```bash
   # 检查 Docker 版本
   docker --version
   
   # 运行测试容器
   docker run hello-world
   ```

3. 拉取镜像

   ```bash
   # 打开终端（Windows 用户使用 PowerShell），输入以下命令
   docker pull yobservatory/future-var-observatory:latest
   
   # 查看已下载的镜像
   docker images
   ```

4. 准备环境变量
   - 创建一个文本文件 `.env`，填入以下内容：

     ```env
     NEXT_PUBLIC_APP_ID=your_app_id
     NEXT_PUBLIC_APP_KEY=your_api_key
     NEXT_PUBLIC_API_URL=https://api.dify.ai/v1
     ```

   - 将 `your_app_id` 和 `your_api_key` 替换为你的实际配置

5. 运行容器

   ```bash
   # 使用环境变量文件运行（推荐）
   docker run -d \
     -p 33896:33896 \
     --env-file .env \
     --name future-var-observatory \
     yobservatory/future-var-observatory:latest

   # 或者直接指定环境变量
   docker run -d \
     -p 33896:33896 \
     -e NEXT_PUBLIC_APP_ID=your_app_id \
     -e NEXT_PUBLIC_APP_KEY=your_api_key \
     -e NEXT_PUBLIC_API_URL=your_api_url \
     --name future-var-observatory \
     yobservatory/future-var-observatory:latest
   ```

   > 注意：
   > - Windows PowerShell 用户使用反引号 ` 换行
   > - Windows CMD 用户需要将命令写在一行
   > - 环境变量需要替换为你的实际配置
   > - `-d` 参数表示在后台运行
   > - `--name` 参数指定容器名称
   > - `-p` 参数指定端口映射，格式为 `主机端口:容器端口`

6. 检查容器运行状态

   ```bash
   # 查看所有容器状态
   docker ps -a
   
   # 查看正在运行的容器
   docker ps
   
   # 查看容器日志
   docker logs future-var-observatory
   
   # 实时查看日志
   docker logs -f future-var-observatory
   ```

7. 访问应用
   - 打开浏览器，访问 <http://localhost:33896>
   - 如果需要远程访问，将 localhost 替换为服务器 IP 地址
   - 首次访问可能需要等待几秒钟

8. 常用命令

   ```bash
   # 容器管理
   docker stop future-var-observatory    # 停止容器
   docker start future-var-observatory   # 启动容器
   docker restart future-var-observatory # 重启容器
   docker rm -f future-var-observatory   # 删除容器

   # 镜像管理
   docker images                         # 查看所有镜像
   docker rmi yobservatory/future-var-observatory:latest  # 删除镜像
   
   # 资源清理
   docker system prune                   # 清理未使用的资源
   docker system prune -a               # 清理所有未使用的资源（包括镜像）
   ```

9. 常见问题解决
   - 端口被占用：

     ```bash
     # 查看端口占用
     netstat -ano | findstr "33896"    # Windows
     lsof -i :33896                    # Linux/Mac
     
     # 修改端口映射
     docker run -p 33897:33896 ...     # 使用其他端口
     ```

   - 容器无法启动：

     ```bash
     # 查看详细日志
     docker logs future-var-observatory
     
     # 以交互模式运行容器排查问题
     docker run -it --rm yobservatory/future-var-observatory:latest /bin/sh
     ```

   - 环境变量问题：

     ```bash
     # 查看容器环境变量
     docker exec future-var-observatory env
     
     # 重新创建容器并验证环境变量
     docker run --rm -it --env-file .env yobservatory/future-var-observatory:latest env
     ```

## 项目结构

```
future-var-observatory/
├── app/                # Next.js 应用目录
├── components/         # 共用组件
├── config/            # 配置文件
├── service/           # 服务层
├── types/             # TypeScript 类型定义
├── utils/             # 工具函数
└── test/              # 测试文件
```

## 环境变量

必要的环境变量配置：

- `NEXT_PUBLIC_APP_ID`: Dify 应用 ID
- `NEXT_PUBLIC_APP_KEY`: Dify API 密钥
- `NEXT_PUBLIC_API_URL`: Dify API 地址（默认：<https://api.dify.ai/v1）>
- `PORT`: 服务端口（默认：33896）
- `NODE_ENV`: 运行环境（development/production）

## 测试

```bash
# 运行测试
npm test

# 监听模式
npm run test:watch
```

## 镜像信息

- 镜像名称：yobservatory/future-var-observatory
- 镜像大小：约 248MB
- 基础镜像：node:19-alpine
- 默认端口：33896

## 许可证

MIT License
