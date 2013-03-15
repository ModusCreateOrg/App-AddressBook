Ext.require([
    'Ext.panel.Panel',
    'Ext.toolbar.Toolbar',
    'Ext.form.field.ComboBox',
    'Ext.form.FieldContainer',
    'Ext.form.field.Radio'
]);

Ext.onReady(function() {

    var theme = Ext.Object.fromQueryString(location.search).theme,
        rtl = location.search.indexOf('rtl') > -1,
        toolbar;

    function setParam(param) {
        var queryString = Ext.Object.toQueryString(
            Ext.apply(Ext.Object.fromQueryString(location.search), param)
        );
        location.search = queryString;
    }

    function removeParam(paramName) {
        var params = Ext.Object.fromQueryString(location.search);

        delete params[paramName];

        location.search = Ext.Object.toQueryString(params);
    }

    toolbar = Ext.widget({
        xtype: 'toolbar',
        rtl: false,
        id: 'options-toolbar',
        floating: true,
        draggable: true,
        items: [{
            xtype: 'combo',
            width: 170,
            labelWidth: 50,
            fieldLabel: 'Theme',
            displayField: 'name',
            valueField: 'value',
            labelStyle: 'cursor:move;',
            margin: '0 10 0 0',
            store: Ext.create('Ext.data.Store', {
                fields: ['value', 'name'],
                data : [
                    { value: 'access', name: 'Accessibility' },
                    { value: 'default', name: 'Classic' },
                    { value: 'gray', name: 'Gray' }
                ]
            }),
            value: theme || 'default',
            listeners: {
                select: function(combo) {
                    var theme = combo.getValue();
                    if (theme !== 'default') {
                        setParam({ theme: theme });
                    } else {
                        removeParam('theme');
                    }
                }
            }
        }, {
            xtype: 'fieldcontainer',
            fieldDefaults: {
                xtype: 'radio',
                margin: '0 5 0 0'
            },
            defaultType: 'radio',
            layout: 'hbox',
            items: [{
                boxLabel: 'LTR',
                name: 'direction',
                inputValue: 'ltr',
                checked: !rtl
            }, {
                boxLabel: 'RTL',
                name: 'direction',
                inputValue: 'rtl',
                checked: rtl,
                handler: function(radio, checked) {
                    if (checked) {
                        setParam({ rtl: '' })
                    } else {
                        removeParam('rtl');
                    }
                }
            }]
        }, {
            xtype: 'tool',
            type: 'close',
            handler: function() {
                toolbar.destroy();
            }
        }]
    });

    toolbar.show();

    toolbar.alignTo(document.body, 'tr-tr');

});