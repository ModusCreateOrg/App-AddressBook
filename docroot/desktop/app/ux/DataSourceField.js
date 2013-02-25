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
            id = 'ds-' + Ext.id(),
            items = [];

        Ext.iterate(me.value, function(item) {
            console.dir(item);
            items.push({
                boxLabel: item.display,
                name: id,
                inputValue: item.value
            });
        });
        me.items = items;
        me.callParent(arguments);
    }
});