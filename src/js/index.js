define(function(require) {

    var messages = require('./math/messages');

    var print = require('./math/print');

    print(messages.getHello());

    // var jqueryTest = require('./math/jqueryTest');
    // jqueryTest.getBodyContent();

    var $ = require('jquery');
    $(function() {
        var carousel = require('./component/carousel');
        carousel.init($('.carousel'));

        var goTo = require('./component/goTo');
        goTo.init($('body'), $('.carousel').eq(0), 'Go Top');

        var sinaNews = require('./component/sinaNews');
        sinaNews.init($('.water-fall-ct'), $('.water-fall-ct .item'), $('.load-more'), 9);
    });

});