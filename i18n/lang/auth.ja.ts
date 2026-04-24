const translation = {
  loading: '読み込み中',
  loadingMessage: '認証情報を確認中...',
  authCheck: {
    title: '認証状態を確認中...',
    message: 'ログイン状態を確認しています',
  },
  loginRequired: {
    title: 'ログインが必要です',
    message: '右上のログインボタンを使用して認証してください',
    hint: 'ログイン後、アプリケーションの使用を続行できます',
  },
  loginButton: {
    loginWithGitLab: 'GitLabでログイン',
    loggingIn: 'ログイン中...',
    logOut: 'ログアウト',
  },
  error: {
    title: {
      default: '認証エラー',
      disabled: '認証機能無効',
      config: '設定エラー',
      no_code: '認証失敗',
      server_error: 'サーバーエラー',
    },
    default: '不明な認証エラーが発生しました',
    disabled: '認証機能が管理者によって無効化されました',
    config: '認証設定にエラーがあります。管理者に連絡してください',
    no_code: '認証中に認可コードが受信されませんでした',
    server_error: '認証サーバーでエラーが発生しました。後ほど再試行してください',
    disabledHint: 'システム管理者に連絡して認証を有効にしてください',
    configHint: '認証設定が正しく設定されているか確認してください',
    retryHint: '認証プロセスを再試行してください',
    backToHome: 'ホームに戻る',
    contactSupport: '問題が解決しない場合は、テクニカルサポートに連絡してください',
  },
}

export default translation
