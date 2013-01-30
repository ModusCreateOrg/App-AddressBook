About the vhost file
====================

These instructions are for Apache2 running on OSX.  Hopefully it's enough information to
derive a similar setup if you're using some other OS.

The vhost file configures a localhost ServerName df.  

You will need to add a line like this to your /etc/hosts file:
```
127.0.0.1 df
```

The vhost sets up a reverse proxy to the Dream Factory API/Host at /service/.  That is, if
you access http://df/service/whatever from the browser or JavaScript/AJAX, the request is 
forwarded as-is to the Dream Factory API/Host.

The vhost file may be merged into your /etc/apache2/extra/httpd-vhosts.conf.  What I did was
to modify my /etc/apache2/httpd.conf file as follows:

```
# Virtual hosts
Include /private/etc/apache2/sites-enabled
#Include /private/etc/apache2/extra/httpd-vhosts.conf
```

That is, find the "Virtual Hosts" comment and add the Include line.  This will load all the 
individual vhost files (of any filename) you have in /private/etc/apache2/sites-enabled directory.

Also make sure that you have mod_proxy enabled in your httpd.conf (these lines likely already exist
but may be commented out):

```
LoadModule proxy_module libexec/apache2/mod_proxy.so
LoadModule proxy_connect_module libexec/apache2/mod_proxy_connect.so
LoadModule proxy_ftp_module libexec/apache2/mod_proxy_ftp.so
LoadModule proxy_http_module libexec/apache2/mod_proxy_http.so
LoadModule proxy_scgi_module libexec/apache2/mod_proxy_scgi.so
LoadModule proxy_ajp_module libexec/apache2/mod_proxy_ajp.so
LoadModule proxy_balancer_module libexec/apache2/mod_proxy_balancer.so
```

For my setup, I have /etc/apache2/sites-enabled and /etc/apache2/sites-available.  

For general purpose vhost creation, I copy an existing vhost file in the sites-available directory and
modify it to suit my needs. 

To activate a vhost, I create a soft link from the sites-available file in sites-enabled and restart
apache:

```
$ cd /etc/sites-enabled
$ ln -s ../sites-available/whatever-vhost .
$ sudo apachectl restart
```

At this point you should be able to edit and develop locally, using your clone of the git repository.

