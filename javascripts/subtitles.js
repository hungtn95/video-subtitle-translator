$.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toLowerCase().match(`^${arg.toLowerCase()}$`);
    };
});

function updateCaption(captionLanguage, placeHolder) {
  videojs('video1', {}, function () {
    let tracks = this.textTracks();
    let metadataTrack;
    let disp = document.getElementById(placeHolder);
    let dict = document.getElementById("dictionary");

    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];

      // find the metadata track that's labeled ads
      if (track.kind === 'captions' && track.label === captionLanguage) {
        track.mode = 'showing';
        track.mode = 'hidden';
        // store it for usage outside of the loop
        metadataTrack = track;
      }
    }

    metadataTrack.addEventListener('cuechange', function () {
      let myTrack = this;             // track element is "this" 
      let myCues = myTrack.activeCues;      // activeCues is an array of current cues.                                                    
      if (myCues.length > 0) {
        disp.innerText = myCues[0].text;
        disp.innerHTML = disp.innerHTML.replace(/\b(\w+?)\b(?![^<]*>)/g, '<span class="word">$1</span>');
        $('.word').click(function (e) {
          $('.word.active').removeClass('active');
          let word = e.target.innerText.toLowerCase();
          $(`.word:textEquals(${word})`).addClass('active');
          
          $.ajax({
            //The URL to process the request
            url: 'https://glosbe.com/gapi/translate?',
            type: 'GET',
            async: true,
            dataType: 'jsonp',   //you may use jsonp for cross origin request
            data: {
              from: 'eng',
              dest: 'eng',
              format: 'json',
              phrase: word,
              pretty: 'true'
            },
            'crossDomain': true,
            // 'success': function(data) {
            //     dict.innerHTML = JSON.stringify(data.tuc[0].meanings);
            // },
            'success': function (data) {
              $('#dictionary').empty();
              $('#dictionary').append("<h2 id='word'>" + word + "</h2>");
              $('#dictionary').append("<ol id='definitionList'></ol>");
              let def = data.tuc[0].meanings;
              let i = 0;
              for (; i < def.length; i++) {
                $("#definitionList").append("<li>" + def[i].text + "</li>");
              }
            }
          });
        });
      } else {
        disp.innerHTML = "";
        dict.innerHTML = "";
      }
    });
  });
}

setTimeout(function () {
  updateCaption('Espanol', 'display1');
  updateCaption('English', 'display2');
}, 0); 