export interface Channel {
  id: string
  name: string
  isPrivate: boolean
}

export interface Message {
  content: string
  /* eslint @typescript-eslint/ban-types: 0 */
  timestamp: Object
  user: {
    avatar: string | null
    id: string
    name: string | null
  }
}

export interface User {
  uid: string
  name: string
  avatar: string
  status: 'online' | 'offline'
}
