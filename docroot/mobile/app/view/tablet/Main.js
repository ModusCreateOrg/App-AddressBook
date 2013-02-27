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

    config : {
        fullscreen : true,
        title      : '<div style="background-image: url(resources/images/modus.png)" class="header-logo"></div>',
        layout     : {
            type : 'hbox'
        },
        items      : [
        ]
    },

    initialize : function () {
        console.log('initialize tablet main');
        this.add([
            {
                xtype  : 'titlebar',
                title  : this.getTitle(),
                docked : 'top'
            },
            {
                flex   : .3,
                style  : 'border-right: 1px solid black;',
                layout : 'fit',
                items  : [
//                    {
//                        xtype  : 'toolbar',
//                        docked : 'top',
//                        items  : [
//                            {
//                                xtype    : 'selectfield',
//                                width    : '90%',
//                                centered : true,
//                                options  : [
//                                    { text : 'All Contacts' },
//                                    { text : 'Group 1' },
//                                    { text : 'Group 2' },
//                                    { text : 'Group 3' },
//                                    { text : 'Group 4' },
//                                    { text : 'Group 5' },
//                                    { text : 'Group 6' },
//                                    { text : 'Group 7' },
//                                    { text : 'Group 8' },
//                                    { text : 'Group 9' },
//                                    { text : 'Group 10' },
//                                    { text : 'Group 11' },
//                                    { text : 'Group 12' },
//                                    { text : 'Group 13' },
//                                    { text : 'Group 14' },
//                                    { text : 'Group 15' },
//                                    { text : 'Group 16' },
//                                    { text : 'Group 17' },
//                                    { text : 'Group 18' },
//                                    { text : 'Group 19' },
//                                    { text : 'Group 20' },
//                                    { text : 'Group 21' },
//                                    { text : 'Group 22' },
//                                    { text : 'Group 23' },
//                                    { text : 'Group 24' },
//                                    { text : 'Group 25' },
//                                    { text : 'Group 26' },
//                                    { text : 'Group 27' },
//                                    { text : 'Group 28' },
//                                    { text : 'Group 29' }
//                                ]
//                            }
//                        ]
////                        title: 'Contacts'
//                    },
                    {
                        layout : 'fit',
                        items  : [
                            {
                                xtype  : 'toolbar',
                                docked : 'top',
                                ui: 'search',
                                items  : [
                                    {
                                        xtype       : 'searchfield',
                                        placeHolder : 'Search',
                                        width       : '90%',
                                        centered    : true
                                    }
                                ]
                            },
                            {
                                xtype  : 'contact_list',
                                schema : mobile.schemas.Contacts
                            },
                            {
                                xtype  : 'titlebar',
                                docked : 'bottom',
                                items  : [
                                    {
                                        xtype    : 'selectfield',
//                                        width    : '90%',
//                                        centered : true,
                                        options  : [
                                            { text : 'All Contacts' },
                                            { text : 'Group 1' },
                                            { text : 'Group 2' },
                                            { text : 'Group 3' },
                                            { text : 'Group 4' },
                                            { text : 'Group 5' },
                                            { text : 'Group 6' },
                                            { text : 'Group 7' },
                                            { text : 'Group 8' },
                                            { text : 'Group 9' },
                                            { text : 'Group 10' },
                                            { text : 'Group 11' },
                                            { text : 'Group 12' },
                                            { text : 'Group 13' },
                                            { text : 'Group 14' },
                                            { text : 'Group 15' },
                                            { text : 'Group 16' },
                                            { text : 'Group 17' },
                                            { text : 'Group 18' },
                                            { text : 'Group 19' },
                                            { text : 'Group 20' },
                                            { text : 'Group 21' },
                                            { text : 'Group 22' },
                                            { text : 'Group 23' },
                                            { text : 'Group 24' },
                                            { text : 'Group 25' },
                                            { text : 'Group 26' },
                                            { text : 'Group 27' },
                                            { text : 'Group 28' },
                                            { text : 'Group 29' }
                                        ]
                                    },
                                    {
                                        align  : 'right',
                                        ui     : 'edit',
                                        cls    : 'edit-button',
                                        text   : 'Edit',
                                        hidden : false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                flex    : .7,
                padding : 20,
                xtype   : 'contact_information'
            }
        ]);

        this.callParent();
    }
});

