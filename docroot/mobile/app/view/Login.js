/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/12/13
 * Time: 6:47 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

Ext.define('mobile.view.Login', {
    extend     : 'Ext.form.Panel',
    xtype      : 'loginview',
    requires   : [
        'Ext.form.FieldSet',
        'Ext.field.Text',
        'Ext.field.Password'
    ],
    config     : {
        submitOnAction : true,
        fullscreen     : true,
        scrollable     : false
    },
    fullscreen : true,

    initialize : function () {
        this.callParent(arguments);
        this.add([
            {
                xtype    : 'fieldset',
                cls      : 'login-screen',
                defaults : {
                    autoComplete: false,
                    autoCorrect: false,
                    autoCapitilize: false,
                    clearIcon: false,
                    cls: 'login-input'
                },
                items    : [
                    {
                        xtype : 'textfield',
                        name  : 'username',
                        placeHolder: 'Username',
                    },
                    {
                        xtype : 'passwordfield',
                        name  : 'password',
                        placeHolder: 'Password'
                    },
                    {
                        xtype : 'button',
                        ui    : 'confirm',
                        style : 'margin: 10px 0',
                        text  : 'Sign In'
                    }
                ]
            }
        ]);
    }
});
