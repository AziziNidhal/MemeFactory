import { axiosInstance } from "../../../lib/axios";
import { User } from "../types/User";

export type GetUserByIdResponse = User;
  
  /**
   * Get a user by their id
   * @param id 
   * @returns 
   */
  export async function getUserById(id: string): Promise<GetUserByIdResponse> {
    const response = await axiosInstance.get<GetUserByIdResponse>(`/users/${id}`);
    return response.data;
  }
  