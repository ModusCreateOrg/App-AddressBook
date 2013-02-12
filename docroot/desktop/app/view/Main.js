(function() {

    function deleteContactRecords(records, callback) {
        var me = this,
            toDelete = [];

        Ext.iterate(records, function(value) {
            toDelete.push(value);
        });

        function deleteOne() {
            var recordId = toDelete.shift();
            if (!recordId) {
                if (callback) {
                    callback();
                }
                return;
            }

            common.DreamFactory.filterRecords(ab.Schemas.ContactInfo.name, {
                fields   : 'infoId',
                where    : 'contactId=' + recordId,
                callback : function(o) {
                    var associated = [];
                    Ext.iterate(o.record, function(record) {
                        associated.push(record.fields.infoId);
                    });
                    deleteInfoRecords(associated, function() {
                        common.DreamFactory.deleteRecord(ab.Schemas.Contacts.name, recordId, function() {
                            Ext.defer(deleteOne, 0);
                        });
                    });
                }
            });
        }

        deleteOne();
    }

    function deleteInfoRecords(records, callback) {
        var me = this,
            toDelete = [];

        Ext.iterate(records, function(value) {
            toDelete.push(value);
        });
        function deleteOne() {
            var recordId = toDelete.shift();
            if (!recordId) {
                if (callback) {
                    callback();
                }
                return;
            }
            common.DreamFactory.deleteRecord(ab.Schemas.ContactInfo.name, recordId, function() {
                Ext.defer(deleteOne, 0);
            });
        }

        deleteOne();
    }


    Ext.define('ab.view.Main', {
        extend   : 'Ext.panel.Panel',
        alias    : 'widget.main',
        requires : [ 'Ext.form.Panel', 'Ext.tab.Panel' ],
        layout   : 'fit',
        border   : false,

        dockedItems : {
            xtype  : 'toolbar',
            dock   : 'top',
            height : 34,
            itemId : 'header-bar',
            items  : [
                {
                    xtype : 'component',
                    width : 400,
                    html  : '<img style="margin: 0 5px 0 5px; float: left;" src="../img/Modus-create-logo-only.png" />' +
                        '<span style="font-size: 24px;">Modus Create Address Book</span>'

                },
                '->',
                '<span id="clock"></span>',
                '-',
                {
                    text   : '', //ab.user.username
                    itemId : 'user-button',
                    icon   : '../img/famfam/user.png',
                    menu   : [
                        {
                            text   : 'Log Out',
                            action : 'logout',
                            icon   : '../img/famfam/control_power_blue.png'
                        },
                        '-',
                        {
                            text   : 'Change Password...',
                            icon   : '../img/famfam/cog.png',
                            itemId : 'change-password-item'
                        }
                    ]
                }
            ]
        },

        initComponent             : function() {
            var me = this,
                layout = true,
                runner = new Ext.util.TaskRunner();

            runner.start({
                interval : 1000,
                run      : function() {
                    var el = Ext.fly('clock'),
                        text = Ext.util.Format.date(new Date(), 'D M j Y g:i:s A');

                    el.update(text);

                    if (layout) {
                        me.down('#header-bar').doLayout();
                        layout = false;
                    }
                }
            });

            me.items = me.buildItems();

            me.callParent(arguments);
            me.on('destroy', function() {
                Ext.TaskManager.stop(runner);
            });

            me.on({
                scope       : me,
                afterrender : me.onAfterRenderUpdateButton
            });
        },
        buildItems                : function() {
            var me = this;
            return {
                xtype      : 'tabpanel',
                itemId     : 'ab-tabPanel',
                activeItem : 0,
                border     : false,
                items      : [
                    {
                        xtype      : 'schemagrid',
                        title      : 'Contacts',
                        border     : false,
                        icon       : '../img/famfam/group.png',
                        schema     : ab.Schemas.Contacts,
                        filterable : true,
                        deleteFn   : deleteContactRecords,
                        listeners  : {
                            scope         : me,
                            deleterecords : me.onSchemaGridDeleteRecords,
                            itemdblclick  : me.onSchemaGridItemDblClick
                        }
                    }
                ]
            }
        },
        onSchemaGridDeleteRecords : function(grid, records) {
            var tabPanel = this.down('#ab-tabPanel');
            Ext.iterate(records, function(record) {
                var cmp = this.down('#userInfo-grid-' + record.data.contactId);
                if (cmp) {
                    tabPanel.remove(cmp);
                }
            }, this);
        },

        onSchemaGridItemDblClick : function(view, record) {
            var me = this,
                tabPanel = me.down('#ab-tabPanel'),
                recordData = record.data,
                tab = me.down('#userInfo-grid-' + recordData.contactId),
                title = recordData.firstName + ' ' + recordData.lastName;

    //        console.log(title + " selected", recordData);
            if (!tab) {
                tab = tabPanel.add({
                    xtype       : 'schemagrid',
                    title       : Ext.String.ellipsis(title, 15),
                    itemId      : 'userInfo-grid-' + recordData.contactId,
                    icon        : '../img/famfam/user_b.png',
                    userInfo    : recordData,
                    schema      : ab.Schemas.ContactInfo,
                    closable    : true,
                    deleteFn    : deleteInfoRecords,
                    extraParams : {
                        filter : 'contactId=' + record.data.contactId
                    },
                    extraFields : {
                        contactId : record.data.contactId
                    }
                });
            }

            tabPanel.setActiveTab(tab);
        },

        onAfterRenderUpdateButton : function() {
            var user = ab.data.user;
            this.down('#user-button').setText(user.display_name);
        }
    });

}());
