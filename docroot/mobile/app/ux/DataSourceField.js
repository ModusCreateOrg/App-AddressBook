/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/14/13
 * Time: 10:25 AM
 */

Ext.define('mobile.ux.DataSourceField', {
    extend: 'Ext.form.FieldSet',
    xtype: 'datasourcefield',
    requires: [
        'Ext.field.Checkbox'
    ],
    
    config : {
          title: 'Data Source Field',
          value : null
    },

    initialize: function() {
        var me = this,
            items = [];

        console.log('init', this.$className);
        Ext.iterate(me.getValue(), function(item) {
            items.push({
                id: me.id + '-' + item.value,
                checked: item.checked,
                valueItem: item,
                boxLabel: item.display,
//                name: id,
                inputValue: item.value,
                listeners: {
                    change: function(cb, newValue, oldValue, eOpts) {
                        console.log(newValue + ' ' + oldValue);
                        if (initialized) {
                            console.log('initialized');
                            cb.valueItem.checked = newValue;
                        }
                    }
                }
            });
        });
        me.setItems(items);
        console.dir(items);
        me.callParent(arguments);
    }
});
