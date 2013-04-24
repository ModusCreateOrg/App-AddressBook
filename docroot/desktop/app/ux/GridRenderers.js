/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/25/13
 * Time: 6:06 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

(function() {
    var date = function(value) {
        return Ext.Date.format(new Date(value * 1000), 'm/d/Y h:i:s A');
    };

    Ext.define('ab.ux.Renderers', {
        singleton : true,

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

