/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 3/14/13
 * Time: 10:25 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

Ext.define('mobile.ux.DataSourceField', {
    extend   : 'Ext.form.FieldSet',
    xtype    : 'datasourcefield',
    isField: true,
    requires : [
        'Ext.field.Checkbox'
    ],

    config : {
        title : 'Data Source Field',
        value : null
    },

    initialize : function() {
        var me = this,
            items = [];

        console.log('init', this.$className);
        Ext.iterate(me.getValue(), function(item) {
            items.push({
                xtype      : 'checkboxfield',
                checked    : item.checked,
                valueItem  : item,
                label      : item.display,
                inputValue : item.value,
                labelWidth : '90%',
                listeners  : {
                    change : function(cb, newValue, oldValue, eOpts) {
                        cb.valueItem.checked = newValue;
                    }
                }
            });
        });
        me.setItems(items);
        me.callParent(arguments);
    },

    getValue: function() {
        var me = this;
        return me._value;
    },

    getName: function() {
        var me = this;
        return me.name;
    }

});
