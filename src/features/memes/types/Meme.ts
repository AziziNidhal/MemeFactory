import { MemeText } from "./MemeText"
import { User } from "../../user/types/User"

export type Meme = {
    id: string,
    authorId: string,
    pictureUrl: string,
    description: string,
    commentsCount: number,
    texts: MemeText[],
    createdAt: string,
}

export type MemeWithAuthor = Meme & {
    author: User|undefined
}