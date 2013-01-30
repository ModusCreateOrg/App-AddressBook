Ext.define('ab.ux.PasswordField', {
    extend : 'Ext.form.FieldContainer',
    alias  : 'widget.passwordfield',

    isFormField  : true,
    minLength    : 8,
    validStyle   : {
        background : 'none'
    },
    invalidStlye : {
        'background-color' : '#FEE'
    },

    initComponent : function() {
        var me = this,
            labelWidth = me.initialConfig.labelWidth || 110,
            fieldListeners = {
                scope  : me,
                change : me.isValid
            };

        var config = {
            layout   : 'form',
            defaults : {
                xtype      : 'textfield',
                anchor     : '100%',
                inputType  : 'password',
                labelWidth : labelWidth
            },
            items    : [
                {
                    fieldLabel : 'Password',
                    itemId     : 'pw1',
                    listeners  : fieldListeners
                },
                {
                    fieldLabel : 'Re-enter password',
                    itemId     : 'pw2',
                    listeners  : fieldListeners
                },
                {
                    xtype      : 'component',
                    style      : 'text-align: center; font-size: 12px;',
                    labelWidth : 10,
                    itemId     : 'msg'
                }
            ]
        };

        Ext.apply(me, Ext.apply(me.initialConfig, config));
        me.fieldLabel = undefined;
        me.callParent();

        me.pwField1 = me.down('#pw1');
        me.pwField2 = me.down('#pw2');
        me.msgField = me.down('#msg');
    },
    getValue      : function() {
        var value = this.pwField1.getValue();

        return value.length ? ab.ux.Utils.md5(value) : '';
    },
    markInvalid   : function() {
        this.el.applyStyles(this.invalidStyle)
    },

    clearInvalid : function() {
        this.el.applyStyles(this.validStyle)
    },
    isDirty      : function() {
        return false;
    },
    isValid      : function() {
        var me = this,
            msgField = me.msgField,
            msgStart = '<span style="color: red;">',
            msgEnd = '</span>',
            emsg = 'Leave password blank to leave unchanged' ,
            passwdOK = true,
            minLength = me.minLength,
            pw1 = me.pwField1.getValue(),
            pw2 = me.pwField2.getValue(),
            pw1Len = pw1.length,
            pw2Len = pw2.length,
            no = false;

        // TODO: Elevate to a template?
        if (!pw1Len || !pw2Len) {
            if (me.required || pw1Len || pw2Len) {
                emsg = msgStart + 'Both password fields are required' + msgEnd;
                passwdOK = no;
            }
        }
        else if (pw1Len < minLength || pw2Len < minLength) {
            emsg = msgStart + 'Your password needs to be a min. of ' + minLength + ' characters' + msgEnd;
            passwdOK = no;
        }
        else if (pw1 !== pw2) {
            emsg = msgStart + 'The passwords entered do not match' + msgEnd;
            passwdOK = no;
        }
        else if (pw1 === pw2) {
            emsg = '<span style="color: green;">Password is OK!</span>';
        }
        else if (!me.required) {
            emsg = '';
        }

        msgField.el.update(emsg);

        passwdOK ? me.clearInvalid() : me.markInvalid();
        return passwdOK;
    }
});
