var app = require('express')();
app.set('trust proxy fn', [
    // Ipv4
    '103.21.244.0/22',
    '103.22.200.0/22',
    '103.31.4.0/22',
    '104.16.0.0/12',
    '108.162.192.0/18',
    '131.0.72.0/22',
    '141.101.64.0/18',
    '162.158.0.0/15',
    '172.64.0.0/13',
    '173.245.48.0/20',
    '188.114.96.0/20',
    '190.93.240.0/20',
    '197.234.240.0/22',
    '198.41.128.0/17',
    '199.27.128.0/21',
    // Ipv6
    '2400:cb00::/32',
    '2405:8100::/32',
    '2405:b500::/32',
    '2606:4700::/32',
    '2803:f800::/32',
]);
var http = require('http').Server(app);
var io = require('socket.io')(http);

var redisc = require('redis');

var host = process.env.REDIS_PORT_6379_TCP_ADDR || 'redis';
var port = process.env.REDIS_PORT_6379_TCP_PORT || 6379;

var redis = redisc.createClient(port, host);
redis.subscribe('chat', function(err, count) {
	console.log('dinleniyor..');
});
redis.on('message', function(channel, message) {
    console.log('Message Recieved: ' + message);
    message = JSON.parse(message);
	
    //Send this event to everyone in the room.
    io.emit(message.channel, message.data);
    
});

app.set('port', process.env.PORT || 3000);

http.listen(app.get('port'), function(){
    console.log('Listening on Port ' + app.get('port'));
});
