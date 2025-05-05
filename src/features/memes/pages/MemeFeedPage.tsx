
import {
  Flex,
  StackDivider,
  VStack,
} from "@chakra-ui/react";

import MemeList from "../components/MemeList/MemeList";
import { useEffect, useRef } from "react";

import { usePaginatedMemesWithAuthor } from "../hooks/usePaginatedMemesWithAuthor";
import { Loader } from "../../../components/loader";


const MemeFeedPage: React.FC = () => {
  const PAGE_SIZE = 10;

  const { items: memesWithAuthors, loading, hasMore, getNextPage } = usePaginatedMemesWithAuthor();


  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        getNextPage();
        //alert("IntersectionObserver triggered");
      }
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [getNextPage]);


  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto" h="90vh">
      <VStack
        p={4}
        width="full"
        maxWidth={800}
        divider={<StackDivider border="gray.200" />}
      >
        <MemeList memes={memesWithAuthors ? memesWithAuthors : []} refOfLastElement={bottomRef} />

        {loading && <Loader />}

      </VStack>
    </Flex>
  );
};

export default MemeFeedPage;