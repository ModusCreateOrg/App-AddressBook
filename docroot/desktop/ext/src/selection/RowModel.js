/**
 * Implements row based navigation via keyboard.
 *
 * Must synchronize across grid sections.
 */
Ext.define('Ext.selection.RowModel', {
    extend: 'Ext.selection.Model',
    alias: 'selection.rowmodel',
    requires: ['Ext.util.KeyNav'],

    /**
     * @private
     * Number of pixels to scroll to the left/right when pressing
     * left/right keys.
     */
    deltaScroll: 5,

    /**
     * @cfg {Boolean} enableKeyNav
     *
     * Turns on/off keyboard navigation within the grid.
     */
    enableKeyNav: true,

    /**
     * @cfg {Boolean} [ignoreRightMouseSelection=false]
     * True to ignore selections that are made when using the right mouse button if there are
     * records that are already selected. If no records are selected, selection will continue 
     * as normal
     */
    ignoreRightMouseSelection: false,

    constructor: function() {
        this.addEvents(
            /**
             * @event beforedeselect
             * Fired before a record is deselected. If any listener returns false, the
             * deselection is cancelled.
             * @param {Ext.selection.RowModel} this
             * @param {Ext.data.Model} record The deselected record
             * @param {Number} index The row index deselected
             */
            'beforedeselect',

            /**
             * @event beforeselect
             * Fired before a record is selected. If any listener returns false, the
             * selection is cancelled.
             * @param {Ext.selection.RowModel} this
             * @param {Ext.data.Model} record The selected record
             * @param {Number} index The row index selected
             */
            'beforeselect',

            /**
             * @event deselect
             * Fired after a record is deselected
             * @param {Ext.selection.RowModel} this
             * @param {Ext.data.Model} record The deselected record
             * @param {Number} index The row index deselected
             */
            'deselect',

            /**
             * @event select
             * Fired after a record is selected
             * @param {Ext.selection.RowModel} this
             * @param {Ext.data.Model} record The selected record
             * @param {Number} index The row index selected
             */
            'select'
        );
        this.views = [];
        this.callParent(arguments);
    },

    bindComponent: function(view) {
        var me = this;

        me.views = me.views || [];
        me.views.push(view);
        me.bindStore(view.getStore(), true);

        view.on({
            itemmousedown: me.onRowMouseDown,
            scope: me
        });

        if (me.enableKeyNav) {
            me.initKeyNav(view);
        }
    },

    initKeyNav: function(view) {
        var me = this;

        if (!view.rendered) {
            view.on('render', Ext.Function.bind(me.initKeyNav, me, [view], 0), me, {single: true});
            return;
        }

        // view.el has tabIndex -1 to allow for
        // keyboard events to be passed to it.
        view.el.set({
            tabIndex: -1
        });

        // Drive the KeyNav off the View's itemkeydown event so that beforeitemkeydown listeners may veto
        me.keyNav = new Ext.util.KeyNav({
            target: view,
            ignoreInputFields: true,
            eventName: 'itemkeydown',
            processEvent: function(view, record, node, index, event) {
                event.record = record;
                event.recordIndex = index;
                return event;
            },
            up: me.onKeyUp,
            down: me.onKeyDown,
            right: me.onKeyRight,
            left: me.onKeyLeft,
            pageDown: me.onKeyPageDown,
            pageUp: me.onKeyPageUp,
            home: me.onKeyHome,
            end: me.onKeyEnd,
            space: me.onKeySpace,
            enter: me.onKeyEnter,
            scope: me
        });
    },

    onUpdate: function(record) {
        var me = this,
            view = me.view,
            index;
        
        if (view && me.isSelected(record)) {
            index = view.indexOf(record);
            view.onRowSelect(index);
            if (record === me.lastFocused) {
                view.onRowFocus(index, true);
            }
        }
    },

    // Returns the number of rows currently visible on the screen or
    // false if there were no rows. This assumes that all rows are
    // of the same height and the first view is accurate.
    getRowsVisible: function() {
        var rowsVisible = false,
            view = this.views[0],
            firstRow = view.all.first(),
            rowHeight, gridViewHeight;

        if (firstRow) {
            rowHeight = firstRow.getHeight();
            gridViewHeight = view.el.getHeight();
            rowsVisible = Math.floor(gridViewHeight / rowHeight);
        }

        return rowsVisible;
    },

    // go to last visible record in grid.
    onKeyEnd: function(e) {
        var me = this,
            last = me.views[0].all.last();

        if (last) {
            if (e.shiftKey) {
                me.selectRange(last, me.lastFocused || 0);
                me.setLastFocused(last);
            } else if (e.ctrlKey) {
                me.setLastFocused(last);
            } else {
                me.doSelect(last);
            }
        }
    },

    // go to first visible record in grid.
    onKeyHome: function(e) {
        var me = this,
            firstRow = me.views[0].all.first();

        if (firstRow) {
            if (e.shiftKey) {
                me.selectRange(firstRow, me.lastFocused || 0);
                me.setLastFocused(firstRow);
            } else if (e.ctrlKey) {
                me.setLastFocused(firstRow);
            } else {
                me.doSelect(firstRow, false);
            }
        }
    },

    // Go one page up from the lastFocused record in the grid.
    onKeyPageUp: function(e) {
        var me = this,
            rowsVisible = me.getRowsVisible(),
            selIdx,
            prevIdx,
            prevRecord;

        if (rowsVisible) {
            selIdx = e.recordIndex;
            prevIdx = selIdx - rowsVisible;
            if (prevIdx < 0) {
                prevIdx = 0;
            }
            prevRecord = me.views[0].getRecord(prevIdx);
            if (e.shiftKey) {
                me.selectRange(prevRecord, e.record, e.ctrlKey, 'up');
                me.setLastFocused(prevRecord);
            } else if (e.ctrlKey) {
                e.preventDefault();
                me.setLastFocused(prevRecord);
            } else {
                me.doSelect(prevRecord);
            }

        }
    },

    // Go one page down from the lastFocused record in the grid.
    onKeyPageDown: function(e) {
        var me = this,
            rowsVisible = me.getRowsVisible(),
            selIdx,
            nextIdx,
            nextRecord;

        if (rowsVisible) {
            selIdx = e.recordIndex;
            nextIdx = selIdx + rowsVisible;
            if (nextIdx >= me.store.getCount()) {
                nextIdx = me.store.getCount() - 1;
            }
            nextRecord = me.views[0].getAt(nextIdx);
            if (e.shiftKey) {
                me.selectRange(nextRecord, e.record, e.ctrlKey, 'down');
                me.setLastFocused(nextRecord);
            } else if (e.ctrlKey) {
                // some browsers, this means go thru browser tabs
                // attempt to stop.
                e.preventDefault();
                me.setLastFocused(nextRecord);
            } else {
                me.doSelect(nextRecord);
            }
        }
    },

    // Select/Deselect based on pressing Spacebar.
    // Assumes a SIMPLE selectionmode style
    onKeySpace: function(e) {
        var me = this,
            record = me.lastFocused;

        if (record) {
            if (me.isSelected(record)) {
                me.doDeselect(record, false);
            } else {
                me.doSelect(record, true);
            }
        }
    },
    
    onKeyEnter: Ext.emptyFn,

    // Navigate one record up. This could be a selection or
    // could be simply focusing a record for discontiguous
    // selection. Provides bounds checking.
    onKeyUp: function(e) {
        var me = this,
            pos = {
                row: me.lastFocused ? me.views[0].indexOf(me.lastFocused, true) : me.view.all.endIndex + 1,
                column: 0
            },
            newPos,
            newRecord;

        if (pos.row > 0) {
            newPos = me.view.walkCells(pos, 'up', e);
            newRecord = newPos ? me.views[0].getRecord(newPos.row) : null;
            if (newRecord) {
                if (e.shiftKey && me.lastFocused) {
                    if (me.isSelected(me.lastFocused) && me.isSelected(newRecord)) {
                        me.doDeselect(me.lastFocused, true);
                        me.setLastFocused(newRecord);
                    } else if (!me.isSelected(me.lastFocused)) {
                        me.doSelect(me.lastFocused, true);
                        me.doSelect(newRecord, true);
                    } else {
                        me.doSelect(newRecord, true);
                    }
                } else if (e.ctrlKey) {
                    me.setLastFocused(newRecord);
                } else {
                    me.doSelect(newRecord);
                    //view.focusRow(idx - 1);
                }
            }
        }
        // There was no lastFocused record, and the user has pressed up
        // Ignore??
        //else if (this.selected.getCount() == 0) {
        //
        //    this.doSelect(record);
        //    //view.focusRow(idx - 1);
        //}
    },

    // Navigate one record down. This could be a selection or
    // could be simply focusing a record for discontiguous
    // selection. Provides bounds checking.
    onKeyDown: function(e) {
        var me = this,
            pos = {
                row: me.lastFocused ? me.views[0].indexOf(me.lastFocused) : 0,
                column: 0
            },
            newPos,
            newRecord;

        newPos = me.view.walkCells(pos, 'down', e);
        newRecord = newPos ? me.views[0].getRecord(newPos.row) : null;
        if (newRecord) {
            if (me.selected.getCount() === 0) {
                if (!e.ctrlKey) {
                    me.doSelect(newRecord);
                } else {
                    me.setLastFocused(newRecord);
                }
                //view.focusRow(idx + 1);
            } else if (e.shiftKey && me.lastFocused) {
                if (me.isSelected(me.lastFocused) && me.isSelected(newRecord)) {
                    me.doDeselect(me.lastFocused, true);
                    me.setLastFocused(newRecord);
                } else if (!me.isSelected(me.lastFocused)) {
                    me.doSelect(me.lastFocused, true);
                    me.doSelect(newRecord, true);
                } else {
                    me.doSelect(newRecord, true);
                }
            } else if (e.ctrlKey) {
                me.setLastFocused(newRecord);
            } else {
                me.doSelect(newRecord);
                //view.focusRow(idx + 1);
            }
        }
    },

    scrollByDeltaX: function(delta) {
        var view    = this.views[0],
            section = view.up(),
            hScroll = section.horizontalScroller;

        if (hScroll) {
            hScroll.scrollByDeltaX(delta);
        }
    },

    onKeyLeft: function(e) {
        this.scrollByDeltaX(-this.deltaScroll);
    },

    onKeyRight: function(e) {
        this.scrollByDeltaX(this.deltaScroll);
    },

    // Select the record with the event included so that
    // we can take into account ctrlKey, shiftKey, etc
    onRowMouseDown: function(view, record, item, index, e) {

        // Record index will be -1 if the clicked record is a metadata record and not selectable
        if (index !== -1) {
            if (!this.allowRightMouseSelection(e)) {
                return;
            }

            if (e.button === 0 || !this.isSelected(record)) {
                this.selectWithEvent(record, e);
            }
        }
    },

    /**
     * Checks whether a selection should proceed based on the ignoreRightMouseSelection
     * option.
     * @private
     * @param {Ext.EventObject} e The event
     * @return {Boolean} False if the selection should not proceed
     */
    allowRightMouseSelection: function(e) {
        var disallow = this.ignoreRightMouseSelection && e.button !== 0;
        if (disallow) {
            disallow = this.hasSelection();
        }
        return !disallow;
    },

    // Allow the GridView to update the UI by
    // adding/removing a CSS class from the row.
    onSelectChange: function(record, isSelected, suppressEvent, commitFn) {
        var me      = this,
            views   = me.views,
            viewsLn = views.length,
            rowIdx  = views[0].indexOf(record),
            eventName = isSelected ? 'select' : 'deselect',
            i = 0;

        if ((suppressEvent || me.fireEvent('before' + eventName, me, record, rowIdx)) !== false &&
                commitFn() !== false) {

            for (; i < viewsLn; i++) {
                if (isSelected) {
                    views[i].onRowSelect(rowIdx, suppressEvent);
                } else {
                    views[i].onRowDeselect(rowIdx, suppressEvent);
                }
            }

            if (!suppressEvent) {
                me.fireEvent(eventName, me, record, rowIdx);
            }
        }
    },

    // Provide indication of what row was last focused via
    // the gridview.
    onLastFocusChanged: function(oldFocused, newFocused, supressFocus) {
        var views   = this.views,
            viewsLn = views.length,
            rowIdx,
            i = 0;

        if (oldFocused) {
            rowIdx = views[0].indexOf(oldFocused);
            if (rowIdx != -1) {
                for (; i < viewsLn; i++) {
                    views[i].onRowFocus(rowIdx, false);
                }
            }
        }

        if (newFocused) {
            rowIdx = views[0].indexOf(newFocused);
            if (rowIdx != -1) {
                for (i = 0; i < viewsLn; i++) {
                    views[i].onRowFocus(rowIdx, true, supressFocus);
                }
            }
        }
        this.callParent();
    },

    onEditorTab: function(editingPlugin, e) {
        var me = this,
            view = me.views[0],
            record = editingPlugin.getActiveRecord(),
            header = editingPlugin.getActiveColumn(),
            position = view.getPosition(record, header),
            direction = e.shiftKey ? 'left' : 'right';

        // We want to continue looping while:
        // 1) We have a valid position
        // 2) There is no editor at that position
        // 3) There is an editor, but editing has been cancelled (veto event)

        do {
            position  = view.walkCells(position, direction, e, me.preventWrap);
        } while(position && (!view.headerCt.getHeaderAtIndex(position.column).getEditor(record) || !editingPlugin.startEditByPosition(position)));
    },

    /**
     * Returns position of the first selected cell in the selection in the format {row: row, column: column}
     */
    getCurrentPosition: function() {
        var firstSelection = this.selected.items[0];
        if (firstSelection) {
            return {
                row: this.store.indexOf(firstSelection),
                column: 0
            };
        }
    },

    selectByPosition: function(position) {
        var record = this.store.getAt(position.row);
        this.select(record);
    },

    /**
     * Selects the record immediately following the currently selected record.
     * @param {Boolean} [keepExisting] True to retain existing selections
     * @param {Boolean} [suppressEvent] Set to false to not fire a select event
     * @return {Boolean} `true` if there is a next record, else `false`
     */
    selectNext: function(keepExisting, suppressEvent) {
        var me = this,
            store = me.store,
            selection = me.getSelection(),
            record = selection[selection.length - 1],
            index = me.views[0].indexOf(record) + 1,
            success;

        if(index === store.getCount() || index === 0) {
            success = false;
        } else {
            me.doSelect(index, keepExisting, suppressEvent);
            success = true;
        }
        return success;
    },

    /**
     * Selects the record that precedes the currently selected record.
     * @param {Boolean} [keepExisting] True to retain existing selections
     * @param {Boolean} [suppressEvent] Set to false to not fire a select event
     * @return {Boolean} `true` if there is a previous record, else `false`
     */
    selectPrevious: function(keepExisting, suppressEvent) {
        var me = this,
            selection = me.getSelection(),
            record = selection[0],
            index = me.views[0].indexOf(record) - 1,
            success;

        if (index < 0) {
            success = false;
        } else {
            me.doSelect(index, keepExisting, suppressEvent);
            success = true;
        }
        return success;
    },

    isRowSelected: function(record, index) {
        return this.isSelected(record);
    }
});