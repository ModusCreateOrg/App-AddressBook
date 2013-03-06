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
        'Ext.data.Store',
        'Ext.Anim'
    ],

    config: {
        grouped: false,
        indexBar: false,

        itemTpl: ''.concat(
            '{groupName}<span></span>'
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
                    totalProperty: 'meta.count'
                },
                headers: {
                    'X-Application-Name' : 'add'
                },
                extraParams: me.extraParams,
                startParam: false,
                limitParam: false,
                pageParam: false
            },
            listeners: {
                load: function(me) {
                    me.insert(0, {
                        contactGroupId: 0,
                        groupName: 'All Contact Groups'
                    });
                }
            }
        });

        me.callParent(arguments);
        me.on("itemswipe", function(dataview, ix, target, record, event, options) {
            var el = event.target;
            if (event.direction == "left") {
                var del = Ext.create("Ext.Button", {
                    ui: "decline",
                    text: "Delete",
                    style: "position:absolute;right:0.125in; margin-top: -40px",
                    handler: function(btn, e) {
                        console.dir(e);
                        console.dir(record);
                        Ext.Msg.confirm('Delete ' + record.data.groupName, 'Are you sure?', function(btn) {
                            if (btn === 'yes') {
                                me.fireEvent('deleteGroup', record.data.contactGroupId);
                            }
                        });
                        e.stopEvent();
//                        record.stores[0].remove(record);
//                        record.stores[0].sync();
                    }
                });
                var removeDeleteButton = function() {
                    Ext.Anim.run(del, 'fade', {
                        after: function() {
                            del.destroy();
                        },
                        out: true
                    });
                };
                del.renderTo(target.element);
                dataview.on({
                    single: true,
                    buffer: 250,
                    itemtouchstart: removeDeleteButton
                });
                dataview.element.on({
                    single: true,
                    buffer: 250,
                    touchstart: removeDeleteButton
                });
            }
        });
    }
});
