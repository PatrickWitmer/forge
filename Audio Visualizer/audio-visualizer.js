// First, we ask if we can use the computer's microphone.
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(function (stream) {
    // Here we're setting up an audio context, which is like creating a space where we can work with the audio.
    const audioContext = new AudioContext();

    // Now, we grab the audio coming in from the microphone.
    const source = audioContext.createMediaStreamSource(stream);

    // We're setting up an analyzer to understand the audio, like figuring out its volume and pitch.
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // This is about how detailed our analysis is. A smaller number means less detail but faster processing.
    const bufferLength = analyser.frequencyBinCount; // This is how many pieces of data we get from our analysis.
    const dataArray = new Uint8Array(bufferLength); // This is where we'll store the data we analyze.

    // We connect our microphone's audio to the analyzer, so it can start doing its work.
    source.connect(analyser);

    // We're grabbing the canvas from our HTML, so we can draw our visualization on it.
    const canvas = document.getElementById('visualizer');
    const canvasCtx = canvas.getContext('2d');

    // This function is where the magic happens. We draw our visualization based on the audio data.
    function draw() {
      // We ask the browser to run this function over and over, making our visualization animate.
      requestAnimationFrame(draw);

      // Here, we get the current data from our analyzer.
      analyser.getByteFrequencyData(dataArray);

      // We're making the background of our canvas black.
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      // We calculate the width of each bar in our visualizer.
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0; // This will keep track of where to draw each bar.

      // Now, we go through our data and draw a bar for each piece of data.
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i]; // This determines the height of our bar.

        // We pick a color for our bar.
        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        // And finally, we draw the bar on the canvas.
        canvasCtx.fillRect(
          x,
          canvas.height - barHeight / 2,
          barWidth,
          barHeight
        );

        // We move to the right for the next bar.
        x += barWidth + 1;
      }
    }

    // We start our visualization by calling our drawing function for the first time.
    draw();
  })
  .catch(function (err) {
    // If we can't access the microphone, we'll see an error in the console.
    console.error('Error accessing microphone:', err);
  });
