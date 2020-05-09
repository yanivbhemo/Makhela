from sklearn.feature_extraction.text import TfidfVectorizer
import re
import numpy as np
import pandas as pd

import gensim
import gensim.corpora as corpora
from gensim.utils import simple_preprocess
import spacy
from nltk.corpus import stopwords

import networkx as nx
from networkx.algorithms import community as nxc
import logger


class Analyzer:

    def __init__(self, leaders, posts, key_words):
        self.leaders = leaders
        self.posts = posts
        self.key_words = key_words
        self.DG = ''

    def analyze_community(self):
        log = logger.logger_handler()
        log.send_message_to_logfile("Beginning to analyze community")
        self.add_key_words(log)
        self.important_words(log)
        self.analyze_lda(log)
        self.build_graph(log)
        self.centrality(log)
        self.community(log)
        return self.leaders, self.posts


    def add_key_words(self, log):
        log.send_message_to_logfile("adding key word indicator to post")
        for key, value in self.posts.items():
            try:
                word_found = False
                for key_word in self.key_words:
                    if key_word in value['full_text']:
                        word_found = True
                        break
                self.posts[key]["key_word"] = word_found
            except:
                log.send_message_to_logfile("exception adding key word indicator to post: ", key)
                continue

    def text(self, dict):
        if dict['retweeted_status_text'] != 'None':
            return dict['retweeted_status_text']
        elif dict['in_reply_to_status_text'] != 'None':
            return dict['in_reply_to_status_text']
        elif dict['quoted_status_text'] != 'None':
            return dict['quoted_status_text']
        else:
            return dict['full_text']

    def important_words(self, log):
        log.send_message_to_logfile("Finding important words")
        words_from_posts = []
        for key, value in self.posts.items():
            try:
                post_row = []
                post_row.append(key)
                post_row.append(self.text(self.posts[key]))
                words_from_posts.append(post_row)
            except:
                log.send_message_to_logfile("exception finding text in post: ", key)
                continue
        words_df = pd.DataFrame(words_from_posts)
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform(words_df[1])
        feature_names = vectorizer.get_feature_names()
        dense = vectors.todense()
        denselist = dense.tolist()
        df = pd.DataFrame(denselist, columns=feature_names)

        words = []
        for i in range(len(df)):
            words.append(df.iloc[i, :][df.iloc[i, :] == df.iloc[i, :].max()].index.values.tolist())

        words_df['words'] = words

        for i in range(len(words_df)):
            try:
                self.posts[words_df.loc[i, 0]]['words'] = words_df.loc[i, 'words']
            except:
                log.send_message_to_logfile("exception while finding important wordst: ", i,  words_df.loc[i, 'words'])
                continue

        return



    def analyze_lda(self, log):
        log.send_message_to_logfile("Analyzing LDA")
        def sent_to_words(sentences):
            try:
                for sentence in sentences:
                    yield (gensim.utils.simple_preprocess(str(sentence), deacc=True))  # deacc=True removes punctuations
            except:
                log.send_message_to_logfile("exception in sent_to_words")

        # Define functions for stopwords, bigrams, trigrams and lemmatization
        def remove_stopwords(texts):
            try:
                stop_words = stopwords.words('english')
                return [[word for word in simple_preprocess(str(doc)) if word not in stop_words] for doc in texts]
            except:
                log.send_message_to_logfile("exception in removing stopwords")
                return []

        def make_bigrams(texts):
            try:
                return [bigram_mod[doc] for doc in texts]
            except:
                log.send_message_to_logfile("exception in make_bigram")
                return []


        def make_trigrams(texts):
            try:
                return [trigram_mod[bigram_mod[doc]] for doc in texts]
            except:
                log.send_message_to_logfile("exception in make_bigrams")
                return []

        def lemmatization(texts, allowed_postags=['NOUN', 'ADJ', 'VERB', 'ADV']):
            try:
                """https://spacy.io/api/annotation"""
                texts_out = []
                for sent in texts:
                    doc = nlp(" ".join(sent))
                    texts_out.append([token.lemma_ for token in doc if token.pos_ in allowed_postags])
                return texts_out
            except:
                log.send_message_to_logfile("exception in lemmatization")

        def LDA(posts_corpus):
            try:
                df = pd.DataFrame(posts_corpus)
                df = df.drop_duplicates()
                df = df.rename({0: 'leader', 1: 'post'}, axis='columns')

                data = df.post.values.tolist()
                data = [re.sub('\s+', ' ', sent) for sent in data]
                data = [re.sub("\'", "", sent) for sent in data]
                data_words = list(sent_to_words(data))

                # Build the bigram and trigram models
                bigram = gensim.models.Phrases(data_words, threshold=100)  # higher threshold fewer phrases.
                trigram = gensim.models.Phrases(bigram[data_words], threshold=100)

                # Faster way to get a sentence clubbed as a trigram/bigram
                bigram_mod = gensim.models.phrases.Phraser(bigram)
                trigram_mod = gensim.models.phrases.Phraser(trigram)

                # Remove Stop Words
                data_words_nostops = remove_stopwords(data_words)

                # Form Bigrams
                data_words_bigrams = make_bigrams(data_words_nostops)

                nlp = spacy.load('en', disable=['parser', 'ner'])

                # Do lemmatization keeping only noun, adj, vb, adv
                data_lemmatized = lemmatization(data_words_bigrams, allowed_postags=['NOUN', 'ADJ', 'VERB', 'ADV'])

                # Create Dictionary
                id2word = corpora.Dictionary(data_lemmatized)

                # Create Corpus
                texts = data_lemmatized

                # Term Document Frequency
                corpus = [id2word.doc2bow(text) for text in texts]

                # Build LDA model
                lda_model = gensim.models.ldamodel.LdaModel(corpus=corpus,
                                                            id2word=id2word,
                                                            num_topics=5,
                                                            random_state=100,
                                                            update_every=1,
                                                            chunksize=100,
                                                            passes=10,
                                                            alpha='auto',
                                                            per_word_topics=True)
                return lda_model
            except:
                log.send_message_to_logfile("exception in LDA")

        for key, value in self.leaders.items():
            posts_corpus = []
            try:
                for post in value['posts']:
                    leader_posts = []
                    leader_posts.append(key)
                    leader_posts.append(self.text(self.posts[post]))
                    posts_corpus.append(leader_posts)
                self.leaders[key]['topics'] = LDA(posts_corpus).print_topics()
            except:
                log.send_message_to_logfile("exception appending topics: ", key)
                continue

    def build_graph(self, log):
        log.send_message_to_logfile("Building Graph")
        try:
            self.DG = nx.DiGraph()
            self.DG.add_nodes_from(self.leaders)
            for key, value in self.leaders.items():
                for follower in value['community_following']:
                    self.DG.add_edge(key, follower)
            return
        except:
            log.send_message_to_logfile("exception while building graph")

    def centrality(self, log):
        log.send_message_to_logfile("Analyzing centrality")
        try:
            deg_centrality = nx.degree_centrality(self.DG)
        except:
            log.send_message_to_logfile("exception finding degree_centrality")
        try:
            betweenness_centrality = nx.betweenness_centrality(self.DG)
        except:
            log.send_message_to_logfile("exception finding betweenness_centrality")
        try:
            closeness_centrality = nx.closeness_centrality(self.DG)
        except:
            log.send_message_to_logfile("exception finding closeness_centrality")

            for key, value in self.leaders.items():
                try:
                    self.leaders[key]["deg_centrality"] = deg_centrality[key]
                except:
                    log.send_message_to_logfile("exception adding deg_centrality: ", key)
                    continue
                try:
                    self.leaders[key]["betweenness_centrality"] = betweenness_centrality[key]
                except:
                    log.send_message_to_logfile("exception adding betweenness_centrality: ", key)
                    continue
                try:
                    self.leaders[key]["closeness_centrality"] = closeness_centrality[key]
                except:
                    log.send_message_to_logfile("exception adding closeness_centrality: ", key)
                    continue



    def community(self, log):
        log.send_message_to_logfile("Analyzing community")
        try:
            communities_generator = nxc.girvan_newman(self.DG)
            top_level_communities = next(communities_generator)
            next_level_communities = next(communities_generator)
            community_found = sorted(map(sorted, next_level_communities))
        except:
            log.send_message_to_logfile("failed analyzing community")

        counter = 0
        for community in community_found:
            if len(community) > 1:
                for c in community:
                    try:
                        self.leaders[c]['community'] = counter+1
                    except:
                        log.send_message_to_logfile("failed adding community to ", c)
                        continue
            else:
                self.leaders[community[0]]['community'] = 0
        for key, value in self.leaders.items():
            try:
                if self.leaders['community']:
                    self.leaders['community'] = self.leaders['community']+1
                else:
                    self.leaders['community'] = 0
            except:
                log.send_message_to_logfile("exception adding deg_centrality: ", key)












