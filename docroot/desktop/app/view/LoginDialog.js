Ext.define('ab.view.LoginDialog', {
    extend : 'Ext.window.Window',
    alias  : 'widget.loginDialog',

    title       : 'Enter your credentials',
    modal       : true,
    draggable   : false,
    resizable   : false,
    y           : 150,
    width       : 400,
    height      : 140,
    border      : false,
    layout      : 'fit',
    buttonAlign : 'center',

    items        : {
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
                fieldLabel : 'Username',
                value      : 'admin'
            },
            {
                itemId     : 'password',
                inputType  : 'password',
                fieldLabel : 'Password',
                value      : 'admin'
            },
            {
                xtype  : 'component',
                itemId : 'login-message'
            }
        ]
    },

    buttons : [
        {
            text   : 'Log In',
            itemId : 'login-button'
        },
        {
            text   : 'Forgot Password',
            itemId : 'forgot-button'
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
        this.down('#login-message').el.update('<span style="color: red">' + text + '</span>');
    },

    onFieldSpecialKey : function(field, e) {
        if (e.getKey() == e.ENTER) {
            this.fireEvent('enterkey', this);
        }
    }
});