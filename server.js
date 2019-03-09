const path = require('path');
const express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
const updateFile = require('./update');


const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.send('Welcome to the future');
});

io.on('connection', (socket) => {

    console.log('user connected');

    socket.on('join', (data) => {
        var getAllInfo = updateFile.getAllData(data['file']);
        const eventName = 'InformData' + data['file'];
        io.emit(eventName, getAllInfo);
    });

    socket.on('handshake', (data) => {
        //console.log(data);
        console.log('--- handshake --', data['file']);
        var getAllInfo = updateFile.getAllData(data['file']);
        const eventName = 'handshake' + data['file'] + data['uniqueId'];
        io.emit(eventName, getAllInfo);
    });

    socket.on('userMac', (data) => {
        console.log(data);
        updateFile.insertUniqueId(data);
    });

    socket.on('loginconfirm', (id, email, pass) => {
        console.log('-- login request --', id, email, pass);
        var proj = updateFile.validateEmail(id, email, pass);
        //console.log('sucessfully get', proj);
        const event = 'InformLogin' + id;
        io.emit(event, proj);
    });

    // arduino request
    socket.on('1stRequest', (data) => {
        console.log(data);
        let getData = updateFile.getDataArduino(data['file'], data['device']);
        getData['file'] = data['file'];
        getData['device'] = data['device'];

        getData['day'] = (new Date).getDay() + 1;
        getData['month'] = (new Date).getMonth() + 1;
        getData['year'] = (new Date).getFullYear();

        getData['hr'] = (new Date).getHours();
        getData['min'] = (new Date).getMinutes();
        getData['sec'] = (new Date).getSeconds();

        console.log('get result from server', getData);
        const event = 'Inform1stRequest' + data['file'];
        io.emit(event, getData);
    });


    socket.on('changesOccur', (data) => {
        console.log('changes occur', data['file'],data['device'] ,  data['status']);
        let changeStatusEvent = 'InformtoAllUser' + data['file'];
        io.emit(changeStatusEvent, data);
        setTimeout(() => {
            updateFile.updateStatus(data['file'], data['device'], data['status']);
        }, 0);
    });

    socket.on('changesOccurArduino', (data) => {
        console.log('changes occur', data['file'], data['status']);
        let changeStatusEvent = 'InformtoAllUser' + data['file'];
        socket.broadcast.emit(changeStatusEvent, data);
        setTimeout(() => {
            updateFile.updateStatus(data['file'], data['device'], data['status']);
        }, 0);
    });



    socket.on('changeLabel', (data) => {
        console.log('--change label--', data['file'], data['label']);
        let changeLableEvent = 'InformLabel' + data['file'];
        io.emit(changeLableEvent, data);
        setTimeout(() => {
            updateFile.updateLabel(data['file'], data['device'], data['label']);
        }, 0);
    });

    socket.on('changeCategory', (data) => {
        console.log('--change category--', data['file'], data['category']);
        let changeLableEvent = 'InformCategory' + data['file'];
        socket.broadcast.emit(changeLableEvent, data);
        setTimeout(() => {
            updateFile.updateCategory(data['file'], data['device'], data['category']);
        }, 0);
    });

    socket.on('changeSch', (data) => {
        console.log('--change schedular--', data['file'], data['device'], data['status']);
        let schEvent = 'InformSch' + data['file'];
        socket.broadcast.emit(schEvent, data);
        setTimeout(() => {
            if (data['sch'] == 'on') {
                updateFile.updateSchON(data['file'], data['device'], data['sch'], data['status'], data['hrs'], data['min'], data['day']);
            }
            if (data['sch'] == 'off') {
                updateFile.updateSchOFF(data['file'], data['device'], data['sch'], data['status'], data['hrs'], data['min'], data['day']);
            }
        }, 0);


    });

    socket.on('changeWatt', (data) => {
        console.log('--change watt--', data['file'], data['watt']);
        let wattEvent = 'InformWatt' + data['file'];
        socket.broadcast.emit(wattEvent, data);
        setTimeout(() => {
            updateFile.updateWatt(data['file'], data['device'], data['watt']);
        }, 0);

    });

    socket.on('clearSch', (data) => {
        console.log('--clear schedular--', data['file']);
        let clearEvent = 'InformClearSch' + data['file'];
        socket.broadcast.emit(clearEvent, data);
        setTimeout(() => {
            updateFile.clearSch(data['file'], data['device']);
        }, 0);
    });

    socket.on("addNewCategory", (data) => {
        console.log('-=add new category--', data['file'], data['cat']);
        socket.broadcast.emit('InformNewCat' + data['file'], data);
        updateFile.addNewCategory(data['file'], data['cat']);
    });

    socket.on('delCategory', (data) => {
        console.log('--del category--', data['file'], data['delcat']);
        socket.broadcast.emit("infoDelCat" + data['file'], data);
        updateFile.delCategory(data['file'], data['delcat']);
    });

    socket.on('configDevice', (data) => {
        console.log('--------------------');
        console.log(data);
        const message = updateFile.configDevice(data['file'], data['device'], data['config']);
        //  let message = { id: "atoswitch1", status: "OFF", configuration: "yes", label: "asdfg", category: "Room", image: "3", schedular: "off", type: "atoswitch", watt: "0.00" };
        setTimeout(() => {
            console.log('send config socket event');
            io.emit('informConfig' + data['file'], message);
        }, 3000);

    });

    socket.on('ResetDevice', (data) => {
        console.log('--reset device--', data['file'], data['config']);
        io.emit('informResetDev' + data['file'], data);
        updateFile.resetDevice(data['file'], data['device'], data['config']);
    });

    socket.on('changeImage', (data) => {
        console.log('--change image--', data['file'], data['img']);
        // console.log(data);
        socket.broadcast.emit('infoImgChange' + data['file'], data);
        updateFile.changeImage(data['file'], data['device'], data['img']);
    });

    socket.on('updateSchStatus', (data) => {
        console.log('--update schedular status--', data['file'], data['device']);
        updateFile.updateSchStatus(data['file'], data['device'], data);
        io.emit('informSchStatus' + data['file'], data);
    });

    socket.on('schedularOn', (data) => {
        console.log('--schedular on--', data['file'], data['device']);
        updateFile.updateSchOnList(data['file'], data['device'], data);
        io.emit('InformSchOn' + data['file'], data);
    });

    socket.on('schedularOff', (data) => {
        console.log('--schedular off--', data['file'], data['device']);
        updateFile.updateSchOffList(data['file'], data['device'], data);
        io.emit('InformSchOff' + data['file'], data);
    });

    socket.on('changePassword', (data) => {
        console.log('--change password--', data['file'], data['email'], data['newPass']);
        const res = updateFile.changePassword(data['file'], data['email'], data['newPass']);
        if (res == 'OK') {
            let conf = { file: data['file'], email: data['email'], status: 'OK' };
            io.emit('infoChangePassword' + data['uniqueId'], conf);
        } else {
            let conf = { file: data['file'], email: data['email'], status: 'not' };
            io.emit('infoChangePassword' + data['uniqueId'], conf);
        }
    });

    socket.on('confirmEmail', (data) => {
        console.log(data);
        var res = updateFile.confirmForgetEmail(data);
        console.log(res);
        io.emit('InformForgetEmail' + data['ID'], res);
    });

    socket.on('forgetSavePassed', (data) => {
        console.log(data);
        let res = updateFile.forgetSavePassed(data);
        io.emit('InformSavedPassword' + data['ID'], res);
    });
    
     socket.on('configDev' , (data) => {
        console.log('new device config  = ' , data);
        var getAllInfo = updateFile.getAllData(data['file']);
        const event = 'InfoConfigDev' + data['file'];
        io.emit(event , getAllInfo);
    });


    socket.on('disconnect', function (userNickname) {
        console.log(userNickname + ' has left ');
        socket.broadcast.emit("userdisconnect", userNickname + ' user has left');
    });

});

server.listen(process.env.PORT || 3000,() => {
    console.log('Node app is running on port 3000');
});

