let classifier;
let video;
let canvas;
let ctx;
let label = "Loading...";

// Use your Teachable Machine model URL
const modelURL = "https://teachablemachine.withgoogle.com/models/LHT9iEh1T/";

function setup() {
  // Create the canvas and video elements
  canvas = document.getElementById("canvas");
  canvas.width = 640;
  canvas.height = 520;
  ctx = canvas.getContext("2d");

  video = document.createElement("video");
  video.setAttribute("autoplay", true);
  video.setAttribute("playsinline", true);

  // Start the webcam
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      classifyVideo();
    })
    .catch((err) => {
      console.error("Webcam access error:", err);
    });

  // Load the classifier
  classifier = ml5.imageClassifier(modelURL + "model.json", modelReady);
}

function modelReady() {
  console.log("Model Loaded!");
}

function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // Update the label with the top prediction
  label = results[0].label;
  classifyVideo(); // Keep classifying
}

function draw() {
  // Draw the video feed onto the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Update the label
  document.getElementById("label").innerText = label;
}

// Initialize everything
setup();
setInterval(draw, 30); // Update the canvas at 30 FPS
