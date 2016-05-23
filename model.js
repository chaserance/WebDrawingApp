/*  Chushu Liu
    COSC 231-0
    PP#4       */

/**
 *  Put everything together and run function
 *  after document load.
 */
$(document).ready(function () {

    //Global variables
    var canvas = document.getElementById("drawingArea"),
        context = canvas.getContext("2d"),
        painting = false,
        radius = 5,
        shape = "cir",

    /**
     *  Create an array and generate 24 colors for those
     *  browsers that do not support "input type=color"
     */
        color = new Array();
    color.push("black");
    function generaterColor() {
        var size = 22;
        var rainbow = new Array(size);

        for (var i = 0; i < size; i++) {
            var red = sin_to_hex(i, 0 * Math.PI * 2 / 3);
            var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3);
            var green = sin_to_hex(i, 2 * Math.PI * 2 / 3);

            color.push("#" + red + green + blue);
        }

        function sin_to_hex(i, phase) {
            var sin = Math.sin(Math.PI / size * 2 * i + phase);
            var dec = Math.floor(sin * 127) + 128;
            var hex = dec.toString(16);

            return hex.length === 1 ? "0" + hex : hex;
        }
    }
    generaterColor();
    color.push("white");

    //Initial context lineWidth and strokeStyle and fillStyle.
    context.lineWidth = radius * 2;
    context.strokeStyle = "black";
    context.fillStyle = "black";

    /**
     *  Begin paint if mouse move and also down, stop otherwise. 
     */
    $("#drawingArea").mousedown(function (e) {
        painting = true;
        paint(e);
    });

    $("#drawingArea").mousemove(function (e) {
        paint(e);
    });

    $("#drawingArea").mouseup(function (e) {
        painting = false;
        context.beginPath();
    });

    $("#drawingArea").mouseleave(function (e) {
        painting = false;
        context.beginPath();
    });

    /**
     *  Main function that do the painting, obtain the relative mouse location
     *  and paint based on the given shape, connect those dots by line as well
     */
    var paint = function (e) {
        if (painting) {
            var offset = $("#box").offset();
            var extraOffset = $("#tool").width();
            context.lineTo(e.pageX - offset.left - extraOffset, e.pageY - offset.top);
            context.closePath();
            context.stroke();
            context.beginPath();
            switch (shape) {
                case "cir":
                    context.arc(e.pageX - offset.left - extraOffset, e.pageY - offset.top, radius, 0, Math.PI * 2);
                    context.fill();
                    break;
                case "sq":
                    var sx = e.pageX - offset.left - extraOffset - radius;
                    var sy = e.pageY - offset.top - radius;
                    context.fillRect(sx, sy, radius * 2, radius * 2);
                    break;
                case "di":
                    var x = e.pageX - offset.left - extraOffset - radius;
                    var y = e.pageY - offset.top - radius;
                    context.lineWidth = 1;
                    context.strokeRect(x, y, radius * 2, radius * 2);
                    context.beginPath();
                    context.moveTo(x + radius * 2, y);
                    context.lineTo(x, y + radius * 2);
                    context.stroke();
                    context.lineWidth = radius * 2;
                    break;
                default:
                    break;
            }
            context.closePath();
            context.beginPath();
            context.moveTo(e.pageX - offset.left - extraOffset, e.pageY - offset.top);
            context.closePath();
        }
    };

    /**
     *  Function to change the brush shape based on user choice 
     */
    $(".shape").click(function (e) {
        shape = $(this).attr("id");
        $(".active").attr("class", "shape");
        $(this).addClass("active");
        context.fillStyle = $("#pC").val();
        context.strokeStyle = $("#pC").val();
        $("#drawingArea").css("cursor", "url('cursor.png'), auto");
    });

    /**
     *  Function to provide an eraser 
     */
    $(".eraser").click(function (e) {
        var bgColor = $("#box").css("background-color");
        context.fillStyle = bgColor;
        context.strokeStyle = bgColor;
        $("#drawingArea").css("cursor", "url('ec.png'), auto");
    });

    /**
     *  Function to clear everything drawing on canvas
     */
    $("#clearAll").click(function (e) {
        context.clearRect(0, 0, 500, 500);
    });

    /**
     *  Create a HTML5 color input if browser support,
     *  otherwise create a color pick palette based on the 
     *  color array given above
     */
    var creatColorPicker = function () {
        var penC = document.getElementById("penColor"),
            bgC = document.getElementById("backgroundColor"),
            pc = document.createElement("input");
        pc.setAttribute("type", "color");
        pc.setAttribute("id", "pC");
        pc.setAttribute("value", "#000000");
        pc.className = "color";
        //If browser support:
        if (pc.type != "text") {
            var bc = document.createElement("input");
            bc.setAttribute("type", "color");
            bc.setAttribute("id", "bC");
            bc.setAttribute("value", "#FFFFFF");
            bc.className = "color";
            penC.appendChild(pc);
            bgC.appendChild(bc);
        }
        //If not:
        else {
            for (var i = 0; i < color.length; i++) {
                var picker1 = document.createElement("div");
                var picker2 = document.createElement("div");
                picker1.className = "pickerP";
                picker1.style.backgroundColor = color[i];
                picker1.addEventListener("click", function (e) {
                    context.fillStyle = this.style.backgroundColor;
                    context.strokeStyle = this.style.backgroundColor;
                    $(".chooseP").attr("class", "pickerP");
                    $(this).addClass("chooseP");
                    $("#drawingArea").css("cursor", "url('cursor.png'), auto");
                });
                picker2.className = "pickerBG";
                picker2.style.backgroundColor = color[i];
                picker2.addEventListener("click", function (e) {
                    $(box).css("background-color", this.style.backgroundColor);
                    $(".chooseBG").attr("class", "pickerBG");
                    $(this).addClass("chooseBG");
                    $("#drawingArea").css("cursor", "url('cursor.png'), auto");
                });
                penC.appendChild(picker1);
                bgC.appendChild(picker2);
            }
        }
    };
    creatColorPicker();

    /**
     *  Function that change color based on HTML5 color input
     */
    $(".color").on('input', function () {
        var id = $(this).attr("id");
        var color = this.value;
        if (id == "pC") {
            context.fillStyle = color;
            context.strokeStyle = color;
            $("#drawingArea").css("cursor", "url('cursor.png'), auto");
        }
        else {
            $(box).css("background-color", color);
            $("#drawingArea").css("cursor", "url('cursor.png'), auto");
        }
    });

    /**
     *  Function that adjust the range slider to change the brush width 
     *  and also update the displayed value.
     */
    var rangeSlider = function () {
        var range = $('#size'),
            show = $('#view');

        var view = show.prev().attr('value');
        show.html(view);

        range.on('input', function () {
            $(this).next().html(this.value);
            radius = this.value / 2;
            context.lineWidth = radius * 2;
        });
    };
    rangeSlider();
});