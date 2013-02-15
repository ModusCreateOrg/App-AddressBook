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
        ]
    },

    isActive: function() {
        console.log('tablet isActive');
        return Ext.os.is.Tablet;
    }
});
