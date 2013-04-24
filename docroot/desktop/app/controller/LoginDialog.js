/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/11/13
 * Time: 7:17 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

Ext.define('ab.controller.LoginDialog', {
    extend : 'Ext.app.Controller',
    views  : [
        'LoginDialog'
    ],

    init   : function() {
        var me = this;

        me.control({
            '#login-button' : {
                click : me.onLoginButton
            },
            'loginDialog'   : {
                enterkey : me.onEnterKey,
                show     : me.onDialogShow
            }
        });

    },

    showDialog : function() {
        Ext.create('ab.view.LoginDialog').show();
    },

    onLoginButton : function(btn) {
        var me = this,
            dialog = btn.up('window'),
            email = dialog.down('#email').getValue().trim(),
            password = dialog.down('#password').getValue();

        if (!email.length || !password.length) {
            dialog.errorMessage('Email and Password fields are required');
            return;
        }

        dialog.disable();
        dialog.setMessage('Logging in...');

        common.DreamFactory.login(email, password, function(o) {
            if (o.error) {
                dialog.enable();
                dialog.setMessage('Log In Failed');
                Ext.Msg.alert('Server Error ' + o.error[0].code, o.error[0].message);
                return;
            }
            ab.data.user = o;
            dialog.close();
            me.application.fireEvent('loginsuccessful');
        });
    },

    onDialogShow : function(dialog) {
        dialog.down('#email').focus(false, 20);
    },
    onEnterKey   : function(view) {
        this.onLoginButton(view.down('#login-button'));
    }

});
