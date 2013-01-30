Ext.define('ab.ux.TypeComboField', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.typecombofield',
    initComponent: function() {
        var me = this;
        var config = {
            triggerAction: 'all',
            store: [ 'Home', 'Work', 'Mobile' ],
            queryMode: 'local'
        };

        Ext.apply(me, Ext.apply(me.initialConfig, config));
        me.callParent(arguments);
    }
});
