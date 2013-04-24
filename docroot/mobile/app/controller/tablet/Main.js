/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/18/13
 * Time: 11:34 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

/*
 *  _____     _     _      _     __  __       _          ____            _             _ _
 * |_   _|_ _| |__ | | ___| |_  |  \/  | __ _(_)_ __    / ___|___  _ __ | |_ _ __ ___ | | | ___ _ __
 *   | |/ _` | '_ \| |/ _ \ __| | |\/| |/ _` | | '_ \  | |   / _ \| '_ \| __| '__/ _ \| | |/ _ \ '__|
 *   | | (_| | |_) | |  __/ |_  | |  | | (_| | | | | | | |__| (_) | | | | |_| | | (_) | | |  __/ |
 *   |_|\__,_|_.__/|_|\___|\__| |_|  |_|\__,_|_|_| |_|  \____\___/|_| |_|\__|_|  \___/|_|_|\___|_|
 */


(function() {

    function intVal(n) {
        return parseInt('0' + n, 10);
    }

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
                        value   : intVal(record.contactGroupId),
                        display : record.groupName,
                        checked : false
                    });
                });
                allGroups.sort(function(a,b) {
                    return a.display.toLowerCase().localeCompare(b.display.toLowerCase());
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
                            common.DreamFactory.filterRecords(mobile.schemas.ContactInfo.name, {
                                where    : 'contactId=' + record.contactId,
                                callback : function(o) {
                                    record.contactData = o.record;
                                    common.DreamFactory.filterRecords(mobile.schemas.ContactRelationships.name, {
                                        fields   : 'contactGroupId',
                                        where    : 'contactId=' + record.contactId,
                                        callback : function(o) {
                                            Ext.iterate(o.record, function(record) {
                                                groups.push(intVal(record.contactGroupId));
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
                    });
                }
                else {
                    if (record.currentGroupId) {
                        groups.push(record.currentGroupId);
                        Ext.each(allGroups, function(group) {
                            if (group.value === record.currentGroupId) {
                                group.checked = true;
                            }
                        });
                    }
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
                groupList               : 'group_list',
                contactList             : 'contact_list',
                contactEditor           : 'contact_editor',
                mainPanel               : 'mainview',
                titleBar                : 'titlebar',
                detailCard              : 'contact_details',
                addGroupButton          : 'button[action=add-group]',
                addContactButton        : 'button[action=add-contact]',
                editContactButton       : 'button[action=edit-contact]',
                cancelEditContactButton : 'button[action=cancel-edit-contact]',
                searchField             : 'searchfield'
            },
            control : {

                'group_list' : {
                    itemtap     : 'onGroupSelected',
                    storeloaded : 'onGroupListRendered',
                    deleteGroup : 'onDeleteGroup'
                },

                'contact_list' : {
                    itemtap       : 'onContactSelected',
                    deleteContact : 'onDeleteContact'
                },

                viewport : {
                    orientationchange : 'onOrientationChange'
                },

                'button[action=add-contact]' : {
                    tap : 'onAddContactButton'
                },

                'button[action=add-group]' : {
                    tap : 'onAddGroupButton'
                },

                'button[action=edit-contact]' : {
                    tap : 'onEditContactButton'
                },

                'button[action=cancel-edit-contact]' : {
                    tap : 'onCancelEditContactButton'
                },

                'button[action=save-contact]' : {
                    tap : 'onSaveContactButton'
                },

                mainPanel : {
                    showCard : 'onShowCard'
                },

                searchField : {
                    change : 'onSearchFieldChanged'
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

        onSearchFieldChanged : function() {
            var me = this,
                searchField = me.getSearchField(),
                contactList = me.getContactList();

            contactList.search = searchField.getValue();
            contactList.getStore().load();
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

        /**
         *            __               _      ____            _             _   _     _     _
         *  _ __ ___ / _|_ __ ___  ___| |__  / ___|___  _ __ | |_ __ _  ___| |_| |   (_)___| |_
         * | '__/ _ \ |_| '__/ _ \/ __| '_ \| |   / _ \| '_ \| __/ _` |/ __| __| |   | / __| __|
         * | | |  __/  _| | |  __/\__ \ | | | |__| (_) | | | | || (_| | (__| |_| |___| \__ \ |_
         * |_|  \___|_| |_|  \___||___/_| |_|\____\___/|_| |_|\__\__,_|\___|\__|_____|_|___/\__|

         * @param contactGroupId
         * @param callback
         */
        refreshContactList : function(contactGroupId, callback) {
            var me = this,
                contactList = me.getContactList();

            if (contactGroupId) {
                common.DreamFactory.filterRecords(mobile.schemas.ContactRelationships.name, {
                    where    : 'contactGroupId=' + contactGroupId,
                    callback : function(o) {
                        mobile.data.contactIds = [];
                        Ext.iterate(o.record, function(item) {
                            mobile.data.contactIds.push(parseInt('' + item.contactId, 10));
                        });
                        contactList.getStore().load(callback);
                    }
                });
            }
            else {
                mobile.data.contactIds = undefined;
                contactList.getStore().load(callback);
            }
        },

        /**
         *              ____  _                    ____              _
         *   ___  _ __ / ___|| |__   _____      __/ ___|__ _ _ __ __| |
         *  / _ \| '_ \\___ \| '_ \ / _ \ \ /\ / / |   / _` | '__/ _` |
         * | (_) | | | |___) | | | | (_) \ V  V /| |__| (_| | | | (_| |
         *  \___/|_| |_|____/|_| |_|\___/ \_/\_/  \____\__,_|_|  \__,_|
         *
         * onShowCard
         *
         * Handles showcard event fired on mainPanel by the Contact or ContactGroup editor.
         *
         * @param card
         * @param direction
         * @param record
         */
        onShowCard : function(card, direction, record) {
            var me = this,
                mainPanel = me.getMainPanel(),
                contactList = me.getContactList(),
                detailCard = me.getDetailCard(),
                layout = mainPanel.down('#card');

            switch (card) {
                case 'contact':
                    me.refreshContactList(me.contactGroupIdSelected, function() {
                        loadContactRecord(record, function(o) {
                            me.selectedRecord = o;
                            common.DreamFactory.filterRecords('ContactInfo', {
                                where    : 'contactId=' + record.contactId,
                                callback : function(o) {
                                    o.record.contactId = intVal(o.record.contactId);
                                    me.selectedRecord.contactData = o.record;
                                    me.showDetails();
                                    layout.removeAt(1);
                                    // select and scroll selected record into view in group list
                                    var store = contactList.getStore(),
                                        rec = store.find('contactId', me.selectedRecord.contactId);
                                    console.dir(rec);

                                    if (rec === -1) {
                                        me.resetContactDetails();
                                        return;
                                    }
                                    contactList.select(store.getAt(rec), false, true);

                                    var el = contactList.element,
                                        cls = contactList.getSelectedCls(),
                                        selected = el.down('.' + cls);

                                    if (!selected) {
                                        // this is magic I figured out through a lot of discovery
                                        contactList.getScrollable().getScroller().scrollTo(0, rec * contactList._itemHeight);
                                        contactList.doRefresh();
                                    }
                                }
                            });
                        });
                    });
                    break;
            }
        },

        /**
         *              ____       _      _        ____
         *   ___  _ __ |  _ \  ___| | ___| |_ ___ / ___|_ __ ___  _   _ _ __
         *  / _ \| '_ \| | | |/ _ \ |/ _ \ __/ _ \ |  _| '__/ _ \| | | | '_ \
         * | (_) | | | | |_| |  __/ |  __/ ||  __/ |_| | | | (_) | |_| | |_) |
         *  \___/|_| |_|____/ \___|_|\___|\__\___|\____|_|  \___/ \__,_| .__/
         *                                                             |_|
         *
         * @param groupId
         */
        onDeleteGroup : function(groupId) {
            var me = this,
                groupList = me.getGroupList();

            common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactGroups.name, {
                where    : 'contactGroupId=' + groupId,
                callback : function() {
                    common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactRelationships.name, {
                        where    : 'contactGroupId=' + groupId,
                        callback : function() {
                            groupList.getStore().load({
                                callback: function() {
                                    groupList.select(0);
                                    me.contactGroupSelected = 'All Contacts';
                                    me.contactGroupIdSelected = 0;
                                    me.resetContactDetails();
                                    me.refreshContactList(0, function() {

                                    });
                                }
                            });
                        }
                    });
                }
            });
        },


        /**
         *              ____       _      _        ____            _             _
         *   ___  _ __ |  _ \  ___| | ___| |_ ___ / ___|___  _ __ | |_ __ _  ___| |_
         *  / _ \| '_ \| | | |/ _ \ |/ _ \ __/ _ \ |   / _ \| '_ \| __/ _` |/ __| __|
         * | (_) | | | | |_| |  __/ |  __/ ||  __/ |__| (_) | | | | || (_| | (__| |_
         *  \___/|_| |_|____/ \___|_|\___|\__\___|\____\___/|_| |_|\__\__,_|\___|\__|
         *
         * @param contactId
         */
        onDeleteContact : function(contactId) {
            var me = this,
                mainPanel = me.getMainPanel(),
                editButton = mainPanel.down('#edit-contact'),
                contactList = me.getContactList(),
                detailCard = me.getDetailCard(),
                currentId = me.selectedRecord ? intVal(me.selectedRecord.contactId) : false;

            contactId = intVal(contactId);
            console.dir(me.selectedRecord);

            console.dir(contactId);
            console.dir(currentId);

            common.DreamFactory.deleteRecordsFiltered(mobile.schemas.Contacts.name, {
                where    : 'contactId=' + contactId,
                callback : function() {
                    common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactInfo.name, {
                        where    : 'contactId=' + contactId,
                        callback : function() {
                            common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactRelationships.name, {
                                where    : 'contactId=' + contactId,
                                callback : function() {
                                    console.dir(contactId);
                                    console.dir(currentId);
                                    if (contactId === currentId) {
                                        contactList.deselectAll();
                                        detailCard.setData({});
                                        editButton.hide();
                                        if (me.editing) {
                                            me.onCancelEditContactButton();
                                        }
                                    }
                                    contactList.getStore().load();
                                }
                            });
                        }
                    });
                }
            });
        },

        /**
         *               ____                      ____       _           _           _
         *   ___  _ __  / ___|_ __ ___  _   _ _ __/ ___|  ___| | ___  ___| |_ ___  __| |
         *  / _ \| '_ \| |  _| '__/ _ \| | | | '_ \___ \ / _ \ |/ _ \/ __| __/ _ \/ _` |
         * | (_) | | | | |_| | | | (_) | |_| | |_) |__) |  __/ |  __/ (__| ||  __/ (_| |
         *  \___/|_| |_|\____|_|  \___/ \__,_| .__/____/ \___|_|\___|\___|\__\___|\__,_|
         *                                   |_|
         *
         * @param list
         * @param index
         * @param target
         * @param record
         * @param e
         */
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
            me.contactGroupIdSelected = record.data.contactGroupId || false;
            detailCard.setData({});
            editButton.hide();
            contactList.deselectAll();
            if (me.editing) {
                me.onCancelEditContactButton();
            }
            me.refreshContactList(record.data.contactGroupId, function() {
                searchField.reset();
                delete contactList.search;
            });
        },

        /**
         *               ____            _             _   ____       _           _           _
         *   ___  _ __  / ___|___  _ __ | |_ __ _  ___| |_/ ___|  ___| | ___  ___| |_ ___  __| |
         *  / _ \| '_ \| |   / _ \| '_ \| __/ _` |/ __| __\___ \ / _ \ |/ _ \/ __| __/ _ \/ _` |
         * | (_) | | | | |__| (_) | | | | || (_| | (__| |_ ___) |  __/ |  __/ (__| ||  __/ (_| |
         *  \___/|_| |_|\____\___/|_| |_|\__\__,_|\___|\__|____/ \___|_|\___|\___|\__\___|\__,_|
         *
         * @param list
         * @param index
         * @param target
         * @param record
         * @param e
         */
        onContactSelected : function(list, index, target, record, e) {
            var me = this;

            me.selectedRecord = record;
            me.selectedRecord.contactId = intVal(me.selectedRecord.contactId);

            loadContactRecord(record.data, function(o) {
                me.selectedRecord = o;
                me.selectedRecord.contactId = intVal(me.selectedRecord.contactId);
                common.DreamFactory.filterRecords('ContactInfo', {
                    where    : 'contactId=' + record.get('contactId'),
                    callback : function(o) {
                        o.record.contactId = intVal(o.record.contactId);
                        me.selectedRecord.contactData = o.record;

                        console.dir(me.selectedRecord);
                        me.showDetails();
                        if (me.editing) {
                            me.onCancelEditContactButton();
                        }
                    }
                });
            });
        },

        showDetails : function() {
            var me = this,
                recordData = me.selectedRecord,
                mainPanel = me.getMainPanel(),
                contactList = me.getContactList(),
                editButton = mainPanel.down('#edit-contact'),
                layout = mainPanel.down('#card');

            recordData.imageUrl = recordData.imageUrl || '../img/default_portrait.png';
            if (recordData.notes) {
                recordData.notes = recordData.notes.replace(/\n/igm, '<br/>');
            }

            me.getDetailCard().setData(recordData);
            editButton.show();

        },

        resetContactDetails : function() {
            var me = this,
                detailCard = me.getDetailCard(),
                contactList = me.getContactList(),
                mainPanel = me.getMainPanel(),
                editButton = mainPanel.down('#edit-contact');

            delete me.selectedRecord;

            detailCard.setData({});
            editButton.hide();
            contactList.deselectAll();
        },

        onAddGroupButton : function() {
            var me = this,
                groupList = me.getGroupList(),
                store = groupList.getStore();

            console.log('add group');
            Ext.Msg.prompt('Add Group', 'New Group Name:', function(button, groupName) {
                if (button !== 'ok') {
                    return;
                }
                if (!groupName || !groupName.trim().length) {
                    Ext.Msg.alert('Error', 'Group Name is required');
                    return;
                }

                common.DreamFactory.filterRecords(mobile.schemas.ContactGroups.name, {
                    where    : 'groupName=' + '"' + groupName + '"',
                    callback : function(o) {
                        if (o.record.length) {
                            Ext.Msg.alert('Error', 'Group already exists');
                            return;
                        }
                        common.DreamFactory.createRecords(mobile.schemas.ContactGroups.name, { groupName : groupName }, function(o) {
                            var contactGroupId = intVal(o.record[0].contactGroupId);
                            store.load({
                                callback : function() {
                                    me.resetContactDetails();
                                    var rec = store.find('contactGroupId', contactGroupId);
                                    if (rec === -1) {
                                        return;
                                    }
                                    var record = store.getAt(rec);
                                    groupList.select(record, false, true);
                                    var el = groupList.element,
                                        cls = groupList.getSelectedCls(),
                                        selected = el.down('.' + cls);

                                    if (!selected) {
                                        // this is magic I figured out through a lot of discovery
                                        groupList.getScrollable().getScroller().scrollTo(0, rec * groupList._itemHeight);
                                        groupList.doRefresh();
                                    }
                                    me.onGroupSelected(groupList, rec, null, record, null);
                                }
                            });
                        });
                    }
                });

            });
        },

        showContactEditorCard : function() {
            var me = this,
                mainPanel = me.getMainPanel(),
                layout = mainPanel.down('#card'),
                record = me.selectedRecord;

            layout.insert(1, {
                layout : 'fit',
                items  : [
                    {
                        xtype  : 'titlebar',
                        title  : ((me.selectedRecord && me.selectedRecord.contactId) ? 'Edit' : 'Add') + ' Contact',
                        docked : 'top',
                        items  : [
                            {
                                // text   : 'Cancel',
                                // ui     : 'decline',
                                cls    : 'cancel-edit-contact',
                                action : 'cancel-edit-contact',
                                text   : '',
                                align  : 'left'
                            },
                            {
                                text   : 'Save',
                                // ui     : 'confirm',
                                action : 'save-contact',
                                align  : 'right'
                            }
                        ]
                    },
                    {
                        xtype   : 'contact_editor',
                        details : me.selectedRecord
                    }
                ]
            });

            layout.animateActiveItem(1, {
                type      : 'slide',
                duration  : 250,
                direction : 'left'
            });
            me.editing = true;
        },

        onAddContactButton : function() {
            var me = this,
                mainPanel = me.getMainPanel(),
                editButton = mainPanel.down('#edit-contact'),
                detailCard = me.getDetailCard(),
                contactList = me.getContactList();

            contactList.deselectAll();
            editButton.hide();
            delete me.selectedRecord;
            loadContactRecord({ currentGroupId : me.contactGroupIdSelected }, function(r) {
                me.selectedRecord = r;
                me.selectedRecord.contactId = intVal(me.selectedRecord.contactId);
                me.showContactEditorCard();
                detailCard.setData({});
            });
        },

        onEditContactButton : function() {
            console.log('edit contact');
            var me = this;

            loadContactRecord(me.selectedRecord, function(o) {
                console.dir(o);
                me.selectedRecord = o;
                me.showContactEditorCard();
            });
        },

        onCancelEditContactButton : function() {
            var me = this,
                mainPanel = me.getMainPanel(),
                layout = mainPanel.down('#card');

            layout.animateActiveItem(0, {
                type      : 'slide',
                duration  : 250,
                direction : 'right'
            });
            Ext.Function.defer(function() {
                layout.removeAt(1);
                me.editing = false;
            }, 260);
        },

        onSaveContactButton : function() {
            var me = this,
                mainPanel = me.getMainPanel(),
                layout = mainPanel.down('#card');

            me.getContactEditor().submit();
        }

    });

}());
