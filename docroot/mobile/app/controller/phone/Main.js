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
            groupList   : 'group_list',
            contactList : 'contact_list',
            mainPanel   : 'mainview',
            titleBar    : 'titlebar',
            backButton  : 'button[align=left]',
            detailCard  : 'contact_information'
        },
        control : {
            'group_list' : {
                itemtap: 'onGroupSelected'
            },
            'contact_list' : {
                itemtap : 'onContactSelected'
            },

            'mainview > titlebar button[align=left]' : {
                tap : 'onBackButton'
            }
        }
    },

    init : function () {
        console.log('init ' + this.$className);
    },

    onGroupSelected: function(list, index, target, record, e) {
        var me = this,
            mainPanel = this.getMainPanel(),
            titleBar = this.getTitleBar(),
            backButton = this.getBackButton();

        mainPanel.animateActiveItem(1, {
            type      : 'slide',
            duration  : 250,
            direction : 'right'
        });
        Ext.Function.defer(function () {
//            titleBar.setTitle(mainPanel.getTitle());
            titleBar.setTitle(record.data.groupName);
            backButton.show();
            backButton.setText('Groups');
        }, 260)
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

        var records = [];
        Ext.iterate(data.record, function (record) {
            records.push(record.fields);
        });
        me.showDetails(records);

        delete me.selectedRecord;
    },

    showDetails : function (contactData) {
        var me = this,
            recordData = me.selectedRecord.data,
            contactList = me.getContactList(),
            mainPanel = me.getMainPanel(),
            titleBar = me.getTitleBar(),
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

        Ext.Function.defer(function () {
            titleBar.setTitle('info');
            backButton.setText('Contacts');
            backButton.show();
            contactList.deselectAll();
        }, 260);

        delete me.selectedRecord;
    },

    onBackButton : function () {
        var mainPanel = this.getMainPanel(),
            titleBar = this.getTitleBar(),
            backButton = this.getBackButton();

        if (backButton.getText() === 'Groups') {
            mainPanel.animateActiveItem(0, {
                type      : 'slide',
                duration  : 250,
                direction : 'right'
            });
            Ext.Function.defer(function () {
                titleBar.setTitle('Contact Groups');
                backButton.hide();
            }, 260)
        }
        else {
            mainPanel.animateActiveItem(1, {
                type      : 'slide',
                duration  : 250,
                direction : 'right'
            });

            Ext.Function.defer(function () {
                backButton.setText('Groups');
                titleBar.setTitle('Contacts');
            }, 260)
        }
    }

});
