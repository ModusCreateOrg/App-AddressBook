/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 8/15/12
 * Time: 7:02 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

(function () {

    function loadContactRecord(record, callback) {
        var allGroups = [],
            groups = [];

        common.DreamFactory.filterRecords(ab.Schemas.ContactGroups.name, {
            fields   : 'contactGroupId,groupName',
            callback : function (o) {
                Ext.iterate(o.record, function (record) {
                    allGroups.push({
                        value   : record.contactGroupId,
                        display : record.groupName,
                        checked : false
                    });
                });
                if (record && record.contactId) {
                    common.DreamFactory.filterRecords(ab.Schemas.Contacts.name, {
                        where    : 'contactId=' + record.contactId,
                        callback : function (o) {
                            record = o.record[0];
                            if (!record.contactId) {
                                Ext.Msg.alert('Error', 'Contact has been removed and can no longer be edited.');
                                if (callback) {
                                    callback(false);
                                }
                                return;
                            }
                            common.DreamFactory.filterRecords(ab.Schemas.ContactRelationships.name, {
                                fields   : 'contactGroupId',
                                where    : 'contactId=' + record.contactId,
                                callback : function (o) {
                                    Ext.iterate(o.record, function (record) {
                                        groups.push(record.contactGroupId);
                                    });
                                    Ext.each(allGroups, function (group) {
                                        if (groups.indexOf(group.value) !== -1) {
                                            group.checked = true;
                                        }
                                    });
                                    record.groups = allGroups;
                                    record.currentGroups = groups;
                                    if (callback) {
                                        callback(record);
                                    }
                                }
                            });
                        }
                    });
                }
                else {
                    record.groups = allGroups;
                    record.currentGroups = groups;
                    if (callback) {
                        callback(record);
                    }
                }
            }
        });
    }

    function deleteContactRelationships(contactId, callback) {
        if (!contactId) {
            callback();
            return;
        }
        common.DreamFactory.deleteRecordsFiltered(ab.Schemas.ContactRelationships.name, {
            where    : 'contactId=' + contactId,
            callback : function (o) {
                callback();
            }
        });
    }

    function addContactRelationships(contactId, groupIds, callback) {
//        callback();
//        return;
        var records = [];
        Ext.each(groupIds, function (id) {
            records.push({
                contactId      : contactId,
                contactGroupId : id
            });
        });
        if (records.length) {
            common.DreamFactory.createRecords(ab.Schemas.ContactRelationships.name, records, function (o) {
                callback();
            });
        }
        else {
            callback();
        }
    }

    function saveContactRecord(record, callback) {
        var me = this,
            schema = ab.Schemas.Contacts,
            groupIds = [];

        Ext.iterate(record.groups, function (group) {
            if (group.checked) {
                groupIds.push(parseInt(group.value, 10));
            }
        });
        if (record[schema.primaryKey]) {
            deleteContactRelationships(record[schema.primaryKey], function () {
                common.DreamFactory.updateRecords(schema.name, [record], function () {
                    addContactRelationships(record[schema.primaryKey], groupIds, function () {
                        if (callback) {
                            callback();
                        }
                    });
                });
            });
        }
        else {
            common.DreamFactory.createRecords(schema.name, [record], function (o) {
                console.dir(o);
                if (callback) {
                    callback();
                }
            });
        }
    }

    function deleteContactRecords(records, callback) {
        var me = this,
            toDelete = [];

        Ext.iterate(records, function (value) {
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
                callback : function (o) {
                    var associated = [];
                    Ext.iterate(o.record, function (record) {
                        associated.push(record.infoId);
                    });
                    deleteInfoRecords(associated, function () {
                        common.DreamFactory.deleteRecord(ab.Schemas.Contacts.name, recordId, function () {
                            Ext.defer(deleteOne, 0);
                        });
                    });
                }
            });
        }

        deleteOne();
    }

    function saveContactInfoRecord(record, callback) {
        var me = this,
            schema = ab.Schemas.ContactInfo;

        if (record[schema.primaryKey]) {
            common.DreamFactory.updateRecords(schema.name, [record], function () {
                if (callback) {
                    callback();
                }
            });
        }
        else {
            common.DreamFactory.createRecords(schema.name, [record], function () {
                if (callback) {
                    callback();
                }
            });
        }
    }

    function deleteInfoRecords(records, callback) {
        var me = this,
            toDelete = [];

        Ext.iterate(records, function (value) {
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
            common.DreamFactory.deleteRecord(ab.Schemas.ContactInfo.name, recordId, function () {
                Ext.defer(deleteOne, 0);
            });
        }

        deleteOne();
    }

    function loadContactGroupRecord(record, callback) {
        if (!record.contactGroupId) {
            callback(record);
            return;
        }
        common.DreamFactory.filterRecords(ab.Schemas.ContactGroups.name, {
            where    : 'contactGroupId=' + record.contactGroupId,
            callback : function (o) {
                record = o.record[0];
                if (!record || !record.contactGroupId) {
                    Ext.Msg.alert('Error', 'Group has been removed and can no longer be edited.');
                    record = false;
                }
                callback(record);
            }
        });
    }

    function saveContactGroupRecord(record, callback) {
        var me = this,
            schema = ab.Schemas.ContactGroups;

        if (record[schema.primaryKey]) {
            common.DreamFactory.updateRecords(schema.name, [record], function () {
                if (callback) {
                    callback();
                }
            });
        }
        else {
            common.DreamFactory.createRecords(schema.name, [record], function () {
                if (callback) {
                    callback();
                }
            });
        }
    }

    function deleteContactGroupRecords(records, callback) {
        if (callback) {
            callback();
        }
    }

    Ext.define('ab.view.Main', {
        extend   : 'Ext.panel.Panel',
        alias    : 'widget.main',
        requires : [
            'Ext.form.Panel',
            'Ext.tab.Panel',
            'ab.ux.DataSourceField'
        ],
        layout   : 'fit',
        border   : false,

        dockedItems : {
            xtype  : 'toolbar',
            dock   : 'top',
            itemId : 'header-bar',
            cls    : 'header-bar',
            items  : [
                {
                    xtype : 'component',
                    width : 400,
                    html  : '<span class="text">Address Book</span>'

                },
                '->',
                '<span id="clock"></span>',
                '-',
                {
                    text   : '', //ab.user.email
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

        initComponent             : function () {
            var me = this,
                layout = true,
                runner = new Ext.util.TaskRunner();

            runner.start({
                interval : 1000,
                run      : function () {
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
            me.on('destroy', function () {
                Ext.TaskManager.stop(runner);
            });

            me.on({
                scope       : me,
                afterrender : me.onAfterRenderUpdateButton
            });
        },
        buildItems                : function () {
            var me = this;
            return {
                xtype      : 'tabpanel',
                cls        : 'main-tabs',
                itemId     : 'ab-tabPanel',
                deferredRender: true,
                // margin: '10 0 0 0',
                height     : 125,
                margin     : 30,
                activeItem : 0,
                border     : false,
                items      : [
                    {
                        xtype      : 'schemagrid',
                        title      : 'Contacts',
                        iconCls    : 'contacts',
                        border     : false,
                        // icon       : '../img/famfam/group.png',
                        schema     : ab.Schemas.Contacts,
                        filterable : true,
                        loadFn     : loadContactRecord,
                        saveFn     : saveContactRecord,
                        deleteFn   : deleteContactRecords,
                        listeners  : {
                            scope         : me,
                            deleterecords : me.onSchemaGridDeleteRecords,
                            saverecord : me.onSchemaGridSaveRecord,
                            itemdblclick  : me.onContactsGridItemDblClick
                        }
                    },
                    {
                        xtype    : 'schemagrid',
                        title    : 'Groups',
                        iconCls    : 'groups',
                        border   : false,
                        // icon     : '../img/famfam/group.png',
                        schema   : ab.Schemas.ContactGroups,
//                        filterable : true,
                        loadFn   : loadContactGroupRecord,
                        saveFn   : saveContactGroupRecord,
                        deleteFn : deleteContactGroupRecords,
                        listeners : {
//                            itemdblclick  : me.onGroupsGridItemDblClick,
//                            deleterecords : me.onSchemaGridDeleteRecords,
                            scope         : me
                        }
                    }
                ]
            }
        },

        onSchemaGridSaveRecord: function(grid, records) {
            var me = this;
            Ext.iterate(records, function(record) {
                var cmp = me.down('#userInfo-grid-' + record.contactId);
                if (cmp) {
                    cmp.setTitle(record.firstName + ' ' + record.lastName);
                }
            });
        },

        onSchemaGridDeleteRecords : function (grid, records) {
            var me = this,
                tabPanel = this.down('#ab-tabPanel');

            Ext.iterate(records, function (record) {
                var cmp = me.down('#userInfo-grid-' + record.data.contactId);
                if (cmp) {
                    tabPanel.remove(cmp);
                }
            }, this);
        },

        onContactsGridItemDblClick : function (view, record) {
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
                    saveFn      : saveContactInfoRecord,
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

        onGroupsGridItemDblClick : function (view, record) {
            var me = this,
                tabPanel = me.down('#ab-tabPanel'),
                recordData = record.data,
                tab = me.down('#userInfo-grid-' + recordData.contactId),
                title = recordData.firstName + ' ' + recordData.lastName;
//console.log('dbl click');
//            return;
            //        console.log(title + " selected", recordData);
            if (!tab) {
                tab = tabPanel.add({
                    xtype       : 'schemagrid',
                    title       : Ext.String.ellipsis(title, 15),
                    itemId      : 'userInfo-grid-' + recordData.contactId,
                    icon        : '../img/famfam/user_b.png',
                    userInfo    : recordData,
                    schema      : ab.Schemas.ContactGroups,
                    closable    : true,
                    saveFn      : saveContactInfoRecord,
                    deleteFn    : deleteInfoRecords,
                    extraParams : {
                        related: 'Contacts_by_ContactRelationships',
                        filter : 'contactGroupId=' + record.data.contactGroupId
                    },
                    extraFields : {
                        contactGroupId : record.data.contactGroupId
                    }
                });
            }

            tabPanel.setActiveTab(tab);
        },

        onAfterRenderUpdateButton : function () {
            var user = ab.data.user;
            this.down('#user-button').setText(user.display_name);
        }
    });

}());
