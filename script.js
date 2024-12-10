const URL = "https://teachablemachine.withgoogle.com/models/zrdbuDJE5/";

let model, webcam, labelContainer, maxPredictions;
let previousLabel = "";
let stableLabel = "";
let stableLabelCount = 0;
let isMuted = false; // Flag to control muting

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip); // Create webcam object
    await webcam.setup(); // Setup webcam
    await webcam.play(); // Start webcam
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas); // Add webcam canvas
    labelContainer = document.getElementById("label-container");

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }



}

async function loop() {
    webcam.update(); // Update webcam image
    await predict(); // Make predictions
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let currentLabel = "";
    let highestProbability = 0;

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
        labelContainer.childNodes[i].innerHTML = classPrediction;

        if (prediction[i].probability > highestProbability) {
            highestProbability = prediction[i].probability;
            currentLabel = prediction[i].className;
        }
    }

    if (highestProbability > 0.9) {
        if (currentLabel === stableLabel) {
            stableLabelCount++;
        } else {
            stableLabel = currentLabel;
            stableLabelCount = 1;
        }

        if (stableLabelCount >= 3 && currentLabel !== previousLabel) {
            speakLabel(currentLabel);
            previousLabel = currentLabel;
        }
    }
}

function speakLabel(label) {
    const utterance = new SpeechSynthesisUtterance(label);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}
