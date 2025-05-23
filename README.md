# Conversation Web App Template
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Config App
Create a file named `.env.local` in the current directory and copy the contents from `.env.example`. Setting the following content:
```
# APP ID: This is the unique identifier for your app. You can find it in the app's detail page URL. 
# For example, in the URL `https://cloud.dify.ai/app/xxx/workflow`, the value `xxx` is your APP ID.
NEXT_PUBLIC_APP_ID=

# APP API Key: This is the key used to authenticate your app's API requests. 
# You can generate it on the app's "API Access" page by clicking the "API Key" button in the top-right corner.
NEXT_PUBLIC_APP_KEY=

# APP URL: This is the API's base URL. If you're using the Dify cloud service, set it to: https://api.dify.ai/v1.
NEXT_PUBLIC_API_URL=
```

## 整体架构概述

本项目主要包含以下三个组成部分：

1.  **前端应用程序 (Client)**：用户直接交互的操作界面，基于 Next.js 和 React 技术栈构建。用户通过此界面与应用进行对话、管理对话历史、配置个性化设置等。
2.  **后端服务 (BFF)**：作为前端应用的后端 (Backend-for-Frontend)，同样基于 Next.js 的 API 路由功能实现。它不直接处理核心的业务逻辑，而是充当一个中间层，负责接收前端的请求，并将其转发给 Dify.ai 服务。
3.  **Dify.ai 服务**：核心的 AI 引擎，提供包括对话式 AI 能力、知识库管理、工作流（Workflow）处理、日志与分析等在内的底层能力。

它们之间的关系如下：

*   用户通过**前端应用程序**发起操作（例如发送一条消息）。
*   **前端应用程序**将请求发送到**后端服务 (BFF)**。
*   **后端服务 (BFF)** 负责处理与 **Dify.ai 服务** 的交互。这包括：
    *   安全地管理和使用 Dify.ai 的 API 密钥，避免密钥泄露到客户端。
    *   根据需要转换前端请求的格式，以符合 Dify.ai 服务的接口规范。
    *   调用 **Dify.ai 服务** 的相关 API 接口。
    *   接收 **Dify.ai 服务** 的响应，并可能进行必要的格式转换，然后返回给前端应用程序。
*   **前端应用程序**接收到来自 BFF 的响应后，更新界面展示给用户。

通过这种方式，整个 Next.js 应用（包含前端和 BFF）可以视为 Dify.ai 服务的一个客户端应用。BFF 层的引入，有效地将前端界面与具体的后端 AI 服务实现（即 Dify.ai）解耦，同时也增强了应用的安全性。

## 技术栈说明

本项目采用了一系列现代化的技术和工具来构建，主要包括：

*   **前端框架**: Next.js (基于 React) - 用于构建用户界面和服务器端渲染 (SSR) 以及静态站点生成 (SSG)。它提供了路由、API 接口、图片优化等功能。
*   **编程语言**: TypeScript - 作为 JavaScript 的超集，为项目提供了静态类型检查，增强了代码的可维护性和健壮性。
*   **UI 库/框架**: React - 用于构建可复用的用户界面组件，是 Next.js 的核心。
*   **样式**: 
    *   Tailwind CSS - 一个功能优先的 CSS 框架，用于快速构建自定义设计的用户界面。
    *   PostCSS - 一个用 JavaScript 工具转换 CSS 的工具，常与 Tailwind CSS 配合使用。
    *   SCSS - CSS 预处理器，增加了变量、嵌套、混合等高级功能，提升了 CSS 的可维护性。
*   **代码编辑器 (工作流内嵌)**: Monaco Editor - 微软 VS Code 使用的同款代码编辑器，被集成到工作流模块中，提供代码编辑功能。
*   **状态管理辅助**: 
    *   ahooks - 一个封装了大量实用 React Hooks 的库，简化了复杂逻辑的处理。
    *   immer - 通过生成不可变数据结构来简化状态管理，常与 React Hooks 和 Context API 结合使用。
*   **核心 AI 服务**: Dify.ai - 提供底层的对话式 AI、知识库、工作流等核心能力。
*   **容器化**: Docker - 用于创建、部署和运行应用程序的容器化平台，确保了开发、测试和生产环境的一致性。
*   **部署平台**: Vercel - Next.js 的创建者提供的平台，专为 Next.js 应用优化，支持轻松部署和扩展。
*   **API 通信**: Server-Sent Events (SSE) - 用于从服务器到客户端的单向流式数据传输，在此项目中用于实现对话结果的流式返回。

## 数据流与控制流

下面描述了本应用中几个关键操作的数据流和控制流：

### 1. 用户发送消息流程 (流式响应)

此流程描述了用户从界面发送消息到接收 AI 流式回复的完整过程。

1.  **用户输入与前端触发**:
    *   用户在前端聊天界面 (`app/components/chat/index.tsx`) 的输入框中键入消息，然后点击发送按钮。
    *   点击事件触发调用位于 `service/index.ts` 文件中的 `sendChatMessage` 函数。

2.  **前端服务层处理**:
    *   `sendChatMessage` 函数准备好请求参数（包括用户输入、会话 ID 等）。
    *   它使用项目封装的 `ssePost` 方法向 Next.js 后端（BFF）的特定 API 路由 (例如 `/api/chat-messages`) 发起一个 HTTP POST 请求。`ssePost` 的使用表明客户端期望接收流式响应 (Server-Sent Events)。

3.  **BFF API 路由处理**:
    *   位于 `app/api/chat-messages/route.ts` 的 BFF API 路由处理这个 POST 请求。
    *   此路由首先从请求头或环境变量中获取必要的认证信息（如 Dify.ai 的 API Key）。
    *   然后，它构造请求体，调用 Dify.ai 服务提供的 `/chat-messages` API 接口，并将从 Dify.ai 返回的流式响应直接透传回客户端。

### 2. Dify.ai 服务处理与 SSE 响应流

此流程紧接上述用户发送消息流程的第3步之后。

1.  **Dify.ai 服务处理**:
    *   Dify.ai 接收到来自 BFF 的请求后，开始处理。这可能包括：
        *   调用大型语言模型 (LLM)。
        *   根据配置的 Prompt 和上下文进行处理。
        *   如果应用配置了知识库，则进行知识库检索。
        *   如果应用是基于工作流 (Workflow) 构建的，则执行相应的工作流逻辑。
    *   Dify.ai 服务以 Server-Sent Events (SSE) 的形式，将处理结果（例如 AI 生成的文本片段、思考过程中的工具调用信息等）分块、逐步地返回给 BFF。

2.  **BFF 透传 SSE 流**:
    *   BFF 层的 `app/api/chat-messages/route.ts` 在接收到 Dify.ai 返回的 SSE 数据流时，并不等待所有数据都到达或进行聚合处理。
    *   相反，它将这些 SSE 数据块直接、实时地透传给发起请求的前端 `service/index.ts` 中的 `ssePost` 函数。

3.  **前端实时处理与 UI 更新**:
    *   `service/index.ts` 中的 `ssePost` 函数在其内部实现中，通过注册一系列回调函数（如 `onData`, `onThought`, `onCompleted`, `onError` 等）来处理 SSE 事件流。
        *   `onData`: 当接收到实际的文本消息片段时被调用。
        *   `onThought`: 当接收到 AI 思考过程中的中间步骤（如工具调用）时被调用。
        *   `onCompleted`: 当整个流结束时被调用。
    *   这些回调函数被触发时，它们会更新相关的 React 组件（主要是 `app/components/chat/index.tsx` 及其子组件）的状态。
    *   React 的响应式机制确保了状态的改变会立即反映到用户界面上，从而实现 AI 回复的逐字或逐段流式显示效果。

### 3. 加载会话列表流程 (非流式示例)

此流程展示了一个典型的非流式数据获取场景，例如加载用户的历史会话列表。

1.  **前端触发**:
    *   当用户访问应用的主聊天界面或特定的会话管理页面时，相关的 UI 组件 (例如 `app/components/sidebar/index.tsx` 或 `app/components/chat/index.tsx` 初始化时) 可能需要加载用户的历史会话列表。
    *   组件的 `useEffect` Hook 或特定用户操作会触发调用 `service/index.ts` 中的 `fetchConversations` 函数。

2.  **前端服务层处理**:
    *   `fetchConversations` 函数向 BFF 的 API 路由 (例如 `/api/conversations`) 发起一个标准的 HTTP GET 请求。

3.  **BFF API 路由处理**:
    *   位于 `app/api/conversations/route.ts` 的 BFF API 路由处理 GET 请求。
    *   它会调用 Dify.ai 提供的获取会话列表的 API 接口，并传递必要的参数（如用户信息、分页参数等）。

4.  **Dify.ai 服务响应**:
    *   Dify.ai 服务查询数据库或相关记录，将完整的会话列表数据（通常是 JSON 格式）一次性返回给 BFF。

5.  **BFF 返回数据与前端处理**:
    *   BFF 接收到 Dify.ai 的响应后，将 JSON 数据直接返回给前端的 `service/index.ts`。
    *   `fetchConversations` 函数的 Promise 解析成功，返回会话列表数据。
    *   获取到数据的 React 组件通过 `useState` 或类似的状态管理机制更新其内部状态。
    *   UI 根据新的状态重新渲染，从而在侧边栏或相应区域显示用户的会话列表。

## 模块划分

本项目代码结构清晰，各模块职责分明，主要目录和模块的功能如下：

### 1. `app/components/` (前端组件)

此目录包含了构成应用用户界面的所有 React 组件。

*   **`base/`**: 存放基础、可复用的原子组件，如按钮 (`button`)、图标 (`icons`)、模态框 (`modal`)、加载指示器 (`loading`) 等。这些组件是构建更复杂用户界面元素的基石，强调通用性和可重用性。
*   **`chat/`**: 包含了构成聊天界面的核心组件。主要包括：
    *   消息展示 (`answer/index.tsx`, `question/index.tsx`): 分别用于渲染 AI 的回复和用户的问题。
    *   聊天输入区域、反馈机制、引用与来源展示、思维过程可视化等 (`index.tsx`)。
*   **`sidebar/`**: 实现应用侧边栏功能。通常用于：
    *   展示用户的历史会话列表 (`index.tsx`, `card.tsx`)。
    *   提供创建新会话的入口。
    *   可能包含应用导航链接或其他上下文信息。
*   **`welcome/`**: 用户首次访问应用或当前没有选中任何会话时显示的欢迎界面或引导组件 (`index.tsx`)。它通常会提供应用的基本介绍或操作指引。
*   **`workflow/`**: 包含与 Dify.ai 工作流 (Workflow) 功能相关的组件。这些组件使得用户可以与应用的底层逻辑进行更深度的交互：
    *   工作流节点的可视化展示 (`node.tsx`)。
    *   工作流执行过程或状态的展示 (`workflow-process.tsx`)。
    *   内嵌的代码编辑器 (`code-editor/`)，通常使用 Monaco Editor，允许用户查看甚至配置某些节点的代码逻辑或 Prompt。
*   **`config-scene/`**: (推测为 "config-scene") 用于配置特定场景或应用模式的组件 (`index.tsx`)。例如，如果应用支持不同的对话模式（如“创意写作模式”、“翻译模式”），此模块可能包含切换和配置这些模式的界面。
*   **`header.tsx`**: 应用的全局页眉组件，通常包含应用 Logo、标题、用户状态或全局操作入口。

### 2. `app/api/` (后端 API - BFF)

此目录实现了应用的 Backend-for-Frontend (BFF) 层，基于 Next.js 的 API 路由功能。它的核心职责是：
*   作为前端请求的统一入口。
*   安全地处理对外部 Dify.ai 服务的 API 调用，尤其是管理 API 密钥，避免其泄露到客户端。
*   根据需要转换数据格式。

主要 API 路由包括：
*   **`chat-messages/route.ts`**: 负责处理聊天消息的发送与接收。它会调用 Dify.ai 的聊天接口，并通常以流式 (SSE) 的方式将响应返回给前端。
*   **`conversations/route.ts`** 和 **`conversations/[conversationId]/...`**: 用于管理会话的生命周期，包括：
    *   创建新会话。
    *   获取历史会话列表。
    *   获取特定会话的详细信息。
    *   更新会话（如重命名，Dify.ai 可能提供自动命名功能）。
    *   删除会话。
*   **`file-upload/route.ts`**: 处理文件上传功能。前端上传文件到此 API，然后 BFF 将文件信息（如文件ID或URL）传递给 Dify.ai 服务，用于知识库、多模态输入等场景。
*   **`messages/route.ts`**: 获取指定会话内的历史消息列表 (通常是分页加载)。
*   **`parameters/route.ts`**: 获取 Dify.ai 应用的运行时参数和配置信息，例如应用启动时需要的前置 Prompt、变量列表等。

### 3. `hooks/` (自定义 React Hooks)

此目录存放自定义的 React Hooks，用于封装和复用组件间的有状态逻辑。

*   **`use-conversation.ts`**: 项目的核心 Hook 之一。它集中管理了与会话相关的状态和逻辑，例如：
    *   当前选中的会话 ID。
    *   会话列表数据。
    *   用户在输入框中未发送的文本。
    *   与浏览器本地存储 (`localStorage`) 的交互，用于持久化会话 ID 或草稿等。
*   **`use-breakpoints.ts`**: 一个用于实现响应式设计的 Hook。它通常会监听浏览器窗口大小的变化，并根据预设的断点（如手机、平板、桌面）返回当前活动的断点名称或布尔值，帮助组件调整其布局或行为。

### 4. `service/` (前端服务层)

此模块是前端与 BFF API 通信的抽象层，统一管理所有对 `app/api/` 的 HTTP 请求。

*   **`index.ts`**: 作为服务层的入口，导出一系列具体的服务函数，例如：
    *   `sendChatMessage(params)`: 发送聊天消息，内部调用 `base.ts` 中的 `ssePost` 处理流式响应。
    *   `fetchConversations()`: 获取用户的会话列表。
    *   `fetchChatList(conversationId)`: 获取指定会话的消息记录。
    *   `fetchAppParams()`: 获取应用配置参数。
    *   其他与 BFF API 对应的各种数据获取和操作函数。
*   **`base.ts`**: 提供了底层的 HTTP 请求方法封装，如 `get`, `post`, 以及专门用于处理 Server-Sent Events (SSE) 的 `ssePost`。这些基础方法被 `index.ts` 中的服务函数调用，统一处理请求头、错误处理、URL 构造等。

### 5. `config/` (应用配置)

存放应用的静态配置信息。

*   **`index.ts`**: 主要负责：
    *   从环境变量 (`process.env`) 中读取并导出 Dify.ai 相关的配置，如 `NEXT_PUBLIC_APP_ID` (应用ID), `NEXT_PUBLIC_APP_KEY` (API密钥), `NEXT_PUBLIC_API_URL` (Dify.ai 服务地址)。
    *   定义和导出应用本身的元数据，如 `title` (应用标题), `description` (应用描述), `copyright` (版权信息), `privacy_policy` (隐私政策链接), `default_language` (默认界面语言) 等。

### 6. `i18n/` (国际化)

此目录负责应用的国际化 (i18n) 支持，使得应用界面能够以多种语言显示。

*   包含各种语言的翻译资源文件 (例如 `lang/app.en.ts` 对应英文，`lang/app.zh.ts` 对应中文)。这些文件通常以键值对的形式存储待翻译的文本。
*   包含 i18next 或类似库的配置文件 (`i18next-config.ts`, `client.ts`, `server.ts`)，用于初始化和管理国际化实例。

### 7. `public/vs/` (Monaco Editor 静态资源)

此目录存放 Monaco Editor 所需的静态资源文件。Monaco Editor 是一个功能强大的代码编辑器，与 VS Code 使用相同的核心组件。

*   这些静态文件 (主要是 JavaScript 和 CSS) 由 `app/components/workflow/code-editor/` 组件在需要渲染代码编辑器时按需加载。

### 8. `styles/` (全局样式)

包含应用的全局样式定义。

*   **`globals.css`**: 定义应用范围内的全局 CSS 规则，通常包括基础 HTML 元素的样式重置、默认字体、以及 Tailwind CSS 引入等。
*   **`markdown.scss`**: (或类似的 CSS/SCSS 文件) 专门用于定义 Markdown 内容渲染后的样式，确保应用中通过 Markdown 展示的文本（如 AI 的回复）具有一致和美观的格式。

## 安全性和性能考量

### 安全性考量 (Security Considerations)

*   **API 密钥管理**:
    *   应用通过环境变量 (`NEXT_PUBLIC_APP_KEY`, `NEXT_PUBLIC_API_URL`) 配置与 Dify.ai 通信所需的 API 密钥和端点。
    *   强调 `NEXT_PUBLIC_` 前缀的变量在 Next.js 中会暴露给客户端浏览器。BFF (`app/api/`) 层虽然目前直接使用了这个暴露的key，但其存在本身为未来可能的安全增强（如密钥轮换、更细致的权限控制、不在客户端暴露敏感key而是在BFF层注入）提供了基础架构。理想情况下，与外部服务通信的密钥不应直接暴露给前端。
*   **后端作为前端 (BFF)**:
    *   BFF 层 (`app/api/`) 作为前端和 Dify.ai 服务之间的网关，可以集中处理出入流量，为未来实施更严格的安全策略（如请求校验、速率限制、IP 黑白名单）提供切入点。
*   **输入验证**:
    *   前端组件 (`app/components/chat/index.tsx`) 对用户输入（如消息不能为空）进行基本的客户端校验。
    *   更核心和复杂的输入验证逻辑预期由 Dify.ai 服务在其后端处理，以确保数据的一致性和安全性。
*   **依赖管理**:
    *   项目使用 `package.json` 管理依赖，定期更新依赖项有助于防范已知的安全漏洞（此为通用建议，非项目特有实现）。
*   **HTTPS**:
    *   在生产环境部署时（如使用 Vercel），应确保全程使用 HTTPS 来保护数据传输安全（此为通用建议）。

### 性能考量 (Performance Considerations)

*   **Next.js 框架优势**:
    *   **代码分割 (Code Splitting)**: Next.js 自动进行代码分割，只加载当前页面所需的 JavaScript，减少初始加载时间。
    *   **预渲染 (Pre-rendering)**: 支持静态站点生成 (SSG) 和服务器端渲染 (SSR)，有助于提升首屏加载速度和 SEO。具体使用策略需视页面特性而定。
    *   **图片优化**: Next.js 提供 `<Image>` 组件（虽然在 `chat/index.tsx` 中直接使用的是 `<img>`，但可以考虑切换）来自动优化图片。
*   **流式响应 (Streaming Responses)**:
    *   通过 Server-Sent Events (SSE) 实现聊天消息的流式传输 (`service/index.ts` 中的 `ssePost` 和 `app/api/chat-messages/route.ts` 的处理方式)。这使得用户可以更快地看到响应的初始部分，提升了感知性能和用户体验。
*   **状态管理**:
    *   使用 React Hooks (`useState`, `useContext`) 结合 `ahooks` 和 `immer` (`hooks/use-conversation.ts`) 进行状态管理，这是一种相对轻量且高效的方式。
*   **前端资源优化**:
    *   使用 Tailwind CSS 这类 Utility-First 框架，有助于通过复用原子类来控制最终生成的 CSS 大小。
    *   PostCSS 用于 CSS 转换和优化。
*   **Vercel 平台**:
    *   Vercel 为 Next.js 应用提供了优化的构建和部署流程，包括 CDN 加速、边缘函数等，有助于提升全球访问速度和应用的整体性能。
*   **注意事项**:
    *   README.md 中提到 "If you are using Vercel Hobby, your message will be truncated due to the limitation of vercel." 这指出了在特定部署环境下可能存在的性能或功能限制。

## 扩展性考虑 (Extensibility Considerations)

本项目在设计和实现时考虑了未来的功能扩展和需求变化，主要的扩展性体现在以下几个方面：

### 1. 模块化组件设计 (Modular Component Design)

*   前端应用 (`app/components/`) 采用了基于 React 的组件化开发思想。每个 UI 功能单元（如消息气泡、输入框、侧边栏卡片等）被封装成独立的组件。
*   这种设计使得添加新的 UI 功能或修改现有组件变得相对独立和便捷。例如，可以方便地开发新的聊天消息类型（如展示表格、渲染特定卡片）、在工具栏中增加新的交互按钮，或者创建全新的配置面板，而对项目其他部分的影响较小。

### 2. BFF (Backend-for-Frontend) 架构优势

*   BFF 层 (`app/api/`) 的存在将前端应用与具体的后端 AI 服务 (Dify.ai) 有效地解耦。这种解耦带来了显著的扩展性优势：
    *   **替换或增加后端服务**: 如果未来决定更换 AI 服务提供商，或者需要集成额外的第三方服务（如数据分析、用户行为追踪等），主要修改将集中在 BFF 层。前端对 `service/` 层的调用接口可能保持不变，或者只需少量适配性修改。
    *   **聚合多个服务**: BFF 可以扮演数据聚合者的角色。例如，一个前端请求可能需要来自 Dify.ai 的 AI 回复，同时还需要来自另一个内部系统的用户信息。BFF 可以分别调用这两个服务，并将结果聚合成前端所需的统一数据结构后返回。
    *   **定制化数据转换**: Dify.ai 返回的数据结构可能并非完全符合前端展示的最佳格式。BFF 层可以针对特定前端组件的需求，对 Dify.ai 返回的数据进行裁剪、重组、格式化或补充额外信息，从而简化前端逻辑。

### 3. 可配置性 (Configurability)

*   项目通过环境变量 (`.env.local` 或服务器环境变量) 和应用级配置文件 (`config/index.ts`) 提供了多层级的配置管理。
*   可以方便地调整与 Dify.ai 服务的连接参数（如 `NEXT_PUBLIC_APP_ID`, `NEXT_PUBLIC_APP_KEY`, `NEXT_PUBLIC_API_URL`）、应用的基本信息（如 `title`, `description`）以及一些内置的功能开关（如 `isShowPrompt`，用于控制是否在界面显示调试性的 Prompt 输入框）。
*   这种设计为不同环境（开发、测试、生产）下的部署和针对不同用户群体的微调提供了极大的灵活性。

### 4. 工作流与提示工程 (Workflow and Prompt Engineering)

*   项目已包含与 Dify.ai 工作流 (Workflow) 功能相关的组件 (`app/components/workflow/`) 以及 Monaco Editor (`public/vs/` 和 `app/components/workflow/code-editor/`)，表明系统在设计上已为支持 Dify.ai 的高级功能（如工作流编排和提示词工程）奠定了基础。
*   未来可以基于现有组件进行扩展，例如：
    *   提供更丰富的图形化界面来创建、编辑和管理 Dify.ai 的工作流。
    *   允许用户在界面上更方便地调试和优化与 AI 模型交互的提示词 (Prompts)。
    *   根据不同的业务场景，动态加载或配置不同的工作流。
    *   这将使得非技术人员也能灵活调整和优化 AI 应用的行为，增强了应用的适应性和业务敏捷性。

### 5. 国际化 (Internationalization)

*   `i18n/` 目录的存在，以及其中包含的语言资源文件 (如 `lang/app.en.ts`, `lang/app.zh.ts`) 和 i18next 配置，为应用的国际化提供了良好的基础。
*   若要添加对新语言的支持，主要工作是翻译现有的文本键值对，并创建一个新的语言资源文件。这使得应用能够相对轻松地扩展到不同的语言市场。

### 6. 自定义功能集成 (Integration of Custom Features)

*   BFF 架构不仅服务于对 Dify.ai 的调用，也为集成独立于 Dify.ai 的自定义业务逻辑提供了便利。
*   开发者可以在 `app/api/` 目录下添加新的 API 路由，用于实现项目特有的功能，例如：
    *   用户账户管理系统（注册、登录、权限控制）。
    *   应用内部的数据统计与分析。
    *   与其他业务系统（如 CRM、订单管理）的集成。
*   前端则可以通过 `service/` 层调用这些新增的自定义 API 接口，从而在不影响核心 AI 功能的前提下，丰富和扩展应用的整体能力。

### 7. 样式系统的灵活性 (Styling System Flexibility)

*   项目采用了 Tailwind CSS，这是一个功能优先 (Utility-First) 的 CSS 框架。它提供了大量原子化的 CSS 类，使得开发者可以快速构建和定制界面，而无需编写大量自定义 CSS。
*   结合 PostCSS（用于 CSS 转换和优化）和 SCSS（提供更高级的 CSS 功能如嵌套和变量），样式系统具有高度的灵活性。这意味着可以：
    *   轻松调整应用的主题和外观。
    *   方便地集成第三方的 React UI 组件库，并根据需要调整其样式以符合整体设计。
    *   确保样式代码的可维护性和可扩展性。

Config more in `config/index.ts` file:   
```js
export const APP_INFO: AppInfo = {
  title: 'Chat APP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans'
}

export const isShowPrompt = true
export const promptTemplate = ''
```

## Getting Started
First, install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using Docker

```
docker build . -t <DOCKER_HUB_REPO>/webapp-conversation:latest
# now you can access it in port 3000
docker run -p 3000:3000 <DOCKER_HUB_REPO>/webapp-conversation:latest
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

> ⚠️ If you are using [Vercel Hobby](https://vercel.com/pricing), your message will be truncated due to the limitation of vercel.


The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
