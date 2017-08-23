Convolution Math
i,k, s, p

#Re1: For any i, k, s = 1, p = 0
o = (i - k) + 1
#Rel2: For any i, k, p, s = 1
o = (i + 2p - k) + 1

#Half Padding or Same Padding - ie maintains same size
For s = 1, choose k and p s.t
k = 2n + 1, n e= N
p = floor(k/2) = n
o = i + 2p - k + 1 = i + 2p - (k + 1) = i + 2n - 2n = i

#Full Padding - increases output size
For s = 1, choose k and p s.t
p = k - 1
o = i + 2p - k + 1 = i + 2(k - 1) -k + 1 = i + k - 1

# No zero padding non-unit strides
For any i, k, s, and p = 0
o = floor((i - k) / s) + 1

# Zero padding, non unit strides
For any i, k, p, s
o = floor((i + 2p - k) / s) + 1

Devconvolution Math
#Rel1
Given a convolution s = 1, p = 0, k, the transposed convolution is
k' = k
s' = s
p' = k - 1
o' = i' + (k - 1)

#Zero padding, unit stride, transposed
Convolution with s = 1, k, p, transposed convolution is
k' = k
s' = s
p' = k - p - 1
o' = i' + (k - 1) - 2p

#Half padding, transposed
Convolution with k = 2n + 1, s = 1, p = floor(k/2), transposed convolution is
k' = k
s' = s
p' = p
o' = i' + (k - 1) - 2p
o' = i' + (2n + 1 - 1) - 2n
o' = i'

#Full padding, transposed
Convolution with s = 1, k, p = k - 1, transposed convolution is
k' = k
s' = s
p' = 0
o' = i' + (k - 1) - 2p
o' = i' - (k - 1)

#No zero padding (p = 0), s > 1, transposed
Assume i - k is multiple of s
Convolution with p = 0, k, s, transposed convolution is
k' = k
s ' = 1
p' = k - 1
i'' = s - 1 zero padding inserted between inputs
o' = s(i' - 1) + k

#Zero padding, s > 1, transposed
Assume i + 2p - k is multiple of s
k' = k
s' = 1
p' = k - p - 1
i'' = s - 1 zero padding inserted between inputs
o' = s(i' - 1) + k - 2p

#Zero padding, s > 1, transposed
Without assuming i + 2p - k is multiple of s, and provided a = (i + 2p - k) % s
o' = s(i' - 1) + a + k - 2p
