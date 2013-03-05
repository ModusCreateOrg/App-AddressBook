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
            groupList     : 'group_list',
            contactList   : 'contact_list',
            contactEditor : 'contact_editor',
            mainPanel     : 'mainview',
            titleBar      : 'titlebar',
            backButton    : 'button[align=left]',
            rightButton   : 'button[action=title-right]',
            detailCard    : 'contact_information'
        },
        control : {
            'group_list' : {
                itemtap : 'onGroupSelected'
            },

            'contact_list' : {
                itemtap : 'onContactSelected'
            },

            'button[action=title-right]' : {
                tap : 'onRightButton'
            },

            'mainview > titlebar button[align=left]' : {
                tap : 'onBackButton'
            }
        }
    },

    init : function() {
        console.log('init ' + this.$className);
    },

    showContactGroupsCard: function() {
        var me = this,
            mainPanel = this.getMainPanel(),
            titleBar = this.getTitleBar(),
            rightButton = me.getRightButton(),
            backButton = this.getBackButton();

        mainPanel.animateActiveItem(0, {
            type      : 'slide',
            duration  : 250,
            direction : 'right'
        });
        Ext.Function.defer(function() {
            titleBar.setTitle('Contact Groups');
            backButton.hide();
            rightButton.setIconCls('add');
            rightButton.setCls('mobile-add-contact-group-button');
        }, 260)
    },

    showContactsCard: function() {
        var me = this,
            mainPanel = me.getMainPanel(),
            titleBar = me.getTitleBar(),
            rightButton = me.getRightButton(),
            backButton = me.getBackButton();

        mainPanel.animateActiveItem(1, {
            type      : 'slide',
            duration  : 250,
            direction : 'right'
        });
        Ext.Function.defer(function() {
            titleBar.setTitle(me.contactGroupSelected);
            backButton.show();
            backButton.setText('Groups');
            rightButton.setCls('mobile-add-contact-button');
        }, 260)
    },

    onGroupSelected : function(list, index, target, record, e) {
        var me = this;
        me.contactGroupSelected = record.data.groupName;

        me.showContactsCard();
    },

    onContactSelected : function(list, index, target, record, e) {
        var me = this;

        me.selectedRecord = record;

        common.DreamFactory.filterRecords('ContactInfo', {
            where    : 'contactId=' + record.get('contactId'),
            callback : function(o) {
                me.onAfterContactDetailsLoad(o);
            }
        });
    },

    onAfterContactDetailsLoad : function(data) {
        var me = this,
            record = me.selectedRecord;

        var records = [];
        Ext.iterate(data.record, function(record) {
            records.push(record.fields);
        });
        me.showDetails(records);

        delete me.selectedRecord;
    },

    showDetails : function(contactData) {
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

        mainPanel.animateActiveItem(2, {
            type      : 'slide',
            duration  : 250,
            direction : 'left'
        });

        Ext.Function.defer(function() {
            titleBar.setTitle('info');
            backButton.setText('Contacts');
            backButton.show();
            rightButton.setIconCls('compose');
            rightButton.setCls('mobile-edit-contact-button');
            contactList.deselectAll();
        }, 260);

        delete me.selectedRecord;
    },

    onRightButton : function() {
        var mainPanel = this.getMainPanel(),
            titleBar = this.getTitleBar(),
            backButton = this.getBackButton();
            rightButton = this.getRightButton();

        var cls = '';
        Ext.each(rightButton.getCls(), function(item) {
            if (item.indexOf('mobile-') === 0) {
                cls = item;
            }
        });
        console.dir(cls);
        switch (cls) {
            case 'mobile-edit-contact-button':
                mainPanel.animateActiveItem(3, {
                    type      : 'slide',
                    duration  : 250,
                    direction : 'right'
                });
                Ext.Function.defer(function() {
                    titleBar.setTitle('Edit Contact');
                    backButton.setText('Cancel');
                    backButton.show();
                }, 260)
                break;
        }

    },

    onBackButton : function() {
        var me = this,
            mainPanel = this.getMainPanel(),
            titleBar = this.getTitleBar(),
            rightButton = me.getRightButton(),
            backButton = this.getBackButton();

        switch (backButton.getText()) {
            case 'Groups':
                me.showContactGroupsCard();
                break;
            case 'Cancel':
                mainPanel.animateActiveItem(2, {
                    type      : 'slide',
                    duration  : 250,
                    direction : 'right'
                });
                Ext.Function.defer(function() {
                    titleBar.setTitle('info');
                    backButton.setText('Contacts');
                    backButton.show();
                    rightButton.setIconCls('add');
                    rightButton.setCls('mobile-edit-contact-button');
                }, 260);
                break;
            default:
                me.showContactsCard();
                break;
        }
    }

});
