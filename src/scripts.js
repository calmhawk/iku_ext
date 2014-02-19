
if($("#fn_favorite").length > 0){
    var m = window.location.href.match(/.*id_(.*)\.html.*/);
    if(m.length > 1){
        var href = "iku://|play|popwnd|url|bak|"+"http://v.youku.com/v_show/id_"+m[1]+".html|";
        var inject = ' \
            <div class="fn" id="fn_play_iku"> \
                <div class="handle" ><a id="fn_play_iku_a" href="' + href + '">播放</a></div> \
            </div> \
        ';
        $("#fn_favorite").after(inject);
        injectJs(m[1]);
    }
}

function injectJs(vid) {
    var inject = '<script type="text/javascript"> (function(){var swfiKuAdapter=null;function getIkuAdapter(){swfiKuAdapter=document.getElementById("ikuadapter_swf");return swfiKuAdapter};function ikuExecute(a){return null!=(iku=getIkuAdapter())&&iku.execute?iku.execute(a):"f"};var ele=document.getElementById("fn_play_iku_a");ele.onclick=function(){var a="iku://|play|popwnd|url|bak|"+"http://v.youku.com/v_show/id_'+vid+'.html|";var b="";b=ikuExecute(a);if ("f" == b) return true;else return false;}})(); </script> ';

    $("body").append(inject); 
}

