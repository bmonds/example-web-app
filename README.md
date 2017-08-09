# Example Web App - Burrito Time
[![Build Status](https://travis-ci.org/bmonds/example-web-app.svg?branch=master)](http://travis-ci.org/bmonds/example-web-app)

Burrito Time is a demonstration of automation tools and testing for a simple web application. The application itself runs on Node.JS behind an Nginx proxy, hosted on the same server. PM2 is used to start the Node.JS app and keep it running. The content of the application is a few very simple pages, and a form used to calculate the cost of a fake burrito order based on a provided quantity. The purpose of the Node.JS application is to provide the code to test and deploy.

There are two environments supported by this application. The first is an OSX local development environment, powered by vagrant and virtualbox. The second is closer to a production environment and runs on an Amazon Web Services EC2 instance. Both environments are configured using Ansible playbooks. In the case of the EC2 instance on Amazon Web Services, Ansible is also used to create the server and security group.

[Travis CI](https://travis-ci.org/bmonds/example-web-app.svg?branch=master) is monitoring this repository for changes. When a commit is detected it will run the unit tests, followed by end-to-end tests with the help of [SauceLabs](https://saucelabs.com/). Mocha and Chai are used for the unit tests. Nightwatch.js and Selenium (or SauceLabs) are used for end-to-end tests with Chrome.

## Local Development and Testing

### Requirements

The virtual server for local development requires a few pieces of software to be installed on the system.  First, download and install [Vagrant](https://www.vagrantup.com/). Vagrant will handle running the virtualization software and starting the configuration process for the server.

For virtualization, download and install [VirtualBox](https://www.virtualbox.org/). As an alternative, you can use a different virtualization product, such as VMWare. If using another product, you will need to change the [Vagrant provider](https://www.vagrantup.com/docs/providers/) and [Vagrant box](https://app.vagrantup.com/boxes/search?utf8=%E2%9C%93&sort=downloads&provider=&q=Ubuntu+16.04) in the Vagrantfile. The current configuration uses an Ubuntu 16.04 box for VirtualBox.

If you wish to run the end-to-end tests on your local system, you will need to install the Selenium server and driver for Chrome.

```
brew install selenium-server-standalone
brew install chromedriver
```

### The Vagrant server

Once the repository is downloaded, change to the root folder of the project. The following Vagrant command will create the virtual server, and run the Ansible playbooks to configure and start the Node.JS application. If using a different Vagrant provider, the `--provider` flag may need to be added. The [Vagrant Basic Usage](https://www.vagrantup.com/docs/providers/basic_usage.html) page will provide additional information.

```
vagrant up
```

Vagrant handles sharing the project files between the host system and the virtual server. So any code changes are instantly available to the server. If making changes to the Node.JS app, a shell script is available to restart the PM2 job. From the project root on the host computer run `./vagrantRestartNode.sh`.

When finished, the server can be destroyed by running the Vagrant destroy command.

```
vagrant destroy
```

### Tests

Unit tests are run by the [Mocha](https://mochajs.org/) test framework, and use [Chai](http://chaijs.com/) for assertions. Tests are located in the `/tests` folder. The NPM package information has scripts to start the different test suites. To run the unit tests, use the `test-unit` npm script.

```
npm run test-unit
```

End-to-End tests use Selenium to control a Chrome browser, and the tests are written using [Nightwatch.js](http://nightwatchjs.org/). Before running the tests, start the Selenium server using a different terminal.

```
selenium-server -port 4444
```

Then from the project root, use the `test-e2e` npm script to start Nightwatch.js and run the end-to-end tests.

```
npm run test-e2e
```

The well known `npm test` command works as well. It will run the unit tests followed immediately by the end-to-end tests. Because of this, Selenium will need to be running prior to executing `npm test`.

## Using Amazon Web Services

### Requirements

In order to communicate with Amazon  Web Services, the included Ansible playbooks make use of [boto](http://docs.pythonboto.org/en/latest/) and the [AWS EC2 dynamic inventory](https://aws.amazon.com/blogs/apn/getting-started-with-ansible-and-dynamic-amazon-ec2-inventory-management/).  Both of these will need to be installed unless they are already available.

Install boto:

```
pip install boto
```

Download the python script and configuration file for the AWS EC2 Dynamic Inventory:

```
sudo curl -o /etc/ansible/ec2.py -k https://raw.githubusercontent.com/ansible/ansible/stable-2.3/contrib/inventory/ec2.py
sudo curl -o /etc/ansible/ec2.ini -k https://raw.githubusercontent.com/ansible/ansible/stable-2.3/contrib/inventory/ec2.ini
```

The included Ansible playbooks use the us-west-2 region by default. If Ansible has a problem creating, or finding, the server for this project then change region value in `/etc/ansible/ec2.ini` to the correct region name.

In addition to the above tools, a key pair will need to exist on Amazon Web Services. This SSH key is used by Ansible to connect to the server and run the appropriate commands. Create a key pair following the [Amazon EC2 Key Pairs](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) documenation. You will also need an AWS Access Key ID and AWS Secret Access Key so boto can use the AWS API. If you need to create these keys, consult the [AWS Security Credentials](http://docs.aws.amazon.com/general/latest/gr/aws-security-credentials.html) documenation and update the [boto config](https://github.com/boto/boto#getting-started-with-boto).

### AWS Related Commands

Working with server on Amazon Web Services consists of a few commands. The `main_aws.yml`, `aws_deploy.yml`, and `aws_destroy.yml` Ansible playbooks handle the heavy lifting.

#### Create the server
To create the server, configure the services, and then deploy the application use the `main_aws.yml` playbook. Replace `your-aws-key-name` with the name of the key pair created in the Requirements section.

```
ansible-playbook ansible/main_aws.yml -i /etc/ansible/ec2.py --extra-vars "key=your-aws-key-name"
```

When complete, Ansible will provide the public IP for the new server. In the following example, `54.70.120.47` is the IP for the new server. Open your browser and go to http://54.70.120.47 to view the web app, replacing the IP with the one from your own play recap.

```
PLAY RECAP ***********************************************************************
54.70.120.47               : ok=14   changed=12   unreachable=0    failed=0
localhost                  : ok=5    changed=3    unreachable=0    failed=0
```

#### Deploy code changes

If code changes are made after the server is running, the `aws_deploy.yml` playbook will deploy the project files and restart the PM2 job for the Node.JS app.

```
ansible-playbook ansible/aws_deploy.yml -i /etc/ansible/ec2.py
```

#### Destroy the server

When you are finished with the server use the `aws_destroy.yml` playbook to destroy the EC2 instance and related security group.

```
ansible-playbook ansible/aws_destroy.yml -i /etc/ansible/ec2.py
```

#### Cached IP Address Problems

Frequently creating and destroying the server can lead to old IP address information being pulled from the cache. If Ansible is unable to reach the server due to an incorrect IP address, clear the cache with the following command.

```
sudo /etc/ansible/ec2.py --refresh-cache
```
