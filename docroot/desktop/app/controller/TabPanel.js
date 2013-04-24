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
Ext.define('ab.controller.TabPanel', {
    extend : 'Ext.app.Controller',
    // views  : [
    //     'TabPanel.Panel',
    //     'UsersTab.Panel'
    // ],
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
