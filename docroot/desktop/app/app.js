/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 8/15/12
 * Time: 7:02 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

//<debug>
Ext.Loader.setConfig({
    enabled : true,
//    // disableCaching: false,
    paths   : {
        common : '../common'
    }
});
//</debug>

Ext.application({
    name        : 'ab',
    appFolder   : 'app',
    requires    : [
        'Ext.container.Viewport',
        'ab.ux.Utils',
        'ab.ux.Renderers',
        'ab.ux.SchemaGrid',
        'ab.ux.PasswordField',
        'ab.ux.TypeComboField',
        'common.DreamFactory'
    ],
    controllers : [
        'LoginDialog',
        'PasswordDialog',
        'Main'
    ]
});
