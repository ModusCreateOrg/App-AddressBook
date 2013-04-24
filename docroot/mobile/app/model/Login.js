/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/12/13
 * Time: 7:04 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

Ext.define('mobile.model.Login', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'id',
            'email',
            'password'
        ],
        proxy: {
            type: 'localstorage',
            id: 'mobile-login'
        }
    }
});
