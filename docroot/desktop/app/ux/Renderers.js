/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 8/15/12
 * Time: 7:02 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
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
