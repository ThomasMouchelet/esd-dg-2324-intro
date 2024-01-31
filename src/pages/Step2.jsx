// import * as handTrack from 'handtrackjs';
import { useEffect, useRef, useState } from "react";

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
};

const Step2 = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [contextState, setContextState] = useState(null);

  useEffect(() => {
    // Load the model.
    handTrack.load(modelParams).then((lmodel) => {
      // detect objects in the image.
      setModel(lmodel);
    });
  }, []);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    setContextState(context);
  }, [canvasRef]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          handTrack
            .startVideo(videoRef.current)
            .then((status) => console.log("video started", status));
        }
      })
      .catch((err) => console.error("err", err));
  };

  const runDetection = () => {
    if (model) {
      model.detect(videoRef.current).then((predictions) => {
        model.renderPredictions(
          predictions,
          canvasRef.current,
          contextState,
          videoRef.current
        );

        predictions.forEach((prediction) => {
          if (prediction.label !== "face") {
            const [x, y, width, height] = prediction.bbox;
            console.log(
              `Main détectée à x: ${x}, y: ${y}, largeur: ${width}, hauteur: ${height}`
            );
          }
        });

        requestAnimationFrame(runDetection);
      });
    }
  };

  return (
    <div>
      <div className="mb10">
        <button onClick={startVideo}>Start video</button>
      </div>

      <video
        ref={videoRef}
        width="720"
        height="560"
        autoPlay
        muted
        className="videobox canvasbox"
        onPlay={runDetection}
      ></video>

      <canvas ref={canvasRef} className="border canvasbox"></canvas>
    </div>
  );
};

export default Step2;
