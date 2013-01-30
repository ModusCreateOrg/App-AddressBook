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

        rpc('Users.login', {
            params : {
                username : username,
                password : ab.ux.Utils.md5(password)
            },

            fn : function(o) {
                if (o.success) {
                    // global ab.user is user record of current logged in user
                    ab.data.user = o.user;
                    dialog.close();
                    me.application.fireEvent('loginsuccessful');

                }
                else {
                    dialog.errorMessage(o.message);
                    dialog.enable();
                }
            }
        });
    },

    onDialogShow : function(dialog) {
        dialog.down('#username').focus(false, 20);
    },
    onEnterKey   : function(view) {
        this.onLoginButton(view.down('#login-button'));
    }

});
