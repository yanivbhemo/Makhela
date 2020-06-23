FROM python:3.7.7-slim-buster

RUN ln -fs /usr/share/zoneinfo/Asia/Jerusalem /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata 2>/dev/null

RUN apt update -y && \
        apt install git -y && \
        /bin/bash
COPY	/root/password.txt /tmp
CMD cd /tmp && \
        git clone https://github.com/yanivbhemo/Makhela.git && \
        cd Makhela/analyzer && \
        pip install pymongo nltk numpy pandas gensim spacy networkx sklearn dnspython
        python -m spacy download en
        mkdir logs
        python3 main.py $RUN_TYPE $COLLECTION
