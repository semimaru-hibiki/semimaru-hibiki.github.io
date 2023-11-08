/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;

const codecPreferences = document.querySelector('#codecPreferences');

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');


async () => {
  document.querySelector('button#start').disabled = true;
  const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
  const constraints = {
    audio: {
      echoCancellation: {exact: hasEchoCancellation}
    },
    video: {
      width: 1280, height: 720
    }
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
}
setInterval(() => {com_exist();}, 3000);
  //音声認識開始
  window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
		const speech = new window.SpeechRecognition();
		speech.lang = 'ja-JP';
		speech.continuous = true;
	    const content = document.getElementById('speach_text_content');
	
    speech.start();

	  //音声認識結果
    speech.onresult = function(e) {
		let now_time = new Date();
		speech.stop();
			if(e.results[0].isFinal){
				var autotext =  e.results[0][0].transcript
        if(autotext == '録画開始'){
          com_file("rec_start");
          startRecording();
        }
        if(autotext == '録画 停止'){
          com_file("rec_end");
          stopRecording();
          recordButton.textContent = '録画開始';
          playButton.disabled = false;
          downloadButton.disabled = false;
          codecPreferences.disabled = false;
        }
        if(autotext == 'カメラ 準備'){
          com_file("rec_ready");
          document.querySelector('button#start').disabled = true;
          const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
          const constraints = {
          audio: {
            echoCancellation: {exact: hasEchoCancellation}
          },
          video: {
            width: 1280, height: 720
          }
        };
        console.log('Using media constraints:', constraints);
        init(constraints);
        }
				content.innerHTML = '<div class="speach_text_messagebox">【 認識 】 <br>' + autotext +'<span id="translate" style="color:#ff0;"></span></div>';


			 }
		}

		speech.onend = () => { 
		   speech.start() 
		};
    
//録画ボタン    
recordButton.addEventListener('click', () => {
  if (recordButton.textContent === '録画開始') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = '録画開始';
    playButton.disabled = false;
    downloadButton.disabled = false;
    codecPreferences.disabled = false;
  }
});

//再生ボタン
const playButton = document.querySelector('button#play');
playButton.addEventListener('click', () => {
  const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value.split(';', 1)[0];
  const superBuffer = new Blob(recordedBlobs, {type: 'video/webem'});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});

//ダウンロードボタン
const downloadButton = document.querySelector('button#download');
downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function getSupportedMimeTypes() {
  const possibleTypes = [
    'video/webm;codecs=vp8,opus',
    'video/mp4;codecs=h264,aac',
  ];
  return possibleTypes.filter(mimeType => {
    return MediaRecorder.isTypeSupported(mimeType);
  });
}

//録画開始
function startRecording() {
  recordedBlobs = [];
  const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value;
  const options = {mimeType};
  com_file("rec_start");


  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  //録画ボタン
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = '録画停止';
  playButton.disabled = true;
  downloadButton.disabled = true;
  codecPreferences.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);

    const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value.split(';', 1)[0];
    const superBuffer = new Blob(recordedBlobs, {type: 'video/webem'});
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
  
    var now = new Date();
    var dateYear    = now.getFullYear();
    var dateMonth   = now.getMonth() + 1;
    var dateDay     = now.getDate();
    var dateWeek    = now.getDay();
    var timeHour    = now.getHours();
    var timeMinutes = now.getMinutes();
    var result      = '';
    // 文字列の結合
    result  = dateYear + '_' + dateMonth + '_' +  dateDay + '_' +  timeHour + '_' +  timeMinutes;

    const blob = new Blob(recordedBlobs, {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = result+'.webm';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      com_file("rec_upload");
    }, 100);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

//録画停止
function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;

  getSupportedMimeTypes().forEach(mimeType => {
    const option = document.createElement('option');
    option.value = mimeType;
    option.innerText = option.value;
    codecPreferences.appendChild(option);
  });
  codecPreferences.disabled = false;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
  document.querySelector('button#start').disabled = true;
  const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
  const constraints = {
    audio: {
      echoCancellation: {exact: hasEchoCancellation}
    },
    video: {
      width: 1280, height: 720
    }
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
  let s = com_exist();
});

function com_file(com){
	let xhr = new XMLHttpRequest();
	xhr.open('POST', './php/file.php', true);
	xhr.responseType = 'json'; //JSON形式で取得
	xhr.addEventListener('load', function(event) {
		console.log(xhr.response.com_name);

	});
	let fd = new FormData();
	fd.append("name","../com_file/" + com);
	xhr.send(fd);
}

function com_exist(){
	let xhr = new XMLHttpRequest();
	xhr.open('POST', './php/exist.php', true);
	xhr.responseType = 'json'; //JSON形式で取得
	xhr.addEventListener('load', function(event) {
		console.log(xhr.response.com_name);
    // JavaScriptからAndroidへ
    android.MyMethod(xhr.response.com_name);
    return xhr.response.com_name;
	});
	let fd = new FormData();
	fd.append("name","../com_file/");
	xhr.send(fd);
}
