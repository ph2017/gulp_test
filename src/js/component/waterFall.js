define([
    'jquery'
], function($, factory) {
    'use strict';

    function WaterFall($ct, $item) {
        //瀑布流容器
        this.$ct = $ct;
        //瀑布流中的单个块元素item
        this.$item = $item;
        this.init();
    }

    WaterFall.prototype.init = function() {
        //瀑布布局的每列高度数组
        this.cloumArray = [];
        //瀑布流容器的宽度
        this.waterFallCtWidth = this.$ct.width();
        //单个图片块的宽度与高度
        this.itemWidth = this.$item.outerWidth(true);

        this.cloumArrayInit();
    }

    //总列数初始化方法
    WaterFall.prototype.cloumArrayInit = function() {
        //瀑布流容器的宽度
        let waterFallCt = this.waterFallCtWidth;
        //单个图片块的宽度与高度
        let itemWidth = this.itemWidth;
        let array = this.cloumArray;
        if (array instanceof Array) {
            let cloumCount = parseInt(waterFallCt / itemWidth);
            for (var i = 0; i < cloumCount; i++) {
                array[i] = 0;
            }
        }
    }

    //瀑布流布局处理方法
    WaterFall.prototype.waterFallPlace = function($nodes) {
        let $items = $nodes;
        let _this = this;
        $items.each(function(index, element) {
            var $this = $(element);

            var minHeight = Math.min.apply(null, _this.cloumArray);
            var minHeightIndex = _this.cloumArray.indexOf(minHeight);

            $this.css({
                top: minHeight,
                left: _this.itemWidth * minHeightIndex
            })

            _this.cloumArray[minHeightIndex] += $this.outerHeight(true);

            _this.$ct.height(Math.max.apply(null, _this.cloumArray));
        })
    }

    WaterFall.prototype.bind = function() {

    }

    return {
        init: function($ct, $item) {
            return new WaterFall($ct, $item);
        },

        waterFallRender: function(waterFallObject, $nodes) {
            waterFallObject.waterFallPlace($nodes);
        }
    }
});