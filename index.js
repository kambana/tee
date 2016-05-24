// Enter your Sonarr URL including port
var sonarr_url = "http://localhost:8989";
// Enter your Sonarr API key
var sonarr_apikey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// Enter your TorrentLeech RSS key
var rss_key = "xxxxxxxxxxxxxxxxxxxx";

var request = require('request');
var irc = require('irc');

var reg = new RegExp('(?:New Torrent Announcement: <)(.*?)(?: :: )(.*?)(?:>  Name:\')(.*?)(?:\').*?(?:https://www.torrentleech.org/torrent/)([0-9]+)',["i"]);

var client = new irc.Client('irc.torrentleech.org', 'torrentleech2sonarr_bot', {
    port: 7011,
    channels: ['#tlannounces'],
    showErrors: true,
    autoRejoin: true,
    autoConnect: true,
    stripColors: true
});

client.addListener('message#tlannounces', function (from, message) {
    console.log(message);
    var o = reg.exec(message)
    if(o && o[1] == 'TV'){
        request.post(sonarr_url+'/api/release/push?apikey='+sonarr_apikey,{
            form: {
                title: o[3],
                downloadUrl: 'https://www.torrentleech.org/rss/download/'+o[4]+'/'+rss_key+'/'+o[3]+'.torrent',
                protocol: 'Torrent',
                publishDate: new Date().toISOString()
            }
        },function(err,httpResponse,body){
            if(err) console.warn(err);
            console.log(body);
        });
    } else {
        console.info("Not TV");
    }
});
client.addListener('error', function(message) {
    console.log('error: ', message);
});

