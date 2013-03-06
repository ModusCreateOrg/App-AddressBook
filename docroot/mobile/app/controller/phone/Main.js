/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/14/13
 * Time: 7:10 AM
 * To change this template use File | Settings | File Templates.
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
            detailCard        : 'contact_information'
        },
        control : {
            'group_list' : {
                itemtap : 'onGroupSelected',
                deleteGroup: 'onDeleteGroup'
            },

            'contact_list' : {
                itemtap : 'onContactSelected'
            },

            'button[action=title-right]' : {
                tap : 'onRightButton'
            },

            'mainview > titlebar button[align=left]' : {
                tap : 'onBackButton'
            },

            mainPanel : {
                showCard : 'onShowCard'
            }
        }
    },

    init : function () {
        console.log('init ' + this.$className);
        this.callParent(arguments);
    },

    onShowCard : function (card, direction) {
        switch (card) {
            case 'groupList':
                this.showContactGroupsCard(direction);
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
            mainPanel.showLogo();
            backButton.hide();
            rightButton.setIconCls('add');
            rightButton.setCls('mobile-add-contact-group-button');
            rightButton.show();
        }, 260)
    },

    showContactGroupsEditorCard : function (direction) {
        direction = direction || 'up';
        var me = this,
            mainPanel = me.getMainPanel(),
            titleBar = me.getTitleBar(),
            backButton = me.getBackButton(),
            rightButton = me.getRightButton();

        mainPanel.animateActiveItem(4, {
            type      : 'slide',
            duration  : 250,
            direction : direction
        });
        Ext.Function.defer(function () {
            titleBar.setTitle('Add Group');
            rightButton.hide();
            backButton.setCls('mobile-cancel-groups-editor-button');
            backButton.setText('Cancel');
            backButton.show();
        }, 260)
    },

    showContactsCard : function (direction) {
        direction = direction || 'right';
        var me = this,
            mainPanel = me.getMainPanel(),
            titleBar = me.getTitleBar(),
            rightButton = me.getRightButton(),
            backButton = me.getBackButton();

        mainPanel.animateActiveItem(1, {
            type      : 'slide',
            duration  : 250,
            direction : direction
        });
        Ext.Function.defer(function () {
            titleBar.setTitle(me.contactGroupSelected);
            backButton.setText('Groups');
            backButton.setCls('mobile-cancel-groups-button');
            backButton.show();
            rightButton.setIconCls('add');
            rightButton.setCls('mobile-add-contact-button');
            rightButton.show();
        }, 260)
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
            titleBar.setTitle('info');
            backButton.setText('Contacts');
            backButton.setCls('mobile-cancel-contact-button');
            backButton.show();
            rightButton.setIconCls('compose');
            rightButton.setCls('mobile-edit-contact-button');
            rightButton.show();
            contactList.deselectAll();
        }, 260);

    },

    showContactEditorCard : function (direction) {
        direction = direction || 'up';
        var me = this,
            mainPanel = me.getMainPanel(),
            titleBar = me.getTitleBar(),
            backButton = me.getBackButton(),
            rightButton = me.getRightButton();

        mainPanel.animateActiveItem(3, {
            type      : 'slide',
            duration  : 250,
            direction : direction
        });
        Ext.Function.defer(function () {
            titleBar.setTitle('Edit Contact');
            rightButton.hide();
            backButton.setText('Cancel');
            backButton.setCls('mobile-cancel-edit-contact-button');
            backButton.show();
        }, 260)
    },

    onGroupSelected : function (list, index, target, record, e) {
        var me = this;

        me.contactGroupSelected = record.data.groupName;
        if (record.data.contactGroupId) {
            common.DreamFactory.filterRecords(mobile.schemas.ContactRelationships.name, {
                where: 'contactGroupId=' + record.data.contactGroupId,
                callback: function(o) {
                    console.dir(o);
                    mobile.data.contactIds = [];
                    Ext.iterate(o.record, function(item) {
                        mobile.data.contactIds.push(parseInt(''+item.contactId, 10));
                    });
                    me.getContactList().getStore().load(function() {
                        me.showContactsCard();
                    });
                }
            });
        }
        else {
            mobile.data.contactIds = undefined;
            me.getContactList().getStore().load(function() {
                me.showContactsCard();
            });
        }
    },

    onContactSelected : function (list, index, target, record, e) {
        var me = this;

        me.selectedRecord = record;

        common.DreamFactory.filterRecords('ContactInfo', {
            where    : 'contactId=' + record.get('contactId'),
            callback : function (o) {
                me.onAfterContactDetailsLoad(o);
            }
        });
    },

    onAfterContactDetailsLoad : function (data) {
        var me = this,
            record = me.selectedRecord;

        me.showDetails(data.record);

        delete me.selectedRecord;
    },

    showDetails : function (contactData) {
        var me = this,
            recordData = me.selectedRecord.data,
            contactList = me.getContactList(),
            mainPanel = me.getMainPanel(),
            titleBar = me.getTitleBar(),
            rightButton = me.getRightButton(),
            backButton = me.getBackButton();

        recordData.contactData = recordData.contactData || contactData;
        recordData.imageUrl = recordData.imageUrl || '../img/default_portrait.png';
        if (recordData.notes) {
            recordData.notes = recordData.notes.replace(/\n/igm, '<br/>');
        }

        me.getDetailCard().setData(recordData);

        me.showContactDetailsCard();
        delete me.selectedRecord;
    },

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
            case 'mobile-add-contact-group-button':
                me.showContactGroupsEditorCard();
                break;
            case 'mobile-edit-contact-button':
                me.showContactEditorCard();
                break;
        }

    },

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
                me.getGroupEditor().reset();
                me.showContactGroupsCard();
                break;
            case 'mobile-cancel-groups-button':
                me.showContactGroupsCard();
                break;
            case 'mobile-cancel-contact-button':
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

    onDeleteGroup: function(groupId) {
        console.dir(arguments);
        var me = this;
        common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactGroups.name, {
            where: 'contactGroupId=' + groupId,
            callback: function() {
                common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactRelationships.name, {
                    where: 'contactGroupId=' + groupId,
                    callback: function() {
                        me.getGroupList().getStore().load();
                    }
                });
            }
        });
        console.log("onDeleteGroup")
    }

});
