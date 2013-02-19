/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/12/13
 * Time: 7:50 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('mobile.controller.Login', {
    extend: 'Ext.app.Controller',

    requires: [
        'mobile.model.Login'
    ],

    config: {
        refs: {
            loginView: 'loginview'
        },
        control: {
            'loginview': {
                show: 'onFormShown',
                beforesubmit: 'onBeforeSubmit'
            },
            'loginview  button': {
                tap: 'onLoginButton'
            }
        }
    },

    init: function() {
//        console.log('init ' + this.$className);
    },

    onFormShown: function() {
        var form = this.getLoginView();
        var Login = Ext.ModelManager.getModel('mobile.model.Login');

        Login.load('saved', {
            success: function(login) {
                form.setValues({
                    username: login.get('username'),
                    password: login.get('password')
                });
            },
            failure: function() {
                console.log('load failed');
            }
        });
    },

    doLogin: function(form) {
        var fields = form.getValues();

        var login = Ext.create('mobile.model.Login', { id: 'saved', username: fields.username, password: fields.password });
        login.save();

        common.DreamFactory.login(fields.username, fields.password, function(o) {
            if (o.error) {
                var e = o.error[0],
                    code = e.code,
                    message = e.message;
                Ext.Msg.alert('Error ' + code, message);
            }
            else {
                Ext.Viewport.removeAll(true, true);
                Ext.Viewport.add(Ext.create('mobile.view.' + form.which + '.Main'));
            }
        });

    },

    onBeforeSubmit: function(form) {
        console.log('beforesubmit');
        this.doLogin(form);
        return false;
    },



    onLoginButton: function(button) {
        var me = this,
            form = button.up('loginview');

        me.doLogin(form);
//            fields = form.getValues();
//
//        var login = Ext.create('mobile.model.Login', { id: 'saved', username: fields.username, password: fields.password });
//        login.save();
//
//        common.DreamFactory.login(fields.username, fields.password, function(o) {
//            if (o.error) {
//                var e = o.error[0],
//                    code = e.code,
//                    message = e.message;
//                console.log('here');
//                console.log(code + ' ' + message);
//                Ext.Msg.alert('Error ' + code, message);
//            }
//            else {
//                Ext.Viewport.removeAll(true, true);
//                Ext.Viewport.add(Ext.create('mobile.view.' + form.which + '.Main'));
//            }
//        });

    }
});
