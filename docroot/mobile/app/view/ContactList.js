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
            '<span id="contact-list-{contactId}" class="first_name">{firstName}</span> <span class="last_name">{lastName}</span>'
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
                        // it could be a single line returning localeCompare() of the two strings
                        a = a.lastName + ' ' + a.firstName;
                        a = a.toLowerCase();
                        b = b.lastName + ' ' + b.firstName;
                        b = b.toLowerCase();
                        if (a > b) {
                            return 1;
                        }
                        if (a === b) {
                            return 0;
                        }
                        return -1;
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

    },

    selectWithScroll : function(record, suppressEvent) {
        var me = this, index;
        if (me.getDisableSelection()) {
            return;
        }
        index = me.getStore().indexOf(record);
        me.doScrollSelect(record, index, suppressEvent);
    },
    doScrollSelect   : function(record, index, suppressEvent) {
        var me = this,
            selected = me.selected;
        if (me.getDisableSelection()) {
            return;
        }
        if (me.isSelected(record)) {
            return;
        }
        if (selected.getCount() > 0) {
            me.deselect(me.getLastSelected(), suppressEvent);
        }
        selected.add(record);
        me.setLastSelected(record);
        me.onItemSelect(record, suppressEvent);
        me.setLastFocused(record);

        if (index > 0) {
            var scroller = me.getScrollable().getScroller(),
                direction = scroller.getDirection(),
                itemScroll;
            if (direction == 'vertical') {
                itemScroll = (me.getItemHeight() * index);
                scroller.scrollTo(0, itemScroll);
            }
            else if (direction == 'horizontal') {
                itemScroll = (me.getItemWidth() * index);
                scroller.scrollTo(itemScroll, 0);
            }
        }
        if (!suppressEvent) {
            me.fireSelectionChange([record]);
        }
    }

});