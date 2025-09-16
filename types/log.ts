export interface LogAnnotation {
  content: string
  account: {
    id: string
    name: string
    email: string
  }
  created_at: number
}

export interface Annotation {
  id: string
  authorName: string
  logAnnotation?: LogAnnotation
  created_at?: number
}
