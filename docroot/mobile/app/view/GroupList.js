/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/20/13
 * Time: 9:14 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('mobile.view.GroupList', {
    extend: 'Ext.dataview.List',
    xtype: 'group_list',

    requires: [
        'Ext.data.Store'
    ],

    config: {
        grouped: false,
        indexBar: false,

        itemTpl: ''.concat(
            '{groupName}'
        )
    },

    initialize: function() {
        var me = this,
            fields = [],
            schema = mobile.schemas.ContactGroups,
            url = mobile.data.serviceUrl + 'rest/db/' + schema.name;

        Ext.each(schema.fields, function(field) {
            fields.push({
                name: field.name,
                type: field.type
            });
        });

        this.setStore({
            fields: fields,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: url,
                reader: {
                    type: 'json',
                    rootProperty: 'record',
                    idProperty: schema.primaryKey,
                    totalProperty: 'meta.count',
                    record: 'fields'
                },
                headers: {
                    'X-Application-Name' : 'add'
                },
                extraParams: me.extraParams,
                startParam: false,
                limitParam: false,
                pageParam: false
            }
        });

        me.callParent(arguments);
    }
});
