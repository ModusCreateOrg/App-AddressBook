Ext.define("mobile.view.ContactInformation", {
    extend: 'Ext.Container',
    xtype: 'contact_information',


    config : {
        cls : 'person',
        scrollable : {
            direction : 'vertical'
        },
        data : {},
        tpl: [
            '<div class="contact_photo" style="background-image: url(http://src.sencha.io/60/{imageUrl});"></div>',

            '<div class="name-title">',
                '<div class="name">{firstName} {lastName}</div>',
                '<div class="title">{title}</div>',
            '</div>',

            '<tpl if="values.twitter">',
                '<div class="contact-methods">',
                    '<a class="contact untouched" href="twitter:{twitter}" class="value"><span class="contact twitter"></span> {twitter}</a>',
                '</div>',
            '</tpl>',

            '<tpl if="values.skype">',
                '<div class="contact-methods">',
                    '<a class="contact untouched" href="skype:{skype}" class="value"><span class="contact skype"></span> {skype}</a>',
                '</div>',
            '</tpl>',

            '<div class="contact-methods">',
                '<tpl for="contactData">',
                    '<div class="info-type">{infoType}</div>',

                    '<tpl if="values.phone">',
                        '<a class="contact untouched" href="tel:{phone}" class="value"><span class="contact phone"></span> {phone}</a>',
                    '</tpl>',

                    '<tpl if="values.email">',
                        '<a class="contact untouched" href="mailto:{email}" class="value"><span class="contact email"></span> {email}</a>',
                    '</tpl>',

                    '<tpl if="values.address && values.city && values.state && values.zip">',
                        // TODO: optimize
                        // TODO: Fix issue with tap
                        '<a class="contact" sclass="contact-address" href="http://maps.google.com/?q={address} {city} {state} {zip}">',
                            '<span class="contact address"></span><span style="margin-bottom: -5px;">{address}</span>',
                            '<div class="contact-rest">{city}, {state} {zip}</div>',
                            '<div class="contact-rest">{country}</div>',
                        '</a>',
                    '</tpl>',

                    '<div class="info-clear"></div>',

                '</tpl>',
            '</div>'
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