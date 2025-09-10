import type { TypeWithI18N } from './base'
export enum LOC {
  tools = 'tools',
  app = 'app',
}

export enum AuthType {
  none = 'none',
  apiKey = 'api_key',
}

export interface Credential {
  auth_type: AuthType
  api_key_header?: string
  api_key_value?: string
}

export enum CollectionType {
  all = 'all',
  builtIn = 'builtin',
  custom = 'api',
}

export interface Emoji {
  background: string
  content: string
}

export interface Collection {
  id: string
  name: string
  author: string
  description: TypeWithI18N
  icon: string | Emoji
  label: TypeWithI18N
  type: CollectionType
  team_credentials: Record<string, any>
  is_team_authorization: boolean
  allow_delete: boolean
}

export interface ToolParameter {
  name: string
  label: TypeWithI18N
  human_description: TypeWithI18N
  type: string
  required: boolean
  default: string
  options?: {
    label: TypeWithI18N
    value: string
  }[]
}

export interface Tool {
  name: string
  label: TypeWithI18N
  description: any
  parameters: ToolParameter[]
}

export interface ToolCredential {
  name: string
  label: TypeWithI18N
  help: TypeWithI18N
  placeholder: TypeWithI18N
  type: string
  required: boolean
  default: string
  options?: {
    label: TypeWithI18N
    value: string
  }[]
}

export interface CustomCollectionBackend {
  provider: string
  original_provider?: string
  credentials: Credential
  icon: Emoji
  schema_type: string
  schema: string
  privacy_policy: string
  tools?: ParamItem[]
}

export interface ParamItem {
  name: string
  label: TypeWithI18N
  human_description: TypeWithI18N
  type: string
  required: boolean
  default: string
  min?: number
  max?: number
  options?: {
    label: TypeWithI18N
    value: string
  }[]
}

export interface CustomParamSchema {
  operation_id: string // name
  summary: string
  server_url: string
  method: string
  parameters: ParamItem[]
}
