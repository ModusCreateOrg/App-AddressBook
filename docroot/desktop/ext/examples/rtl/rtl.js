Ext.require([
    'Ext.container.Viewport',
    'Ext.grid.Panel',
    'Ext.layout.container.Border',
    'Ext.rtl.*'
]);

(function() {
    var match = RegExp('[?&]theme=([^&]*)').exec(window.location.search),
        theme = match && decodeURIComponent(match[1]),
        stylesheet = document.createElement('link');

    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';
    stylesheet.href = '../../resources/css/ext-all' + (!theme || theme === 'default' ? '' : '-' + theme) + '-rtl.css';

    document.getElementsByTagName('head')[0].appendChild(stylesheet);
})();

Ext.onReady(function() {
    var text = '\u0635\u0650\u0641 \u062E\u064E\u0644\u0642\u064E \u062E\u064E\u0648\u062F\u0650 \u0643\u064E\u0645\u0650\u062B\u0644\u0650 \u0627\u0644\u0634\u064E\u0645\u0633\u0650 \u0625\u0650\u0630 \u0628\u064E\u0632\u064E\u063A\u064E\u062A \u2014 \u064A\u064E\u062D\u0638\u0649 \u0627\u0644\u0636\u064E\u062C\u064A\u0639\u064F \u0628\u0650\u0647\u0627 \u0646\u064E\u062C\u0644\u0627\u0621\u064E \u0645\u0650\u0639\u0637\u0627\u0631\u0650',
        i = 50,
        sentences = [],
        words = text.split(' '),
        paragraph;
        
    while (i--) {
        sentences.push(text);
    }
    paragraph = sentences.join(' ');

    Ext.define('Fubar', {
        extend: 'Ext.data.Model',
        fields: [ 'foo', 'bar', 'baz', 'zork', 'gork', 'bork' ]
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        rtl: true,
        items: [{
            region: 'north',
            title: '\u0634\u0645\u0627\u0644',
            height: 100,
            html: paragraph,
            autoScroll: true,
            collapsible: true,
            split: true
        },{
            region: 'west',
            id: 'west-region',
            title: '\u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u063a\u0631\u0628\u064a\u0629',
            width: 200,
            collapsible: true,
            split: true
        }, {
            region: 'center',
            xtype: 'grid',
            title: '\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0646\u0637\u0642\u0629',
            columns: [
                { dataIndex: 'foo', text: words[0] },
                { dataIndex: 'bar', text: words[1] },
                { dataIndex: 'baz', text: words[2] },
                { dataIndex: 'zork', text: words[3] },
                { dataIndex: 'gork', text: words[4] },
                { dataIndex: 'bork', text: words[5], flex: 1 }
            ],
            store: Ext.create('Ext.data.Store', {
                model: 'Fubar',
                data: [
                    [words[6], words[8], words[9], words[10], words[11], words[12]],
                    [words[5], words[4], words[3], words[2], words[1], words[0]],
                    [words[12], words[11], words[10], words[9], words[8], words[6]],
                    [words[0], words[1], words[2], words[3], words[4], words[5]],
                    [words[6], words[8], words[9], words[10], words[11], words[12]],
                    [words[5], words[4], words[3], words[2], words[1], words[0]],
                    [words[12], words[11], words[10], words[9], words[8], words[6]],
                    [words[0], words[1], words[2], words[3], words[4], words[5]],
                    [words[6], words[8], words[9], words[10], words[11], words[12]],
                    [words[5], words[4], words[3], words[2], words[1], words[0]],
                    [words[12], words[11], words[10], words[9], words[8], words[6]],
                    [words[0], words[1], words[2], words[3], words[4], words[5]],
                    [words[6], words[8], words[9], words[10], words[11], words[12]],
                    [words[5], words[4], words[3], words[2], words[1], words[0]],
                    [words[12], words[11], words[10], words[9], words[8], words[6]],
                    [words[0], words[1], words[2], words[3], words[4], words[5]],
                    [words[6], words[8], words[9], words[10], words[11], words[12]],
                    [words[5], words[4], words[3], words[2], words[1], words[0]],
                    [words[12], words[11], words[10], words[9], words[8], words[6]],
                    [words[0], words[1], words[2], words[3], words[4], words[5]]
                ]
            })
        }, {
            region: 'east',
            title: '\u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0634\u0631\u0642\u064a\u0629',
            width: 200,
            collapsible: true,
            split: true
        }, {
            region: 'south',
            title: '\u062c\u0646\u0648\u0628 \u0627\u0644\u0645\u0646\u0637\u0642\u0629',
            height: 100,
            collapsible: true,
            split: true
        }]
    });
});