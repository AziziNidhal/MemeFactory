import { User } from "../../user/types/User"

export type Comment = {
    memeId:string;
    id: string,
    authorId: string,
    content: string,
    createdAt: string,
}

export type CommentWithAuthor = Comment & {
    author: User|undefined
}

