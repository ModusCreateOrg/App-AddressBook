/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/28/13
 * Time: 8:38 AM
 */

Ext.define('mobile.view.ContactEditor', {
    extend: 'Ext.form.Panel',
    xtype: 'contact_editor',

    requires: [
    ],

    initialize: function() {
        var me = this;

        me.callParent(arguments);
        Ext.iterate(mobile.schemas.Contacts.fields, function(field) {
            if (field.editor) {
                if (field.editor.xtype === 'textfield') {
                    me.add({
                        xtype: 'textfield',
                        label: field.header || field.editor.fieldLabel
                    });
                }
            }
        });
//        me.add({
//            xtype: 'textfield',
//            fieldLabel: 'First Name'
//        });
//        me.add({
//            xtype: 'textfield',
//            fieldLabel: 'Last Name'
//        });
    }

});
