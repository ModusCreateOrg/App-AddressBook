/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/6/13
 * Time: 4:47 AM
 */

(function() {

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
            url      : ab.data.serviceUrl + 'rest/' + config.url,
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
            failure  : function(response) {
                console.dir(Ext.decode(response.responseText));
            }
        });
    }

    function tableName(name) {
        return name;
    }

    function buildQuery(options) {
        var args = [];

        if (options) {
            if (options.fields) {
                if (Ext.isArray(options.fields)) {
                    args.push('fields=' + encodeURIComponent(options.fields.join(',')));
                }
                else {
                    args.push('fields=' + options.fields);
                }
            }

            if (options.where) {
                args.push('filter=' + encodeURIComponent(options.where));
            }
            else if (options.filter) {
                args.push('filter=' + encodeURIComponent(options.filter));
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

    Ext.define('ab.ux.DreamFactory', {
        singleton : true,
        extend    : 'Ext.Base',

        init : function() {
            console.log('init dream factory');
        },

        login : function(username, password, callback) {
            rpc({
                url      : 'user/session/',
                params   : {
                    username : username,
                    password : password
                },
                callback : callback
            });
        },

        logout : function(callback) {
            rpc({
                url      : 'user/session/',
                method   : 'DELETE',
                callback : callback
            });
        },

        session : function(callback) {
            rpc({
                url      : 'user/session/',
                callback : callback
            });
        },

        temporarySession : function(ticket, callback) {
            rpc({
                url      : 'user/session/?ticket=' + ticket,
                callback : callback
            });
        },

        getProfile    : function(callback) {
            rpc({
                url      : 'user/profile/',
                callback : callback
            });
        },

        // note: profile may contain one or more fields to update
        updateProfile : function(profile, callback) {
            rpc({
                url    : 'user/profile/',
                method : 'POST',
                params : profile
            });
        },

        changePassword : function(oldPassword, newPassword, callback) {
            rpc({
                url      : 'user/password/',
                method   : 'POST',
                params   : {
                    old_password : oldPassword,
                    new_password : newPassword
                },
                callback : callback
            });
        },

        // throws 500 error on user admin
        getChallenge   : function(username, callback) {
            rpc({
                url      : 'user/challenge/?username=' + username,
                callback : callback
            });
        },

        describeSystemTables : function(callback) {
            rpc({
                url      : 'system/schema/',
                callback : callback
            });
        },

        describeTables : function(callback) {
            rpc({
                url      : 'schema/',
                callback : callback
            });
        },

        describeSystemTable : function(name, callback) {
            rpc({
                url      : 'system/schema/' + name,
                callback : callback
            });
        },

        describeTable : function(name, callback) {
            rpc({
                url      : 'schema/' + tableName(name),
                callback : callback
            });
        },

        deleteTable : function(name, callback) {
            rpc({
                url      : 'schema/' + name,
                method   : 'DELETE',
                callback : callback
            });
        },

        createTable : function(schema, callback) {
            rpc({
                url      : 'schema/' + schema.table[0].name,
                method   : 'POST',
                params   : schema,
                callback : callback
            });
        },

        createSystemRecords : function(table, records, callback) {
            rpc({
                url      : 'system/' + table,
                method   : 'POST',
                params   : buildRecords(records),
                callback : callback
            });
        },

        createRecords : function(table, records, callback) {
            rpc({
                url      : 'dB/' + tableName(table),
                method   : 'POST',
                params   : buildRecords(records),
                callback : callback
            });
        },

        retrieveSystemRecords : function(table, ids, callback, fields) {
            var url = 'system/' + table;
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

        retrieveRecords : function(table, ids, callback, fields) {
            var url = 'db/' + tableName(table);
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

        filterSystemRecords : function(table, options, callback) {
            var url = 'system/' + table,
                args = buildQuery(options);

            if (args.length) {
                url += '?' + args.join('&');
            }
            rpc({
                url      : url,
                callback : callback || options.callback
            });
        },

        filterRecords : function(table, options, callback) {
            var url = 'db/' + tableName(table),
                args = buildQuery(options);

            if (args.length) {
                url += '?' + args.join('&');
            }

            rpc({
                url      : url,
                callback : callback || options.callback
            });
        },

        updateSystemRecords : function(table, records, callback, fields) {
            var url = 'system/' + table;

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
            var url = 'db/' + table;

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
            var url = 'system/' + table;
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

        deleteRecords : function(table, ids, callback, fields) {
            var url = 'db/' + tableName(table);
            if (Ext.isArray(ids)) {
                if (ids.length > 1) {
                    url += '?ids=' + ids.join(',');
                }
                else {
                    url += '?id=' + ids[0];
                }
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

        deleteRecord : function(table, id, callback, fields) {
            var url = 'db/' + tableName(table) + '/' + id;
            if (Ext.isArray(fields)) {
                url += '?fields=' + fields.join(',');
            }
            else if (Ext.isString(fields)) {
                url += '?fields=' + fields;
            }
            rpc({
                url      : url,
                method   : 'DELETE',
                callback : callback
            });
        },

        putDocuments : function(documents, callback) {
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
                        Name    : doc.name,
                        Content : doc.content
                    });
                }
                else {
                    files.push({
                        Name      : doc.name,
                        Content   : doc.content,
                        is_base64 : doc.base64
                    });
                }
            });

            if (folders.length) {
                params.folders = {
                    folder : folders
                };
            }
            if (files.length) {
                params.files = {
                    file : files
                }
            }

            rpc({
                url      : 'DOC',
                method   : 'POST',
                params   : params,
                callback : callback
            });
        },

        getDocument : function(path, callback) {
            path = path.replace(/\/+$/, '');
            rpc({
                url      : 'DOC/' + path + '?properties=true&content=true',
                callback : callback
            });
        },

        getFolder : function(path, callback) {
            path = path.replace(/\/+$/, '') + '/';
            rpc({
                url      : 'DOC/' + path, //  + '?properties=true&content=true',
                callback : callback
            });
        },

        deleteDocument : function(path, callback) {
            path = path.replace(/\/+$/, '');
            rpc({
                url    : 'DOC/' + path,
                method : 'DELETE'
            });
        },

        deleteFolder : function(path, callback) {
            path = path.replace(/\/+$/, '') + '/';
            rpc({
                url    : 'DOC/' + path,
                method : 'DELETE'
            });
        }
    });

}());
