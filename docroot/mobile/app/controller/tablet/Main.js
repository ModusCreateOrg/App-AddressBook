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
                    storeloaded : 'onGroupListRendered'
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
                layout = mainPanel.down('#card');

            switch (card) {
                case 'contact':
                    loadContactRecord(arguments[2], function(o) {
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
                                    rec = store.findRecord('contactId', me.selectedRecord.contactId);
                                console.dir(rec);

                                contactList.selectWithScroll(rec, true);


//    var list = contactList,
//        store = list.getStore(),
//        selected = list.getSelection()[0],
//        idx = store.indexOf(selected),
//        els = list.container.getViewItems(),
//        el = els[idx],
//        offset = el.dom.offsetTop;
//
//    list.getScrollable().getScroller().scrollTo(0, offset);

//                                var el = Ext.get('contact-list-' + me.selectedRecord.contactId);
//                                if (el) {
//                                    el.scrollIntoView();
//                                }
//                                Ext.Function.defer(function() {
//                                    var el = contactList.element,
//                                        cls = contactList.getSelectedCls(),
//                                        selected = el.down('.' + cls),
//                                        y;
////debugger;
//                                    if (selected) {
//                                        console.log('selected');
//                                        console.dir(selected);
//                                        selected.dom.scrollIntoView();
//                    //                y = selected.dom.offsetTop;
//
//                    //                contactList.getScrollable().getScroller().scrollTo(0, y, true);
//                                    }
//                                    else {
//                                        console.log('not selected ' + me.selectedRecord.contactId);
//                                    }
//                                }, 10);
                            }
                        });
                    });
                    break;
            }
        },

        onDeleteContact : function(contactId) {
            var me = this,
                contactList = me.getContactList(),
                detailCard = me.getDetailCard(),
                currentId = me.selectedRecord ? me.selectedRecord.contactId : false;

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
                                    }
                                    contactList.getStore().load();
                                }
                            });
                        }
                    });
                }
            });
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
//            layout.setActiveItem(0);
            editButton.show();

        },

        onAddGroupButton : function() {
            console.log('add group');
        },

        showContactEditorCard : function() {
            var me = this,
                mainPanel = me.getMainPanel(),
                layout = mainPanel.down('#card'),
                record = me.selectedRecord;

            layout.insert(2, {
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

            layout.animateActiveItem(2, {
                type      : 'slide',
                duration  : 250,
                direction : 'left',
            });
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
            loadContactRecord({}, function(r) {
                me.selectedRecord = r;
                me.selectedRecord.contactId = intVal(me.selectedRecord.contactId);
                me.showContactEditorCard();
                detailCard.setData({});
            });
        },

        onEditContactButton : function() {
            console.log('edit contact');
            var me = this;

            me.showContactEditorCard();
        },

        onCancelEditContactButton : function() {
            var me = this,
                mainPanel = me.getMainPanel(),
                layout = mainPanel.down('#card');

            console.log('cancel edit contact button')

            layout.animateActiveItem(0, {
                type      : 'slide',
                duration  : 250,
                direction : 'right'
            });
            Ext.Function.defer(function() {
                layout.removeAt(1);
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
