"use strict";

// The RGB to Hex code is from here: http://www.javascripter.net/faq/rgbtohex.htm
function rgbToHex(R, G, B) {
    return toHex(R) + toHex(G) + toHex(B)
}

function toHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return "00";
    n = Math.max(0, Math.min(n, 255));
    return "0123456789ABCDEF".charAt((n - n % 16) / 16)
        + "0123456789ABCDEF".charAt(n % 16);
}

// This is code I found here: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
// There is a fully-featured library there but I only needed an older snippet from a StackOverflow page.
function shadeBlend(p,c0,c1) {
    var n=p<0?p*-1:p,u=Math.round,w=parseInt;
    if(c0.length>7){
        var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
        return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
    }else{
        var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
        return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
    }
}
