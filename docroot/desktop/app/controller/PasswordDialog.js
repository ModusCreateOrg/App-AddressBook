Ext.define('ab.controller.PasswordDialog', {
    extend: 'Ext.app.Controller',

    views: [
        'PasswordDialog'
    ],

    init: function() {
        var me = this;

        me.control({
            '#ok-button'     : {
                click : me.onOkButton
            },
            '#cancel-button' : {
                click : me.onCancelButton
            }
        });
    },
    onOkButton: function(btn) {
        var win     = btn.up('window'),
            cmp     = win.down('form').down('#password'),
            isValid = cmp.isValid();

        if (!isValid) {
            return;
        }

        win.disable();

        rpc('Users.changePassword', {
            params: {
                userId   : ab.data.user.userId,
                password : cmp.getValue()
            },
            fn: function(o) {
                (o.success) ? win.close() : win.enable();
            }
        });
    },

    onCancelButton: function(btn) {
        btn.up('window').close();
    },

    showDialog: function() {
        Ext.create('ab.view.PasswordDialog').show();
    },

    onDialogShow: function(dialog) {

    }
});
