/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/6/13
 * Time: 6:23 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

Ext.define("mobile.view.ContactList", {

    extend : 'Ext.dataview.List',
    xtype  : 'contact_list',

    requires : [
        'Ext.data.Store'
    ],

    config     : {
        grouped  : true,
        indexBar : true,
        schema   : false,

        itemTpl : ''.concat(
            '<span class="first_name">{firstName}</span> <span class="last_name">{lastName}</span>'
        )
    },
    initialize : function() {
        var me = this,
            fields = [],
            schema = me.getSchema(),
            url = mobile.data.serviceUrl + 'rest/db/' + schema.name;

        Ext.each(schema.fields, function(schemaItem) {
            if (!schemaItem.header) {
                return;
            }

            fields.push({
                name : schemaItem.name,
                type : schemaItem.type
            });
        });


        this.setStore({
            fields   : fields,
            autoLoad : true,
            proxy    : {
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
            sorters  : [
                {
                    sorterFn  : function(a, b) {
                        // this logic is presented for clarity, not for elegance
                        a = a.raw.lastName + ' ' + a.raw.firstName;
                        a = a.toLowerCase();
                        b = b.raw.lastName + ' ' + b.raw.firstName;
                        b = b.toLowerCase();
                        return a.localeCompare(b);
                    },
                    direction : 'ASC'
                }
            ],

            grouper : {
                groupFn : function(record) {
                    var last_name = record.get('lastName');
                    return (last_name === null || last_name === '') ? '&nbsp' : last_name.substr(0, 1).toUpperCase();
                }
            },

            filters : {
                filterFn : function(record) {
                    if (mobile.data.contactIds && mobile.data.contactIds.indexOf(parseInt('' + record.data.contactId, 10)) === -1) {
                        return false;
                    }
                    if (me.search && me.search.length) {
                        var s = me.search.toLowerCase(),
                            r = record.data;
                        return r.firstName.toLowerCase().indexOf(s) !== -1 || r.lastName.toLowerCase().indexOf(s) !== -1;
                    }
                    return true;
                }
            }
        });

        me.callParent(arguments);
        me.setScrollToTopOnRefresh(false);
        me.del = null;
        me.on("itemswipe", function(dataview, ix, target, record, event, options) {
            var el = event.target;
            if (me.del) {
                console.log('stop event');
                event.stopEvent();
                return false;
            }
            if (event.direction == "left") {
                me.deleteButton = true;
                var del = me.del = Ext.create("Ext.Button", {
                    ui      : "decline",
                    cls     : 'swipe-delete-button',
                    text    : "Delete",
                    style   : "position:absolute;right:0.125in; margin-top: -40px",
                    handler : function(btn, e) {
                        Ext.Msg.confirm('Delete ' + record.data.firstName + ' ' + record.data.lastName, 'Are you sure?', function(btn) {
                            if (btn === 'yes') {
                                me.fireEvent('deleteContact', record.data.contactId);
                            }
                        });
                        e.stopEvent();
                    }
                });
                var removeDeleteButton = function() {
                    Ext.Anim.run(del, 'fade', {
                        after : function() {
                            del.destroy();
                            delete me.del;
                        },
                        out   : true
                    });
                };
                del.renderTo(target.element);
                Ext.Anim.run(me.del, 'fade', {
                    out       : false,
                    autoClear : true,
                    duration  : 500
                });
                dataview.on({
                    single         : true,
                    buffer         : 250,
                    itemtouchstart : removeDeleteButton
                });
                dataview.element.on({
                    single     : true,
                    buffer     : 250,
                    touchstart : removeDeleteButton
                });
            }
        });

    }
});