/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/13/13
 * Time: 9:37 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

(function () {

    function deleteContactRelationships(contactId, callback) {
        if (!contactId) {
            callback();
            return;
        }
        common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactRelationships.name, {
            where    : 'contactId=' + contactId,
            callback : function (o) {
                callback();
            }
        });
    }

    function addContactRelationships(contactId, groupIds, callback) {
        var records = [];
        Ext.each(groupIds, function (id) {
            records.push({
                contactId      : contactId,
                contactGroupId : id
            });
        });
        if (records.length) {
            common.DreamFactory.createRecords(mobile.schemas.ContactRelationships.name, records, function (o) {
                callback();
            });
        }
        else {
            callback();
        }
    }

    function saveContactRecord(record, callback) {
        var me = this,
            schema = mobile.schemas.Contacts,
            groupIds = [];

        if (record.groups) {
            Ext.iterate(record.groups, function (group) {
                if (group.checked) {
                    groupIds.push(parseInt(group.value, 10));
                }
            });
        }

        if (record[schema.primaryKey]) {
            deleteContactRelationships(record[schema.primaryKey], function () {
                common.DreamFactory.updateRecords(schema.name, [record], function () {
                    addContactRelationships(record[schema.primaryKey], groupIds, function () {
                        if (callback) {
                            callback(record);
                        }
                    });
                });
            });
        }
        else {
            common.DreamFactory.createRecords(schema.name, [record], function (o) {
                record.contactId = parseInt('0' + o.record[0].contactId, 10);
                addContactRelationships(record.contactId, groupIds, function () {
                    if (callback) {
                        callback(record);
                    }
                });
            });
        }
    }

    function deleteContactInfo(record, callback) {
        if (!record || !record.contactId) {
            callback();
            return;
        }
        common.DreamFactory.deleteRecordsFiltered(mobile.schemas.ContactInfo.name, {
            where    : 'contactId=' + record.contactId,
            callback : function (o) {
                callback();
            }
        });
    }

    Ext.define('mobile.controller.ContactEditor', {
        extend : 'Ext.app.Controller',

        requires : [
            'mobile.ux.DataSourceField',
            'Ext.MessageBox'
        ],
        config   : {
            refs    : {
                form        : 'contact_editor',
                mainPanel   : 'mainview',
                contactList : 'contact_list'
            },
            control : {
                'contact_editor' : {
                    show         : 'onFormShown',
                    beforesubmit : 'onBeforeSubmit'
                }
            }
        },

        init : function () {
            console.log('init ' + this.$className);
            this.callParent(arguments);
        },

        onFormShown : function () {

        },

        validate : function (values) {
            if (!values.firstName.length || !values.lastName.length) {
                Ext.Msg.alert('Error', 'First and Last Name are required');
                return false;
            }
            return true;
        },

        doSave : function () {
            console.log('doSave');
            var me = this,
                contactList = me.getContactList(),
                mainPanel = me.getMainPanel(),
                form = me.getForm(),
                record = form.getValues();

            if (!me.validate(record)) {
                return;
            }
            console.dir(record);
            var contactId = record.contactId = parseInt('0' + record.contactId, 10);

            if (record.imageUrl === '../img/default_portrait.png') {
                record.imageUrl = '';
            }

            saveContactRecord(record, function (o) {
                deleteContactInfo(record, function () {

                    var infoData = {
                        Home         : {
                            contactId : record.contactId
                        },
                        Home_empty   : true,
                        Work         : {
                            contactId : record.contactId
                        },
                        Work_empty   : true,
                        Mobile       : {
                            contactId : record.contactId
                        },
                        Mobile_empty : true
                    };

                    Ext.iterate(record, function (key, value) {
                        var parts = key.split('_');
                        if (parts.length > 1) {
                            var what = parts[0],
                                fieldName = parts[1];

                            if (fieldName !== 'infoId') {
                                infoData[what][fieldName] = value;
                                if (fieldName != 'infoType' && value.length) {
                                    console.log(key + ' = ' + value);
                                    infoData[what + '_empty'] = false;
                                }
                            }
                            delete record[key];
                        }
                    });


                    var info = [];
                    if (!infoData.Home_empty) {
                        info.push(infoData.Home);
                    }
                    if (!infoData.Work_empty) {
                        info.push(infoData.Work);
                    }
                    if (!infoData.Mobile_empty) {
                        info.push(infoData.Mobile);
                    }

//                    console.dir(infoData);
                    // create records
                    common.DreamFactory.createRecords(mobile.schemas.ContactInfo.name, info, function (o) {
                        // fire event
                        contactList.getStore().load(function () {
                            mainPanel.fireEvent('showCard', 'contact', 'down', record);
                        });
                    });
                });
            });

        },

        onBeforeSubmit : function () {
            this.doSave();
            return false;
        }
    });

}());

