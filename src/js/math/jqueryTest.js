define(['jquery'], function($) {
    return {
        getBodyContent: function() {
            let content = $('body').html();
            console.log('content', content);
        }
    }
});