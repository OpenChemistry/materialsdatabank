<%include file="mdb.header.mako"/>

<p>Congratulations ${approver.get('firstName')}!</p>

<p>Your <a href="${host}/dataset/${dataset.get('_id')}">dataset</a> has been approved by ${approver.get('firstName')} ${approver.get('lastName')} .</p>

<%include file="mdb.footer.mako"/>
