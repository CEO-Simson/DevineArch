export type Role = 'owner' | 'admin' | 'staff' | 'volunteer' | 'member'

export interface UserDTO {
  id: string
  email: string
  name: string
  roles: Role[]
}

export interface AuthResponse {
  token: string
  user: UserDTO
}
