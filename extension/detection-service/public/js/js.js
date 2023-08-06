const videoElement = document.getElementsByClassName('input_video')[0];
let send = false;
videoElement.style.display = 'none';
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
let token = document.getElementById('token').textContent;
let x =0;
let zeros = new Array(21).fill(0);
let resetSentence = +document.getElementById('resetSentence').textContent;
let newReqEvery = +document.getElementById('newReqEvery').textContent;
setInterval(() => {
    send= !send;
}, newReqEvery);
let sentence = [];
setInterval(() => {
    sentence= [];
}, resetSentence);
//remove the v and update the server
function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
            {color: '#FF5959', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FACF5A', lineWidth: 3});
        }
    }
    canvasCtx.restore();
    if(results.multiHandLandmarks.length == 0) return;
    if(!send) return;
    if(results.multiHandLandmarks.length == 1){
        let x = [...results.multiHandLandmarks[0].map(e=> e.x), ...zeros];
        let y = [...results.multiHandLandmarks[0].map(e=> e.y), ...zeros];
        let z = [...results.multiHandLandmarks[0].map(e=> e.z), ...zeros];
        // let v = [...results.multiHandLandmarks[0].map(e=> 0), ...zeros];
        let data = {x, y, z};
        (async () => {
            try{
            send = false;
            const rawResponse = await fetch('https://hand-sign-detection-extension.herokuapp.com/api', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const content = await rawResponse.json();
            if(sentence[sentence.length-1] == content.result.class) return;
            sentence.push(content.result.class);
            document.querySelector('.translate').textContent = sentence.join(' ');
            await fetch(`/hoster/update/${token}`, {
                method: 'PATCH',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "sentence": sentence
                })
            });
            }catch(er){
            console.log(er)
            }
        })();
        return;
    }
    let x = [...results.multiHandLandmarks[0].map(e=> e.x), ...results.multiHandLandmarks[1].map(e=> e.x)];
    let y = [...results.multiHandLandmarks[0].map(e=> e.y), ...results.multiHandLandmarks[1].map(e=> e.y)];
    let z = [...results.multiHandLandmarks[0].map(e=> e.z), ...results.multiHandLandmarks[1].map(e=> e.z)];
    // let v = [...results.multiHandLandmarks[0].map(e=> 0), ...results.multiHandLandmarks[1].map(e=> 0)];
    let data = {x, y, z};
    (async () => {
        try{
        send = false;
        const rawResponse = await fetch('https://hand-sign-detection-extension.herokuapp.com/api', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const content = await rawResponse.json();
        if(sentence[sentence.length-1] == content.result.class) return;
        sentence.push(content.result.class);
        document.querySelector('.translate').textContent = sentence.join(' ');
        await fetch(`/hoster/update/${token}`, {
            method: 'PATCH',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "sentence": sentence
            })
        });
        }catch(er){
        console.log(er)
        }
    })();
}
const hands = new Hands({locateFile: (file) => {
return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
maxNumHands: 2,
modelComplexity: 1,
minDetectionConfidence: 0.8,
minTrackingConfidence: 0.5
});
hands.onResults(onResults);
const camera = new Camera(videoElement, {
onFrame: async () => {
await hands.send({image: videoElement});
},
width: canvasElement.width,
height: canvasElement.height
});
camera.start();
