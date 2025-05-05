import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Comment } from '../types/Comment'; // Ensure the correct Comment type is imported
import { User } from '../../user/types/User';
import { CommentWithAuthor } from '../types/Comment';
import { getMemeComments, GetMemeCommentsResponse } from '../api/getComments';
import { getUsersByIds } from '../../user/api/getUsersByIds';

type UseGetCommentsWithAuthorOutput = {
  commentsWithAuthors: CommentWithAuthor[] | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

export const useInfiniteGetCommentsWithAuthor = (memeId: string): UseGetCommentsWithAuthorOutput => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    refetch
  } = useInfiniteQuery<
    GetMemeCommentsResponse,     // Type des pages
    Error,                // Type d'erreur
    InfiniteData<GetMemeCommentsResponse>, //  TData : le type retourné par React Query
    [string],             // Type de queryKey
    number                // Type du pageParam (number)
  >({
    queryKey: [`comments-${memeId}`], // Utilisation de memeId pour la clé de requête
    queryFn: ({ pageParam = 1 }) => getMemeComments(memeId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap(page => page.results).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    placeholderData: (prev) => prev, // Pour éviter les clignotements
  });

  // Fusionner toutes les pages en un seul tableau de comments
  const comments: Comment[] = data?.pages.flatMap(page => page.results) ?? [];

  // Extraire les IDs uniques des auteurs
  const authorIds = [...new Set(comments.map((comment: Comment) => comment.authorId))];

  // Charger les auteurs correspondants
  const { data: authors } = useQuery<User[]>({
    queryKey: ['authors', authorIds],
    queryFn: () => getUsersByIds(authorIds),
    enabled: authorIds.length > 0,
  });

  // Fusionner les comments avec leurs auteurs
  const mergedData: CommentWithAuthor[] | undefined = authors
    ? comments.map(comment => ({
      ...comment,
      author: authors.find(author => author.id === comment.authorId),
    }))
    : undefined;

  return {
    commentsWithAuthors: mergedData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    refetch
  };
};
