/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 8/15/12
 * Time: 7:02 AM
 *
 * Copyright (c) 2013 Modus Create, Inc.
 * This file is licensed under the terms of the MIT license.
 * See the file license.txt for more details.
 */

Ext.define('ab.view.PasswordDialog', {
    extend : 'Ext.window.Window',
    alias  : 'widget.passwordDialog',
    id     : 'password-dialog',

    title       : 'Change your password',
    modal       : true,
    draggable   : false,
    resizable   : false,
    centered    : true,
    width       : 500,
    height      : 150,
    border      : false,
    layout      : 'fit',
    buttonAlign : 'center',
    items       : {
        xtype : 'form',
        frame : true,
        items : {
            xtype : 'passwordfield',
            itemId: 'password',
            required: true
            // labelWidth: 150
        }
    },
    buttons     : [
        {
            text   : 'OK',
            itemId : 'ok-button'
        },
        {
            text   : 'Cancel',
            itemId : 'cancel-button'
        }
    ]
});