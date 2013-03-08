/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/28/13
 * Time: 8:38 AM
 */

Ext.define('mobile.view.ContactEditor', {
    extend : 'Ext.form.Panel',
    xtype  : 'contact_editor',

    requires : [
    ],

    initialize : function () {
        var me = this,
            details = me.details;

        console.log('initialize contact editor');
        console.dir(me.details);
        me.callParent(arguments);
        var items = [];
        Ext.iterate(mobile.schemas.Contacts.fields, function (field) {
            if (field.editor) {
                console.dir(field);
                if (field.editor.xtype === 'textfield') {
                    items.push({
                        xtype       : 'textfield',
                        placeHolder : field.header || field.editor.fieldLabel,
                        value       : details ? details.get(field.name) : undefined
                    });
                }
            }
        });

        me.add({
            xtype : 'fieldset',
            title : 'Contact Details',
            items : items
        });

        Ext.iterate(['Home', 'Work', 'Mobile'], function (what) {
            var detail = false;
            if (me.details && me.details.info) {
                Ext.iterate(me.details.info, function (info) {
                    if (info.infoType === what) {
                        detail = info;
                    }
                });
            }
            var items = [];
            Ext.iterate(mobile.schemas.ContactInfo.fields, function (field) {
                if (field.editor) {
                    if (field.editor.xtype === 'typecombofield') {
                        items.push({
                            xtype: 'hiddenfield',
                            value: what
                        });
                    }
                    else {
                        items.push({
                            xtype       : 'textfield',
                            placeHolder : field.header || field.editor.fieldLabel,
                            value       : detail ? detail[field.name] : undefined
                        });
                    }
                }
            });
            me.add({
                xtype : 'fieldset',
                title : what + ' Information',
                items : items
            });
        });
    }

});
