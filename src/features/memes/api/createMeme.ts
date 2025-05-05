import axios from "axios";
import { axiosInstance } from "../../../lib/axios";
import { MemeText } from "../types/MemeText";
import { BadRequest, ErrorResponse } from "../../../types/Error";

export type CreateMemeResponse = {
    id: string;
    authorId: string;
    pictureUrl: string;
    description: string;
    texts: {
      x: number;
      y: number;
      content: string;
    }[];
    commentsCount: number;
    createdAt: string;
  }
  
  /**
   * Create a meme
   * @param picture
   * @param description
   * @param texts
   */
  export async function createMeme(
    picture: File,
    description: string,
    texts: MemeText[]
  ): Promise<CreateMemeResponse> {
    const formData = new FormData();
    formData.append("picture", picture);
    formData.append("description", description);
  
    texts.forEach((text, index) => {
      formData.append(`Texts[${index}][Content]`, text.content);
      formData.append(`Texts[${index}][X]`, text.x.toString());
      formData.append(`Texts[${index}][Y]`, text.y.toString());
    });
  
    try {
        const response = await axiosInstance.post<CreateMemeResponse>(
            `/memes`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        
          return response.data;

    }catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                const errorBody: ErrorResponse =  error.response.data;
                return Promise.reject(errorBody);
            }
      
            // Optionally handle other status codes
            throw new Error(`Meme creation failed with status ${error.response?.status}`);
          }
      
          throw new Error("Unexpected error during Meme Creation");

    }
  }