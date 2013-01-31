Ext.define('ab.controller.Main', {
    extend : 'Ext.app.Controller',

    views : [
        'Main'
    ],

    init : function() {
        var me = this;

        var production = window.location.host.indexOf('dreamfactory.com') !== -1;
        ab.data = {
            serviceUrl: production ? '/services/' : '/',
            user : {
                userId : 0
            }
        };

        // disable browser context menu
//        Ext.fly(document.body).on('contextmenu', function(e) {
//            e.preventDefault();
//        });

        Ext.Ajax.on({
            requestexception : this.onAjaxRequestException,
            beforerequest    : this.onAjaxBeforeRequest
        });


        me.control({
            '[action=logout]' : {
                click : me.onLogoutButton
            }
        });

        me.application.on({
            scope           : me,
            loginsuccessful : me.onAppLoginSuccessful
        });

        me.viewport = Ext.create('Ext.container.Viewport', {
            layout : 'fit',
            id     : 'app-viewport'
        });


        Ext.getBody().mask('Loading schemas...');

        Ext.Ajax.request({
            url     : ab.data.serviceUrl + 'json/Schemas.json',
            success : function(resp) {
                var data;

                try {
                    data = Ext.decode(resp.responseText);
                    ab.Schemas = data;
                }
                catch (e) {
                    Ext.getBody().mask('Error! Schemas could not load!  The application cannot continue.');
                }
                console.log('resp', resp);

                Ext.getBody().unmask();
                me.getController('LoginDialog').showDialog();
            }
        });

    },

    onLogoutButton : function() {
        this.viewport.removeAll();
        this.getController('LoginDialog').showDialog();
    },

    onAppLoginSuccessful   : function() {
        this.viewport.add({
            xtype : 'main'
        });
    },
    onAjaxRequestException : function(conn, response, options, eOpts) {
        new Ext.window.Window({
            title       : 'Server Error',
            modal       : true,
            resizable   : false,
            draggable   : false,
            bodyStyle   : 'background: white; padding: 5px;',
            html        : response.responseText,
            buttonAlign : 'center',
            buttons     : {
                text    : 'OK',
                handler : function() {
                    this.up('window').close();
                }
            }

        }).show();
    },
    onAjaxBeforeRequest : function() {
        Ext.Ajax.defaultHeaders = {
            'login-id' : ab.data.user.userId
        };
    }
});