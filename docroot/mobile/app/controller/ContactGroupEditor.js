/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/6/13
 * Time: 8:11 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('mobile.controller.ContactGroupEditor', {
    extend : 'Ext.app.Controller',

    requires: [
        'Ext.MessageBox'
    ],
    config : {
        refs    : {
            mainPanel         : 'mainview',
            groupList         : 'group_list',
            form              : 'contact_group_editor'
        },
        control : {
            'contact_group_editor' : {
                show         : 'onFormShown',
                beforesubmit : 'onBeforeSubmit'
            }
        }
    },

    init : function () {
        console.log('init ' + this.$className);
        this.callParent(arguments);
    },

    doSave: function() {
        var me = this,
            form = me.getForm(),
            groupList = me.getGroupList(),
            mainPanel = me.getMainPanel();

        var values = form.getValues();
        console.dir(values);

        if (!values.groupName || !values.groupName.trim().length) {
            Ext.Msg.alert('Error', 'Group Name is required');
            return;
        }

        common.DreamFactory.filterRecords(mobile.schemas.ContactGroups.name, {
            where: 'groupName=' + '"' + values.groupName + '"',
            callback: function(o) {
                if (o.record.length) {
                    Ext.Msg.alert('Error', 'Group already exists');
                    return;
                }
                common.DreamFactory.createRecords(mobile.schemas.ContactGroups.name, values, function(o) {
                    console.dir(o);
                    groupList.getStore().load({
                        callback : function () {
                            mainPanel.fireEvent('showCard', 'groupList', 'down');
                            groupList.highlightRecord(parseInt('0' + o.record[0].contactGroupId, 10));
//                            form.reset();
                        }
                    });
                });
            }
        });

    },

    onFormShown : function () {

    },

    onBeforeSubmit : function () {
        this.doSave();
        return false;
    }

});