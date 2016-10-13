setTimeout(function() {
    videojs('video1', {}, function() {
        let tracks = this.textTracks();
        let metadataTrack;
        let disp = document.getElementById("display");
        let dict = document.getElementById("dictionary");

        for (let i = 0; i < tracks.length; i++) {
            let track = tracks[i];

            // find the metadata track that's labeled ads
            if (track.kind === 'captions' && track.label === 'English') {
                track.mode = 'hidden';
                // store it for usage outside of the loop
                metadataTrack = track;
            }
        }
        
        metadataTrack.addEventListener('cuechange', function() {
            let myTrack = this;             // track element is "this" 
            let myCues = myTrack.activeCues;      // activeCues is an array of current cues.                                                    
            if (myCues.length > 0) {
                disp.innerText = myCues[0].text;
                disp.innerHTML = disp.innerHTML.replace(/\b(\w+?)\b(?![^<]*>)/g, '<span class="clickable">$1</span>');
                $('.clickable').click(function(e) { 
                    let word = e.target.innerText.toLowerCase()
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
                        'crossDomain' : true,
                        // 'success': function(data) {
                        //     dict.innerHTML = JSON.stringify(data.tuc[0].meanings);
                        // },
                        'success': function(data) {
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
}, 0); 