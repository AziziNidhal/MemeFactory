import axios from "axios";
import { axiosInstance } from "../../../lib/axios";
import { UnauthorizedError } from "../../../types/Error";

export type LoginResponse = {
    jwt: string
}


/**
 * Authenticate the user with the given credentials
 * @param username 
 * @param password 
 * @returns 
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post("/authentication/login", {
      username,
      password,
    });

    return response.data; // Axios parses JSON automatically
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new UnauthorizedError(); //  Required for useMutation `error` to work
      }

      // Optionally handle other status codes
      throw new Error(`Login failed with status ${error.response?.status}`);
    }

    throw new Error("Unexpected error during login");
  }

}
