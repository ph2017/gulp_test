define([
    'jquery',
], function($) {
    'use strict';

    function Exposure($target, callback) {
        this.$target = $target;
        this.callback = callback;
        this.timerID = null;

    }

    Exposure.prototype = {
        init: function() {
            this.bind();

            $(window).trigger('scroll');
        },

        one: function() {
            let _this = this;

            $(window).on('scroll', function() {
                // 先清除之前的定时器
                if (_this.timerID) {
                    clearTimeout(_this.timerID);
                }
                // 使用定时器，防止滑动过快时产生多次加载，提高效率
                _this.timerID = setTimeout(function() {
                    let value = _this.check(_this.$target);
                    if (value) {
                        _this.$target.trigger('exposure.myOneEvent');
                    }
                }, 300);
            })

            this.$target.on('exposure.myOneEvent', function() {
                $(window).off('scroll');
            })

            $(window).trigger('scroll');
        },

        bind: function() {
            let _this = this;
            $(window).on('scroll', function() {
                // 先清除之前的定时器
                if (_this.timerID) {
                    clearTimeout(_this.timerID);
                }
                // 使用定时器，防止滑动过快时产生多次加载，提高效率
                _this.timerID = setTimeout(function() {
                    _this.check(_this.$target);
                }, 300);

                // _this.callback(_this.$target);
            })
        },

        isVisiable: function($node) {
            var windowHeight = $(window).height();
            var windowScrollTop = $(window).scrollTop();
            var nodeOffsetTop = $node.offset().top;

            // windowHeight + windowScrollTop > nodeOffsetTop 的情况下，表示$node在可视区
            // 提前50px加载
            if (windowHeight + windowScrollTop + 50 > nodeOffsetTop) {
                return true;
            }

            return false;
        },

        check: function($node) {
            //如果node进入可视区，并且this.one不为true，则执行callback
            // if (this.isVisiable($node) && !this.one) {
            if (this.isVisiable($node)) {
                // console.log('看到了！！');
                this.callback($node);
                //执行了callback后返回true
                return true;
            }
            return false;
        },

    }

    return {
        init: function($target, callback) {
            $target.each(function(index, node) {
                let exposure = new Exposure($(node), callback);
                exposure.init();
            })
        },

        one: function($target, callback) {
            $target.each(function(index, node) {
                let oneExposure = new Exposure($(node), callback);
                oneExposure.one();
            })
        }
    }

});