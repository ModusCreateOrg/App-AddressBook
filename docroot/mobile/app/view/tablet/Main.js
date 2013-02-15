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
        'mobile.view.Login',
        'mobile.view.ContactList',
        'mobile.view.ContactInformation'
    ],

    config     : {
        fullscreen : true,
        title      : '<div style="background-image: url(resources/images/modus.png)" class="header-logo"></div>',
        layout     : {
            type : 'card'
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
                xtype  : 'contact_list',
                schema : mobile.schemas.Contacts
            },
            {
                xtype : 'contact_information'
            }
        ]);

        this.callParent();
    }
});

