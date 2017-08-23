## 2017-08
### Learning to Compare Image Patches via Convolutional Neural Networks
keyword:
Q:
    - SIFT
### Data-Driven Synthesis of Smoke Flows with CNN-based Feature Descriptors
keyword: low dimension feature descriptor
-
Q:
    - advection step
    -

### Deep Unfolding: Model-Based Inspiration of Novel Deep Architectures
keywords:
- deep unfolding - start with a model based approach and then convert iterative step into layers in network; untie the parameter across layers to obtain a trainable model across layers
-
Q:
    - markov random fields vs CRF
    - belief propagation
    - variational approximations


### Audio-Driven Facial Animation by Joint End-to-End Learning of Pose and Emotion
keywords: e2e, audio, emotion, lip vertex position
- uses a feature vector from a fully connected layer as emotional representation;
- emotion database is then later assigned a semantic meaning via playback on target mesh and manually assigning semantic label
- had to apply specific smoothing and ensemble (same input, averaged result across 2 runs) to obtain temporal stability
- uses PCA to pre-initialize the "bottleneck" layer
- defined a loss function of vertex position, vertex motion, and regularization to encourage long term change from emotion and shortterm change from audio

Q:
    - Source filter model?
    - autocorrelation
    - deformation transfer

### Architectures for deep neural network based acoustic models defined over windowed speech waveforms
keywords: raw input,
- investigated whether windowed speech wavform (WSW) DNN can be on par with MFCC/MFSC feature based DNN
- stacked bottleneck layer showed markable improvemnent for WSW and less for MFCC/MFSC - resulting in similar WER
- investigated using trained weight matrix structure as initialization vs random initialization

Q:
    - MFSC vs MFCC??

### spectral subband centroid features for speech recognition
keywords: features
- SSC improves baseline recognition performance as supplemnt features for cepstral coefficients
Takeaway:
    - spectral centroid, SSC, etc. are good features to try in additional to MFCC


### LCN, CNN, DNN for Text Dependent SV
keywords: LCN, CNN, DNN
- experiment with LCN and CNN as first layer for a DNN text dependent SV system
- shows that computation and parameters can be vastly reduced with CNN/LCN without losing too much performance
Takeaway:
    - try simpler layers with fewer parameters first

### Resnet
keywords: skip layer,
- bottleneck design with skip connection
Takeaway:
    - propagating "raw" information across layer helps with deeper architecture

### Network in a Network
keywords: NIN
- https://www.reddit.com/r/MachineLearning/comments/5n01i4/d_network_in_network_nin_is_it_still_useful/dc7qfd1/

### automatic gain control and multi-style training for robust small-footprint keyword spotting with deep neural networks
keywords:  keyword spotting, automatic gain control, multi-style training, small-footprint models
- trains a frontend system with EM algorithm on peak power by assuming signals from mixed Gaussian signals
- then applies automatic gain control (AGC) to speech segment
- builds on the DNN keyword system from "Small-footprint key- word spotting using deep neural networks"

### acoustic modelling from the signal domain using CNNs
keywords: CNN, raw waveform, statistic extraction layer, Network In Network nonlinearity
- LVCSR
- directly learn the "features" from raw signals
- uses the proposed NIN block to replace RELU and maxpooling
- propsed DNN used in combination with traditional iVector approach


### End-to-End Text-Dependent Speaker Verification
keywords: speaker verification, end-to-end training
- training e2e by using accept or reject as the loss function
- LSTM outperforms small footprint DNN but better DNN can improve base performance
- utterance vs frame level modeling - utterance level works better
- uses locally connected layers
Q:
    - Is it important for your system to use frame level modeling? Utterance should work?
    - What are the locally connected layer advantages?


### deep neural network-based speaker embeddings for end-to-end speaker verification
keywords: speaker vr, text-indepdendent
- uses network in a network (NIN) architecture to project an input vector (di) into output vector (do)
- trains directly on distance metric to create neural network that creates more characteristic embedding
- need a large dataset before DNN approach exceeded the ivector baseline
- uses US phone data with 102K speaker data
- 2 network - one for generating speaker embedding and another for maximizing log prob of same speaker pair
- "curriculum" learning of training on long durations then short durations works better
- Custom objective function with PLDA inspired distance metrics

Q:
   - How well do these results generalize across same speaker but different languages?
   - DNN + PLDA seems to work better everytime?

## 2017-07
### http://xgboost.readthedocs.io/en/latest/model.html
keywords: boosted trees, random trees
- random forest and tree ensemble are the same except in how they are trained


### Deep Learning for Hate Speech Detection in Tweets
keywords: glove, fasttext, hate speech, GBDT (gradient boosted decision trees)
- network architecture experiment with various embedding
- random embedding
- task specific embedding/feature vector useful as input to downstream system
- (LSTM + Random Embedding + GBDT) is much better than (CNN + Random Embedding + GBDT)
Q:
    - what does random embedding mean exactly? Why does it work better?
    - How popular DNN + GBDT architecture?


### A time delay neural network architecture for efficient modeling of long temporal contexts
keywords: subsampling, dnn,
- basically just dilated cnn without the convolution - ie fully connected
- [-2,2] means {-2, -1, 0, 1, 2}
- asymmetric input splicing - more frames from the past (up to 16 frames) and future (up to 9 frames); more frames prove to be detrimental to word recognition accuracies
Q:
    - Is TDNN similar to dilation CNN?
    - What is the sampling rate


### Maxout Network Summary
from: http://www.simon-hohberg.de/2015/07/19/maxout.html
- a form activiation designed for dropout

### deep neural networks for small footprint text-dependent speaker verification

### Deep Speaker Feature Learning for Text-independent Speaker Verification
keywords: SR, speaker feature vector
- experiments suggests speaker feature is a short time phenomenon; achieves ERR of 7.68% from 300ms of frame
- uses 2 layer CNN with maxpooling plus TDNN with p norm activation function
- trained with 5000 speakers
- uses tsne to verify speaker cluster well

Q:
    - Is TDNN similar to dilation CNN?
    - How will the network perform with ReLU instead?
    - Why did keras remove maxout dense layer?
    - Is maxout dense basically maxpooling?

### A Simple Way to Initialize Recurrent Networks of Rectified Linear Units
keywords: identity matrix, rnn, lstm
- using identity matrix initialization for RELU RNN works well with little tuning

### MultiScale Context Aggregation by Dilated Convolution
keywords: dilated, convolution, segmentation, dense prediction
- aggregates multiscale information without pooling or sampling
- exponetial increase of receptive field with increasing dilation
- F_i_+_1 = F_i * 2^i * ki
- standard intiailzation didn't show improvement; uses a form of identity intialization
- applied context module to a frontend of adapated VGG16 without last pooling and striding(?) layers
- context module improved semantic segmentation task


### Denoising with wavent
keywords: noncausal dilated convolution, raw signal,
- energy preserving loss based on receptive field rather than a single sample

### squeeze net
keywords: deep compression, small model
summary: efficient model microarchitecture for building small and competitive image recognition models
- less 5MB,
- uses Fire module defined by s11, e11, e33
- expander and squeeze sub components
- competitive and 50x less parameters than alexnets

### multi-scale context aggregation by dilated convolutions
keywords: dilated convolution, segmentation, dense prediction
- using dilated convolution to segment images
- identity reinitialization needed to improve accuracy
- combination with CRF-RNN improves accuracy further
- experiments suggest no good reason to downsample and then upsample - adds complexity and hurts accuracy
to explore: structured prediction, CRF-RNN


## 2017-06
### [Layer normalization]()
- batch normalization adapted to RNN

### [Attention Is All You Need]()
keywords: transformer, self attention, multi-head attention, encoder-decoder
- eschews RNN and CNN and uses positional embedding to provide positional information
- composes feed forward NN exclusively with attention to learn representation between input and output
- transformer model architecture [picture]
- multi head attention
? good for seq2seq tasks

### [Label Smoothing]()
- a form of regularization that penalizes low entropy predictions
