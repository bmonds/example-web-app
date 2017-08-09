#!/bin/bash
vagrant ssh -c "cd /var/www/;pm2 startOrRestart ecosystem.json"
