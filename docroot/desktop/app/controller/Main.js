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

                if (field.clientOnly) {
                    return;
                }
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
            common.DreamFactory.createTable({
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
                requestexception : this.onAjaxRequestException
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
            common.DreamFactory.logout(function() {
                me.getController('LoginDialog').showDialog();
            });
        },

        onAppLoginSuccessful   : function() {
            this.viewport.add({
                xtype : 'main'
            });
        },

        onAjaxRequestException : function(conn, response, options, eOpts) {
            console.dir(arguments);
            var title = '',
                message = response.responseText;

            if (message.indexOf('No records deleted from table')) {
                if (options.success) {
//                    response.status = 200;
//                    response.responseText = Ext.encode({ record: [] });
//                    options.success(response, options);
                    return;
                }
            }
            try {
                var o = Ext.decode(message);
                message = o.error[0].message;
                title = o.error[0].code;
            }
            catch (e) {

            }
            new Ext.window.Window({
                title       : 'Server Error ' + title,
                modal       : true,
                resizable   : false,
                draggable   : false,
                bodyStyle   : 'background: white; padding: 5px;',
                html        : message,
                buttonAlign : 'center',
                buttons     : {
                    text    : 'OK',
                    handler : function() {
                        this.up('window').close();
                    }
                }

            }).show();
        }
    });
}());
