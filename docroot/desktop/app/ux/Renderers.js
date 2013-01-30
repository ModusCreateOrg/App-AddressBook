/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 8/15/12
 * Time: 7:02 AM
 * To change this template use File | Settings | File Templates.
 */

/*global Ext */
(function() {
    "use strict";

    function date(value) {
        return Ext.Date.format(new Date(value*1000), 'm/d/Y h:i:s A');
    }

    Ext.define('ab.ux.Renderers', {
        singleton: true,
        extend: 'Ext.Base',
        creator: function(value, p, record) {
            return date(record.created) + '<br/>By ' + record.creatorInfo.username;
        },
        editor: function(value, p, record) {
            return date(record.edited) + '<br/>By ' + record.editorInfo.username;
        }
    });

}());
