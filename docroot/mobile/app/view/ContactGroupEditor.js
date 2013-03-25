/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/6/13
 * Time: 6:23 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

Ext.define('mobile.view.ContactGroupEditor', {
    extend: 'Ext.form.Panel',
    xtype: 'contact_group_editor',

    requires: [
    ],

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.add({
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'textfield',
                    placeHolder: 'Group Name (required)',
                    name: 'groupName'
                }
            ]
        });
    }
});
