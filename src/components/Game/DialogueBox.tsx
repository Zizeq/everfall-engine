import "./DialogueBox.css";

type Props = {
  charId?: string;
  text?: string;
};

export const DialogueBox = ({ charId, text }: Props) => {
  return (
    <div className="dialogue-box">
      <h3 className="char-name">{charId || "???"}</h3>
      <p className="dialogue-text">{text}</p>
    </div>
  );
};
