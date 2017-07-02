define([
    'jquery',
    'waterfall',
    'exposure'
], function($, waterFall, exposure) {
    'use strict';

    function SinaNews($ct, $item, $loadMore, perPageCount) {
        //新闻内容的容器
        this.$ct = $ct;
        //单个新闻块
        this.$item = $item;
        //当前页
        this.curPage = 1;
        //加载更多的对象
        this.$loadMore = $loadMore;
        //每页数量
        this.perPageCount = perPageCount;

        //初始化waterFall对象
        this.selfWaterFall = waterFall.init(this.$ct, this.$item);

        let _this = this;
        //初始化曝光加载对象
        this.selfExposure = exposure.init(this.$loadMore, function() {
            _this.getNews();
        });

        this.bind();
        // $(window).trigger('scroll');
    }

    SinaNews.prototype.bind = function() {
        let _this = this;
        // exposure.init(this.$loadMore, function(e) {
        //     _this.getNews();
        //     e.preventDefault();
        // })

        $('.load-more').on('click', function(e) {
            // console.log('load-more click');
            _this.getNews();
            e.preventDefault();
        })
    }

    //调用接口，获取新闻的方法
    SinaNews.prototype.getNews = function() {
        let _this = this;
        $.ajax({
            url: 'https://platform.sina.com.cn/slide/album_tech', //这里使用了新浪新闻的 jsonp 接口，大家可以直接看数据， 如： http://platform.sina.com.cn/slide/album_tech?jsoncallback=func&app_key=1271687855&num=3&page=4
            dataType: 'jsonp',
            jsonp: "jsoncallback",
            data: {
                app_key: '1271687855',
                num: _this.perPageCount,
                page: _this.curPage
            }
        }).done(function(ret) {
            if (ret && ret.status && ret.status.code === "0") {
                //获取到数据后，把新闻布局到瀑布流中
                _this.place(ret.data, _this.$ct);
                // console.log('接口返回数据：', ret);
                _this.curPage++
            } else {
                console.log('error data')
            }
        })
    }

    //等待新闻图片加载完成，并块插入容器的方法
    SinaNews.prototype.place = function(data) {
        let _this = this;

        let $nodes = _this.renderItems(data, _this.$ct);

        let defereds = []; //创建存储 defered 对象的数组

        $nodes.find('img').each(function(index, element) {
            let defer = $.Deferred();
            defereds.push(defer);
            $(element).load(function() {
                defer.resolve();
            }); //当每个图片加载完成后，执行 resolve

        });
        $.when.apply(null, defereds).done(function() { //当所有的图片都执行 resolve 后，即全部图片加载后，执行下面的内容
            // console.log('new images all loaded ...');
            //当节点里的图片全部加载后再使用瀑布流计算，否则会因为图片未加载 item 高度计算错误导致瀑布流高度计算出问题
            waterFall.waterFallRender(_this.selfWaterFall, $nodes);
        });
    }

    //生成单个图片块的方法    
    SinaNews.prototype.getItems = function(contents) {
        let $node = '';

        for (var i = 0; i < contents.length; i++) {
            $node += '<li class="item">'
            $node += '<a href="' + contents[i].url + '" target="_blank">'
            $node += '<img src="' + contents[i].img_url + '" alt="">'
            $node += '</a>'
            $node += '<h4>' + contents[i].short_name + '</h4>'
            $node += '<p>' + contents[i].short_intro + '</p>'
            $node += '</li>'
        }
        $node = $($node);
        return $node;
    }

    //渲染新闻块的方法
    SinaNews.prototype.renderItems = function(data) {
        //把获取到的图片数据拼装成块，放入$ct容器
        var $items = this.getItems(data);

        this.$ct.append($items);

        return $items;
    }

    return {
        init: function($ct, $loadMore, perPageCount) {
            new SinaNews($ct, $loadMore, perPageCount);
        }
    }
});