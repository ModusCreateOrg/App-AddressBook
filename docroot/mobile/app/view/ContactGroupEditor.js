/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/6/13
 * Time: 6:23 AM
 * To change this template use File | Settings | File Templates.
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
                    placeHolder: 'Group Name',
                    name: 'groupName'
                }
            ]
        });
//        me.add({
//            xtype: 'button',
//            ui: 'confirm',
//            style: 'margin: 10px',
//            text: 'Create Group',
//            action: 'create-group'
//        });
    }
});
