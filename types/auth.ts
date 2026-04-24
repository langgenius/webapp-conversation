export interface GitLabUser {
  id: number
  username: string
  name: string
  email: string
  avatar_url: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: GitLabUser | null
  isLoading: boolean
}

export interface GitLabAuthConfig {
  enabled: boolean
  clientId: string
  clientSecret: string
  baseUrl: string
  redirectUri: string
}

export interface AuthResponse {
  success: boolean
  user?: GitLabUser
  error?: string
}
