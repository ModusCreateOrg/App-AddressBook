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
            username = dialog.down('#username').getValue().trim(),
            password = dialog.down('#password').getValue();

        if (!username.length || !password.length) {
            dialog.errorMessage('Username and Password fields are required');
            return;
        }

        dialog.disable();
        dialog.setMessage('Logging in...');

        common.DreamFactory.login(username, password, function(o) {
            ab.data.user = o;
            dialog.close();
            me.application.fireEvent('loginsuccessful');
        });
    },

    onDialogShow : function(dialog) {
        dialog.down('#username').focus(false, 20);
    },
    onEnterKey   : function(view) {
        this.onLoginButton(view.down('#login-button'));
    }

});
