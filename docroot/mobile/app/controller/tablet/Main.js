/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/18/13
 * Time: 11:34 AM
 */

/*
 *  _____     _     _      _     __  __       _          ____            _             _ _
 * |_   _|_ _| |__ | | ___| |_  |  \/  | __ _(_)_ __    / ___|___  _ __ | |_ _ __ ___ | | | ___ _ __
 *   | |/ _` | '_ \| |/ _ \ __| | |\/| |/ _` | | '_ \  | |   / _ \| '_ \| __| '__/ _ \| | |/ _ \ '__|
 *   | | (_| | |_) | |  __/ |_  | |  | | (_| | | | | | | |__| (_) | | | | |_| | | (_) | | |  __/ |
 *   |_|\__,_|_.__/|_|\___|\__| |_|  |_|\__,_|_|_| |_|  \____\___/|_| |_|\__|_|  \___/|_|_|\___|_|
 */


(function() {

    /**
     *  _                 _  ____            _             _   ____                        _
     * | | ___   __ _  __| |/ ___|___  _ __ | |_ __ _  ___| |_|  _ \ ___  ___ ___  _ __ __| |
     * | |/ _ \ / _` |/ _` | |   / _ \| '_ \| __/ _` |/ __| __| |_) / _ \/ __/ _ \| '__/ _` |
     * | | (_) | (_| | (_| | |__| (_) | | | | || (_| | (__| |_|  _ <  __/ (_| (_) | | | (_| |
     * |_|\___/ \__,_|\__,_|\____\___/|_| |_|\__\__,_|\___|\__|_| \_\___|\___\___/|_|  \__,_|
     *
     * loadContactRecord
     *
     * Load in a contact record and associated information
     *
     * @param record
     * @param callback
     */
    function loadContactRecord(record, callback) {
        var allGroups = [],
            groups = [];

        common.DreamFactory.filterRecords(mobile.schemas.ContactGroups.name, {
            fields   : 'contactGroupId,groupName',
            callback : function(o) {
                Ext.iterate(o.record, function(record) {
                    allGroups.push({
                        value   : record.contactGroupId,
                        display : record.groupName,
                        checked : false
                    });
                });
                if (record && record.contactId) {
                    common.DreamFactory.filterRecords(mobile.schemas.Contacts.name, {
                        where    : 'contactId=' + record.contactId,
                        callback : function(o) {
                            record = o.record[0];
                            if (!record.contactId) {
                                Ext.Msg.alert('Error', 'Contact has been removed and can no longer be edited.');
                                if (callback) {
                                    callback(false);
                                }
                                return;
                            }
                            common.DreamFactory.filterRecords(mobile.schemas.ContactRelationships.name, {
                                fields   : 'contactGroupId',
                                where    : 'contactId=' + record.contactId,
                                callback : function(o) {
                                    Ext.iterate(o.record, function(record) {
                                        groups.push(record.contactGroupId);
                                    });
                                    Ext.each(allGroups, function(group) {
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

    Ext.define('mobile.controller.tablet.Main', {
        extend : 'Ext.app.Controller',

        config : {
            refs    : {
                groupList         : 'group_list',
                contactList       : 'contact_list',
                mainPanel         : 'mainview',
                titleBar          : 'titlebar',
                detailCard        : 'contact_details',
                addGroupButton    : 'button[action=add-group]',
                addContactButton  : 'button[action=add-contact]',
                editContactButton : 'button[action=edit-contact]',
                searchField       : 'searchfield'
            },
            control : {
                'group_list'                  : {
                    itemtap     : 'onGroupSelected',
                    storeloaded : 'onGroupListRendered'
                },
                'contact_list'                : {
                    itemtap : 'onContactSelected'
                },
                viewport                      : {
                    orientationchange : 'onOrientationChange'
                },
                'button[action=add-contact]'  : {
                    tap : 'onAddContactButton'
                },
                'button[action=add-group]'    : {
                    tap : 'onAddGroupButton'
                },
                'button[action=edit-contact]' : {
                    tap : 'onEditContactButton'
                }
            }
        },

        init : function() {
            var me = this;

            console.log('init ' + this.$className);
            me.callParent(arguments);
            document.title = 'Tablet';
            me.firstLoad = true;
        },

        onGroupListRendered : function() {
            var me = this,
                groupList = me.getGroupList();

            if (!me.firstLoad) {
                return;
            }
            me.firstLoad = false;
            console.log('group list rendered');

            Ext.Function.defer(function() {
                groupList.select(0, true, false);
            }, 1);
        },

        onOrientationChange : function(viewport, orientation, width, height) {
            console.log('orientation changed');
            console.log(orientation + ' ' + width + 'x' + height);
        },

        onGroupSelected : function(list, index, target, record, e) {
            console.log('group selected');
            console.dir(record);
            var me = this,
                searchField = me.getSearchField(),
                mainPanel = me.getMainPanel(),
                editButton = mainPanel.down('#edit-contact'),
                contactList = me.getContactList(),
                detailCard = me.getDetailCard(),
                groupList = me.getGroupList();

            if (groupList.deleteButton) {
                delete groupList.deleteButton;
                Ext.Function.defer(function() {
                    groupList.deselectAll();
                }, 1);
                return;
            }
            me.contactGroupSelected = record.data.groupName;
            detailCard.setData({});
            editButton.hide();
            if (record.data.contactGroupId) {
                common.DreamFactory.filterRecords(mobile.schemas.ContactRelationships.name, {
                    where    : 'contactGroupId=' + record.data.contactGroupId,
                    callback : function(o) {
                        mobile.data.contactIds = [];
                        Ext.iterate(o.record, function(item) {
                            mobile.data.contactIds.push(parseInt('' + item.contactId, 10));
                        });
                        me.getContactList().getStore().load(function() {
                            searchField.reset();
                            delete contactList.search;
                        });
                    }
                });
            }
            else {
                mobile.data.contactIds = undefined;
                contactList.getStore().load(function() {
                    searchField.reset();
                    delete contactList.search;
                });
            }
        },

        onContactSelected : function(list, index, target, record, e) {
            var me = this;

            me.selectedRecord = record;

            loadContactRecord(record.data, function(o) {
                me.selectedRecord = o;
                common.DreamFactory.filterRecords('ContactInfo', {
                    where    : 'contactId=' + record.get('contactId'),
                    callback : function(o) {
                        me.selectedRecord.contactData = o.record;
                        me.showDetails();
                    }
                });
            });

        },

        showDetails : function() {
            var me = this,
                recordData = me.selectedRecord,
                mainPanel = me.getMainPanel(),
                editButton = mainPanel.down('#edit-contact');

            recordData.imageUrl = recordData.imageUrl || '../img/default_portrait.png';
            if (recordData.notes) {
                recordData.notes = recordData.notes.replace(/\n/igm, '<br/>');
            }

            me.getDetailCard().setData(recordData);
            mainPanel.down('#card').setActiveItem(0);
            editButton.show();
        },

        onAddGroupButton : function() {
            console.log('add group');
        },

        onAddContactButton : function() {
            console.log('add contact');
        },

        onEditContactButton : function() {
            console.log('edit contact');
            var me = this,
                mainPanel = me.getMainPanel(),
                layout = mainPanel.down('#card');

            layout.insert(2, {
                xtype: 'contact_editor',
                details: me.selectedRecord
            });

            layout.animateActiveItem(2, {
                type: 'slide',
                duration: 250,
                direction: 'up'
            });
        }

    });

}());
