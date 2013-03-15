Ext.define('Ext.rtl.EventObjectImpl', {
    override: 'Ext.EventObjectImpl',
    
    getXY: function() {
        var xy = this.xy;

        if (!xy) {
            xy = this.callParent();
            // since getXY is a page-level concept, we only need to check the
            // rootHierarchyState once to see if all successive calls to getXY() should have
            // their x-coordinate converted to rtl.
            if (this.rtl || (this.rtl = Ext.rootHierarchyState.rtl)) {
                xy[0] = Ext.Element.getViewportWidth() - xy[0];
            }
        }
        return xy;
    }

});