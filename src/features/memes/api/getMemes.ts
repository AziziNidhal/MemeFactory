import { axiosInstance } from "../../../lib/axios";

export type GetMemesResponse = {
    total: number;
    pageSize: number;
    results: {
      id: string;
      authorId: string;
      pictureUrl: string;
      description: string;
      commentsCount: number;
      texts: {
        content: string;
        x: number;
        y: number;
      }[];
      createdAt: string;
    }[]
  }
  
  /**
   * Get the list of memes for a given page
   * @param page 
   * @returns 
   */
  export async function getMemes(page: number): Promise<GetMemesResponse> {
    const response = await axiosInstance.get<GetMemesResponse>(`/memes?page=${page}`);
    return response.data;
  }
  