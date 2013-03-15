Ext.define('Ext.rtl.util.Renderable', {
    override: 'Ext.util.Renderable',

    _rtlCls: Ext.baseCSSPrefix + 'rtl',
    _ltrCls: Ext.baseCSSPrefix + 'ltr',

    // this template should be exactly the same as frameTableTple, except with the order
    // of right and left TD elements switched.
    rtlFrameTableTpl: [
        '{%this.renderDockedItems(out,values,0);%}',
        '<table><tbody>',
            '<tpl if="top">',
                '<tr>',
                    '<tpl if="right"><td id="{fgid}TR" class="{frameCls}-tr {baseCls}-tr {baseCls}-{ui}-tr<tpl for="uiCls"> {parent.baseCls}-{parent.ui}-{.}-tr</tpl><tpl if="frameElCls"> {frameElCls}</tpl>" style="background-position: {tr}; padding-left: {frameWidth}px" role="presentation"></td></tpl>',
                    '<td id="{fgid}TC" class="{frameCls}-tc {baseCls}-tc {baseCls}-{ui}-tc<tpl for="uiCls"> {parent.baseCls}-{parent.ui}-{.}-tc</tpl><tpl if="frameElCls"> {frameElCls}</tpl>" style="background-position: {tc}; height: {frameWidth}px" role="presentation"></td>',
                    '<tpl if="left"><td id="{fgid}TL" class="{frameCls}-tl {baseCls}-tl {baseCls}-{ui}-tl<tpl for="uiCls"> {parent.baseCls}-{parent.ui}-{.}-tl</tpl><tpl if="frameElCls"> {frameElCls}</tpl>" style="background-position: {tl}; padding-left:{frameWidth}px" role="presentation"></td></tpl>',
                '</tr>',
            '</tpl>',
            '<tr>',
                '<tpl if="right"><td id="{fgid}MR" class="{frameCls}-mr {baseCls}-mr {baseCls}-{ui}-mr<tpl for="uiCls"> {parent.baseCls}-{parent.ui}-{.}-mr</tpl><tpl if="frameElCls"> {frameElCls}</tpl>" style="background-position: {mr}; padding-left: {frameWidth}px" role="presentation"></td></tpl>',
                '<td id="{fgid}MC" class="{frameCls}-mc {baseCls}-mc {baseCls}-{ui}-mc<tpl for="uiCls"> {parent.baseCls}-{parent.ui}-{.}-mc</tpl><tpl if="frameElCls"> {frameElCls}</tpl>" style="background-position: 0 0;" role="presentation">',
                    '{%this.applyRenderTpl(out, values)%}',
                '</td>',
                '<tpl if="left"><td id="{fgid}ML" class="{frameCls}-ml {baseCls}-ml {baseCls}-{ui}-ml<tpl for="uiCls"> {parent.baseCls}-{parent.ui}-{.}-ml</tpl><tpl if="frameElCls"> {frameElCls}</tpl>" style="background-position: {ml}; padding-left: {frameWidth}px" role="presentation"></td></tpl>',
            '</tr>',
            '<tpl if="bottom">',
                '<tr>',
                    '<tpl if="right"><td id="{fgid}BR" class="{frameCls}-br {baseCls}-br {baseCls}-{ui}-br<tpl for="uiCls"> {parent.baseCls}-{parent.ui}-{.}-br</tpl><tpl if="frameElCls"> {frameElCls}</tpl>" style="background-position: {br}; padding-left: {frameWidth}px" role="presentation"></td></tpl>',
                    '<td id="{fgid}BC" class="{frameCls}-bc {baseCls}-bc {baseCls}-{ui}-bc<tpl for="uiCls"> {parent.baseCls}-{parent.ui}-{.}-bc</tpl><tpl if="frameElCls"> {frameElCls}</tpl>" style="background-position: {bc}; height: {frameWidth}px" role="presentation"></td>',
                    '<tpl if="left"><td id="{fgid}BL" class="{frameCls}-bl {baseCls}-bl {baseCls}-{ui}-bl<tpl for="uiCls"> {parent.baseCls}-{parent.ui}-{.}-bl</tpl><tpl if="frameElCls"> {frameElCls}</tpl>" style="background-position: {bl}; padding-left: {frameWidth}px" role="presentation"></td></tpl>',
                '</tr>',
            '</tpl>',
        '</tbody></table>',
        '{%this.renderDockedItems(out,values,1);%}'
    ],

    beforeRender: function() {
        var rtl = this.getHierarchyState().rtl;
        if (rtl) {
            this.addCls(this._rtlCls);
        } else if (rtl === false) {
            this.addCls(this._ltrCls);
        }

        this.callParent();
    },

    getFrameTpl: function(table) {
        return (table && this.getHierarchyState().rtl) ?
            this.getTpl('rtlFrameTableTpl') : this.callParent(arguments);
    },

    getVertCenterFramePositions: function(frameWidth, dock) {
        var tc, bc;

        if (dock && dock === (this.getHierarchyState().rtl ? 'left' : 'right')) {
            tc = 'right 0';
            bc = 'right -' + frameWidth + 'px';
        } else {
            tc = '0 0';
            bc = '0 -' + frameWidth + 'px';
        }

        return {
            tc: tc,
            bc: bc
        };
    },

    initRenderData: function() {
        var renderData = this.callParent();

        if (this.getHierarchyState().rtl) {
            Ext.apply(renderData, { childElCls: this._rtlCls });
        }

        return renderData;
    },

    getFrameElCls: function() {
        return this._frameElCls ||
            (this._frameElCls = (this.getHierarchyState().rtl ? this._rtlCls : ''));
    }

});