/**
 * Plugin to add header resizing functionality to a HeaderContainer.
 * Always resizing header to the left of the splitter you are resizing.
 */
Ext.define('Ext.grid.plugin.HeaderResizer', {
    extend: 'Ext.AbstractPlugin',
    requires: ['Ext.dd.DragTracker', 'Ext.util.Region'],
    alias: 'plugin.gridheaderresizer',

    disabled: false,

    config: {
        /**
         * @cfg {Boolean} dynamic
         * True to resize on the fly rather than using a proxy marker.
         * @accessor
         */
        dynamic: false
    },

    colHeaderCls: Ext.baseCSSPrefix + 'column-header',

    minColWidth: 40,
    maxColWidth: 1000,
    wResizeCursor: 'col-resize',
    eResizeCursor: 'col-resize',
    // not using w and e resize bc we are only ever resizing one
    // column
    //wResizeCursor: Ext.isWebKit ? 'w-resize' : 'col-resize',
    //eResizeCursor: Ext.isWebKit ? 'e-resize' : 'col-resize',

    init: function(headerCt) {
        this.headerCt = headerCt;
        headerCt.on('render', this.afterHeaderRender, this, {single: true});
    },

    /**
     * @private
     * AbstractComponent calls destroy on all its plugins at destroy time.
     */
    destroy: function() {
        if (this.tracker) {
            this.tracker.destroy();
        }
    },

    afterHeaderRender: function() {
        var headerCt = this.headerCt,
            el = headerCt.el;

        headerCt.mon(el, 'mousemove', this.onHeaderCtMouseMove, this);

        this.tracker = new Ext.dd.DragTracker({
            disabled: this.disabled,
            onBeforeStart: Ext.Function.bind(this.onBeforeStart, this),
            onStart: Ext.Function.bind(this.onStart, this),
            onDrag: Ext.Function.bind(this.onDrag, this),
            onEnd: Ext.Function.bind(this.onEnd, this),
            tolerance: 3,
            autoStart: 300,
            el: el
        });
    },

    // As we mouse over individual headers, change the cursor to indicate
    // that resizing is available, and cache the resize target header for use
    // if/when they mousedown.
    onHeaderCtMouseMove: function(e, t) {
        var me = this,
            prevSiblings,
            headerEl, overHeader, resizeHeader, resizeHeaderOwnerGrid, ownerGrid;

        if (me.headerCt.dragging) {
            if (me.activeHd) {
                me.activeHd.el.dom.style.cursor = '';
                delete me.activeHd;
            }
        } else {
            headerEl = e.getTarget('.' + me.colHeaderCls, 3, true);

            if (headerEl){
                overHeader = Ext.getCmp(headerEl.id);

                // On left edge, go back to the previous non-hidden header.
                if (overHeader.isOnLeftEdge(e)) {
                    resizeHeader = overHeader.previousNode('gridcolumn:not([hidden]):not([isGroupHeader])')
                    // There may not *be* a previous non-hidden header.
                    if (resizeHeader) {

                        ownerGrid = me.headerCt.up('tablepanel');
                        resizeHeaderOwnerGrid = resizeHeader.up('tablepanel');

                        // Need to check that previousNode didn't go outside the current grid/tree
                        // But in the case of a Grid which contains a locked and normal grid, allow previousNode to jump
                        // from the first column of the normalGrid to the last column of the lockedGrid
                        if (!((resizeHeaderOwnerGrid === ownerGrid) || ((ownerGrid.ownerCt.isXType('tablepanel')) && ownerGrid.ownerCt.view.lockedGrid === resizeHeaderOwnerGrid))) {
                            resizeHeader = null;
                        }
                    }
                }
                // Else, if on the right edge, we're resizing the column we are over
                else if (overHeader.isOnRightEdge(e)) {
                    resizeHeader = overHeader;
                }
                // Between the edges: we are not resizing
                else {
                    resizeHeader = null;
                }

                // We *are* resizing
                if (resizeHeader) {
                    // If we're attempting to resize a group header, that cannot be resized,
                    // so find its last visible leaf header; Group headers are sized
                    // by the size of their child headers.
                    if (resizeHeader.isGroupHeader) {
                        prevSiblings = resizeHeader.getGridColumns();
                        resizeHeader = prevSiblings[prevSiblings.length - 1];
                    }

                    // Check if the header is resizable. Continue checking the old "fixed" property, bug also
                    // check whether the resizablwe property is set to false.
                    if (resizeHeader && !(resizeHeader.fixed || (resizeHeader.resizable === false) || me.disabled)) {
                        me.activeHd = resizeHeader;
                        overHeader.el.dom.style.cursor = me.eResizeCursor;
                    }
                // reset
                } else {
                    overHeader.el.dom.style.cursor = '';
                    delete me.activeHd;
                }
            }
        }
    },

    // only start when there is an activeHd
    onBeforeStart : function(e){
        var t = e.getTarget();
        // cache the activeHd because it will be cleared.
        this.dragHd = this.activeHd;

        if (!!this.dragHd && !Ext.fly(t).hasCls(Ext.baseCSSPrefix + 'column-header-trigger') && !this.headerCt.dragging) {
            //this.headerCt.dragging = true;
            this.tracker.constrainTo = this.getConstrainRegion();
            return true;
        } else {
            this.headerCt.dragging = false;
            return false;
        }
    },

    // get the region to constrain to, takes into account max and min col widths
    getConstrainRegion: function() {
        var me       = this,
            dragHdEl = me.dragHd.el,
            nextHd;

        // If forceFit, then right constraint is based upon not being able to force the next header
        // beyond the minColWidth. If there is no next header, then the header may not be expanded.
        if (me.headerCt.forceFit) {
            nextHd = me.dragHd.nextNode('gridcolumn:not([hidden]):not([isGroupHeader])');
        }

        return me.adjustConstrainRegion(
            Ext.util.Region.getRegion(dragHdEl),
            0,
            me.headerCt.forceFit ? (nextHd ? nextHd.getWidth() - me.minColWidth : 0) : me.maxColWidth - dragHdEl.getWidth(),
            0,
            me.minColWidth
        );
    },

    // initialize the left and right hand side markers around
    // the header that we are resizing
    onStart: function(e){
        var me       = this,
            dragHd   = me.dragHd,
            dragHdEl = dragHd.el,
            width    = dragHdEl.getWidth(),
            headerCt = me.headerCt,
            t        = e.getTarget(),
            x, y, gridSection, dragHct, firstSection, lhsMarker, rhsMarker, markerHeight;

        if (me.dragHd && !Ext.fly(t).hasCls(Ext.baseCSSPrefix + 'column-header-trigger')) {
            headerCt.dragging = true;
        }

        me.origWidth = width;

        // setup marker proxies
        if (!me.dynamic) {
            x            = me.getDragHdX();
            gridSection  = headerCt.up('tablepanel');
            dragHct      = me.dragHd.up(':not([isGroupHeader])');
            firstSection = dragHct.up();
            lhsMarker    = gridSection.getLhsMarker();
            rhsMarker    = gridSection.getRhsMarker();
            markerHeight = firstSection.body.getHeight() + headerCt.getHeight();
            y            = dragHdEl.getY() - gridSection.getY();

            x += me.getViewOffset(gridSection);

            lhsMarker.setLocalY(y);
            rhsMarker.setLocalY(y);
            lhsMarker.setHeight(markerHeight);
            rhsMarker.setHeight(markerHeight);
            me.setMarkerX(lhsMarker, x);
            me.setMarkerX(rhsMarker, x + width);
        }
    },

    // synchronize the rhsMarker with the mouse movement
    onDrag: function(e){
        if (!this.dynamic) {
            var gridSection = this.headerCt.up('tablepanel');
            this.setMarkerX(gridSection.getRhsMarker(), this.calculateDragX(gridSection));
        // Resize as user interacts
        } else {
            this.doResize();
        }
    },

    onEnd: function(e){
        this.headerCt.dragging = false;
        if (this.dragHd) {
            if (!this.dynamic) {
                var gridSection = this.headerCt.up('tablepanel'),
                    lhsMarker   = gridSection.getLhsMarker(),
                    rhsMarker   = gridSection.getRhsMarker(),
                    offscreen   = -9999;

                // hide markers
                this.setMarkerX(lhsMarker, offscreen);
                this.setMarkerX(rhsMarker, offscreen);
            }
            this.doResize();
        }
    },

    doResize: function() {
        if (this.dragHd) {
            var dragHd = this.dragHd,
                nextHd,
                offset = this.tracker.getOffset('point');

            // resize the dragHd
            if (dragHd.flex) {
                delete dragHd.flex;
            }

            Ext.suspendLayouts();

            // Set the new column width.
            this.adjustColumnWidth(offset[0]);
 
            // In the case of forceFit, change the following Header width.
            // Constraining so that neither neighbour can be sized to below minWidth is handled in getConstrainRegion
            if (this.headerCt.forceFit) {
                nextHd = dragHd.nextNode('gridcolumn:not([hidden]):not([isGroupHeader])');
                if (nextHd) {
                    delete nextHd.flex;
                    nextHd.setWidth(nextHd.getWidth() - offset[0]);
                }
            }

            // Apply the two width changes by laying out the owning HeaderContainer
            Ext.resumeLayouts(true);
        }
    },

    disable: function() {
        this.disabled = true;
        if (this.tracker) {
            this.tracker.disable();
        }
    },

    enable: function() {
        this.disabled = false;
        if (this.tracker) {
            this.tracker.enable();
        }
    },

    calculateDragX: function(gridSection) {
        return this.tracker.getXY('point')[0] - gridSection.getX();
    },

    getDragHdX: function() {
        return this.dragHd.el.getLocalX();
    },

    setMarkerX: function(marker, x) {
        marker.setLocalX(x);
    },

    adjustConstrainRegion: function(region, t, r, b, l) {
        return region.adjust(t, r, b, l);
    },

    adjustColumnWidth: function(offsetX) {
        this.dragHd.setWidth(this.origWidth + offsetX);
    },
    
    getViewOffset: function(gridSection) {
        return gridSection.view.getX() - gridSection.getX() - gridSection.el.getBorderWidth('l');
    }
});