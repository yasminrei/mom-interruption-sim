import { useState, useEffect, useRef } from "react";
import { InterruptionType } from "@/pages/Timer";

type InterruptionProps = {
  title: string;
  message: string;
  image: string;
  successMsg: string;
  successImg: string;
  failMsg: string;
  failImg: string;
  onSuccess: () => void;
  onFail: () => void;
  failAudio: string;
  successAudio: string;
  duration: number;
  interruptionsCount: number;
  occurredInterruptions: InterruptionType[];
};

const Interruption = ({
  title,
  message,
  image,
  successMsg,
  successImg,
  failMsg,
  failImg,
  onSuccess,
  onFail,
  failAudio,
  successAudio,
  duration,
  interruptionsCount,
  occurredInterruptions,
}: InterruptionProps) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [taps, setTaps] = useState(0);
  const [tapsRequired] = useState(() => 5 + Math.floor(Math.random() * 3)); // Stable random value
  const [outcome, setOutcome] = useState<"pending" | "success" | "fail">(
    "pending"
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSuccess = () => {
    onSuccess();
  };
  const handleFail = () => {
    onFail();
  };

  // Handle tap interactions
  const handleTap = () => {
    setTaps((prev) => {
      const newTaps = prev + 1;
      if (newTaps >= tapsRequired && outcome === "pending") {
        setOutcome("success");
        clearInterval(timerRef.current as NodeJS.Timeout);
        setTimeout(handleSuccess, 3000);
      }
      return newTaps;
    });
  };

  // Countdown timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (taps < tapsRequired && outcome === "pending") {
            setOutcome("fail");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Keep only this useEffect for audio
  useEffect(() => {
    if (outcome === "pending") return;

    const audio = new Audio(outcome === "success" ? successAudio : failAudio);
    audio.play();

    return () => {};
  }, [outcome, successAudio, failAudio]);

  // Add audio preloading
  // Fix audio initialization issues
  useEffect(() => {
    const successAudioObj = new Audio(successAudio);
    const failAudioObj = new Audio(failAudio);

    if (outcome === "pending") {
      successAudioObj.preload = "auto";
      failAudioObj.preload = "auto";
    }

    return () => {
      successAudioObj.pause();
      failAudioObj.pause();
    };
  }, [successAudio, failAudio, outcome]); // Add explicit dependencies

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

    return randomInterruption.failEndMsg
      .replace("{duration}", `${duration} ${durationWord}`)
      .replace("{interruptions}", `${interruptionsCount} ${interruptionsWord}`)
      .replace(
        "{momInterruptions}",
        `${interruptionsCount} ${momInterruptionsWord}`
      );
  };

  const handleShare = () => {
    const shareMessage = getShareMessage();
    if (!shareMessage) return;

    const twitterText = encodeURIComponent(shareMessage);
    window.open(`https://twitter.com/intent/tweet?text=${twitterText}`);
  };

  // Success component
  if (outcome === "success") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border-5 border-sunflower-amber max-w-md w-full mx-4 text-center">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4">
            <img
              src={successImg}
              alt="Success meme"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-2xl font-bold text-sunflower-brown mb-4">
            {successMsg}
          </h2>
          <div className="text-lg text-sunflower-brown animate-pulse">
            Resuming your study session in 3 seconds...
          </div>
        </div>
      </div>
    );
  }

  // Failure component
  if (outcome === "fail") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border-5 border-sunflower-amber max-w-md w-full mx-4 text-center">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4">
            <img
              src={failImg}
              alt="Failure meme"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-2xl font-bold text-sunflower-brown mb-6">
            {failMsg}
          </h2>
          <div className="flex gap-4 justify-center">
            <button
              className="px-6 py-3 bg-red-500 text-white rounded-lg border-3 border-sunflower-brown hover:bg-red-600 transition-all"
              onClick={handleFail}
            >
              🔄 Restart Timer
            </button>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg border-3 border-sunflower-brown hover:bg-blue-600 transition-all"
              onClick={handleShare}
            >
              📤 Share Failure
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
  }

  // Active interruption component
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border-5 border-sunflower-amber max-w-md w-full mx-4">
        <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4">
          <img
            src={image}
            alt="Interruption meme"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-4 text-sunflower-brown">
          🚨 {title} 🚨
        </h2>
        <p className="text-xl text-center mb-6 text-sunflower-brown">
          {message}
        </p>

        <div className="bg-sunflower-yellow rounded-xl p-4 border-5 border-sunflower-brown mb-6">
          <p className="text-lg font-semibold text-center mb-4 text-sunflower-brown">
            Quick! Tap {tapsRequired} times to survive! 👆
          </p>
          <div
            className="bg-white rounded-lg p-6 cursor-pointer active:scale-95 transition-transform border-4 border-sunflower-amber"
            onClick={handleTap}
          >
            <div className="flex justify-between items-center text-sunflower-brown">
              <span className="text-lg font-bold">
                TAPS: {taps}/{tapsRequired}
              </span>
              <span className="text-red-600 font-bold">{timeLeft}s LEFT!</span>
            </div>
          </div>
        </div>

        {/* <p className="text-center text-sm italic text-sunflower-brown">
          Click like your grades depend on it! 🖱️💥
        </p> */}
      </div>
    </div>
  );
};

export default Interruption;
