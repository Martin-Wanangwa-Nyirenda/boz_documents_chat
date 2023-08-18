"use client";

import { useState } from "react";

type TextInputProps = {
  HandleSendQA: (question: string) => any;
};

export default function TextInput(props: TextInputProps) {
  const [content, setContent] = useState("");

  const handleInputChange = (event: any) => {
    setContent(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  const HandleOnSubmit = () => {
    props.HandleSendQA(content);
  };

  return (
    <div className="bg-white p-4 h-max rounded">
      <textarea
        className="resize-none w-full text-sm outline-none"
        value={content}
        onChange={handleInputChange}
      />
      <div className="mt-4 flex justify-end">
        <button
          className="bg-teal-500 p-1 text-white text-sm rounded hover:bg-teal-800"
          onClick={() => HandleOnSubmit()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
