export type JobCompany = {
  id?: number
  name: string
}

export type JobTag = {
  id: number
  name: string
}

export type JobTagRelation = {
  tag: JobTag
}

export type JobMetadata = {
  id?: number
  name: string
  value: string
  createdAt?: string
  updatedAt?: string
}

export type JobWithRelations = {
  id: number
  title: string
  company?: JobCompany | null
  tags: JobTagRelation[]
  metadata: JobMetadata[]
  author?: string | null
  location?: string | null
  source?: string | null
  url: string
  postedAt?: string | Date | null
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
  description?: string | null
  isRemote?: boolean | null
  externalId?: string | null
  data?: unknown
}

export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string
  endCursor: string
}

export type JobsListData = {
  items: JobWithRelations[]
  pageInfo?: PageInfo
  totalCount: number
  meta?: unknown
}

export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiFailure = {
  success: false
  error?: string
  message?: string
  data?: unknown
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure
