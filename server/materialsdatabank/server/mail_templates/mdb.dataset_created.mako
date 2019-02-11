<%include file="mdb.header.mako"/>

<p>A new dataset has been submitted.</p>

<p>Title: ${dataset.get('title')}</p>
<p>Login: ${user.get('login')}</p>
<p>Email: ${user.get('email')}</p>
<p>Name: ${user.get('firstName')} ${user.get('lastName')}</p>

<a href="${host}/dataset/${dataset.get('_id')}">Click here</a> to view the dataset.

<%include file="mdb.footer.mako"/>
