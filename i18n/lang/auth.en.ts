const translation = {
  loading: 'Loading',
  loadingMessage: 'Verifying authentication information...',
  authCheck: {
    title: 'Checking authentication status...',
    message: 'Verifying your login status',
  },
  loginRequired: {
    title: 'Login Required',
    message: 'Please use the login button in the upper right corner to authenticate',
    hint: 'You can continue using the application after logging in',
  },
  loginButton: {
    loginWithGitLab: 'Login with GitLab',
    loggingIn: 'Logging in...',
    logOut: 'Log Out',
  },
  error: {
    title: {
      default: 'Authentication Error',
      disabled: 'Authentication Disabled',
      config: 'Configuration Error',
      no_code: 'Authentication Failed',
      server_error: 'Server Error',
    },
    default: 'An unknown authentication error occurred',
    disabled: 'Authentication functionality has been disabled by administrator',
    config: 'Authentication configuration error, please contact administrator',
    no_code: 'Authorization code not received during authentication',
    server_error: 'Authentication server error, please try again later',
    disabledHint: 'Please contact system administrator to enable authentication',
    configHint: 'Please check if authentication configuration is correctly set',
    retryHint: 'Please retry the authentication process',
    backToHome: 'Back to Home',
    contactSupport: 'If the problem persists, please contact technical support',
  },
}

export default translation
