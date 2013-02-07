//<debug>
Ext.Loader.setConfig({
    enabled : true
//    // disableCaching: false,
//    paths   : {
//        ab : 'app'
//    }
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
        'ab.ux.DreamFactory'
    ],
    controllers : [
        'LoginDialog',
        'PasswordDialog',
        'Main'
    ]
});
