```bash
ansible-galaxy install -r requirements.yml
ansible-playbook -i localhost -e mdb_password=<secret> site.yml
```
