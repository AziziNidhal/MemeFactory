import { MemeText } from "./types/MemeText";
import { fetchWithAuth } from "./utils/fetchWithAuth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

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
  return await fetch(`${BASE_URL}/authentication/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password }),
  }).then(res => checkStatus(res).json())
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
export async function getUserById( id: string): Promise<GetUserByIdResponse> {
  return await fetchWithAuth(`${BASE_URL}/users/${id}`).then(res => checkStatus(res).json())
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
export async function getUsersByIds( ids: string[]): Promise<GetUsersByIdsResponse> {
  const queryString = ids.map(id => `ids=${id}`).join("&");
  return await fetchWithAuth(`${BASE_URL}/users?${queryString}`).then(res => checkStatus(res).json());
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
export async function getMemes( page: number): Promise<GetMemesResponse> {
  return await fetchWithAuth(`${BASE_URL}/memes?page=${page}`).then(res => checkStatus(res).json())
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
  return await fetchWithAuth(`${BASE_URL}/memes/${memeId}/comments?page=${page}`).then(res => checkStatus(res).json())
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
export async function createMemeComment( memeId: string, content: string): Promise<CreateCommentResponse> {
  return await fetchWithAuth(`${BASE_URL}/memes/${memeId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }).then(res => checkStatus(res).json());
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
export async function createMeme( picture: File, description: string, texts:MemeText[]): Promise<CreateMemeResponse> {
  const formData = new FormData();
  formData.append('picture', picture); //  binary file
  formData.append('description', description);
  texts.forEach((text, index) => {
    formData.append(`Texts[${index}][Content]`, text.content);
    formData.append(`Texts[${index}][X]`, text.x.toString());
    formData.append(`Texts[${index}][Y]`, text.y.toString());
  });

 
  return await fetchWithAuth(`${BASE_URL}/memes`, {
    method: 'POST',
    body: formData,
  }).then(res => checkStatus(res).json()).catch((err) => {
    console.error(err);
    throw err;
  });
}