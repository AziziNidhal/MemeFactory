import { Avatar, Box, Collapse, Flex, Icon, Input, LinkBox, LinkOverlay, Text, useToast } from "@chakra-ui/react";
import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { createMemeComment } from "../../../../api";
import { useUserInfo } from "../../../../contexts/authentication";

import CommentList, { CommentListHandle } from "./CommentList/CommentList";

interface CommentSectionProps {
    memeId: string;
    commentsCount: number
}

const CommentSection: React.FC<CommentSectionProps> = ({ memeId, commentsCount }) => {

    const toast = useToast();
    const commentListRef = useRef<CommentListHandle>(null);
    const [addedCommentNumber,setAddedCommentNumber] = useState<number>(0);

    const user = useUserInfo();
    const [openedCommentSection, setOpenedCommentSection] = useState<
        boolean
    >(false);
    const [commentContent, setCommentContent] = useState<{
        [key: string]: string;
    }>({});

    const { mutate } = useMutation({
        mutationFn: async (data: { memeId: string; content: string }) => {
            await createMemeComment( data.memeId, data.content).then(() => {
                commentListRef.current?.refetch();
                setAddedCommentNumber((prev) => prev + 1);
                setCommentContent((prev) => ({
                    ...prev,
                    [memeId]: "",
                  }));
                  toast({
                    title: "Created",
                    description: "Comment created successfully!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
            }).catch((err) => {
                console.error(err);
                toast({
                    title: "Error",
                    description: "Error: Comment creation failed!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
            });
        },
    });

    return <>
        <LinkBox as={Box} py={2} borderBottom="1px solid black">
            <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                    <LinkOverlay
                        data-testid={`meme-comments-section-${memeId}`}
                        cursor="pointer"
                        onClick={() =>
                            setOpenedCommentSection(
                                last => !last,
                            )
                        }
                    >
                        <Text data-testid={`meme-comments-count-${memeId}`}>{commentsCount + addedCommentNumber} comments</Text>
                    </LinkOverlay>
                    <Icon
                        as={
                            openedCommentSection ? CaretUp : CaretDown
                        }
                        ml={2}
                        mt={1}
                    />
                </Flex>
                <Icon as={Chat} />
            </Flex>
        </LinkBox>



        <Collapse in={openedCommentSection} animateOpacity>
            <Box mb={6}>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (commentContent[memeId]) {
                            mutate({
                                memeId: memeId,
                                content: commentContent[memeId],
                            });
                        }
                    }}
                >
                    <Flex alignItems="center">
                        <Avatar
                            borderWidth="1px"
                            borderColor="gray.300"
                            name={user?.username}
                            src={user?.pictureUrl}
                            size="sm"
                            mr={2}
                        />
                        <Input
                            placeholder="Type your comment here..."
                            onChange={(event) => {
                                setCommentContent({
                                    ...commentContent,
                                    [memeId]: event.target.value,
                                });
                            }}
                            value={commentContent[memeId]}
                        />
                    </Flex>
                </form>
            </Box>

            {openedCommentSection && <CommentList  ref={commentListRef} memeId={memeId} />}



        </Collapse>
    </>;
}

export default CommentSection;