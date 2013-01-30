Ext.define('ab.controller.TabPanel', {
    extend : 'Ext.app.Controller',
    views  : [
        'TabPanel.Panel',
        'UsersTab.Panel'
    ],
    init   : function() {
        var me = this;

        me.control({
            '#change-password-item': {
                click: me.onChangePassword
            }
        });
    },
    onChangePassword: function() {
        this.getController('PasswordDialog').showDialog();
    }
});
