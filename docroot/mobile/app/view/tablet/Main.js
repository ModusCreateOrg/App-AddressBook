/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/14/13
 * Time: 6:49 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define("mobile.view.tablet.Main", {

    extend : 'Ext.Container',
    xtype  : 'mainview',

    requires : [
        'Ext.TitleBar',
        'Ext.Toolbar',
        'mobile.view.Login',
        'mobile.view.ContactList',
        'mobile.view.ContactInformation'
    ],

    config     : {
        fullscreen : true,
        title      : '<div style="background-image: url(resources/images/modus.png)" class="header-logo"></div>',
        layout     : {
            type : 'hbox'
        },
        items      : [
        ]
    },

    initialize : function() {
        console.log('initialize tablet main');
        this.add([
            {
                xtype  : 'titlebar',
                title  : this.getTitle(),
                docked : 'top',
                items  : {
                    align  : 'left',
                    ui     : 'back',
                    cls    : 'back-button',
                    text   : 'Contacts',
                    hidden : true
                }
            },
            {
                flex:.3,
                style: 'border-right: 1px solid black;',
//                margin: '0 1 0 0',
                layout: 'fit',
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        title: 'Contacts'
                    },
                    {
                        xtype  : 'contact_list',
                        schema : mobile.schemas.Contacts
                    }
                ]
            },
            {
//                margin: '0 0 0 1',
                flex:.7,
                layout: 'fit',
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        title: 'Info'
                    },
                    {
                        xtype : 'contact_information'
                    }
                ]
            }
        ]);

        this.callParent();
    }
});

