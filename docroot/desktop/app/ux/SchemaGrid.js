Ext.define('ab.ux.SchemaGrid', {
    extend : 'Ext.grid.Panel',
    alias  : 'widget.schemagrid',

    autoSizeColumns : true,
    autoFill        : true,
    stripeRows      : true,
    trackMouseOver  : true,
    loadMask        : true,
    border          : false,

    selModel : {
        type : 'row',
        mode : 'MULTI'
    },

    initComponent : function() {
        var me = this,
            schema = me.schema,
            fields = schema.fields,
            id = me.id;

        me.store = me.buildStore(schema);
        //
        //        me.selModel = Ext.create('Ext.selection.RowModel', {
        //            mode      : 'MULTI',
        //            listeners : {
        //                scope    : me,
        //                select   : me.updatebuttons,
        //                deselect : me.updatebuttons
        //            }
        //        });

        var columns = me.columns = [],
            fieldHash = {},
            field,
            i;

        for (i in fields) {
            field = fields[i];
            fieldHash[field.name] = field;

            if (field.header && !field.serverOnly) {
                //                var flex = field.autoExpand ? 1 : 0;
                var column = {
                    header    : field.header,
                    hidden    : field.hidden,
                    id        : field.name + '-' + id,
                    format    : field.renderer,
                    dataIndex : field.name
                };

                column.renderer = Ext.bind(me.renderField, column);

                if (field.autoExpand) {
                    column.flex = 1;
                }
                else if (field.width) {
                    column.width = field.width;
                }

                columns.push(column);
            }
        }

        me.dockedItems = me.buildDockedItems();

        me.callParent(arguments);

        me.on({
            scope           : me,
            activate        : me.onActivate,
            itemcontextmenu : me.onItemContextMenu,
            select          : me.updatebuttons,
            deselect        : me.updatebuttons
        });
        me.fieldHash = fieldHash;
    },
    buildStore    : function(schema) {
        var me = this,
            extraParams = Ext.apply({
                method : 'list' + schema.name
            }, me.extraParams || {});

        return Ext.data.Store.create({
            root          : 'list',
            totalProperty : 'count',
            idProperty    : schema.primaryKey,
            proxy         : {
                type          : 'ajax',
                url           : '/services/' + schema.name + '.sjs',
                reader        : {
                    type          : 'json',
                    root          : 'list',
                    totalProperty : 'count'
                },
                extraParams   : extraParams,
                actionMethods : {
                    create  : 'POST',
                    read    : 'POST',
                    update  : 'POST',
                    destroy : 'POST'
                }
            },
            fields        : schema.fields,
            listeners     : {
                scope      : me,
                beforeload : me.onStoreBeforeLoad,
                load       : me.onStoreLoad
            }
        });
    },

    buildDockedItems : function() {
        var me = this,
            store = me.store,
            Action = Ext.Action,
            items = me.actions = [
                new Action({
                    text    : 'Add',
                    itemId  : 'add',
                    icon    : '/img/famfam/add.png',
                    scope   : me,
                    handler : me.onAddButton
                }),
                new Action({
                    text    : 'Edit',
                    itemId  : 'edit',
                    icon    : '/img/famfam/pencil.png',
                    scope   : me,
                    handler : me.onEditButton
                }),
                new Action({
                    text    : 'Delete',
                    itemId  : 'delete',
                    icon    : '/img/famfam/delete.png',
                    scope   : me,
                    handler : me.deleteRecords
                })
            ];

        if (me.filterable) {
            me.filterTask = new Ext.util.DelayedTask(me.filterTaskFn, me);

            items = items.concat([
                '->',
                'Filter: ',
                {
                    xtype           : 'textfield',
                    width           : 200,
                    itemId          : 'filterField',
                    enableKeyEvents : true,
                    listeners       : {
                        scope   : me,
                        keydown : me.onFilterFieldKeyDown
                    }
                }
            ]);
        }

        return [
            {
                xtype  : 'toolbar',
                itemId : 'topToolbar',
                dock   : 'top',
                items  : items
            },
            {
                xtype          : 'pagingtoolbar',
                dock           : 'bottom',
                store          : store,
                pageSize       : 25,
                displayInfo    : true,
                displayMsg     : 'Displaying ' + me.schema.name + ' {0} - {1} of {2}',
                beforePageText : 'Page',
                emptyMsg       : 'Nothing to Display'
            }
        ];

    },

    filterTaskFn : function() {

        this.store.load({
            _filter : this.down('#topToolbar').down('#filterField').getValue()
        });
    },

    updatebuttons : function() {
        var me = this,
            selections = me.getSelectionModel().getSelection(),
            deleteButton = me.actions[2],
            editButton = me.actions[1];

        if (selections.length) {
            deleteButton.enable();
            if (selections.length == 1) {
                editButton.enable();
            }
            else {
                editButton.disable();
            }
        }
        else {
            deleteButton.disable();
            editButton.disable();
        }
    },

    onAddButton : function() {
        this.editRecord();
    },

    onEditButton : function() {
        this.editRecord(this.getSelectionModel().getSelection()[0].data);
    },

    onActivate : function() {
        this.store.reload();
    },

    onStoreBeforeLoad : function(store) {
        store.getProxy().extraParams._filter = (this.filterable) ? this.down('#filterField').getValue() : '';
    },

    onStoreLoad : function(store) {
        this.updatebuttons();
    },

    editRecord : function(record) {
        record = record || {};

        record = Ext.apply(record, this.extraParams);

        this.showEditDialog(record);
    },

    onFilterFieldKeyDown : function() {
        this.filterTask.delay(250);
    },

    onItemContextMenu : function(view, moddel, itemEl, index, evtObj) {
        var menu = this.contextMenu || (
            this.contextMenu = Ext.create('Ext.menu.Menu', {
                items : this.actions
            })
        );

        evtObj.preventDefault();
        menu.showAt(evtObj.getXY());
    },

    showEditDialog : function(record) {

        var me = this,
            schema = me.schema,
            fields = schema.fields,
            primaryKey = schema.primaryKey,
            items = [],
            i,
            field,
            fieldLabel,
            cfg;

//        debugger;
        for (i in fields) {
            field = fields[i];

            if (field.editor) {
                fieldLabel = field.header || field.editor.fieldLabel;

                cfg = Ext.apply({
                    fieldLabel : fieldLabel,
                    name       : field.name,
                    value      : record[field.name]
                }, field.editor);

                items.push(cfg);
            }
        }


        var win = Ext.create('Ext.window.Window', {
            title  : record[primaryKey] ? 'Edit Record' : 'Add Record',
            width  : 400,
            height : 0,
            modal  : true,
            border : false,
            record : record,
            items  : {
                xtype      : 'form',
                scrollable : true,
                frame      : true,
                labelWidth : 150,
                items      : items
            },

            buttons : [
                {
                    text    : 'OK',
                    scope   : this,
                    handler : this.onWindowOkBtn
                },
                {
                    text    : 'Cancel',
                    handler : function(btn) {
                        btn.up('window').close();
                    }
                }
            ]
        });

        win.show();

        var winEl = win.el,
            elHeight =  winEl.getHeight(),
            form = win.down('form'),
            newHeight = form.getHeight() + elHeight + 10,
            yPos = winEl.getTop() - (newHeight / 2),
            winBody = win.body,
            buttonBarEl = win.down('[ui=footer]').el;

        buttonBarEl.hide();
        buttonBarEl.fadeOut({duration:1});
        winBody.fadeOut({duration:1});

        win.el.animate({
            y        : yPos,
            height   : newHeight,
            duration : 500,
            callback : function() {
                buttonBarEl.show();

                win.setHeight(newHeight);
                winBody.fadeIn({duration: 500});
                buttonBarEl.fadeIn({duration: 500});
                Ext.Function.defer(function() {
                    form.items.items[0].focus()
                }, 600)
            }
        });
    },

    onWindowOkBtn : function(btn) {

        var me     = this,
            errors = [],
            bullet = '<img src="/img/famfam/bullet_error.png" style="vertical-align: middle; align: left;" /> ',
            win    = btn.up('window'),
            record = win.record,
            schema = me.schema;

        win.down('form').items.each(function(cmp) {
            if (!cmp.getValue) {
                return;
            }

            var v = cmp.getValue();
            if (cmp.required && !v.length) {
                cmp.markInvalid('Required');
                errors.push(bullet + cmp.fieldLabel + ' is required.');
            }
            record[cmp.name] = v;
        });

        debugger;

        if (errors.length) {
            Ext.MessageBox.alert('Errors in form', errors.join('<br/>\n'));
            return;
        }

        Ext.Ajax.request({
            url     : '/services/' + schema.name + '.sjs',
            params  : {
                method  : 'edit' + schema.name.replace(/s$/, ''),
                example : Ext.encode(record)
            },
            success : function(response) {
                btn.up('window').close();
                me.store.load();
            }
        });
    },

    deleteRecords : function() {
        var me = this,
            schema = me.schema,
            records = me.getSelectionModel().getSelection(),
            len = records.length,
            examples;

        if (len) {
            Ext.MessageBox.confirm('Delete ' + len + ' Record(s) ', 'Are you sure?', function(btn) {
                if (btn !== 'yes') {
                    return;
                }
                examples = [];

                Ext.each(records, function(record) {
                    examples.push(record.data);
                });

                rpc(schema.name + '.delete' + schema.name, {
                    params : {
                        examples : Ext.encode(examples)
                    },
                    fn     : function(o) {
                        if (!o.success) {
                            Ext.MessageBox.alert('Error', o.message);
                        }
                        else {
                            me.fireEvent('deleterecords', me, records);
                            me.store.load();
                        }
                    }
                });
            });
        }
    },
    renderField   : function(value, p, r) {
        // todo optimize
        var me = this,
            renderer = me.format;

        if (renderer && ab.ux.Renderers[renderer]) {
            return ab.ux.Renderers[renderer](value, p, r.data);
        }
        else {
            return value;
        }
    },
    destroy       : function() {
        var contextMenu = this.contextMenu;

        if (contextMenu) {
            contextMenu.destroy();
            delete this.contextMenu;
        }

        this.callParent(arguments);
    }
});
