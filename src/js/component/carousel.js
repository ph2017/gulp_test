define([
    'jquery'
], function($) {
    'use strict';

    function _Carousel($ct) {
        this.$ct = $ct;

        this.init();
        this.bind();
        this.setBulletDisplay(0);
        this.autoPlay(2000);
    }

    _Carousel.prototype = {

        init: function() {
            let $imgCt = this.$imgCt = this.$ct.find('.img-ct');
            let imgs = this.$imgs = $imgCt.find('li');
            let imgsCount = this.imgsCount = imgs.length;
            var imgWidth = this.imgWidth = imgs.eq(0).width();

            $imgCt.append(imgs.eq(0).clone());
            $imgCt.prepend(imgs.eq(imgsCount - 1).clone());
            $imgCt.width(imgWidth * (imgsCount + 2));
            $imgCt.css({
                left: -imgWidth
            });

            this.$btnNext = this.$ct.find('.btn-ct').find('.next');
            this.$btnPre = this.$ct.find('.btn-ct').find('.pre');
            this.curIndex = 0;
            //切换动画是否进行中的标志位
            this.isAnimating = false;
            //轮播定时器
            // this.autoPlayTimer = null;
        },

        goTo: function(index) {

            //动画正在播放的情况下，不处理切换操作
            if (this.isAnimating) {
                return false;
            }

            let goToIndex = index;

            let len = goToIndex - this.curIndex;

            let _this = this;

            //上锁
            _this.isAnimating = true;

            this.$imgCt.animate({
                'left': '-=' + len * this.imgWidth
            }, function() {

                //更新当前显示图片下标
                _this.curIndex += len;

                //到图片头部和尾部的处理
                if (_this.curIndex === _this.imgsCount) {
                    //curIndex到最后一张图片的下一张时，位置立即移动到第一张图片的位置
                    _this.$imgCt.css({
                        left: -_this.imgWidth
                    });
                    //把当前图片index改为第一张图片
                    _this.curIndex = 0;
                } else if (_this.curIndex < 0) {
                    //curIndex到第一张图片的上一张时，位置立即移动到最后一张图片的位置
                    _this.$imgCt.css({
                        left: -(_this.imgsCount) * _this.imgWidth
                    });
                    //把当前图片index改为最后一张图片
                    _this.curIndex = _this.imgsCount - 1;
                }

                _this.setBulletDisplay(_this.curIndex);
                //解锁
                _this.isAnimating = false;
            })
        },

        setBulletDisplay: function(index) {
            let $bullets = this.$ct.find('.bullet-ct').find('li');

            $bullets.removeClass('active');
            $bullets.eq(index).addClass('active');
        },

        bind: function() {
            let _this = this;
            this.$btnNext.on('click', function(e) {
                e.preventDefault();
                _this.goTo(_this.curIndex + 1);
            });

            this.$btnPre.on('click', function(e) {
                e.preventDefault();
                _this.goTo(_this.curIndex - 1);
            });

            let $bulletCt = this.$ct.find('.bullet-ct');
            $bulletCt.on('click', 'li', function(e) {
                e.preventDefault();
                let $this = $(this);
                let index = $this.index();
                _this.goTo(index);
            })
        },

        autoPlay: function(millisecond) {
            let _this = this;

            setInterval(function() {
                _this.goTo(_this.curIndex + 1);
            }, millisecond);
        },
    }

    return {
        init: function($cts) {
            $cts.each(function(index, node) {
                new _Carousel($(node));
            })
        }
    }
});