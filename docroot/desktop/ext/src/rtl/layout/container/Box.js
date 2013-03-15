Ext.define('Ext.rtl.layout.container.Box', {
    override: 'Ext.layout.container.Box',

    initLayout: function() {
        var me = this;

        if (me.owner.getHierarchyState().rtl) {
            me.names = Ext.Object.chain(me.names);
            Ext.apply(me.names, me.rtlNames);
        }

        me.callParent(arguments);
    }
});
