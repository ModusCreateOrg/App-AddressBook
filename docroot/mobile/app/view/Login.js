/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/12/13
 * Time: 6:47 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('mobile.view.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'loginview',
    requires: [
        'Ext.field.Text',
        'Ext.field.Password'
    ],
//    fullscreen: true,

    initialize: function() {
        console.log('initialize login panel');
        this.callParent();
        this.add([
            {
                xtype: 'fieldset',
                defaults: {
                    labelWidth: 100
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'username',
                        label: 'User Name'
                    },
                    {
                        xtype: 'passwordfield',
                        name: 'password',
                        label: 'Password'
                    },
                    {
                        xtype: 'button',
                        text: 'Log In'
                    }
                ]
            }
        ]);
    }


});
