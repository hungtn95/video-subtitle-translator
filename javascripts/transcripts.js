setTimeout(function () {
  videojs('video1', {}, function () {
    // Set up any options.
    let options = {
      showTitle: false,
      showTrackSelector: true,
    };

    // Initialize the plugin.
    let transcript = this.transcript(options);

    // Then attach the widget to the page.
    let transcriptContainer = document.querySelector('#transcript');
      transcriptContainer.appendChild(transcript.el()); 
  });
});