import * as handTrack from 'handtrackjs';
import { useRef, useState } from 'react';

const Step2 = () => {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    let trackButtonRef = useRef(null)
    const btnSelectRef = useRef(null)
    const cursorRef = useRef(null)
    const [isVideo, setIsVideo] = useState(false)
    const [model, setModel] = useState(null)

    const modelParams = {
        flipHorizontal: true,   // flip e.g for video  
        maxNumBoxes: 20,        // maximum number of boxes to detect
        iouThreshold: 0.5,      // ioU threshold for non-max suppression
        scoreThreshold: 0.6,    // confidence threshold for predictions.
    }

    const startVideo = () => {
        handTrack.startVideo(videoRef).then(function (status) {
            console.log("video started", status);
            if (status) {
                setIsVideo(true)
                runDetection()
                console.log(" starting video");
            } else {
                console.log("Error starting video");
            }
        });
    }

    const toggleVideo = () => {
        if (!isVideo) {
            startVideo();
        } else {
            handTrack.stopVideo(video)
            setIsVideo(false);
        }
    }
    
    const runDetection = () => {
        console.log("running detection");
        if(model){
            model.detect(video).then(predictions => {
                // console.log("Predictions: ", predictions);
                model.renderPredictions(predictions, canvas, context, video);
        
                predictions.forEach(prediction => {
                    if (prediction.label !== 'face') { // Assurez-vous que la classe 'hand' est correcte
                        console.log(prediction)
                        const [x, y, width, height] = prediction.bbox;
                        console.log(`Main détectée à x: ${x}, y: ${y}, largeur: ${width}, hauteur: ${height}`);
        
                        moveCursor(prediction.bbox, cursor)
                        checkCollision(prediction)   
                    }
                });
        
                if (isVideo) {
                    requestAnimationFrame(runDetection);
                }
            });
        }
    }

    return ( 
        <div>
            <button className="btn" ref={btnSelectRef}>Click me</button>
            <div id="cursor" ref={cursorRef}></div>
            <div className="mb10">
                <button onClick={toggleVideo} ref={trackButtonRef} className="bx--btn bx--btn--secondary" type="button">
                    Toggle Video
                </button>
            </div>
            <video className="videobox canvasbox" autoPlay id="myvideo" ref={videoRef}></video>

            <canvas ref={canvasRef} className="border canvasbox"></canvas>

        </div>
     );
}
 
export default Step2;