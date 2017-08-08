# Example Web App - Burrito Time
[![Build Status](https://travis-ci.org/bmonds/example-web-app.svg?branch=master)](http://travis-ci.org/bmonds/example-web-app)

purpose

## Local Development and Tests

### Prereq
vagrant

virtualbox

selenium server

```
brew install selenium-server-standalone
brew install chromedriver
```

### Running

```
vagrant up
```

### Tests

Unit tests
```
npm test
```

Nightwatch tests
```
selenium-server -p 4444
```

```
node_modules/nightwatch/bin/nightwatch --config nightwatch.json
```

## Run on Amazon Web Services

### Prereq

Install boto
```
pip install boto
```

Get the [AWS EC2 dynamic inventory](https://aws.amazon.com/blogs/apn/getting-started-with-ansible-and-dynamic-amazon-ec2-inventory-management/).

```
sudo curl -o /etc/ansible/ec2.py -k https://raw.githubusercontent.com/ansible/ansible/stable-2.3/contrib/inventory/ec2.py
sudo curl -o /etc/ansible/ec2.ini -k https://raw.githubusercontent.com/ansible/ansible/stable-2.3/contrib/inventory/ec2.ini
```

Update ec2.ini to change the region. Ansible scripts default to us-west-2.

### Provisioning a sever and running

```
ansible-playbook ansible/main_aws.yml -i /etc/ansible/ec2.py --extra-vars "key=your-aws-key-name"
```

If using a different region.

```
ansible-playbook ansible/main_aws.yml -i /etc/ansible/ec2.py --extra-vars "key=your-aws-key-name region=us-west-1"
```

If connecting to the wrong IP for deployment.

```
sudo /etc/ansible/ec2.py --refresh-cache
```

### Terminating the app

```
ansible-playbook ansible/aws_destroy2.yml -i /etc/ansible/ec2.py
```