
~function(){
    var href = window.location.href;

    function inject(){
        if(href.match(/http:\/\/.*\.youku.com\/.*/)){
            injectYouku();
        }else if(href.match(/http:\/\/weibo.com\/.*/)){
            injectWeibo();
            injectWeiboJs();
        }
    }

    function injectYouku(){
        if($("#fn_favorite").length > 0){
            var m = window.location.href.match(/.*id_(.*)\.html.*/);
            if(m && m.length > 1){
                var href = "iku://|play|popwnd|url|bak|"+"http://v.youku.com/v_show/id_"+m[1]+".html|";
                var inject_html = ' \
                    <div class="fn" id="fn_play_iku"> \
                        <div class="handle" ><a id="fn_play_iku_a" href="' + href + '">播放</a></div> \
                    </div> \
                ';
                $("#fn_favorite").after(inject_html);
                injectYoukuJs(m[1]);
            }
        }
    }

    function injectWeibo(){
        document.addEventListener('DOMNodeInserted', function (event){
            node = event.target;
            if(!node.nodeName || node.nodeName.toUpperCase() !== "DIV") return;
            if(node.classList.contains('WB_feed_type')){
                injectWeiboJs();
            }
        }, false);
    }

    function injectYoukuJs(vid){
        var inject_html = '<script type="text/javascript"> (function(){var swfiKuAdapter=null;function getIkuAdapter(){swfiKuAdapter=document.getElementById("ikuadapter_swf");return swfiKuAdapter};function ikuExecute(a){return null!=(iku=getIkuAdapter())&&iku.execute?iku.execute(a):"f"};var ele=document.getElementById("fn_play_iku_a");ele.onclick=function(){var a="iku://|play|popwnd|url|bak|"+"http://v.youku.com/v_show/id_'+vid+'.html|";var b="";b=ikuExecute(a);if ("f" == b) return true;else return false;}})(); </script> ';

        $("body").append(inject_html); 
    }

    function injectWeiboJs(){
        if($(".WB_feed_spec").length > 0){
            $(".WB_feed_spec").each(function(i,d){
                action_data = $(d).attr("action-data");
                if(action_data){
                    var m = action_data.match(/.*v\.youku\.com.*id_(.*)\.html.*/);
                    if(m && m.length > 1){
                        var ele = $(d).find('.W_fr');
                        var play_ele = $(d).find('a[name=iku_play]');
                        if(play_ele.length === 0 && ele.length >= 1){
                            var href = "iku://|play|popwnd|url|bak|"+"http://v.youku.com/v_show/id_"+m[1]+".html|";
                            var inject_html = '<a class="W_btn_a" name="iku_play" href="' + href + '"><span class="btn_26px">iku播放</span></a>'
                            $(ele).prepend(inject_html);
                        }
                    }
                }
            });
        }
    }

    window.addEventListener("load", function(){
        inject();
    });
}();
    

