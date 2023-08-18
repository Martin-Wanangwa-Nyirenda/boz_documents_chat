"use client";
import Image from "next/image";
import TextInput from "./components/TextInput";
import TextDisplay from "./components/TextDisplay";
import { message } from "./LLM/ChatModel";
import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState("");

  const handleSendQA = async (question: string) => {
    const res = await message(question);
    setResponse(res);
  };

  return (
    <div className="flex flex-col w-[700px] justify-center py-12 px-6 h-screen bg-slate-500 mx-auto">
      <TextInput HandleSendQA={handleSendQA} />
      <TextDisplay Response={response} />
    </div>
  );
}
