#!/bin/bash

yarn run build
rsync -av --delete-after build/rustsim/ crozet@ssh.cluster003.ovh.net:/home/crozet/rustsim/
