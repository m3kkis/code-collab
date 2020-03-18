$(document).ready(function(){
    
    var socket = io('http://localhost:3000');

    const leftPanel = $("#leftPanel")[0];
    const centerPanel = $("#centerPanel")[0];
    const rightPanel = $("#rightPanel")[0];

    var currURL = window.location.href;
    var roomid = currURL.split('#');
    var currentRoom;

    function createRandomID(len){
        var res = '';
        var sChar = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789';
        var iCharLen = sChar.length;
        for(var i = 0; i < len; i++)
        {
            res += sChar.charAt( Math.floor( Math.random() * iCharLen ) );
        }

        return res;
    }

    if(roomid[1] != undefined)
    {
        socket.emit('roomjoin',roomid[1]);
        currentRoom = roomid[1];
    }
    else
    {
        var rando = createRandomID(16);
        window.location.hash = rando;
        socket.emit('roomjoin',rando);
        currentRoom = rando;
    }


    var leftEditor = CodeMirror.fromTextArea(leftPanel, {
        lineNumbers: true,
        matchBrackets: true,
        height: "auto",
        lineWrapping: true,
        indentUnit: 4,
        theme: "pastel-on-dark",
        mode: "xml",
        htmlMode: true
    });

    var centerEditor = CodeMirror.fromTextArea(centerPanel, {
        lineNumbers: true,
        matchBrackets: true,
        height: "auto",
        lineWrapping: true,
        indentUnit: 4,
        theme: "pastel-on-dark",
        mode: "javascript"
    });

    var rightEditor = CodeMirror.fromTextArea(rightPanel, {
        lineNumbers: true,
        matchBrackets: true,
        height: "auto",
        lineWrapping: true,
        indentUnit: 4,
        theme: "pastel-on-dark",
        mode: "css"
    });
    
    leftEditor.on("keyup",(leftEditor,e)=>{
        console.log("asdfasdf");
        let data = {
            text: leftEditor.getValue(),
            panel: "left"
        }
        socket.emit('message', data);

    });

    centerEditor.on("keyup",(centerEditor,e)=>{
        let data = {
            text: centerEditor.getValue(),
            panel: "center"
        }
        socket.emit('message', data);

    });

    rightEditor.on("keyup",(rightEditor,e)=>{
        let data = {
            text: rightEditor.getValue(),
            panel: "right"
        }
        socket.emit('message', data);

    });

    socket.on('message', (data) => {

        if(data.panel == "left")
        {
            leftEditor.setValue(data.text);
        }
        else if(data.panel == "center")
        {
            centerEditor.setValue(data.text);
        }
        else if(data.panel == "right")
        {
            rightEditor.setValue(data.text);
        }
        
    });


    $("#blob").on("click", () => {

        var zip = new JSZip();
        zip.file("index.html", leftEditor.getValue());
        zip.file("main.js", centerEditor.getValue());
        zip.file("layout.css", rightEditor.getValue());

        zip.generateAsync({type:"base64"}).then(function (base64) {
            window.location = "data:application/zip;base64," + base64;
        }, function (err) {
            $("#blob").text(err);
        });
    });

    $("#bottom-bar-btn-run").on("click", () => {
        var me = $(this);
        var bbar = $(".bottom-bar");
        var iframeCont = $(".iframe-container");

        if(bbar.hasClass("expanded"))
        {
            me.text("Run");
            me.removeClass("bbar-close");
            iframeCont.addClass("hidden");
            bbar.removeClass("expanded");
            bbar.animate({"height": "25px"}, 200);

        }
        else
        {
            me.text("Close");
            me.addClass("bbar-close");
            iframeCont.removeClass("hidden");
            bbar.addClass("expanded");
            bbar.animate({"height": "100%"}, 200);
        }

    });
});