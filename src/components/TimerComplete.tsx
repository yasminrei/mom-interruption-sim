import { useState, useEffect } from "react";
import { databases } from "../appwrite/config";
import type { InterruptionType } from "../pages/Timer";
import { Models } from "appwrite";

type TimerCompleteProps = {
  duration: number;
  interruptionsCount: number;
  occurredInterruptions: InterruptionType[];
  onRestart: () => void;
};

type CompletionScreen = {
  title: string;
  message: string;
  image: string;
  audio: string;
};

export const TimerComplete = ({
  duration,
  interruptionsCount,
  occurredInterruptions,
  onRestart,
}: TimerCompleteProps) => {
  const [completionScreen, setCompletionScreen] =
    useState<CompletionScreen | null>(null);

  const getShareMessage = () => {
    if (occurredInterruptions.length === 0) return "";

    const randomInterruption =
      occurredInterruptions[
        Math.floor(Math.random() * occurredInterruptions.length)
      ];

    const durationWord = duration === 1 ? "minute" : "minutes";
    const interruptionsWord =
      interruptionsCount === 1 ? "interruption" : "interruptions";
    const momInterruptionsWord =
      interruptionsCount === 1 ? "Mom interruption" : "Mom interruptions";

    return randomInterruption.successEndMsg
      .replace("{duration}", `${duration} ${durationWord}`)
      .replace("{interruptions}", `${interruptionsCount} ${interruptionsWord}`)
      .replace(
        "{momInterruptions}",
        `${interruptionsCount} ${momInterruptionsWord}`
      );
  };

  useEffect(() => {
    const fetchCompletionScreens = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID_TIMERCOMPLETIONS
        );

        const screens = response.documents.map((doc: Models.Document) => ({
          title: doc.title,
          message: doc.message,
          image: doc.image,
          audio: doc.audio,
        }));

        if (screens.length > 0) {
          const randomScreen =
            screens[Math.floor(Math.random() * screens.length)];
          setCompletionScreen(randomScreen);
        }
      } catch (error) {
        console.error("Error loading timer completion data:", error);
      }
    };

    fetchCompletionScreens();
  }, []);

  useEffect(() => {
    if (completionScreen?.audio) {
      const audio = new Audio(completionScreen.audio);

      // Try to play audio when component appears
      audio.play().catch((error) => {
        console.error("Audio play failed:", error);
      });

      // Cleanup function to stop audio when component unmounts
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [completionScreen]); // Run when completionScreen changes

  const handleShare = () => {
    const shareMessage = getShareMessage();
    if (!shareMessage) return;

    const twitterText = encodeURIComponent(shareMessage);
    window.open(`https://twitter.com/intent/tweet?text=${twitterText}`);
  };

  if (!completionScreen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border-5 border-sunflower-orange max-w-md w-full mx-4 text-center">
        <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4">
          <img
            src={completionScreen.image}
            alt="Success meme"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-2xl font-bold text-sunflower-brown mb-4">
          {completionScreen.title}
        </h2>
        <p className="text-lg text-sunflower-brown mb-6">
          {completionScreen.message}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg border-3 border-sunflower-brown hover:bg-green-600 transition-all"
            onClick={onRestart}
          >
            🔄 Restart Timer
          </button>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg border-3 border-sunflower-brown hover:bg-blue-600 transition-all"
            onClick={handleShare}
          >
            📤 Share Success
          </button>
          <button
            className="px-6 py-3 bg-purple-500 text-white rounded-lg border-3 border-sunflower-brown hover:bg-purple-600 transition-all"
            onClick={() => navigator.clipboard.writeText(getShareMessage())}
          >
            📋 Copy
          </button>
        </div>
      </div>
    </div>
  );
};
