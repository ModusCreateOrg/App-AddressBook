/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/13/13
 * Time: 7:24 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('mobile.profile.Tablet', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Tablet',
        views: [
            'Main'
        ],
        controllers: [
            'Main'
        ]
    },

    isActive: function() {
        return Ext.os.is.Tablet;
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
            which: 'tablet'
        }));
    }
});