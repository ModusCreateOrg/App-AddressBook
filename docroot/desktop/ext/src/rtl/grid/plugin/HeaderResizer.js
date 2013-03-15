Ext.define('Ext.rtl.grid.plugin.HeaderResizer', {
    override: 'Ext.grid.plugin.HeaderResizer',

    adjustColumnWidth: function(offsetX) {
        if (!this.headerCt.getHierarchyState().rtl !== !Ext.rootHierarchyState.rtl) {
            offsetX = -offsetX;
        }
        this.callParent(arguments);
    },

    adjustConstrainRegion: function(region, t, r, b, l) {
        return (!this.headerCt.getHierarchyState().rtl !== !Ext.rootHierarchyState.rtl) ?
            region.adjust(t, -l, b, -r) : this.callParent(arguments);
    },

    calculateDragX: function(gridSection) {
        var gridX = gridSection.getX(),
            mouseX = this.tracker.getXY('point')[0];

        return (!this.headerCt.getHierarchyState().rtl !== !Ext.rootHierarchyState.rtl) ?
            (gridX + gridSection.getWidth() - mouseX) : (mouseX - gridX);

    },

    getDragHdX: function() {
        var el = this.dragHd.el;
        return this.headerCt.getHierarchyState().rtl ? el.rtlGetLocalX() : el.getLocalX();
    },

    getViewOffset: function(gridSection) {
        var headerCtRtl = this.headerCt.getHierarchyState().rtl,
            borderWidth = gridSection.el.getBorderWidth(headerCtRtl ? 'r': 'l'),
            view = gridSection.view,
            offset = view.getX() - gridSection.getX();
            
        if (!headerCtRtl !== !Ext.rootHierarchyState.rtl) {
            offset = -(offset + view.getWidth() - gridSection.getWidth());
        }

        return offset - borderWidth;
    },

    setMarkerX: function(marker, x) {
        this.headerCt.getHierarchyState().rtl ? marker.rtlSetLocalX(x) : marker.setLocalX(x);
    }
});
