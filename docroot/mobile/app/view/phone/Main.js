Ext.define("mobile.view.phone.Main", {

    extend : 'Ext.Container',
    xtype  : 'mainview',

    requires : [
        'Ext.TitleBar',
        'Ext.field.Search',
        'mobile.view.Login',
        'mobile.view.GroupList',
        'mobile.view.ContactList',
        'mobile.view.ContactInformation',
        'mobile.view.ContactEditor'
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

    initialize : function () {
        this.add([
            {
                xtype  : 'titlebar',
                title  : this.getTitle(),
                docked : 'top',
                items  : [
                    {
                        align  : 'left',
                        ui     : 'back',
                        cls    : 'back-button',
                        text   : 'Contacts',
                        hidden : true
                    }
                    ,
                    {
                        align  : 'right',
                        iconCls: 'add',
                        iconMask: true,
                        action: 'title-right',
                        cls: 'mobile-add-contact-group-button',
//                        ui     : 'edit',
//                        cls    : 'edit-button',
//                        text   : 'Edit',
                        hidden : false
                    }
                ]
            },
            {
                layout: 'fit',
                items: [
                    {
                        xtype : 'group_list'
                    },
                    {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        ui: 'search',
                        items: [
                            {
                                iconCls: 'add',
                                iconMask: true
                            }
                        ]
                    }
                ]
            },
            {
                layout: 'fit',
                items: [
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
                        xtype: 'toolbar',
                        docked: 'bottom',
                        ui: 'search',
                        items: [
                            {
                                iconCls: 'add',
                                iconMask: true
                            }
                        ]
                    }
                ]
            },
            {
                layout: 'fit',
                items: [
                    {
                        xtype : 'contact_information'
                    },
                    {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        ui: 'search',
                        items: [
                            {
                                text: 'Edit',
                                action: 'edit'
//                                iconCls: 'compose',
//                                iconMask: true
                            }
                        ]
                    }
                ]
            },
            {
                layout: 'fit',
                items: [
                    {
                        xtype : 'contact_editor'
                    }
//                    },
//                    {
//                        xtype: 'titlebar',
//                        docked: 'bottom',
//                        ui: 'search',
//                        items: [
//                            {
//                                align  : 'left',
//                                ui     : 'back',
//                                cls    : 'back-button',
//                                text: 'Cancel'
////                                iconCls: 'compose',
////                                iconMask: true
//                            }
//
//   ]
//                    }
                ]
            }
        ]);

        this.callParent();
    }

});

