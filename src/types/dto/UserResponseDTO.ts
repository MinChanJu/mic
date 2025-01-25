import { User } from "../entity/User"

export type UserResponseDTO = {
    user: User
    token: string
}