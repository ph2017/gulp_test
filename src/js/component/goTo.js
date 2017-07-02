define([
    'jquery',
], function(require, factory) {
    'use strict';

    function GoTo($ct, $target, text) {
        this.$ct = $ct;
        this.$target = $target;
        this.text = text;

        this.createNode();
        this.bindEvent();
    }

    GoTo.prototype = {
        createNode: function() {
            let $ct = this.$ct;
            let $goTo = $('<div class="goto-ct">' + this.text + '</div>');
            $ct.append($goTo);
        },

        bindEvent: function() {
            let self = this;
            let $goToCt = this.$ct.find('.goto-ct');
            $goToCt.on('click', function() {
                let targeOffsetTop = self.$target.offset().top;
                // let windowScrollTop = $(window).scrollTop();
                // console.log('windowScrollTop', windowScrollTop);
                // console.log('targeOffsetTop', targeOffsetTop);
                $(window).scrollTop(targeOffsetTop);
            })
        }
    }

    return {
        init: function($ct, $target, text) {
            new GoTo($ct, $target, text);
        }
    }
});