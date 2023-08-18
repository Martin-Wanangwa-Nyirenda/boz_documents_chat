"use client";

type TextDisplayProps = {
  Response: any;
};

export default function TextDisplay(props: TextDisplayProps) {
  return (
    <div className="mt-20 bg-black rounded w-full h-min-32 p-5">
      <p className="text-white text-sm">{props.Response}</p>
    </div>
  );
}
