import { useState, useEffect, useRef } from "react";
import { databases } from "../appwrite/config";
import Interruption from "../components/Interruption";
import { TimerComplete } from "../components/TimerComplete";

type TimerStatus = "idle" | "running" | "paused" | "completed" | "failed";
export type InterruptionType = {
  successImg: string;
  failImg: string;
  failMsg: string;
  successMsg: string;
  image: string;
  $id: string;
  title: string;
  message: string;
  audio: string;
  failAudio: string;
  successAudio: string;
  failEndMsg: string;
  successEndMsg: string;
  successEndImg: string;
};

const Timer = () => {
  const [duration, setDuration] = useState(1);
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [interruptions, setInterruptions] = useState<InterruptionType[]>([]);
  const [currentInterruption, setCurrentInterruption] =
    useState<InterruptionType | null>(null);
  const [momMode, setMomMode] = useState<"hardcore" | "chill">("hardcore");
  const [occurredInterruptions, setOccurredInterruptions] = useState<
    InterruptionType[]
  >([]);
  const [randomAppName, setRandomAppName] = useState<{
    title: string;
    body: string;
  } | null>(null);

  // Add a ref to track the latest interruptions state
  const interruptionsRef = useRef<InterruptionType[]>([]);

  // Update the ref whenever interruptions state changes
  useEffect(() => {
    interruptionsRef.current = interruptions;
  }, [interruptions]);

  const scheduledInterruptions = useRef<number[]>([]);

  //Track study session data
  const studySessionData = useRef<{
    totalDuration: number;
    interruptionCount: number;
    successCount: number;
  }>({ totalDuration: 0, interruptionCount: 0, successCount: 0 });

  // Sync duration changes
  useEffect(() => {
    if (status === "idle") {
      setRemainingSeconds(duration * 60);
    }
  }, [duration, status]); // Make sure duration and status dependencies are included

  // Fetch interruptions with audio fields
  useEffect(() => {
    const fetchInterruptions = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID_INTERRUPTIONS
        );
        const interruptionsData = response.documents.map((doc: any) => ({
          successImg: doc.successImg,
          failImg: doc.failImg,
          failMsg: doc.failMsg,
          successMsg: doc.successMsg,
          image: doc.image,
          $id: doc.$id,
          title: doc.title,
          message: doc.message,
          audio: doc.audio,
          failAudio: doc.failAudio,
          successAudio: doc.successAudio,
          failEndMsg: doc.failEndMsg,
          successEndMsg: doc.successEndMsg,
          successEndImg: doc.successEndImg,
        }));
        setInterruptions(interruptionsData);
      } catch (error) {
        console.error("Error loading interruptions:", error);
      }
    };
    fetchInterruptions();
  }, []);

  console.log(interruptions);

  // fetch documents from your app names collection
  useEffect(() => {
    const fetchAppNames = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID_APPNAMES
        );

        if (response.documents.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * response.documents.length
          );
          const randomDoc = response.documents[randomIndex];
          setRandomAppName({
            title: randomDoc.title,
            body: randomDoc.body,
          });
        }
      } catch (error) {
        console.error("Error loading app names:", error);
      }
    };

    fetchAppNames();
  }, []);

  // interruption scheduling with mom mode
  const scheduleRandomInterruptions = () => {
    const totalSeconds = duration * 60;
    const baseInterruptions = momMode === "hardcore" ? 3 : 1;

    const randomMultiplier = momMode === "hardcore" ? 3 : 1;
    const numberOfInterruptions =
      baseInterruptions + Math.floor(Math.random() * randomMultiplier);

    const times = [];
    for (let i = 0; i < numberOfInterruptions; i++) {
      const randomTime = Math.floor(Math.random() * (totalSeconds - 30)) + 15;
      times.push(randomTime);
    }
    scheduledInterruptions.current = times.sort((a, b) => a - b);
  };

  // timer logic with session tracking

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === "running") {
      studySessionData.current = {
        totalDuration: duration * 60,
        interruptionCount: 0,
        successCount: 0,
      };
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          const newTime = prev - 1;
          const elapsed = duration * 60 - newTime;

          // Check for scheduled interruptions
          if (
            scheduledInterruptions.current[0] &&
            elapsed >= scheduledInterruptions.current[0]
          ) {
            triggerInterruption();
            scheduledInterruptions.current.shift();
            studySessionData.current.interruptionCount++;
          }

          if (newTime <= 0) {
            setStatus("completed");
            // Update with actual elapsed time
            studySessionData.current.totalDuration = duration * 60 - newTime;
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, duration]);

  // triggerInterruption function
  const triggerInterruption = async () => {
    setStatus("paused");
    const currentInterruptions = interruptionsRef.current;
    if (currentInterruptions.length === 0) return; // Guard against empty list

    const randomInterruption =
      currentInterruptions[
        Math.floor(Math.random() * currentInterruptions.length)
      ];

    setCurrentInterruption(randomInterruption);
    setOccurredInterruptions((prev) => [...prev, randomInterruption]); // ✅ Now properly updates
    console.log(occurredInterruptions);

    // Play audio
    const audio = new Audio(randomInterruption.audio);
    await audio
      .play()
      .catch((error) => console.log("Audio play failed:", error));
  };

  // Ensure fresh duration value in handlers
  const handleStart = () => {
    scheduleRandomInterruptions();
    setStatus("running");
  };

  const handlePause = () => setStatus("paused");
  const handleContinue = () => setStatus("running");
  const handleReset = () => {
    setStatus("idle");
    setRemainingSeconds(duration * 60);
  };

  // Proper duration adjustment handlers
  const incrementDuration = () => {
    setDuration((d) => {
      const newDuration = d + 1;
      return newDuration;
    });
  };

  const decrementDuration = () => {
    setDuration((d) => {
      const newDuration = Math.max(1, d - 1);
      return newDuration;
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="min-h-screen p-8 bg-sunflower-yellow text-center text-sunflower-brown items-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6 border-5 border-sunflower-amber">
        <h1 className="text-xl font-semibold text-sunflower-brown mb-4">
          🚨 Mom Interruption Sim 🍝
        </h1>
        {randomAppName && (
          <>
            <h2 className="text-3xl font-bold mb-4">
              {randomAppName.title.toUpperCase()}
            </h2>
            <h3 className="mb-8 italic">{randomAppName.body}</h3>
          </>
        )}

        {status === "idle" && (
          <div className="mb-8 flex justify-center gap-4">
            <button
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                momMode === "hardcore"
                  ? "bg-sunflower-orange text-white border-4 border-sunflower-brown"
                  : "bg-gray-200 text-gray-500 border-4 border-gray-400"
              }`}
              onClick={() => setMomMode("hardcore")}
            >
              🔥 Hardcore Mom
            </button>
            <button
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                momMode === "chill"
                  ? "bg-green-500 text-white border-4 border-sunflower-brown"
                  : "bg-gray-200 text-gray-500 border-4 border-gray-400"
              }`}
              onClick={() => setMomMode("chill")}
            >
              🍃 Chill Mom
            </button>
          </div>
        )}

        <div className="time-display mb-8">
          {status === "idle" ? (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={decrementDuration}
                className="text-4xl font-bold h-16 w-16 rounded-full border-5 border-sunflower-amber text-sunflower-brown hover:bg-sunflower-yellow leading-none"
              >
                -
              </button>
              <span className="text-6xl font-bold text-sunflower-brown">
                {duration}
              </span>
              <button
                onClick={incrementDuration}
                className="text-4xl font-bold h-16 w-16 rounded-full border-5 border-sunflower-amber text-sunflower-brown hover:bg-sunflower-yellow leading-none"
              >
                +
              </button>
            </div>
          ) : (
            <div className="text-6xl font-bold text-center text-sunflower-brown">
              {formatTime(remainingSeconds)}
            </div>
          )}
        </div>

        <div className="controls space-y-4">
          {status === "idle" && (
            <button
              onClick={handleStart}
              className="w-full py-4 text-2xl font-bold rounded-xl bg-sunflower-green text-white border-5 border-sunflower-brown hover:bg-green-600 transition-all"
            >
              🎧 START TIMER 🧋
            </button>
          )}

          {status === "running" && (
            <button
              onClick={handlePause}
              className="w-full py-4 text-2xl font-bold rounded-xl bg-blue-500 text-white border-5 border-sunflower-brown hover:bg-blue-600 transition-all"
            >
              ⏸️ PAUSE ⏸️
            </button>
          )}

          {status === "paused" && !currentInterruption && (
            <div className="space-y-4">
              <button
                onClick={handleContinue}
                className="w-full py-4 text-xl font-bold rounded-xl bg-purple-500 text-white border-5 border-sunflower-brown hover:bg-purple-600 transition-all"
              >
                ➡️ CONTINUE STUDYING
              </button>
              <button
                onClick={handleReset}
                className="w-full py-4 text-xl font-bold rounded-xl bg-red-500 text-white border-5 border-sunflower-brown hover:bg-red-600 transition-all"
              >
                😫 GIVE UP AND RESET
              </button>
            </div>
          )}
        </div>

        {status === "completed" && (
          <TimerComplete
            duration={duration}
            interruptionsCount={occurredInterruptions.length}
            occurredInterruptions={occurredInterruptions}
            onRestart={handleReset}
          />
        )}

        {currentInterruption && (
          <Interruption
            title={currentInterruption.title}
            message={currentInterruption.message}
            image={currentInterruption.image}
            successMsg={currentInterruption.successMsg}
            successImg={currentInterruption.successImg}
            failMsg={currentInterruption.failMsg}
            failImg={currentInterruption.failImg}
            failAudio={currentInterruption.failAudio}
            successAudio={currentInterruption.successAudio}
            duration={duration}
            interruptionsCount={occurredInterruptions.length}
            occurredInterruptions={occurredInterruptions}
            onSuccess={() => {
              setCurrentInterruption(null);
              setStatus("running");
            }}
            onFail={() => {
              setCurrentInterruption(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Timer;
