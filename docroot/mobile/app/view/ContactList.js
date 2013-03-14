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
//            '<div class="contact">',
//                '<div class="photo" style="background-image: url(http://src.sencha.io/30/{imageUrl});"></div>',
            '{firstName} <span class="last_name">{lastName}</span>'
//            '</div>'
        )
    },
    initialize : function () {
        var me = this,
            fields = [],
            schema = me.getSchema(),
            url = mobile.data.srviceUrl + 'rest/db/' + schema.name;

        Ext.each(schema.fields, function (schemaItem) {
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
                    property  : 'lastName',
                    direction : 'ASC'
                },
                {
                    property  : 'firstName',
                    direction : 'ASC'
                }
            ],

            grouper : {
                groupFn      : function (record) {
                    var last_name = record.get('lastName');
                    return (last_name === null || last_name === '') ? '&nbsp' : last_name.substr(0, 1).toUpperCase();
                },
                sortProperty : 'lastName'
            },

            filters: {
                filterFn: function(record) {
//                    if (mobile.data.contactIds) {
//                        debugger;
//                    }
                    if (mobile.data.contactIds && mobile.data.contactIds.indexOf(parseInt(''+record.data.contactId, 10)) === -1) {
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
                    ui: "decline",
                    cls: 'swipe-delete-button',
                    text: "Delete",
                    style: "position:absolute;right:0.125in; margin-top: -40px",
                    handler: function(btn, e) {
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
                        after: function() {
                            del.destroy();
                            delete me.del;
                        },
                        out: true
                    });
                };
                del.renderTo(target.element);
                Ext.Anim.run(me.del, 'fade', {
                    out: false,
                    autoClear: true,
                    duration: 500
                });
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