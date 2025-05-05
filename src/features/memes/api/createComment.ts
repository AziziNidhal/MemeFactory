import axios from "axios";
import { axiosInstance } from "../../../lib/axios";
import { BadRequest } from "../../../types/Error";

export type CreateCommentResponse = {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
    memeId: string;
  }
  
  /**
   * Create a comment for a meme
   * @param memeId
   * @param content
   */
  export async function createMemeComment(
    memeId: string,
    content: string
  ): Promise<CreateCommentResponse> {
    try { 
        const response = await axiosInstance.post<CreateCommentResponse>(
            `/memes/${memeId}/comments`,
            { content } 
          ); 
        
          return response.data;

    }catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
              throw new BadRequest();
            }
      
            // Optionally handle other status codes
            throw new Error(`Comment creation failed with status ${error.response?.status}`);
          }
      
          throw new Error("Unexpected error during Comment Creation");

    }

  }