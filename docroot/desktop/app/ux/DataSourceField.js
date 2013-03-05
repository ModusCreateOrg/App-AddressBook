/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/25/13
 * Time: 6:06 AM
 */

Ext.define('ab.ux.DataSourceField', {
    extend: 'Ext.form.CheckboxGroup',
    alias: 'widget.datasourcefield',
    requires: [
        'Ext.form.field.Checkbox'
    ],
    columns: 1,
    vertical: true,

    initComponent: function() {
        var me = this,
//            id = 'ds-' + Ext.id(),
            items = [],
            initialized = false;

        Ext.iterate(me.value, function(item) {
            console.dir(item);
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
        me.items = items;
        me.callParent(arguments);
        initialized = true;
    },
    getValue: function() {
        return this.value;
//        return this.callParent(arguments);
    },
    setValue: function(v) {
        var me = this;
        console.dir(v);
        me.value = v;
//        me.callParent(arguments);
        Ext.iterate(v, function(value) {
            Ext.getCmp(me.id + '-' + value.value).setRawValue(value.checked);
        });
    }

});