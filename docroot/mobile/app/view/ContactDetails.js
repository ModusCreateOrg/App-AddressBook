Ext.define("mobile.view.ContactDetails", {
    extend: 'Ext.Container',
    xtype: 'contact_details',


    config : {
        cls : 'person',
        scrollable : {
            direction : 'vertical'
        },
        data : {},
        tpl: [
            '<tpl if="values.firstName || values.lastName">',

                '<div class="photo">',
                    '<img src="{imageUrl}" />',
                '</div>',

                '<div class="name-title">',
                    '<div class="name">{firstName} {lastName}</div>',
                    '<div class="title">{title}</div>',
                '</div>',

                '<tpl if="values.twitter">',
                    '<div class="contact-methods">',
                        '<a class="contact untouched" target="_blank" href="twitter:{twitter}" class="value"><i class="icon-twitter"></i> {twitter}</a>',
                    '</div>',
                '</tpl>',

                '<tpl if="values.skype">',
                    '<div class="contact-methods">',
                        '<a class="contact untouched" target="_blank" href="skype:{skype}" class="value"><i class="icon-rss"></i> {skype}</a>',
                    '</div>',
                '</tpl>',

                '<tpl if="values.notes">',
                    '<div class="contact-methods">',
                        '<div class="info-type">Notes</div>',
                            '<a class="contact untouched" href="javascript:void(0)">{notes}</a>',
                        '</div>',
                    '</div>',
                '</tpl>',

                '<div class="contact-methods">',
                    '<tpl for="contactData">',
                        '<div class="info-type">{infoType}</div>',

                        '<tpl if="values.phone">',
                            '<a class="contact untouched" target="_blank" href="tel:{phone}" class="value"><i class="icon-phone"></i> {phone}</a>',
                        '</tpl>',

                        '<tpl if="values.email">',
                            '<a class="contact untouched" target="_blank" href="mailto:{email}" class="value"><i class="icon-envelope"></i> {email}</a>',
                        '</tpl>',

                        '<tpl if="values.address && values.city && values.state && values.zip">',
                            // TODO: optimize
                            // TODO: Fix issue with tap
                            '<a class="contact" sclass="contact-address" target="_blank" href="http://maps.google.com/?q={address} {city} {state} {zip}">',
                                '<i class="icon-home"></i><span style="margin-bottom: -5px;">{address}</span>',
                                '<div class="contact-rest">{city}, {state} {zip}</div>',
                                '<div class="contact-rest">{country}</div>',
                            '</a>',
                        '</tpl>',
                        '<div class="info-clear"></div>',

                    '</tpl>',
                '</div>',
            '<tpl else>',
                '<div>No contact selected</div>',
            '</tpl>'
        ]
    },
    
    initialize : function() {
        var me = this;
        me.callParent();

        me.element.on({
            scope      : me,
            delegate   : '.contact',
            touchstart : 'onElementTouchStart',
            touchend   : 'onElementTouchEnd',
            click      : 'onElementTap'
        });
    },

    onElementTouchStart : function(evtObj) {
        console.log('evtObj', evtObj.getTarget())
        var target = evtObj.getTarget();
        if (target) {
            Ext.fly(target).replaceCls('untouched', 'touched');
        }
    },

    onElementTouchEnd : function(evtObj) {
        var target = evtObj.getTarget();
        if (target) {
            Ext.fly(target).replaceCls('touched', 'untouched');
        }
    }
});