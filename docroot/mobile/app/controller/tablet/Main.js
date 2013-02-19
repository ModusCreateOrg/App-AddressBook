/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/18/13
 * Time: 11:34 AM
 */

Ext.define('mobile.controller.tablet.Main', {
    extend: 'Ext.app.Controller',

    config : {
        refs    : {
            contactList : 'contact_list',
            mainPanel    : 'mainview',
            titleBar     : 'titlebar',
            detailCard   : 'contact_information'
        },
        control : {
            'contact_list' : {
                itemtap : 'onContactSelected'
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
            titleBar     = me.getTitleBar();

        recordData.contactData = recordData.contactData || contactData;
        recordData.imageUrl = recordData.imageUrl || '/img/default_portrait.png';
        if (recordData.notes) {
            recordData.notes = recordData.notes.replace(/\n/igm, '<br/>');
        }
        me.getDetailCard().setData(recordData);

        delete me.selectedRecord;
    }

});

