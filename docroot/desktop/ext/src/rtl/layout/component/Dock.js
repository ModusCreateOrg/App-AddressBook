/**
 * @override Ext.rtl.layout.component.Dock
 * This override adds RTL support to Ext.layout.component.Dock.
 */
Ext.define('Ext.rtl.layout.component.Dock', {
    override: 'Ext.layout.component.Dock',

    rtlPositions: {
        top: 'top',
        right: 'left',
        bottom: 'bottom',
        left: 'right'
    },

    getDockCls: function(dock) {
        // When in RTL mode it is necessary to reverse "left" and "right" css class names.
        // We have to do it this way (as opposed to using css overrides) because of the
        // !important border-width rules, e.g.:
        // .x-docked-left { border-right-width: 0 !important; }
        return 'docked-' +
            (this.owner.getHierarchyState().rtl ? this.rtlPositions[dock] : dock);
    }
});
