import React from "react";
import { MemeWithAuthor } from "../../types/Meme";
import MemeElement from "./MemeElement/MemeElement";


interface MemeListProps {
    memes: MemeWithAuthor[];
    refOfLastElement?: React.RefObject<HTMLDivElement>;
}

const MemeList: React.FC<MemeListProps> = ({ memes,refOfLastElement }) => {
    return memes?.map((meme,index) => <MemeElement key={meme.id} meme={meme} ref={index === memes.length - 1 ? refOfLastElement : undefined}  />)
}

export default MemeList