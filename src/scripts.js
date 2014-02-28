
~function(){
    var href = window.location.href;

    window.addEventListener('load', function(){
        inject();
    });

    function inject(){
        if(href.match(/http:\/\/.*\.youku.com\/.*/)){
            injectYouku();
        }else if(href.match(/http:\/\/weibo.com\/.*/)){
            injectWeibo();
        }
    }

    // start of youku site inject
    function injectYouku(){
        // fn_favorite is a symbol of swfiKuAdapter's existence we used to start up youkuclient
        // TODO add youku.com inject
        if($('#fn_favorite').length > 0){
            injectVPageJs();
        }else{
            injectMainPageJs();
        }
    }

    function injectVPageJs(){
        var m = href.match(/.*id_(.*)\.html.*/);
        if(m && m.length > 1){
            // add a play button beside the favorite button
            /*jshint multistr: true */
            var inject_html = ' \
                <div class="fn" id="fn_play_iku"> \
                    <div class="handle" ><a id="fn_play_iku_a" href="' + _genInjectUrl(m[1]) + '">iKu</a></div> \
                </div> \
            ';
            $('#fn_favorite').after(inject_html);

            // inject js at the end of body block
            // TODO add whole swf adapter process
            var inject_js = '<script type="text/javascript"> (function(){var swfiKuAdapter=null;function getIkuAdapter(){swfiKuAdapter=document.getElementById("ikuadapter_swf");return swfiKuAdapter};function ikuExecute(a){return null!=(iku=getIkuAdapter())&&iku.execute?iku.execute(a):"f"};var ele=document.getElementById("fn_play_iku_a");ele.onclick=function(){var a="' + _genInjectUrl(m[1]) + '|";var b="";b=ikuExecute(a);if ("f" == b) return true;else return false;}})(); </script> ';

            $('body').append(inject_js); 
        }
    }

    function injectMainPageJs(){
        var m = href.match(/http:\/\/.*\.youku.com\//);
        if(m && m.length > 0){
            $('.v-meta.vb').each(function(i, d){
                $(d).find('.btn.btn-small').each(function(ii, dd){
                    var mm = dd.href.match(/.*id_(.*)\.html.*/);
                    if(mm && mm.length > 1){
                        var inject_html = '<a href="' + _genInjectUrl(mm[1]) + '" style="margin-left:8px" class="btn btn-small">iKu</a>';
                        $(dd).after(inject_html);
                    }
                });
            });
            $('.v-meta.va').each(function(i, d){
                var a = $(d).parent().find('.v-link').find('a');
                var ele = $(d).find('.ico-statplay');
                if(a.length > 0 && ele.length > 0){
                    var mm = a[0].href.match(/.*id_(.*)\.html.*/);
                    if(mm && mm.length > 1){
                        var inject_html = '<a href="' + _genInjectUrl(mm[1]) + '" class="v-username"><i class="ico-statplay"></i>iKu</a>';
                        var TOTAL_DIV_WIDTH = 180; // 190 - 5 * 2(padding)
                        var INJECT_ELE_WIDTH = 34; 
                        var existing_ele_width = 0;
                        $(ele[0]).parent().children().each(function(i, d){
                            existing_ele_width += $(d).width();
                        });
                        if(TOTAL_DIV_WIDTH - existing_ele_width >= INJECT_ELE_WIDTH)
                            $(ele[0]).parent().append(inject_html);
                    }
                }
            });
        }
    }
    // end of youku site inject

    // start of weibo site inject
    function injectWeibo(){
        document.addEventListener('DOMNodeInserted', function (event){
            node = event.target;
            if(!node.nodeName || node.nodeName.toUpperCase() !== 'DIV') return;
            if(node.classList.contains('WB_feed_type')){
                // refresh events 
                injectWeiboJs(node);
            }else if(node.classList.contains('WB_feed')){
                // first loading events
                injectWeiboJs(node);
            }
        }, false);
    }

    function injectWeiboJs(node){
        injectWeiboTextBtn(node);
        injectWeiboSpecBtn(node);
    }

    function injectWeiboTextBtn(node){
        var video_btn = $(node).find('.W_btn_c[suda-uatrack="key=tblog_card&value=click_title:1007002-video"]');
        video_btn.each(function(i, d){
            var play_ele = $(d).parent().find('a[name=iku_play]');
            if(play_ele.length === 0){
                var m = d.href.match(/.*v\.youku\.com.*id_(.*)\.html.*/);
                if(m && m.length > 1){
                    addWeibTextBtn(d, m[1]);
                }else{
                    asyncInjectWeiboElement(d, d.href, addWeiboTextBtn);
                }
            }
        });
    }

    function addWeiboTextBtn(node, vid){
        // add a play button beside origin play button
        var inject_html = '<a name="iku_play" class="W_btn_c" href="' + _genInjectUrl(vid) + '"><span><em class="W_btn_icon"><i class="W_ico12 icon_cd_video"></i><i class="W_vline S_line1_c">|</i></em><em class="W_autocut S_link1">iKu</em></span></a>';
        $(node).after(inject_html);
    }
    
    function injectWeiboSpecBtn(node){
        var spec_block = $(node).find('.WB_feed_spec');
        spec_block.each(function(i, d){
            var ele = $(d).find('.W_fr');
            var play_ele = $(d).find('a[name=iku_play]');
            if(play_ele.length === 0 && ele.length >= 1){
                action_data = $(d).attr('action-data');
                if(action_data){
                    var m = action_data.match(/.*v\.youku\.com.*id_(.*)\.html.*/);
                    if(m && m.length > 1){
                        addWeiboSpecBtn(ele, m[1]);
                    }else{
                        asyncInjectWeiboElement(ele, action_data, addWeiboSpecBtn);
                    }
                }
            }
        });
    }

    function addWeiboSpecBtn(node, vid){
        var inject_html = '<a class="W_btn_a" name="iku_play" href="' + _genInjectUrl(vid) + '"><span class="btn_26px">iKu</span></a>';
        $(node).prepend(inject_html);
    }

    function asyncInjectWeiboElement(node, url, func){
        var m = url.match(/.*t\.cn.*/);
        if(m && m.length > 0){
            $.ajax({
                url: 'https://api.weibo.com/2/short_url/expand.json?source=1548780103&url_short=' + url,
                timeout: 10000,
                type: "GET",
                dataType: "json",
                success: function(data){
                    console.log(data);
                    if(data.urls && data.urls.length > 0){
                        var m = data.urls[0].url_long.match(/.*v\.youku\.com.*id_(.*)\.html.*/);
                        if(m && m.length > 1){
                            func(node, m[1]);
                        }
                    }
                }
            });
        }
    }
    // end of weibo site inject

    // start of common functions
    function _genInjectUrl(id){
        return 'iku://|play|popwnd|url|bak|'+'http://v.youku.com/v_show/id_' + id + '.html|';
    }

    // end of common functions

}();
    

