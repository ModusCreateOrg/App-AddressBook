(function () {

    var /** @constant */ LOGO = 'resources/images/modus.png',
        /** @constant */ TITLE = '<div style="background-image: url(' + LOGO + ')" class="header-logo"></div>';

    Ext.define("mobile.view.phone.Main", {

        extend : 'Ext.Container',
        xtype  : 'mainview',

        requires : [
            'Ext.TitleBar',
            'Ext.field.Search',
            'mobile.view.Login',
            'mobile.view.GroupList',
            'mobile.view.ContactList',
            'mobile.view.ContactDetails',
            'mobile.view.ContactEditor',
            'mobile.view.ContactGroupEditor'
        ],

        config : {
            fullscreen : true,
            // title      : TITLE,
            title      : "Address Book",
            layout     : {
                type : 'card'
            },
            items      : [
            ]
        },

        initialize : function () {
            var me = this;

            me.add([
                {
                    xtype  : 'titlebar',
                    title  : me.getTitle(),
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
                            align    : 'right',
                            // iconCls  : 'add',
                            // iconMask : true,
                            action   : 'title-right',
                            cls      : 'mobile-add-contact-group-button',
                            hidden   : false
                        }
                    ]
                },
                {
                    xtype : 'group_list'
                },
                {
                    layout : 'fit',
                    items  : [
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
                },
                {
                    xtype : 'contact_details'
                }
            ]);

            me.callParent(arguments);
        },

        showLogo: function() {
            this.down('titlebar').setTitle('Address Book');
        }

    });

}());
