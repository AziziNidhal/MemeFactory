import { axiosInstance } from "../../../lib/axios";

export type GetMemeCommentsResponse = {
    total: number;
    pageSize: number;
    results: {
      id: string;
      authorId: string;
      memeId: string;
      content: string;
      createdAt: string;
    }[]
  }
  
  /**
   * Get comments for a meme
   * @param memeId
   * @returns
   */
  export async function getMemeComments( memeId: string, page: number): Promise<GetMemeCommentsResponse> {
    const response = await axiosInstance(`/memes/${memeId}/comments?page=${page}`);
    return response.data;
  }
  
  