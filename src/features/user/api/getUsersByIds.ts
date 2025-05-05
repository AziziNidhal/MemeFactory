import { axiosInstance } from "../../../lib/axios";
import { User } from "../types/User";

export type GetUsersByIdsResponse = User[]
  
  /**
   * Get users by ids
   * @param id 
   * @returns 
   */
  export async function getUsersByIds(ids: string[]): Promise<GetUsersByIdsResponse> {
    const queryString = ids.map(id => `ids=${id}`).join("&");
    const response = await axiosInstance.get<GetUsersByIdsResponse>(`/users?${queryString}`);
    return response.data;
  }
  
  