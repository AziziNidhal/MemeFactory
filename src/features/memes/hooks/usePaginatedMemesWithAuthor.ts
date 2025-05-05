import { useCallback, useEffect, useState } from "react";
import { Meme, MemeWithAuthor } from "../types/Meme";
import { getMemes } from "../api/getMemes";
import { getUsersByIds } from "../../user/api/getUsersByIds";

type UseMemesWithAuthorOutput = {
    items: MemeWithAuthor[],
    loading: boolean,
    hasMore: boolean,
    getFirstPage: () => void,
    getNextPage: () => void,
};



export const usePaginatedMemesWithAuthor = (): UseMemesWithAuthorOutput => {
    const PAGE_SIZE = 10;

    const [items, setItems] = useState<MemeWithAuthor[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const getFirstPage = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMemes( 1);
            const memesWithoutAuthors: Meme[] = data.results;
            const authorIds = [...new Set(memesWithoutAuthors.map(meme => meme.authorId))];
            const authors = await getUsersByIds( authorIds);

            const memesWithAuthor: MemeWithAuthor[] = memesWithoutAuthors.map(meme => ({
                ...meme,
                author: authors.find(author => author.id === meme.authorId),
            }))



            setItems(memesWithAuthor);
            setCurrentPage(1);
            setTotal(data.total);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getFirstPage(); 
    }, [getFirstPage]);



    const getNextPage = useCallback(async () => {
        if (loading) return;
        const nextPage = currentPage + 1;

        const maxPages = Math.ceil(total / PAGE_SIZE);

        if (nextPage >= maxPages) return;

        setLoading(true);

        try {
            const data = await getMemes( nextPage);
            const memesWithoutAuthors: Meme[] = data.results;
            const authorIds = [...new Set(memesWithoutAuthors.map(meme => meme.authorId))];

            const authors = await getUsersByIds( authorIds);

            const memesWithAuthor: MemeWithAuthor[] = memesWithoutAuthors.map(meme => ({
                ...meme,
                author: authors.find(author => author.id === meme.authorId),
            }));
            setItems((prev) => [...prev, ...memesWithAuthor]);
            setCurrentPage(nextPage);
            setTotal(data.total);
        } finally {
            setLoading(false);
        }


    }, [currentPage, total, loading]);


    const hasMore = (currentPage + 1) * PAGE_SIZE < total;


    return {
        items,
        loading,
        hasMore,
        getFirstPage,
        getNextPage,
    };
}