
(function() {
    var date = function(value) {
        return Ext.Date.format(new Date(value * 1000), 'm/d/Y h:i:s A');
    };

    Ext.define('ab.ux.Renderers', {
        singleton : true,
        extend    : 'Ext.Base',
        creator : function(value, p, record) {
            return date(record.created) + '<br/>By ' + record.creatorInfo.username;
        },
        editor  : function(value, p, record) {
            return date(record.edited) + '<br/>By ' + record.editorInfo.username;
        }
    }, function(c) {
        window.r = c;
    });

}());

