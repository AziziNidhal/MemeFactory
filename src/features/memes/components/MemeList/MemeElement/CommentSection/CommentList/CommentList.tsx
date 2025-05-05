import React, { forwardRef, useImperativeHandle } from "react";
import { Avatar, Box, Flex, Text, VStack } from "@chakra-ui/react";
import { format } from "timeago.js";
import { Link } from "@tanstack/react-router";
import { useInfiniteGetCommentsWithAuthor } from "../../../../../hooks/useInfiniteGetCommentsWithAuthor";
import { Loader } from "../../../../../../../components/loader";

interface CommentListProps {
    memeId: string;
}

export type CommentListHandle = {
    refetch: () => void;
};

const CommentList = forwardRef<CommentListHandle, CommentListProps>(({ memeId }, ref) => {
    const {
        commentsWithAuthors: comments,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
        refetch: refetchComments,
    } = useInfiniteGetCommentsWithAuthor(memeId);

    // Exposer refetch au parent
    useImperativeHandle(ref, () => ({
        refetch: refetchComments,
    }));

    if (isLoading) return <Loader />;
    if (isError) return <Text color="red.500">Error loading comments</Text>;
    if (!comments || comments.length === 0) return <Text color="gray.500">No comments yet</Text>;

    return (
        <VStack align="stretch" spacing={4}>
            {comments.map((comment) => (
                <Flex key={comment.id}>
                    <Avatar
                        borderWidth="1px"
                        borderColor="gray.300"
                        size="sm"
                        name={comment.author?.username}
                        src={comment.author?.pictureUrl}
                        mr={2}
                    />
                    <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text>{comment.author?.username}</Text>
                            <Text fontStyle="italic" color="gray.500" fontSize="small">
                                {format(comment.createdAt)}
                            </Text>
                        </Flex>
                        <Text color="gray.500" whiteSpace="pre-line">
                            {comment.content}
                        </Text>
                    </Box>
                </Flex>
            ))}

            {hasNextPage && <Link onClick={fetchNextPage}>Get Next Comments</Link>}
        </VStack>
    );
});

CommentList.displayName = "CommentList";

export default CommentList;
