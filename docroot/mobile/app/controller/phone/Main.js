/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/14/13
 * Time: 7:10 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('mobile.controller.phone.Main', {
    extend: 'Ext.app.Controller',

    config : {
        refs    : {
            contactList : 'contact_list',
            mainPanel    : 'mainview',
            titleBar     : 'titlebar',
            backButton   : 'button[align=left]',
            detailCard   : 'contact_information'
        },
        control : {
            'contact_list' : {
                itemtap : 'onContactSelected'
            },

            'mainview > titlebar button[align=left]' : {
                tap : 'onBackButton'
            }
        }
    },

    init: function() {
        console.log('init ' + this.$className);
    },

    onContactSelected : function(list, index, target, record, e) {
        var me = this;

        me.selectedRecord = record;

        common.DreamFactory.filterRecords('ContactInfo', {
            where: 'contactId=' + record.get('contactId'),
            callback: function(o) {
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
        var me           = this,
            recordData   = me.selectedRecord.data,
            contactList = me.getContactList(),
            mainPanel    = me.getMainPanel(),
            titleBar     = me.getTitleBar(),
            backButton   = me.getBackButton();

        recordData.contactData = recordData.contactData || contactData;

        console.log('Contact', recordData);
        me.getDetailCard().setData(recordData);

        mainPanel.animateActiveItem(1, {
            type      : 'slide',
            duration  : 250,
            direction : 'left'
        });

        Ext.Function.defer(function() {
            titleBar.setTitle('info');
            backButton.show();
            contactList.deselectAll();
        }, 260);

        delete me.selectedRecord;
    },

    onBackButton : function() {
        var mainPanel  = this.getMainPanel(),
            titleBar   = this.getTitleBar(),
            backButton = this.getBackButton();

        mainPanel.animateActiveItem(0, {
            type      : 'slide',
            duration  : 250,
            direction : 'right'
        });

        Ext.Function.defer(function() {
            titleBar.setTitle(mainPanel.getTitle());
            backButton.hide();
        }, 260)
    }

});
