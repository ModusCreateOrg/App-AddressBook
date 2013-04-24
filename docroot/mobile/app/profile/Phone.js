/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/13/13
 * Time: 7:23 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

Ext.define('mobile.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Phone',
        controllers: [
            'Main'
        ],
        views: [
            'Main'
        ]
    },

    isActive: function() {
        if (Ext.os.is.Phone) console.log('is Phone');
        return Ext.os.is.Phone;
    },

    launch: function() {
        Ext.Ajax.request({
            url     : '../json/Schemas.json',
            scope   : this,
            success : this.onAfterSchemaLoad
        });
    },

    onAfterSchemaLoad : function (response) {
        var o;

        try {
            o = Ext.decode(response.responseText);
        }
        catch (e) {
            console.dir(e);
            Ext.Msg.alert('Error', 'Schemas did not load!  App cannot continue.');
        }
        mobile.schemas = o;

        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the login view
        Ext.Viewport.add(Ext.create('mobile.view.Login', {
            which: 'phone'
        }));
    }
});
