import { Box, Flex, Icon, IconButton, Textarea, VStack } from "@chakra-ui/react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash } from "@phosphor-icons/react";
import { memo, useRef } from "react";
import { MemeText } from "../../types/MemeText";

export type CaptionControlsProps = {
  index: number;
  text: MemeText;
  onChange: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  onChangePosition: (index: number, direction: string) => void;
};

export const CaptionControls: React.FC<CaptionControlsProps> = memo(
  ({ index, text, onChange, onDelete, onChangePosition }) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = (direction: string) => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        onChangePosition(index, direction);
      }, 50);
    };

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    return (
      <Flex width="full" align="center">
        <Box mr={2}>
          <VStack spacing={1}>
            <IconButton
              aria-label="Up"
              icon={<ArrowUp />}
              onMouseDown={() => start("up")}
              onMouseUp={stop}
              onMouseLeave={stop}
            />
            <IconButton
              aria-label="Down"
              icon={<ArrowDown />}
              onMouseDown={() => start("down")}
              onMouseUp={stop}
              onMouseLeave={stop}
            />
            <IconButton
              aria-label="Left"
              icon={<ArrowLeft />}
              onMouseDown={() => start("left")}
              onMouseUp={stop}
              onMouseLeave={stop}
            />
            <IconButton
              aria-label="Right"
              icon={<ArrowRight />}
              onMouseDown={() => start("right")}
              onMouseUp={stop}
              onMouseLeave={stop}
            />
          </VStack>
        </Box>
        <Textarea
          value={text.content}
          onChange={(e) => onChange(index, e.target.value)}
          mr={1}
        />
        <IconButton
          onClick={() => onDelete(index)}
          aria-label="Delete caption"
          icon={<Icon as={Trash} />}
        />
      </Flex>
    );
  }
);

CaptionControls.displayName = "CaptionControls";
