(function() {
    function getQueryParam(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
        return match && decodeURIComponent(match[1]);
    }
    function hasQueryParam(name) {
        return location.search.indexOf(name) >= 0;
    }

    var theme = getQueryParam('theme'),
        rtl = hasQueryParam('rtl'),
        suffix = [],
        scriptEls = document.getElementsByTagName('script'),
        path = scriptEls[scriptEls.length - 1].src,
        i = 3;

    while (i--) {
        path = path.substring(0, path.lastIndexOf('/'));
    }
        
    if (theme && theme !== 'default') {
        suffix.push(theme);
    }
    if (rtl !== undefined) {
        suffix.push('rtl');
    } 

    suffix = (suffix.length) ? ('-' + suffix.join('-')) : '';

    document.write('<link rel="stylesheet" type="text/css" href="' + path + '/resources/css/ext-all' + suffix + '.css"/>');
    document.write('<script type="text/javascript" src="' + path + '/ext-all' + (rtl ? '-rtl' : '') + '.js"><\/script>');
})();