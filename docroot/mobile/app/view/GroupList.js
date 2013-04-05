/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/20/13
 * Time: 9:14 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

Ext.define('mobile.view.GroupList', {
    extend : 'Ext.dataview.List',
    xtype  : 'group_list',

    requires : [
        'Ext.data.Store',
        'Ext.Anim'
    ],

    config : {
        grouped  : false,
        indexBar : false,

        itemTpl : ''.concat(
            '{groupName}<span></span>'
        )
    },

    initialize : function () {
        console.log('initialize group list');
        var me = this,
            fields = [],
            schema = mobile.schemas.ContactGroups,
            url = mobile.data.serviceUrl + 'rest/db/' + schema.name;

        Ext.each(schema.fields, function (field) {
            fields.push({
                name : field.name,
                type : field.type
            });
        });

        me.setStore({
            fields    : fields,
            autoLoad  : true,
            proxy     : {
                type        : 'ajax',
                url         : url,
                reader      : {
                    type          : 'json',
                    rootProperty  : 'record',
                    idProperty    : schema.primaryKey,
                    totalProperty : 'meta.count'
                },
                headers     : {
                    'X-Application-Name' : 'add'
                },
                extraParams : me.extraParams,
                startParam  : false,
                limitParam  : false,
                pageParam   : false
            },
            sorters   : {
                sorterFn: function(a, b) {
                    if (a.raw.groupName === 'All Contacts') {
                        return -1;
                    }
                    a = a.raw.groupName.toLowerCase();
                    b = b.raw.groupName.toLowerCase();
                    return a.localeCompare(b);
                },
                direction: 'ASC'
            },
            listeners : {
                load : function (store) {
                    store.insert(0, {
                        contactGroupId : 0,
                        groupName      : 'All Contacts'
                    });
                    me.fireEvent('storeloaded');
                }
            }
        });

        me.callParent(arguments);
        me.del = null;
        me.on("itemswipe", function (dataview, ix, target, record, event, options) {
            var el = event.target;
            if (me.del || record.get('groupName') === 'All Contacts') {
                console.log('stop event');
                event.stopEvent();
                return false;
            }
            if (event.direction == "left") {
                me.deleteButton = true;
                me.del = Ext.create("Ext.Button", {
                    ui      : "decline",
                    text    : "Delete",
                    cls     : 'swipe-delete-button',
                    style   : "position:absolute;right:0.125in; margin-top: -40px",
                    handler : function (btn, e) {
                        Ext.Msg.confirm('Delete ' + record.data.groupName, 'Are you sure?', function (btn) {
                            if (btn === 'yes') {
                                me.fireEvent('deleteGroup', record.data.contactGroupId);
                            }
                        });
                        e.stopEvent();
                    }
                });
                var removeDeleteButton = function () {
                    if (!me.del) {
                        return;
                    }
                    Ext.Anim.run(me.del, 'fade', {
                        after : function () {
                            me.del.destroy();
                            delete me.del;
                        },
                        out   : true
                    });
                };
                me.del.renderTo(target.element);
                Ext.Anim.run(me.del, 'fade', {
                    out       : false,
                    autoClear : true,
                    duration  : 500
                });
                dataview.on({
                    single         : true,
                    buffer         : 250,
                    itemtouchstart : function () {
//                        console.dir('itemtouchstart');
                        removeDeleteButton();
                    }
                });
                dataview.element.on({
                    single     : true,
                    buffer     : 250,
                    touchstart : function () {
//                        console.dir('touchstart');
                        removeDeleteButton();
                    }
                });
            }
        });
    },

    highlightRecord : function (contactGroupId) {
        var me = this,
            index = me.getStore().find('contactGroupId', contactGroupId);

        me.select(index, false, true);
        Ext.Function.defer(function () {
            me.deselect(index, true);
        }, 500);
    }
});
