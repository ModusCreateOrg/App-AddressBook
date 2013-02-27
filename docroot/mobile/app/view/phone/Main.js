Ext.define("mobile.view.phone.Main", {

    extend : 'Ext.Container',
    xtype  : 'mainview',

    requires : [
        'Ext.TitleBar',
        'mobile.view.Login',
        'mobile.view.GroupList',
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
//                    ,
//                    {
//                        align  : 'right',
//                        ui     : 'edit',
//                        cls    : 'edit-button',
//                        text   : 'Edit',
//                        hidden : false
//                    }
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
                                text: 'Edit'
//                                iconCls: 'compose',
//                                iconMask: true
                            }
                        ]
                    }
                ]
            }
        ]);

        this.callParent();
    }

});

