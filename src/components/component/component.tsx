'use client'

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveAs } from 'file-saver';
import React from "react";
import { motion } from "framer-motion";

export function Component() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState('');
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(10);
  const [timeExceeded, setTimeExceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOverlayVisible(true);
    setElapsedTime(10);
    setTimeExceeded(false);

    const response = await fetch("https://workersai.aaryan-539.workers.dev?prompt=" + prompt);
    const blob = await response.blob();
    setImageBlob(blob);
    const base64data = await convertBlobToBase64(blob);

    setImage(base64data as string);
    setOverlayVisible(false);

    // Send prompt and image to the server
    const saveResponse = await fetch('/api/savePrompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, image: base64data }),
    });

    if (!saveResponse.ok) {
      console.error('Error saving prompt');
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  };

  const handleDownload = () => {
    if (imageBlob) {
      saveAs(imageBlob, 'generated-image.png');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (overlayVisible) {
      document.body.style.overflow = "hidden";
      intervalId = setInterval(() => {
        setElapsedTime(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            setTimeExceeded(true);
            return 0;
          }
        });
      }, 1000);
    } else {
      document.body.style.overflow = "auto";
      if (intervalId !== null) clearInterval(intervalId);
    }

    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [overlayVisible]);

  return (
    <div className="w-full max-w-5xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <div className="grid gap-8 md:gap-12">
        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Generate AI Images</h1>
          <p className="max-w-md text-gray-500 dark:text-gray-400 text-center">
            Enter a prompt and let our AI generate a unique and captivating image for you.
          </p>
          <p className="font-bold text-center">
            (PS: This is a very base model so don't expect too much out of it.)
          </p>
          <form className="w-full max-w-md flex items-center gap-2" onSubmit={handleSubmit}>
            <Input className="flex-1" placeholder="Try generating - Cyberpunk Cat" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <Button type="submit">Generate</Button>
          </form>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
          <img
            alt="Generated Image"
            className="w-full h-auto object-cover"
            src={image || "/placeholder.svg"}
            style={{ objectFit: "fill" }}
            width="800"
          />
        </div>
        {image && (
          <div className="flex justify-center">
            <Button onClick={handleDownload}>Download Image</Button>
          </div>
        )}
        <footer>
          Created by Aaryan AKA - Whiteye
        </footer>

        <motion.div
          className="fixed inset-0 bg-gray-900 opacity-75 flex flex-col items-center justify-center"
          animate={overlayVisible ? "visible" : "hidden"}
          initial="hidden"
          variants={{
            visible: { opacity: 1, pointerEvents: "auto" },
            hidden: { opacity: 0, pointerEvents: "none" },
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid animate-spin rounded-full"></div>
          <p className="text-white mt-4">
            {timeExceeded ? "Almost done - might take a few more seconds" : `Generating image - Time Elapsed: ${10 - elapsedTime} seconds`}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
