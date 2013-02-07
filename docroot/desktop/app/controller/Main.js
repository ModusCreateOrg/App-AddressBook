(function() {

    function createTables(callback) {
        var toCreate = [];
        Ext.iterate(ab.Schemas, function(key, schema) {
            if (Ext.isObject(schema)) {
                toCreate.push(schema);
            }
        });
//debugger;
        function createTable() {
            var schema = toCreate.shift();
            if (!schema) {
                callback();
                return;
            }
            var fields = [];
            Ext.iterate(schema.fields, function(field) {
                var name = field.name,
                    label = field.label || name;

                if (field.size) {
                    fields.push({
                        name: name,
                        label: label,
                        type: 'varchar',
                        size: field.size
                    });
                }
                else if (field.autoIncrement) {
                    fields.push({
                        name: name,
                        label: label,
                        type: 'pk'
                    })
                }
                else {
                    fields.push({
                        name: name,
                        label: label,
                        type: field.type
                    });
                }
            });
            ab.ux.DreamFactory.createTable({
                table: [
                    {
                        name: schema.name,
                        label: schema.name,
                        plural: schema.name,
                        field: fields
                    }
                ]
            }, function(o) {
                console.dir(o);
                Ext.defer(createTable, 0);
            });
        }
        createTable();
    }

    Ext.define('ab.controller.Main', {
        extend : 'Ext.app.Controller',

        views : [
            'Main'
        ],

        init : function() {
            var me = this;

            var production = window.location.host.indexOf('dreamfactory.com') !== -1;
            console.dir(window.location.host);
            console.dir(window.location.host.indexOf('dreamfactory.com'));
            ab.data = {
                serviceUrl : production ? '/' : '/service/',
                user       : {
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

            function loadSchemas(callback) {
                Ext.Ajax.request({
                    url     : '../json/Schemas.json',
                    success : function(resp) {
                        var data;

                        try {
                            data = Ext.decode(resp.responseText);
                            ab.Schemas = data;
                        }
                        catch (e) {
                            Ext.getBody().mask('Error! Schemas could not load!  The application cannot continue.');
                        }

                        if (callback) {
                            callback();
                        }
                        else {
                            Ext.getBody().unmask();
                            me.getController('LoginDialog').showDialog();
                        }
                    }
                });
            }

            loadSchemas();
//            loadSchemas(function() {
//                createTables(function() {
//                    Ext.getBody().unmask();
//                    me.getController('LoginDialog').showDialog();
//                })
//            });
        },

        onLogoutButton : function() {
            var me = this;

            me.viewport.removeAll();
            ab.ux.DreamFactory.logout(function() {
                me.getController('LoginDialog').showDialog();
            });
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

        onAjaxBeforeRequest    : function() {
            Ext.Ajax.defaultHeaders = {
                'login-id' : ab.data.user.userId
            };
        }
    });
}());
