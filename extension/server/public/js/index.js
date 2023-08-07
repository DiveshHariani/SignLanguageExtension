const $9fe55b1c430502c2$var$videoElement = document.getElementsByClassName('input_video')[0];
let $9fe55b1c430502c2$var$send = false;
$9fe55b1c430502c2$var$videoElement.style.display = 'none';
const $9fe55b1c430502c2$var$canvasElement = document.getElementsByClassName('output_canvas')[0];
const $9fe55b1c430502c2$var$canvasCtx = $9fe55b1c430502c2$var$canvasElement.getContext('2d');
let $9fe55b1c430502c2$var$token = document.getElementById('token').textContent;
let $9fe55b1c430502c2$var$x = 0;
let $9fe55b1c430502c2$var$zeros = new Array(21).fill(0);
let $9fe55b1c430502c2$var$resetSentence = +document.getElementById('resetSentence').textContent;
let $9fe55b1c430502c2$var$newReqEvery = +document.getElementById('newReqEvery').textContent;
setInterval(()=>{
    $9fe55b1c430502c2$var$send = !$9fe55b1c430502c2$var$send;
}, $9fe55b1c430502c2$var$newReqEvery);
let $9fe55b1c430502c2$var$sentence = [];
setInterval(()=>{
    $9fe55b1c430502c2$var$sentence = [];
}, $9fe55b1c430502c2$var$resetSentence);
function $9fe55b1c430502c2$var$onResults(results) {
    $9fe55b1c430502c2$var$canvasCtx.save();
    $9fe55b1c430502c2$var$canvasCtx.clearRect(0, 0, $9fe55b1c430502c2$var$canvasElement.width, $9fe55b1c430502c2$var$canvasElement.height);
    $9fe55b1c430502c2$var$canvasCtx.drawImage(results.image, 0, 0, $9fe55b1c430502c2$var$canvasElement.width, $9fe55b1c430502c2$var$canvasElement.height);
    if (results.multiHandLandmarks) for (const landmarks of results.multiHandLandmarks){
        drawConnectors($9fe55b1c430502c2$var$canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: '#FF5959',
            lineWidth: 5
        });
        drawLandmarks($9fe55b1c430502c2$var$canvasCtx, landmarks, {
            color: '#FACF5A',
            lineWidth: 3
        });
    }
    $9fe55b1c430502c2$var$canvasCtx.restore();
    if (results.multiHandLandmarks.length == 0) return;
    if (!$9fe55b1c430502c2$var$send) return;
    if (results.multiHandLandmarks.length == 1) {
        let x = [
            ...results.multiHandLandmarks[0].map((e)=>e.x
            ),
            ...$9fe55b1c430502c2$var$zeros
        ];
        let y = [
            ...results.multiHandLandmarks[0].map((e)=>e.y
            ),
            ...$9fe55b1c430502c2$var$zeros
        ];
        let z = [
            ...results.multiHandLandmarks[0].map((e)=>e.z
            ),
            ...$9fe55b1c430502c2$var$zeros
        ];
        let v = [
            ...results.multiHandLandmarks[0].map((e)=>0
            ),
            ...$9fe55b1c430502c2$var$zeros
        ];
        let data = {
            x: x,
            y: y,
            z: z
        };
        (async ()=>{
            try { 
                //API Base: https://sih-handsign-detection-api.wl.r.appspot.com/
                $9fe55b1c430502c2$var$send = false;
                console.log(JSON.stringify(data));
                const rawResponse = await fetch('https://sih-handsign-detection-api.wl.r.appspot.com/api', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const content = await rawResponse.json();
                console.log("content", content);
                if ($9fe55b1c430502c2$var$sentence[$9fe55b1c430502c2$var$sentence.length - 1] == content.result.class) return;
                $9fe55b1c430502c2$var$sentence.push(content.result.class);
                document.querySelector('.translate').textContent = $9fe55b1c430502c2$var$sentence.join(' ');
                await fetch(`/hoster/update/${$9fe55b1c430502c2$var$token}`, {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "sentence": $9fe55b1c430502c2$var$sentence
                    })
                });
            } catch (er) {
                console.log(er);
            }
        })();
        return;
    }
    let x = [
        ...results.multiHandLandmarks[0].map((e)=>e.x
        ),
        ...results.multiHandLandmarks[1].map((e)=>e.x
        )
    ];
    let y = [
        ...results.multiHandLandmarks[0].map((e)=>e.y
        ),
        ...results.multiHandLandmarks[1].map((e)=>e.y
        )
    ];
    let z = [
        ...results.multiHandLandmarks[0].map((e)=>e.z
        ),
        ...results.multiHandLandmarks[1].map((e)=>e.z
        )
    ];
    let v = [
        ...results.multiHandLandmarks[0].map((e)=>0
        ),
        ...results.multiHandLandmarks[1].map((e)=>0
        )
    ];
    let data = {
        x: x,
        y: y,
        z: z
    };
    (async ()=>{
        try {
            $9fe55b1c430502c2$var$send = false;
            const rawResponse = await fetch('https://sih-handsign-detection-api.wl.r.appspot.com/api', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const content = await rawResponse.json();
            if ($9fe55b1c430502c2$var$sentence[$9fe55b1c430502c2$var$sentence.length - 1] == content.result.class) return;
            $9fe55b1c430502c2$var$sentence.push(content.result.class);
            document.querySelector('.translate').textContent = $9fe55b1c430502c2$var$sentence.join(' ');
            await fetch(`/hoster/update/${$9fe55b1c430502c2$var$token}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "sentence": $9fe55b1c430502c2$var$sentence
                })
            });
        } catch (er) {
            console.log(er);
        }
    })();
}
const $9fe55b1c430502c2$var$hands = new Hands({
    locateFile: (file)=>{
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
$9fe55b1c430502c2$var$hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.5
});
$9fe55b1c430502c2$var$hands.onResults($9fe55b1c430502c2$var$onResults);
const $9fe55b1c430502c2$var$camera = new Camera($9fe55b1c430502c2$var$videoElement, {
    onFrame: async ()=>{
        await $9fe55b1c430502c2$var$hands.send({
            image: $9fe55b1c430502c2$var$videoElement
        });
    },
    width: $9fe55b1c430502c2$var$canvasElement.width,
    height: $9fe55b1c430502c2$var$canvasElement.height
});
$9fe55b1c430502c2$var$camera.start();


//# sourceMappingURL=index.js.map
