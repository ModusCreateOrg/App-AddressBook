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

Ext.define('ab.view.LoginDialog', {
    extend : 'Ext.window.Window',
    alias  : 'widget.loginDialog',

    title       : 'Enter your credentials',
    modal       : true,
    draggable   : false,
    resizable   : false,
    closable    : false,
    // y           : 150,
    width       : 240,
    height      : 200,
    shadow      : false,
    border      : false,
    layout      : 'fit',
    buttonAlign : 'center',
    cls         : 'login-form',

    items        : [
        {
        xtype : 'form',
        frame : true,
        defaults : {
            xtype      : 'textfield',
            labelWidth : 60,
            anchor     : '100%'
        },
        items    : [
            {
                itemId     : 'username',
                // fieldLabel : 'Username',
                hideLabel  : true,
                emptyText : 'Username',
                value      : 'admin'
            },
            {
                itemId     : 'password',
                inputType  : 'password',
                hideLabel  : true,
                // fieldLabel : 'Password',
                emptyText : 'Password',
                value      : 'admin'
            },
            {
                xtype  : 'component',
                itemId : 'login-message'
            }
        ]
    }],

    buttons : [
        {
            text   : 'Log In',
            itemId : 'login-button',
            cls    : 'login-button'
        },
        {
            text   : 'Forgot Password',
            itemId : 'forgot-button',
            cls    : 'forgot-button'
        }
    ],

    initComponent : function() {
        var me        = this,
            listeners = {
                scope      : me,
                specialkey : me.onFieldSpecialKey
            };
        this.callParent();

        Ext.each(this.query('field'), function(tf) {
            tf.on(listeners);
        });
    },

    setMessage   : function(text) {
        this.down('#login-message').el.update(text);
    },

    errorMessage : function(text) {
        this.down('#login-message').el.update('<span style="color: #ea5641">' + text + '</span>');
    },

    onFieldSpecialKey : function(field, e) {
        if (e.getKey() == e.ENTER) {
            this.fireEvent('enterkey', this);
        }
    }
});