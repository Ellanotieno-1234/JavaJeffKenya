#!/bin/bash
# exit on error
set -o errexit

# Install system dependencies
apt-get update
apt-get install -y \
    python3-numpy \
    python3-pandas \
    python3-pip \
    python3-dev \
    libpq-dev \
    gcc \
    g++ \
    gfortran \
    musl-dev \
    libffi-dev \
    libblas-dev \
    liblapack-dev \
    libatlas-base-dev

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install build dependencies
pip install --upgrade pip
pip install wheel setuptools
pip install --only-binary=:all: numpy==1.21.0
pip install --only-binary=:all: pandas==1.3.0

# Install remaining requirements
pip install -r requirements.txt

chmod a+x build.sh