/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/18/13
 * Time: 11:34 AM
 */

(function () {

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

    Ext.define('mobile.controller.tablet.Main', {
        extend : 'Ext.app.Controller',

        config : {
            refs    : {
                contactList : 'contact_list',
                mainPanel   : 'mainview',
                titleBar    : 'titlebar',
                detailCard  : 'contact_details'
            },
            control : {
                'contact_list' : {
                    itemtap : 'onContactSelected'
                },
                viewport       : {
                    orientationchange : 'onOrientationChange'
                }
            }
        },

        init : function () {
            console.log('init ' + this.$className);
        },

        onOrientationChange : function (viewport, orientation, width, height) {
            console.log('orientation changed');
            console.log(orientation + ' ' + width + 'x' + height);
        },

        onContactSelected : function (list, index, target, record, e) {
            var me = this;

            me.selectedRecord = record;

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

//        common.DreamFactory.filterRecords('ContactInfo', {
//            where: 'contactId=' + record.get('contactId'),
//            callback: function(o) {
//                me.onAfterContactDetailsLoad(o);
//            }
//        });
        },

        onAfterContactDetailsLoad : function () {
            var me = this,
                recordData = me.selectedRecord;


            recordData.imageUrl = recordData.imageUrl || '../img/default_portrait.png';
            if (recordData.notes) {
                recordData.notes = recordData.notes.replace(/\n/igm, '<br/>');
            }

            me.getDetailCard().setData(recordData);


//            var records = [];
//            Ext.iterate(data.record, function (record) {
//                records.push(record.fields);
//            });
//            me.showDetails(records);
//
//            delete me.selectedRecord;
        },

        showDetails : function (contactData) {
            var me = this,
                recordData = me.selectedRecord;


            recordData.imageUrl = recordData.imageUrl || '../img/default_portrait.png';
            if (recordData.notes) {
                recordData.notes = recordData.notes.replace(/\n/igm, '<br/>');
            }

            me.getDetailCard().setData(recordData);

//
//
//            var me = this,
//                recordData = me.selectedRecord.data,
//                contactList = me.getContactList(),
//                mainPanel = me.getMainPanel(),
//                titleBar = me.getTitleBar();
//
//            recordData.contactData = recordData.contactData || contactData;
//            recordData.imageUrl = recordData.imageUrl || '../img/default_portrait.png';
//            if (recordData.notes) {
//                recordData.notes = recordData.notes.replace(/\n/igm, '<br/>');
//            }
//            me.getDetailCard().setData(recordData);
//
//            delete me.selectedRecord;
        }

    });

}());
