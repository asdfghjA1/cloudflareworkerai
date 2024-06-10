'use client'

/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/v0PJO3F2NuL
*/

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";

export function Component() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const response = await fetch("https://workersai.aaryan-539.workers.dev?prompt=" + prompt);
    const blob = await response.blob();
    setImage(URL.createObjectURL(blob));
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <div className="grid gap-8 md:gap-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Generate Stunning Images</h1>
          <p className="max-w-md text-gray-500 dark:text-gray-400 text-center">
            Enter a prompt and let our AI generate a unique and captivating image for you.
          </p>
          <form className="w-full max-w-md flex items-center gap-2" onSubmit={handleSubmit}>
            <Input className="flex-1" placeholder="Enter a prompt" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <Button type="submit">Generate</Button>
          </form>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
          <img
            alt="Generated Image"
            className="w-full h-auto object-cover"
            height="500"
            src={image ? image : "/placeholder.svg"}
            style={{
              aspectRatio: "800/500",
              objectFit: "cover",
            }}
            width="800"
          />
        </div>
      </div>
    </div>
  )
}
