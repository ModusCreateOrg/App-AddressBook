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

        ab.ux.DreamFactory.login(username, password, function(o) {
            ab.data.user = o;
            dialog.close();
            me.application.fireEvent('loginsuccessful');
        });
//        Ext.Ajax.request({
//            url: '/service/REST/User/Login',
//            method: 'POST',
//            headers: {
//                'X-Application-Name': 'add'
//            },
//            jsonData: {
//                username: username,
//                password: password
//            },
//            success: function(response) {
//                var o = Ext.decode(response.responseText);
//                    ab.data.user = o;
//                    dialog.close();
//                    me.application.fireEvent('loginsuccessful');
//                console.dir(o);
//            }
//        });

//        rpc('Users.login', {
//            params : {
//                username : username,
//                password : ab.ux.Utils.md5(password)
//            },
//
//            fn : function(o) {
//                if (o.success) {
//                    // global ab.user is user record of current logged in user
//                    ab.data.user = o.user;
//                    dialog.close();
//                    me.application.fireEvent('loginsuccessful');
//
//                }
//                else {
//                    dialog.errorMessage(o.message);
//                    dialog.enable();
//                }
//            }
//        });
    },

    onDialogShow : function(dialog) {
        dialog.down('#username').focus(false, 20);
    },
    onEnterKey   : function(view) {
        this.onLoginButton(view.down('#login-button'));
    }

});
