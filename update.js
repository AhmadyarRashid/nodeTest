const fs = require('fs');

var validateEmail = (id, email, pass) => {
    var jsondata;
    var project;
    var readNote = fs.readFileSync(__dirname + '/login.json');
    var root = JSON.parse(readNote);
    if (root) {
        if (root[email]) {
            if (root[email]['email'] == email && root[email]['password'] == pass) {
                project = root[email]['project'];
                jsondata = {
                    id: id,
                    email: email,
                    pass: pass,
                    projectName: project,
                    message: "sucessfull"
                }
                //console.log('message', 'sucessfully');
            } else {
                jsondata = {
                    id: id,
                    email: email,
                    pass: pass,
                    projectName: "unsucess",
                    message: "unsucessfull"
                }
                console.log('message', 'not found');
                project = "not found";
            }
        }
        else {
            jsondata = {
                id: id,
                email: email,
                pass: pass,
                projectName: "unsucess",
                message: "unsucessfull"
            }
            console.log('message', 'not found');
            project = "not found";
        }
    }

    console.log('return value', project);
    return jsondata;
}

var getAllData = (filename) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    return JSON.parse(readNote);
};

// get first request from arduino
var getDataArduino = (filename, device) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            // var week = ['Mon' , 'Tue' , 'Wed' , 'Thu' , 'Fri' , 'Sat' , 'Sun'];
            // var d = new Date();
            // var cur_day = week[d.getDay() - 1];

            // var status = root['devices'][node]['status'];
            // var label = root['devices'][node]['label'];
            // var sch_on_hrs = root['devices'][node]['schedular_on']['shour'];
            // var sch_on_min = root['devices'][node]['schedular_on']['smin'];
            // var sch_on_day = cur_day;
            // var sch_on_stat = root['devices'][node]['schedular_on']['sch_status'];

            // var sch_off_hrs = root['devices'][node]['schedular_off']['shour'];
            // var sch_off_min = root['devices'][node]['schedular_off']['smin'];
            // var sch_off_day = cur_day;
            // var sch_off_stat = root['devices'][node]['schedular_off']['sch_status'];

            // var result = {
            //     file : filename,
            //     device : device,
            //     status : status,
            //     label : label,
            //     sch_on_stat : sch_on_stat,
            //     sch_on_day : sch_on_day,
            //     sch_on_hrs : sch_on_hrs,
            //     sch_on_min : sch_on_min,
            //     sch_off_stat : sch_off_stat,
            //     sch_off_day : sch_off_day,
            //     sch_off_hrs : sch_off_hrs,
            //     sch_off_min : sch_off_min
            // };

            return root['devices'][node];
        }
    }
};

var updateStatus = (filename, device, status) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    updateLogs(filename, device, 'status', status);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            root['devices'][node]['status'] = status;
            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};

var updateLabel = (filename, device, label) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            root['devices'][node]['label'] = label;
            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};

var updateCategory = (filename, device, category) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            root['devices'][node]['category'] = category;
            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};

var updateSchON = (filename, device, sch, stat, hrs, min, day) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            root['devices'][node]['schedular_on']['shour'] = hrs;
            root['devices'][node]['schedular_on']['smin'] = min;
            root['devices'][node]['schedular_on']['sch_status'] = stat;
            root['devices'][node]['schedular_on'][day] = 'true';
            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};


var updateSchOFF = (filename, device, sch, stat, hrs, min, day) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            root['devices'][node]['schedular_off']['shour'] = hrs;
            root['devices'][node]['schedular_off']['smin'] = min;
            root['devices'][node]['schedular_off']['sch_status'] = stat;
            root['devices'][node]['schedular_off'][day] = 'true';
            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};


var updateWatt = (filename, device, watt) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            root['devices'][node]['watt'] = watt;
            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};

var clearSch = (filename, device) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {

            root['devices'][node]['schedular_off']['sch_status'] = "false";
            root['devices'][node]['schedular_on']['sch_status'] = "false";
            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};

const updateSchOnList = (filename, device, data) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            root['devices'][node]['schedular_on']['shour'] = data['hrs'];
            root['devices'][node]['schedular_on']['smin'] = data['min'];
            root['devices'][node]['schedular_on']['Mon'] = data['mon'];
            root['devices'][node]['schedular_on']['Tue'] = data['tue'];
            root['devices'][node]['schedular_on']['Wed'] = data['wed'];
            root['devices'][node]['schedular_on']['Thu'] = data['thu'];
            root['devices'][node]['schedular_on']['Fri'] = data['fri'];
            root['devices'][node]['schedular_on']['Sat'] = data['sat'];
            root['devices'][node]['schedular_on']['Sun'] = data['sun'];

            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};

const updateSchOffList = (filename, device, data) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            root['devices'][node]['schedular_off']['shour'] = data['hrs'];
            root['devices'][node]['schedular_off']['smin'] = data['min'];
            root['devices'][node]['schedular_off']['Mon'] = data['mon'];
            root['devices'][node]['schedular_off']['Tue'] = data['tue'];
            root['devices'][node]['schedular_off']['Wed'] = data['wed'];
            root['devices'][node]['schedular_off']['Thu'] = data['thu'];
            root['devices'][node]['schedular_off']['Fri'] = data['fri'];
            root['devices'][node]['schedular_off']['Sat'] = data['sat'];
            root['devices'][node]['schedular_off']['Sun'] = data['sun'];

            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};

const updateSchStatus = (filename, device, data) => {
    var readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    var root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {
            root['devices'][node]['schedular_off']['sch_status'] = data['schStatusOff'];
            root['devices'][node]['schedular_on']['sch_status'] = data['schStatusOn'];
            root['devices'][node]['schedular'] = data['schedular'];

            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};

const addNewCategory = (filename, newCat) => {
    const readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    let root = JSON.parse(readNote);
    root['category'].push(newCat);

    fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
        if (err) {
            throw err;
        }
    });
};

const changeImage = (filename, device, image) => {
    const readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    let root = JSON.parse(readNote);

    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {

            root['devices'][node]['image'] = image;
            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};

const delCategory = (filename, cat) => {
    const readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    let root = JSON.parse(readNote);
    let category = root['category'];
    var newCatList = category.filter((cate) => cate != cat);
    root['category'] = newCatList;
    fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
        if (err) {
            throw err;
        }
    });
};

const resetDevice = (filename, device, config) => {
    const readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    let root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {

            root['devices'][node]['configuration'] = config;
            if(root['devices'][node]['type'] == 'atodimmer'){
                root['devices'][node]['status'] = "0";
            }else{
                root['devices'][node]['status'] = "OFF";
            }

            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return;
        }
    }
};


const configDevice = (filename, device, config) => {
    const readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    let root = JSON.parse(readNote);
    for ((node) in root['devices']) {
        if (root['devices'][node]['id'] == device) {

            root['devices'][node]['configuration'] = config;
            fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
                if (err) {
                    throw err;
                }
            });
            return root['devices'][node];
        }
    }
}

const changePassword = (filename, email, newPass) => {
    const readNote2 = fs.readFileSync(__dirname + '/login.json');
    let root2 = JSON.parse(readNote2);
    root2[email]['password'] = newPass;
    fs.writeFileSync(__dirname + '/login.json', JSON.stringify(root2), (err) => {
        if (err) {
            throw err;
        }
    });

    return 'OK';

    // const readNote = fs.readFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json');
    // let root = JSON.parse(readNote);
    // let userInfo = root['userInfo'];
    // userInfo['password'] = newPass;
    // fs.writeFileSync(__dirname + '/projects/' + filename + '/' + filename + '.json', JSON.stringify(root), (err) => {
    //     if (err) {
    //         throw err;
    //     }
    // });



};

const updateLogs = (filename, device, key, value) => {
    // console.log('enter in log update function.');
    // var log = `${filename} ${device} ${key} ${value} ${new Date().toString()} \n`;
    // fs.appendFile('server.log', log, (err) => {
    //     console.log("unable to append file");
    // });
   
    //===============
    var notes = fetchData();
    var note = {
      filename,
      device,
      key,
      value,
      'date': new Date().toString()
    };
    notes.push(note);
    fs.writeFileSync('logs.json',JSON.stringify(notes));
   // var duplicate = notes.filter((note)=>{ return note.title === title});
   
};

const insertUniqueId = (data) => {
    const readNote = fs.readFileSync(__dirname + '/projects/' + data['project'] + '/' +  data['project'] + '.json');
    let root = JSON.parse(readNote);
    if(root){
        if(root['uniqueId']){
           if(!root['uniqueId'].includes(data['mac'])){
            root['uniqueId'].push(data['mac']);
           }
        }else{
            console.log('no object found in unique obj');
        }

        fs.writeFileSync(__dirname +  '/projects/' + data['project'] + '/' +  data['project'] + '.json', JSON.stringify(root), (err) => {
            if (err) {
                throw err;
            }
        });

    }
};

const confirmForgetEmail = (data) => {

    var readNote = fs.readFileSync(__dirname + '/login.json');
    var root = JSON.parse(readNote);
    const email = data['email'];
    if(root){
        console.log('found login root');
        if(root[email]){
            console.log('found email successfully');
            const proj = root[email]['project'];
            var readNote1 = fs.readFileSync(__dirname + '/projects/' + proj + '/' + proj + '.json');
            var root1 = JSON.parse(readNote1);

            if(root1){
                console.log('enter in proj file');
                if(root1['uniqueId']){
                    console.log('enter in proj file unique id obj');
                    if(root1['uniqueId'].includes(data['androidId'])){
                        console.log('found user id');
                        return {
                            email : data['email'],
                            uniqueId : data['ID'],
                            message : 'success'
                        };
                    }
                 }else{
                    return {
                        email : data['email'],
                        uniqueId : data['ID'],
                        message : 'fail'
                    };
                 }
            }else{
                return {
                    email : data['email'],
                    uniqueId : data['ID'],
                    message : 'fail'
                };
            }

        }else{
            return {
                email : data['email'],
                uniqueId : data['ID'],
                message : 'fail'
            };
        }
    }
};

const forgetSavePassed = (data) => {
    let res = 'failed';
    const readNote2 = fs.readFileSync(__dirname + '/login.json');
    let root2 = JSON.parse(readNote2);
    const email = data['email'];
    root2[email]['password'] = data['newPwd'];
    fs.writeFileSync(__dirname + '/login.json', JSON.stringify(root2), (err) => {
        if (err) {
            res = 'failed';
            throw err;
        }
    });
    res = 'success';
    return res;
};


var fetchData = () => {
    try{
        var readNote = fs.readFileSync('logs.json');
        return JSON.parse(readNote);
    }catch (e) {
        return [];
    }
};

module.exports = {
    getAllData,
    updateStatus,
    updateLabel,
    updateSchON,
    updateSchOFF,
    clearSch,
    updateWatt,
    validateEmail,
    getDataArduino,
    updateCategory,
    updateSchOnList,
    updateSchOffList,
    updateSchStatus,
    addNewCategory,
    changeImage,
    delCategory,
    resetDevice,
    configDevice,
    changePassword,
    insertUniqueId,
    confirmForgetEmail,
    forgetSavePassed
};