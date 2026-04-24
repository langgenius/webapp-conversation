const translation = {
  loading: '加载中',
  loadingMessage: '正在验证身份信息...',
  authCheck: {
    title: '检查认证状态...',
    message: '正在验证您的登录状态',
  },
  loginRequired: {
    title: '需要登录',
    message: '请使用右上角的登录按钮进行认证',
    hint: '登录后即可继续使用应用',
  },
  loginButton: {
    loginWithGitLab: '使用GitLab登录',
    loggingIn: '登录中...',
    logOut: '登出',
  },
  error: {
    title: {
      default: '认证错误',
      disabled: '认证功能已禁用',
      config: '配置错误',
      no_code: '认证失败',
      server_error: '服务器错误',
    },
    default: '发生未知认证错误',
    disabled: '当前认证功能已被管理员禁用',
    config: '认证配置存在错误，请联系管理员',
    no_code: '认证过程中未收到授权码',
    server_error: '认证服务器发生错误，请稍后重试',
    disabledHint: '请联系系统管理员启用认证功能',
    configHint: '请检查认证配置是否正确设置',
    retryHint: '请重试认证流程',
    backToHome: '返回首页',
    contactSupport: '如果问题持续存在，请联系技术支持',
  },
}

export default translation
