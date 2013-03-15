Ext.define('Ext.rtl.dom.Element_insertion', {
    override: 'Ext.dom.Element',

    wrap: function() {
        var parent = this.parent(),
            rtlCls = Ext.baseCSSPrefix + 'rtl',
            ltrCls = Ext.baseCSSPrefix + 'ltr',
            wrapEl = this.callParent(arguments),
            cls;

        // if the parentNode of the element being wrapped has the "x-rtl" or "x-ltr" css
        // class, then add that class to the wrapper as well.  This ensures that descendant
        // and child selectors still apply e.g. ".x-rtl > .x-foo" or ".x-ltr .x-foo"
        if (parent.hasCls(rtlCls)) {
            cls = rtlCls;
        } else if (parent.hasCls(ltrCls)) {
            cls = ltrCls;
        }

        if (cls) {
            // superclass method may return dom, so use fly() to access the wrap el
            Ext.fly(wrapEl, '_wrap').addCls(cls);
        }

        return wrapEl;
    }
});