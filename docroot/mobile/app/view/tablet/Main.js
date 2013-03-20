/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/14/13
 * Time: 6:49 AM
 */

/*
 *  _____     _     _      _     __  __       _        __     ___
 * |_   _|_ _| |__ | | ___| |_  |  \/  | __ _(_)_ __   \ \   / (_) _____      __
 *   | |/ _` | '_ \| |/ _ \ __| | |\/| |/ _` | | '_ \   \ \ / /| |/ _ \ \ /\ / /
 *   | | (_| | |_) | |  __/ |_  | |  | | (_| | | | | |   \ V / | |  __/\ V  V /
 *   |_|\__,_|_.__/|_|\___|\__| |_|  |_|\__,_|_|_| |_|    \_/  |_|\___| \_/\_/
 */
Ext.define("mobile.view.tablet.Main", {

    extend : 'Ext.Container',
    xtype  : 'mainview',

    requires : [
        'Ext.TitleBar',
        'Ext.Toolbar',
        'mobile.view.Login',
        'mobile.view.GroupList',
        'mobile.view.ContactList',
        'mobile.view.ContactDetails'
    ],

    config : {
        fullscreen : true,
        title      : 'Address Book',
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
                docked : 'top'
            },
            {
                flex   : .3,
                style  : 'border-right: 1px solid black;',
                layout : 'vbox',
                items  : [
                    {
                        layout : 'fit',
                        height : 175,
                        style  : 'border-top: 1px solid black',
                        items  : [
                            {
                                xtype  : 'titlebar',
                                docked : 'top',
                                title  : 'Groups',
                                items  : [
                                    {
                                        cls    : 'mobile-add-contact-button',
                                        align  : 'right',
                                        action : 'add-group'
                                    }
                                ]
                            },
                            {
                                xtype : 'group_list'
                            }
                        ]
                    },
                    {
                        layout : 'fit',
                        flex   : 1,
                        style  : 'border-top: 1px solid black',
                        items  : [
                            {
                                xtype  : 'titlebar',
                                docked : 'top',
                                title  : 'Contacts',
                                items  : [
                                    {
                                        align  : 'right',
                                        cls    : 'mobile-add-contact-button',
                                        action : 'add-contact'
                                    }
                                ]
                            },
                            {
                                xtype  : 'toolbar',
                                docked : 'top',
                                ui     : 'search',
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
                            }
                        ]
                    }
                ]
            },
            {
                flex   : .7,
                layout : 'card',
                itemId : 'card',
                style  : 'border-top: 1px solid black',
                items  : [
                    {
                        layout: 'fit',
                        items: [
                            {
                                xtype  : 'titlebar',
                                title  : 'Contact Information',
                                docked : 'top',
                                items  : [
                                    {
                                        itemId : 'edit-contact',
                                        action : 'edit-contact',
                                        align  : 'right',
                                        text   : 'Edit',
                                        hidden : true
                                    }
                                ]
                            },
                            {
                                padding : 20,
                                xtype   : 'contact_details'
                            }
                        ]
                    }
                ]
            }
        ]);

        this.callParent();
    }
});

