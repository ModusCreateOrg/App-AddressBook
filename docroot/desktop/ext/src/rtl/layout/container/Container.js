Ext.define('Ext.rtl.layout.container.Container', {
    override: 'Ext.layout.container.Container',

    getRenderData: function () {
        var renderData = this.callParent();

        if (this.owner.getHierarchyState().rtl) {
            renderData.targetCls = Ext.baseCSSPrefix + 'rtl'
        }
        
        return renderData;
    }
});