//------------------------------/

/* GolosPolls main script file */

//-----------------------------/

/* switching to testnet */
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
var cyrillicToTranslit = module.exports; // cyrillicToTranslit initializing 
var inputsC = 2; // inputs counter 
var resultContent = ''; // global variable for content
var hash = location.hash.substring(1); // geting hash
if (hash != '') getHash();



function CopyLinkToClipboard() {
    document.querySelector('#cplkint').select();
    document.execCommand('copy');
    swal({
        type: 'success',
        title: 'Link has been copied',
        showConfirmButton: false,
        timer: 1800
    })
}
document.querySelector('#cplkbtn').addEventListener('click', CopyLinkToClipboard, false);

function CopyCodeToClipboard() {
    document.querySelector('#cpcdint').select();
    document.execCommand('copy');
    swal({
        type: 'success',
        title: 'Code has been copied',
        showConfirmButton: false,
        timer: 1800
    })
}
document.querySelector('#cpcdbtn').addEventListener('click', CopyCodeToClipboard, false);

/* adding a response option */

function addPollingInputs() {
    document.getElementById('pOptionButt' + inputsC).removeAttribute('disabled');
    document.getElementById('pOption' + inputsC).style.opacity = '1';
    document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Type your text here');
    document.querySelector('#inputOption' + inputsC).removeEventListener('mousedown', addPollingInputs, false);
    addInactiveInput();
}

addPollingInputs(); // add 2nd active field in a polling form

function doInputInactive() {
    document.getElementById('pOption' + inputsC).style.opacity = '0.4';
    document.getElementById('pOptionButt' + inputsC).setAttribute('disabled', 'disabled');
    document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Click here to add a new one');
    delInputPoll();
}

function addInactiveInput() {
    inputsC++;
    var $div = document.createElement('div');
    $div.className = 'input-group mb-3';
    $div.id = 'pOption' + inputsC;
    $div.style = 'opacity: 0.4; transition: .5s;';
    $div.innerHTML = `<div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" id="pOptionButt` + inputsC + `" disabled>Remove</button>
                    </div>
                    <input type="text" class="form-control" placeholder="Click here to add a new one" aria-label="Get a link of your poll" aria-describedby="basic-addon2" id="inputOption` + inputsC + `">
                </div>`;
    document.getElementById('PollForm').appendChild($div);
    document.querySelector('#inputOption' + inputsC).addEventListener('mousedown', addPollingInputs, false);
    document.getElementById('pOptionButt' + inputsC).addEventListener('click', doInputInactive, false);
}

function delInputPoll() {
    document.getElementById('PollForm').addEventListener('click', function (e) {
        for (var target = e.target; target && target != this; target = target.parentNode.parentNode) {
            if (target.matches('div')) {
                target.remove();
                e.preventDefault();
                break;
            }
        }
    }, false);
}

function completeForm() {

    /* inserting header in poll */

    var $div = document.createElement('h5');
    $div.className = 'card-title';
    $div.innerHTML = document.querySelector('.form-control.title').value;
    document.querySelector('.card-body.text-dark').appendChild($div);

    /* inserting new inputs in poll */

    var $pollInputs = document.getElementById('PollForm').getElementsByClassName('form-control');
    var answers = [];
    for (var cnt = 0; $pollInputs.length - 1 > cnt; cnt++) {
        var $div = document.createElement('div');
        $div.className = 'progress-block';
        $div.innerHTML = `<p class="card-text">` + $pollInputs[cnt].value + `</p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" id="` + cnt + `" style="width: 100%; cursor: pointer;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div><br>`;
        document.querySelector('.card-body.text-dark').appendChild($div);

        /* dummy for polling */

        answers[cnt] = $pollInputs[cnt].value;
        document.getElementById(cnt).onclick = progress_click;
    }

    /* collecting data for sending */

    str = module.exports().transform(document.querySelector('.form-control.title').value, '-');
    str.replace(/[^\w\d]/g, "_");
    var title = document.querySelector('.form-control.title').value;
    /*console.log('permlink : ' + str);
    console.log('json var : ' + answers); // debug info
    console.log('title : ' + title);*/
    var jsonMetadata = {
        poll_title: title,
        poll_answers: answers
    };
    console.log(jsonMetadata);
    send_request(str, title, jsonMetadata);

    /* visual */

    swal({
        type: 'success',
        title: 'Your polling form has been compiled',
        text: "Don`t forget to share it!",
        showConfirmButton: false,
        timer: 2500
    })
    document.getElementById('complete-form').style.display = 'block';
    document.getElementById('PollConstructor').style.display = 'none';
    document.getElementById('complete-form').scrollIntoView();

}

function progress_click() {
    alert('Вы только что выбрали вариант № ' + this.id);
}

function send_request(permlink, title, jsonMetadata) {
    var parentAuthor = ''; // for post creating, empty field
    var parentPermlink = 'test'; // main tag
    //var author = ''; // post author
    //var wif = ''; // private posting key
    //var permlink = ''; // post url-adress
    //var title = 'test'; // post title
    //var jsonMetadata = {}; // jsonMetadata - post metadata (pictures etc.)
    var body = 'At the moment, you are looking at the test page of a simple microservice, which is currently under development. And since it so happened that you look at it, here`s a random cat, good luck to you and all the best.<img src="https://tinygrainofrice.files.wordpress.com/2013/08/kitten-16219-1280x1024.jpg"></img>'; // post text
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, result) {
        //console.log(err, result);
        if (!err) {
            console.log('comment', result);
        } else console.error(err);
    }); // add post
}

function getHash() {
    console.log('hash : ' + hash);
    var startTarget = '/@'; // search '/@'
    var startPos = -1;
    while ((startPos = hash.indexOf(startTarget, startPos + 1)) != -1) {
        var Pos = startPos,
            targetStart = startPos;
    }
    startTarget = '/'; // search '/' after '/@'
    while ((Pos = hash.indexOf(startTarget, Pos + 1)) != -1) {
        var slashPos = Pos;
    }
    var author = hash.substring(targetStart + 2, slashPos); // '+ 2' removes the target symbols
    var permlink = hash.substring(slashPos + 1); // '+ 1' removes '/' 
    console.log('author : ' + author);
    console.log('permlink : ' + permlink);
    
    /* The console displays the data required for the post */

    golos.api.getContent(author, permlink, function (err, result) {
        console.log(err, result);
        resultContent = result;
        if (!err) {
            console.log('getContent', result.title);
            getPoll();
        } else console.error(err);
    });
}

function getPoll() {
    
    /* collecting data */

    resultContent.json_metadata = JSON.parse(resultContent.json_metadata); //parse json to js
    
    /* inserting header in poll */

    var $div = document.createElement('h5');
    $div.className = 'card-title';
    $div.innerHTML = resultContent.json_metadata.poll_title;
    document.querySelector('.card-body.text-dark').appendChild($div);

    /* inserting new inputs in poll resultContent.json_metadata.poll_answers[0];*/

    for (var cnt = 0; resultContent.json_metadata.poll_answers.length - 1 > cnt; cnt++) {
        var $div = document.createElement('div');
        $div.className = 'progress-block';
        $div.innerHTML = `<p class="card-text">` + resultContent.json_metadata.poll_answers[cnt] + `</p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" id="` + cnt + `" style="width: 100%; cursor: pointer;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div><br>`;
        document.querySelector('.card-body.text-dark').appendChild($div);

        /* dummy for polling */

        document.getElementById(cnt).onclick = progress_click;
    }

    /* visual */

    document.getElementById('complete-form').style.display = 'block';
    document.getElementById('PollConstructor').style.display = 'none';
    document.getElementById('complete-form').scrollIntoView();
}

/* buttons events */

document.getElementById('pOptionButt1').addEventListener('click', doInputInactive, false);
document.getElementById('pOptionButt2').addEventListener('click', doInputInactive, false);
document.getElementById('complete').addEventListener('click', function () {
    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, just do it!'
    }).then((result) => {
        if (result.value) {
            if (wif) {
                completeForm();
            } else {
                auth();
            }
        }
    })
}, false);