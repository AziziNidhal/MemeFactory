import axios from "axios";
import { axiosInstance } from "./lib/axios";
import { MemeText } from "./types/MemeText";


export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('Not Found');
  }
}

function checkStatus(response: Response) {
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  if (response.status === 404) {
    throw new NotFoundError();
  }
  return response;
}

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
        throw new UnauthorizedError(); // 👈 Required for useMutation `error` to work
      }

      // Optionally handle other status codes
      throw new Error(`Login failed with status ${error.response?.status}`);
    }

    throw new Error("Unexpected error during login");
  }

}

export type GetUserByIdResponse = {
  id: string;
  username: string;
  pictureUrl: string;
}

/**
 * Get a user by their id
 * @param id 
 * @returns 
 */
export async function getUserById(id: string): Promise<GetUserByIdResponse> {
  const response = await axiosInstance.get<GetUserByIdResponse>(`/users/${id}`);
  return response.data;
}

export type GetUsersByIdsResponse = {
  id: string;
  username: string;
  pictureUrl: string;
}[]

/**
 * Get a user by their id
 * @param id 
 * @returns 
 */
export async function getUsersByIds(ids: string[]): Promise<GetUsersByIdsResponse> {
  const queryString = ids.map(id => `ids=${id}`).join("&");
  const response = await axiosInstance.get<GetUsersByIdsResponse>(`/users?${queryString}`);
  return response.data;
}


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
  const response = await axiosInstance.post<CreateCommentResponse>(
    `/memes/${memeId}/comments`,
    { content } 
  );

  return response.data;
}



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
 * Create a comment for a meme
 * @param memeId
 * @param content
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
}