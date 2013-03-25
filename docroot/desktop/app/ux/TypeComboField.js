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

Ext.define('ab.ux.TypeComboField', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.typecombofield',
    initComponent: function() {
        var me = this;
        var config = {
            triggerAction: 'all',
            store: [ 'Home', 'Work', 'Mobile' ],
            queryMode: 'local'
        };

        Ext.apply(me, Ext.apply(me.initialConfig, config));
        me.callParent(arguments);
    }
});
