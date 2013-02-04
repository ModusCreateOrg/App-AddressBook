(function() {

    var SCHEMA_VERSION = 1;

    window.df = function() {
        function rpc(config) {
            var method = config.method,
                headers = {
                    'X-Application-Name' : 'add'
                };

            if (method === 'DELETE' || method === 'MERGE') {
                headers['X-HTTP-METHOD'] = method;
                method = 'POST';
            }
            Ext.Ajax.request({
                url      : ab.data.serviceUrl + 'REST/' + config.url,
                method   : method,
                headers  : headers,
                jsonData : config.params,
                success  : function(response) {
                    var o = Ext.decode(response.responseText);
                    if (config.callback) {
                        config.callback(o);
                    }
                    else {
                        console.dir(o);
                    }
                },
                failure: function(response) {
                    console.dir(Ext.decode(response.responseText));
                }
            });
        }

        function tableName(name) {
            return name + '_' + SCHEMA_VERSION;
        }

        function buildQuery(options) {
            var args = [];

            if (options.where) {
                args.push(encodeURIComponent(options.where));
            }
            else if (options.filters) {
                args.push(encodeURIComponent(options.filters));
            }

            if (options.order) {
                args.push('order=' + options.order);
            }
            else if (options.sort) {
                var order = 'order=' + options.sort;
                if (options.dir) {
                    order += ' ' + options.dir;
                }
                args.push(order);
            }

            if (options.start) {
                args.push('offset=' + options.start);
            }
            else if (options.offset) {
                args.push('offset=' + options.offset);
            }

            if (options.limit) {
                args.push('limit=' + options.limit);
            }

            return args;
        }

        /*
         {
         "records": {
         "record": [
         {
         "fields": {
         "Id": "1",
         "FirstName": "Joseph"
         }
         }
         ]
         }
         }
         */
        function buildRecords(records) {
            var recs = [];
            Ext.each(records, function(record) {
                recs.push({
                    fields : record
                });
            });
            return {
                records : {
                    record : recs
                }
            };
        }

        return {
            login                 : function(username, password, callback) {
                rpc({
                    url      : 'User/Login',
                    params   : {
                        username : username,
                        password : password
                    },
                    callback : callback
                });
            },
            session               : function(ticket, callback) {
                rpc({
                    url    : 'User/Session',
                    params : {
                        ticket : ticket
                    }
                })
            },
            describeSystemTables  : function(callback) {
                rpc({
                    url      : 'System/Schema',
                    callback : callback
                });
            },
            describeTables        : function(callback) {
                rpc({
                    url      : 'DB/Schema',
                    callback : callback
                });
            },
            describeSystemTable   : function(name, callback) {
                rpc({
                    url      : 'System/Schema/' + name,
                    callback : callback
                });
            },
            describeTable         : function(name, callback) {
                rpc({
                    url      : 'DB/Schema/' + tableName(name),
                    callback : callback
                });
            },
            createTable           : function(schema, callback) {
                rpc({
                    url      : 'DB/Schema/' + schema.table[0].name,
                    method   : 'POST',
                    callback : callback
                });
            },
            createSystemRecords   : function(table, records, callback) {
                rpc({
                    url      : 'System/' + table,
                    method   : 'POST',
                    params   : records,
                    callback : callback
                });
            },
            createRecords         : function(table, records, callback) {
                rpc({
                    url      : 'DB/' + tableName(table),
                    method   : 'POST',
                    params   : records,
                    callback : callback
                });
            },
            retrieveSystemRecords : function(table, ids, callback, fields) {
                var url = 'System/' + table;
                if (Ext.isArray(ids)) {
                    url += '?ids=' + ids.join(',');
                }
                else {
                    url += '?id=' + ids;
                }
                if (Ext.isArray(fields)) {
                    url += '&fields=' + fields.join(',');
                }
                else if (Ext.isString(fields)) {
                    url += '&fields=' + fields;
                }
                rpc({
                    url      : url,
                    callback : callback
                });
            },
            retrieveRecords       : function(table, ids, callback, fields) {
                var url = 'DB/' + tableName(table);
                if (Ext.isArray(ids)) {
                    url += '?ids=' + ids.join(',');
                }
                else {
                    url += '?id=' + ids;
                }
                if (Ext.isArray(fields)) {
                    url += '&fields=' + fields.join(',');
                }
                else if (Ext.isString(fields)) {
                    url += '&fields=' + fields;
                }
                rpc({
                    url      : url,
                    callback : callback
                });
            },
            filterSystemRecords   : function(table, options, callback) {
                var url = 'System/' + table,
                    args = buildQuery(options);

                if (args.length) {
                    url += '?' + args.join('&');
                }
                rpc({
                    url      : url,
                    callback : callback
                });
            },
            filterRecords         : function(table, options, callback) {
                var url = 'DB/' + tableName(table),
                    args = buildQuery(options);

                if (args.length) {
                    url += '?' + args.join('&');
                }

                rpc({
                    url      : url,
                    callback : callback
                });
            },


            updateSystemRecords : function(table, records, callback, fields) {
                var url = 'System/' + table;

                if (Ext.isArray(fields)) {
                    url += '&fields=' + fields.join(',');
                }
                else if (Ext.isString(fields)) {
                    url += '&fields=' + fields;
                }

                rpc({
                    url      : url,
                    method   : 'MERGE',
                    params   : buildRecords(records),
                    callback : callback
                });
            },

            updateRecords : function(table, records, callback, fields) {
                var url = 'DB/' + table;

                if (Ext.isArray(fields)) {
                    url += '&fields=' + fields.join(',');
                }
                else if (Ext.isString(fields)) {
                    url += '&fields=' + fields;
                }

                rpc({
                    url      : url,
                    method   : 'MERGE',
                    params   : buildRecords(records),
                    callback : callback
                });
            },

            deleteSystemRecords : function(table, ids, callback, fields) {
                var url = 'System/' + table;
                if (Ext.isArray(ids)) {
                    url += '?ids=' + ids.join(',');
                }
                else {
                    url += '?id=' + ids;
                }
                if (Ext.isArray(fields)) {
                    url += '&fields=' + fields.join(',');
                }
                else if (Ext.isString(fields)) {
                    url += '&fields=' + fields;
                }
                rpc({
                    url      : url,
                    method   : 'DELETE',
                    callback : callback
                });
            },

            deleteRecords       : function(table, ids, callback, fields) {
                var url = 'DB/' + tableName(table);
                if (Ext.isArray(ids)) {
                    url += '?ids=' + ids.join(',');
                }
                else {
                    url += '?id=' + ids;
                }
                if (Ext.isArray(fields)) {
                    url += '&fields=' + fields.join(',');
                }
                else if (Ext.isString(fields)) {
                    url += '&fields=' + fields;
                }
                rpc({
                    url      : url,
                    method   : 'DELETE',
                    callback : callback
                });
            },

            // if a file name ends with /, it is a folder
//            {
//                "folders": {
//                    "folder": [
//                        {
//                            "Name": "testfolder",
//                            "Content": ""
//                        }
//                    ]
//                },
//                "files": {
//                    "file": [
//                        {
//                            "Name": "testfolder/testblob1",
//                            "Content": "PCFET0NUWVBFIGh0bWw+PGh0bWw+PGJvZHk+PGgxPkhlbGxvIGZyb20gSGVsbG9Xb3JsZCAjMiEhITwvaDE+PC9ib2R5PjwvaHRtbD4=",
//                            "is_base64": "true"
//                        }, {
//                            "Name": "testfolder/testblob2",
//                            "Content": "PCFET0NUWVBFIGh0bWw+PGh0bWw+PGJvZHk+PGgxPkhlbGxvIGZyb20gSGVsbG9Xb3JsZCAjMiEhITwvaDE+PC9ib2R5PjwvaHRtbD4=",
//                            "is_base64": "true"
//                        }
//                    ]
//                }
//            }
            putDocuments: function(documents, callback) {
                var files = [],
                    folders = [],
                    params = {};

                Ext.each(documents, function(doc) {
                    var name = doc.name;

                    if (!name) {
                        throw 'putDocument: document requires name member';
                    }
                    if (name.charAt(name.length - 1) == '/') {
                        folders.push({
                            Name: doc.name,
                            Content: doc.content
                        });
                    }
                    else {
                        files.push({
                            Name: doc.name,
                            Content: doc.content,
                            is_base64: doc.base64
                        });
                    }
                });

                if (folders.length) {
                    params.folders = {
                        folder: folders
                    };
                }
                if (files.length) {
                    params.files = {
                        file: files
                    }
                }

                rpc({
                    url: 'DOC',
                    method: 'POST',
                    params: params,
                    callback: callback
                });
            },

            getDocument: function(path, callback) {
                path = path.replace(/\/+$/, '');
                rpc({
                    url: 'DOC/' + path + '?properties=true&content=true',
                    callback: callback
                });
            },

            getFolder: function(path, callback) {
                path = path.replace(/\/+$/, '') + '/';
                rpc({
                    url: 'DOC/' + path, //  + '?properties=true&content=true',
                    callback: callback
                });
            },

            deleteDocument: function(path, callback) {
                path = path.replace(/\/+$/, '');
                rpc({
                    url: 'DOC/' + path,
                    method: 'DELETE'
                });
            },

            deleteFolder: function(path, callback) {
                path = path.replace(/\/+$/, '') + '/';
                rpc({
                    url: 'DOC/' + path,
                    method: 'DELETE'
                });
            }
        };
    }();

    window.rpc = function(config) {
        debugger;
        console.dir(ab.data);
        var method = config.method,
            headers = {
                'X-Application-Name' : 'add'
            };

        if (method === 'DELETE' || method === 'MERGE') {
            headers['X-HTTP-METHOD'] = method;
            headers.method = 'POST';
        }
        Ext.Ajax.request({
            url      : ab.data.serviceUrl + 'REST/' + config.url,
            method   : method,
            headers  : headers,
            jsonData : config.params,
            success  : function(response) {
                if (config.callback) {
                    config.callback(Ext.decode(response.responseText));
                }
            }
        });
    };

    function createTables(callback) {
        var toCreate = [];
        Ext.Object.each(ab.Schemas, function(schema) {
            toCreate.push(schema);
        });

        function createTable(callback) {
            var schema = toCreate.unshift();
            if (!schema) {
                callback();
            }
            console.dir(schema);
            Ext.Ajax.request({
                url     : ab.data.serviceUrl + 'REST/DB/Schema',
                method  : 'POST',
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
        }

//        callback();
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

            function createSchema() {
                var schema = {
                    "table" : [
                        {
                            "name"   : "foobar",
                            "label"  : "foobar",
                            "plural" : "foobars",
                            "field"  : [
                                {
                                    "name"  : "foo",
                                    "label" : "Foo Bar",
                                    "type"  : "pk"
                                }
                            ]
                        }
                    ]
                };
                rpc({
                    url      : 'DB/Schema',
                    method   : 'POST',
                    params   : schema,
                    callback : function() {
                        listSchemas();
                    }
                });
            }

            function deleteSchema() {
                rpc({
                    url      : 'DB/Schema/foobar',
                    method   : 'DELETE',
                    callback : function() {
                        listSchemas();
                    }
                })
            }

//            createSchema();
//            deleteSchema();

            function listSchemas() {
                rpc({
                    url      : 'DB/Schema',
                    callback : function(o) {
                        loadSchemas();
                    }
                });
            }

            function loadSchemas() {
                Ext.Ajax.request({
                    url     : '/json/Schemas.json',
                    success : function(resp) {
                        var data;

                        try {
                            data = Ext.decode(resp.responseText);
                            ab.Schemas = data;
                        }
                        catch (e) {
                            Ext.getBody().mask('Error! Schemas could not load!  The application cannot continue.');
                        }

                        Ext.getBody().unmask();
                        me.getController('LoginDialog').showDialog();
                    }
                });
            }

            loadSchemas();
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
        onAjaxBeforeRequest    : function() {
            Ext.Ajax.defaultHeaders = {
                'login-id' : ab.data.user.userId
            };
        }
    });
}());
