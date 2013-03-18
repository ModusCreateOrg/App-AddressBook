/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/14/13
 * Time: 7:10 AM
 */

(function () {

    // banners generated with linux "figlet" command

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
            callback : function (o) {
                Ext.iterate(o.record, function (record) {
                    allGroups.push({
                        value   : record.contactGroupId,
                        display : record.groupName,
                        checked : false
                    });
                });
                if (record && record.contactId) {
                    common.DreamFactory.filterRecords(mobile.schemas.Contacts.name, {
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
                            common.DreamFactory.filterRecords(mobile.schemas.ContactRelationships.name, {
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

    /**
     *                  _     _ _                       _             _ _                 _                        __  __       _
     *  _ __ ___   ___ | |__ (_) | ___   ___ ___  _ __ | |_ _ __ ___ | | | ___ _ __ _ __ | |__   ___  _ __   ___  |  \/  | __ _(_)_ __
     * | '_ ` _ \ / _ \| '_ \| | |/ _ \ / __/ _ \| '_ \| __| '__/ _ \| | |/ _ \ '__| '_ \| '_ \ / _ \| '_ \ / _ \ | |\/| |/ _` | | '_ \
     * | | | | | | (_) | |_) | | |  __/| (_| (_) | | | | |_| | | (_) | | |  __/ | _| |_) | | | | (_) | | | |  __/_| |  | | (_| | | | | |
     * |_| |_| |_|\___/|_.__/|_|_|\___(_)___\___/|_| |_|\__|_|  \___/|_|_|\___|_|(_) .__/|_| |_|\___/|_| |_|\___(_)_|  |_|\__,_|_|_| |_|
     *                                                                             |_|
     *
     * Main controller (phone profile)
     */
    Ext.define('mobile.controller.phone.Main', {
        extend : 'Ext.app.Controller',

        config : {
            refs    : {
                groupList         : 'group_list',
                groupEditor       : 'contact_group_editor',
                contactList       : 'contact_list',
                contactEditor     : 'contact_editor',
                mainPanel         : 'mainview',
                titleBar          : 'titlebar',
                backButton        : 'button[align=left]',
                rightButton       : 'button[action=title-right]',
                createGroupButton : 'button[action=create-group]',
                detailCard        : 'contact_details',
                searchField       : 'searchfield'
            },
            control : {
                'group_list' : {
                    itemtap     : 'onGroupSelected',
                    deleteGroup : 'onDeleteGroup'
                },

                'contact_list' : {
                    itemtap       : 'onContactSelected',
                    deleteContact : 'onDeleteContact'
                },

                'button[action=title-right]' : {
                    tap : 'onRightButton'
                },

                'mainview > titlebar button[align=left]' : {
                    tap : 'onBackButton'
                },

                mainPanel : {
                    showCard : 'onShowCard'
                },

                searchField : {
                    change : 'onSearchFieldChanged'
                }
            }
        },

        init : function () {
            console.log('init ' + this.$className);
            this.callParent(arguments);
        },

        onSearchFieldChanged : function () {
            var me = this,
                searchField = me.getSearchField(),
                contactList = me.getContactList();

            contactList.search = searchField.getValue();
            contactList.getStore().load();
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
        onShowCard : function (card, direction, record) {
            var me = this;
            switch (card) {
                case 'groupList':
                    this.showContactGroupsCard(direction);
                    break;
                case 'contact':
                    loadContactRecord(arguments[2], function (o) {
                        me.selectedRecord = o;
                        common.DreamFactory.filterRecords('ContactInfo', {
                            where    : 'contactId=' + record.contactId,
                            callback : function (o) {
                                me.selectedRecord.contactData = o.record;
                                me.showDetails(direction);
                            }
                        });
                    });
                    break;
            }
        },

        showContactGroupsCard : function (direction) {
            direction = direction || 'right';

            var me = this,
                mainPanel = this.getMainPanel(),
                titleBar = this.getTitleBar(),
                rightButton = me.getRightButton(),
                backButton = this.getBackButton();

            mainPanel.animateActiveItem(0, {
                type      : 'slide',
                duration  : 250,
                direction : direction
            });
            Ext.Function.defer(function () {
                
                /* reset the the title, not showing logo anymore */
                mainPanel.showLogo();

                backButton.hide();
                rightButton.setText('');
                rightButton.setCls('mobile-add-contact-group-button');
                rightButton.show();
                mainPanel.removeAt(4);
            }, 260);
            delete me.selectedRecord;
        },

        showContactGroupsEditorCard : function (direction) {
            direction = direction || 'up';
            var me = this,
                mainPanel = me.getMainPanel(),
                titleBar = me.getTitleBar(),
                backButton = me.getBackButton(),
                rightButton = me.getRightButton();

            mainPanel.insert(4, {
                xtype : 'contact_group_editor'
            });

            mainPanel.animateActiveItem(3, {
                type      : 'slide',
                duration  : 250,
                direction : direction
            });
            Ext.Function.defer(function () {
                titleBar.setTitle('Add Group');
                rightButton.setCls('mobile-save-contact-group-button');
                rightButton.setText('Add');
                rightButton.show();
                backButton.setCls('mobile-cancel-groups-editor-button');
                // backButton.setText('Cancel');
                backButton.show();
            }, 260)
            delete me.selectedRecord;
        },

        showContactsCard : function (direction) {
            direction = direction || 'right';
            var me = this,
                searchField = me.getSearchField(),
                contactList = me.getContactList(),
                mainPanel = me.getMainPanel(),
                titleBar = me.getTitleBar(),
                rightButton = me.getRightButton(),
                backButton = me.getBackButton();

            searchField.reset();
            delete contactList.search;

            mainPanel.animateActiveItem(1, {
                type      : 'slide',
                duration  : 250,
                direction : direction
            });
            Ext.Function.defer(function () {
                titleBar.setTitle(me.contactGroupSelected);
                backButton.setText('');
                backButton.setCls('mobile-cancel-groups-button');
                backButton.show();
                rightButton.setText('');
                rightButton.setCls('mobile-add-contact-button');
                rightButton.show();
                mainPanel.removeAt(4);
            }, 260)
            delete me.selectedRecord;
        },

        showContactDetailsCard : function (direction) {
            direction = direction || 'left';

            var me = this,
                contactList = me.getContactList(),
                mainPanel = me.getMainPanel(),
                titleBar = me.getTitleBar(),
                rightButton = me.getRightButton(),
                backButton = me.getBackButton();

            mainPanel.animateActiveItem(2, {
                type      : 'slide',
                duration  : 250,
                direction : direction
            });

            Ext.Function.defer(function () {
                titleBar.setTitle('Contact Details');
                backButton.setCls('mobile-cancel-contact-button');
                backButton.show();
                rightButton.setText('Edit');
                // rightButton.setUi('action');
                rightButton.setCls('mobile-edit-contact-button');
                rightButton.show();
                contactList.deselectAll();
                mainPanel.removeAt(4);
            }, 260);

        },

        /**
         *      _                    ____            _             _   _____    _ _ _              ____              _
         *  ___| |__   _____      __/ ___|___  _ __ | |_ __ _  ___| |_| ____|__| (_) |_ ___  _ __ / ___|__ _ _ __ __| |
         * / __| '_ \ / _ \ \ /\ / / |   / _ \| '_ \| __/ _` |/ __| __|  _| / _` | | __/ _ \| '__| |   / _` | '__/ _` |
         * \__ \ | | | (_) \ V  V /| |__| (_) | | | | || (_| | (__| |_| |__| (_| | | || (_) | |  | |__| (_| | | | (_| |
         * |___/_| |_|\___/ \_/\_/  \____\___/|_| |_|\__\__,_|\___|\__|_____\__,_|_|\__\___/|_|   \____\__,_|_|  \__,_|
         *
         * showContactEditorCard
         *
         * Add contact editor card to layout and animate it into view
         *
         * @param direction
         */
        showContactEditorCard : function (direction) {
            direction = direction || 'up';
            var me = this,
                mainPanel = me.getMainPanel(),
                titleBar = me.getTitleBar(),
                backButton = me.getBackButton(),
                rightButton = me.getRightButton();

            mainPanel.insert(4, {
                xtype   : 'contact_editor',
                details : me.selectedRecord
            });

            mainPanel.animateActiveItem(4, {
                type      : 'slide',
                duration  : 250,
                direction : direction
            });
            Ext.Function.defer(function () {
                titleBar.setTitle(me.selectedRecord.contactId ? 'Edit Contact' : 'Create New Contact');
                rightButton.setText('Save');
                rightButton.setCls('mobile-save-contact-button');
                rightButton.show();
                // backButton.setText('Cancel');
                if (me.selectedRecord.contactId) {
                    backButton.setCls('mobile-cancel-edit-contact-button');
                }
                else {
                    backButton.setCls('mobile-cancel-add-contact-button');
                }

                // backButton.setText('Cancel');
                backButton.show();
            }, 260)
        },

        onGroupSelected : function (list, index, target, record, e) {
            var me = this
            contactList = me.getContactList(),
                groupList = me.getGroupList();

            if (groupList.deleteButton) {
                delete groupList.deleteButton;
                Ext.Function.defer(function () {
                    groupList.deselectAll();
                }, 1);
                return;
            }
            me.contactGroupSelected = record.data.groupName;
            if (record.data.contactGroupId) {
                common.DreamFactory.filterRecords(mobile.schemas.ContactRelationships.name, {
                    where    : 'contactGroupId=' + record.data.contactGroupId,
                    callback : function (o) {
                        mobile.data.contactIds = [];
                        Ext.iterate(o.record, function (item) {
                            mobile.data.contactIds.push(parseInt('' + item.contactId, 10));
                        });
                        me.getContactList().getStore().load(function () {
                            me.showContactsCard('left');
                            Ext.Function.defer(function () {
                                groupList.deselectAll();
                            }, 1);
                        });
                    }
                });
            }
            else {
                mobile.data.contactIds = undefined;
                contactList.getStore().load(function () {
                    me.showContactsCard('left');
                    Ext.Function.defer(function () {
                        groupList.deselectAll();
                    }, 1);
                });
            }
        },

        onContactSelected : function (list, index, target, record, e) {
            var me = this,
                contactList = me.getContactList();

            if (contactList.deleteButton) {
                Ext.Function.defer(function () {
                    contactList.deselectAll();
                }, 1);
                delete contactList.deleteButton;
                return;
            }


            loadContactRecord(record.data, function (o) {
                me.selectedRecord = o;
                common.DreamFactory.filterRecords('ContactInfo', {
                    where    : 'contactId=' + record.get('contactId'),
                    callback : function (o) {
                        me.selectedRecord.contactData = o.record;
                        me.showDetails();
                    }
                });
            });
        },

        showDetails : function (direction) {
            var me = this,
                recordData = me.selectedRecord,
                contactList = me.getContactList(),
                mainPanel = me.getMainPanel(),
                titleBar = me.getTitleBar(),
                rightButton = me.getRightButton(),
                backButton = me.getBackButton();

            recordData.imageUrl = recordData.imageUrl || '../img/default_portrait.png';
            if (recordData.notes) {
                recordData.notes = recordData.notes.replace(/\n/igm, '<br/>');
            }

            me.getDetailCard().setData(recordData);

            me.showContactDetailsCard(direction);
        },

        /**
         *              ____  _       _     _   ____        _   _
         *   ___  _ __ |  _ \(_) __ _| |__ | |_| __ ) _   _| |_| |_ ___  _ __
         *  / _ \| '_ \| |_) | |/ _` | '_ \| __|  _ \| | | | __| __/ _ \| '_ \
         * | (_) | | | |  _ <| | (_| | | | | |_| |_) | |_| | |_| || (_) | | | |
         *  \___/|_| |_|_| \_\_|\__, |_| |_|\__|____/ \__,_|\__|\__\___/|_| |_|
         *                      |___/
         *
         * onRightButton
         *
         * Handles tap on right button in title bar
         */
        onRightButton : function () {
            var me = this,
                mainPanel = me.getMainPanel(),
                titleBar = me.getTitleBar(),
                backButton = me.getBackButton(),
                rightButton = me.getRightButton();

            var cls = '';
            Ext.each(rightButton.getCls(), function (item) {
                if (item.indexOf('mobile-') === 0) {
                    cls = item;
                }
            });
            console.dir(cls);
            switch (cls) {
                case 'mobile-save-contact-group-button':
                    me.getGroupEditor().submit();
                    return;
                case 'mobile-add-contact-group-button':
                    me.showContactGroupsEditorCard();
                    break;
                case 'mobile-add-contact-button':
                    delete me.selectedRecord;
                    loadContactRecord({}, function(r) {
                        me.selectedRecord = r;
                        me.showContactEditorCard();
                    });
                    break;
                case 'mobile-edit-contact-button':
                    me.showContactEditorCard('up');
                    break;
                case 'mobile-save-contact-button':
                    me.getContactEditor().submit();
                    return;
            }

        },

        /**
         *              ____             _    ____        _   _
         *   ___  _ __ | __ )  __ _  ___| | _| __ ) _   _| |_| |_ ___  _ __
         *  / _ \| '_ \|  _ \ / _` |/ __| |/ /  _ \| | | | __| __/ _ \| '_ \
         * | (_) | | | | |_) | (_| | (__|   <| |_) | |_| | |_| || (_) | | | |
         *  \___/|_| |_|____/ \__,_|\___|_|\_\____/ \__,_|\__|\__\___/|_| |_|
         *
         * onBackButton
         *
         * Handles tap on back button in title bar
         */
        onBackButton : function () {
            var me = this,
                mainPanel = me.getMainPanel(),
                titleBar = me.getTitleBar(),
                rightButton = me.getRightButton(),
                backButton = me.getBackButton();

            var cls = '';
            Ext.each(backButton.getCls(), function (item) {
                if (item.indexOf('mobile-') === 0) {
                    cls = item;
                }
            });
            switch (cls) {
                case 'mobile-cancel-groups-editor-button':
                    me.getGroupEditor().blur().reset();
                    me.showContactGroupsCard();
                    break;
                case 'mobile-cancel-groups-button':
                    me.showContactGroupsCard();
                    break;
                case 'mobile-cancel-contact-button':
                    me.showContactsCard();
                    break;
                case 'mobile-cancel-add-contact-button':
                    me.showContactsCard();
                    break;
                case 'mobile-cancel-edit-contact-button':
                    me.showContactDetailsCard();
                    break;
                default:
                    throw 'invalid back button class ' + cls;
                    break;
            }
        },

        onDeleteGroup : function (groupId) {
            var me = this;

            common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactGroups.name, {
                where    : 'contactGroupId=' + groupId,
                callback : function () {
                    common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactRelationships.name, {
                        where    : 'contactGroupId=' + groupId,
                        callback : function () {
                            me.getGroupList().getStore().load();
                        }
                    });
                }
            });
        },

        onDeleteContact : function (contactId) {
            var me = this;

            common.DreamFactory.deleteRecordsFiltered(mobile.schemas.Contacts.name, {
                where    : 'contactId=' + contactId,
                callback : function () {
                    common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactInfo.name, {
                        where    : 'contactId=' + contactId,
                        callback : function () {
                            common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactRelationships.name, {
                                where    : 'contactId=' + contactId,
                                callback : function () {
                                    me.getContactList().getStore().load();
                                }
                            });
                        }
                    });
                }
            });
        }

    });
}());
