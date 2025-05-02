import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    VStack,
    Textarea,
    useToast,
  } from "@chakra-ui/react";
  import { MemeEditor } from "../../components/CreateMeme/MemeEditor";
  import { useMemo, useState, useCallback } from "react";
  import { MemePictureProps } from "../../components/Common/MemePicture";
  import { Plus } from "@phosphor-icons/react";
  import { Link, useNavigate } from "@tanstack/react-router";
  import { createMeme } from "../../api";
  import { ErrorResponse, errorResponseToString } from "../../types/Error";
import { CaptionControls } from "../../components/CreateMeme/CaptionControls";
import { Picture } from "../../types/Picture";

  
  const CreateMemePage: React.FC = () => {
    const toast = useToast();
    const navigate = useNavigate();
  
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState<Picture | null>(null);
    const [texts, setTexts] = useState<MemePictureProps["texts"]>([]);
  
    const handleDrop = useCallback((file: File) => {
      setPicture({ url: URL.createObjectURL(file), file });
    }, []);
  
    const handleAddCaption = useCallback(() => {
      setTexts((prev) => [
        ...prev,
        {
          content: `New caption ${prev.length + 1}`,
          x: Math.round(Math.random() * 400),
          y: Math.round(Math.random() * 225),
        },
      ]);
    }, []);
  
    const handleDeleteCaption = useCallback((index: number) => {
      setTexts((prev) => prev.filter((_, i) => i !== index));
    }, []);
  
    const handleTextChange = useCallback((index: number, value: string) => {
      setTexts((prev) =>
        prev.map((text, i) => (i === index ? { ...text, content: value } : text))
      );
    }, []);
  
    const handleChangePosition = useCallback((index: number, direction: string) => {
      setTexts((prev) =>
        prev.map((text, i) => {
          if (i !== index) return text;
          const delta = 5;
          return {
            ...text,
            x: direction === "left" ? text.x - delta : direction === "right" ? text.x + delta : text.x,
            y: direction === "up" ? text.y - delta : direction === "down" ? text.y + delta : text.y,
          };
        })
      );
    }, []);
  
    const handleAddMeme = useCallback(async () => {
      if (!picture) return;
      try {
        await createMeme(picture.file, description, texts);
        toast({
          title: "Created",
          description: "Meme created successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate({ to: "/" });
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "title" in error &&
          "errors" in error
        ) {
          const msg = errorResponseToString(error as ErrorResponse);
          toast({
            title: "Error",
            description: msg,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          console.error("Unexpected error", error);
        }
      }
    }, [picture, description, texts, toast, navigate]);
  
    const memePicture = useMemo(() => {
      return picture ? { pictureUrl: picture.url, texts } : undefined;
    }, [picture, texts]);
  
    return (
      <Flex width="full" height="full">
        <Box flexGrow={1} height="full" p={4} overflowY="auto">
          <VStack spacing={5} align="stretch">
            <Box>
              <Heading as="h2" size="md" mb={2}>
                Upload your picture
              </Heading>
              <MemeEditor onDrop={handleDrop} memePicture={memePicture} />
            </Box>
            <Box>
              <Heading as="h2" size="md" mb={2}>
                Describe your meme
              </Heading>
              <Textarea
                autoFocus
                placeholder="Type your description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
          </VStack>
        </Box>
        <Flex flexDir="column" width="30%" minW="250" height="full" boxShadow="lg">
          <Heading as="h2" size="md" mb={2} p={4}>
            Add your captions
          </Heading>
          <Box p={4} flexGrow={1} height={0} overflowY="auto">
            <VStack>
              {texts.map((text, index) => (
                <CaptionControls
                  key={index}
                  index={index}
                  text={text}
                  onChange={handleTextChange}
                  onDelete={handleDeleteCaption}
                  onChangePosition={handleChangePosition}
                />
              ))}
              <Button
                colorScheme="cyan"
                leftIcon={<Icon as={Plus} />}
                variant="ghost"
                size="sm"
                width="full"
                onClick={handleAddCaption}
                isDisabled={!memePicture}
              >
                Add a caption
              </Button>
            </VStack>
          </Box>
          <HStack p={4}>
            <Button
              as={Link}
              to="/"
              colorScheme="cyan"
              variant="outline"
              size="sm"
              width="full"
            >
              Cancel
            </Button>
            <Button
              colorScheme="cyan"
              size="sm"
              width="full"
              color="white"
              isDisabled={!memePicture}
              onClick={handleAddMeme}
            >
              Submit
            </Button>
          </HStack>
        </Flex>
      </Flex>
    );
  };
  
  export default CreateMemePage;
  