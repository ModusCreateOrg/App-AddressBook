/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/12/13
 * Time: 7:04 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('mobile.model.Login', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'id',
            'username',
            'password'
        ],
        proxy: {
            type: 'localstorage',
            id: 'mobile-login'
        }
    }
});
