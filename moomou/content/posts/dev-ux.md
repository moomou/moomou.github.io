---
title: "Dev UX"
date: 2017-08-22T23:01:25-07:00
draft: false
---

<!--
Outline
    Describe the pitfall of lack of automation
    Share the benefit of automation
    Show it is easy to get started
    Describe your setup of Fire for a centralized one commandline swiss army knife
-->


## Commandline Productivity and Automation (aka make it easy to repeat)

Developers tend to repeat themselves. A lot. This can be as innocuous as running a test manually after you update a test file or as insidious as deploying a newly built binary into production manually. Nobody likes to repeat themselves over and over again. And for good reasons. Not only does it take time to repeatedly figure all the parameters in a tricky command line program, it also increases stress when you are trying to fix outages as quickly as possible.

The obvious solution to these problems is of course automation. But more or often than not, I can convince myself whatever I am doing is a one off or occurs infrequently enough so is no need for automation. Finally sensing this is slowing down my productivity, I decided to start automating as much as possible, no matter how small.

In this post, I will share 2 broad automation strategies I have followed. First, automating via simple shell scripts. Second, creating a Swiss army knife to help make automation easier while keeping boilerplates to a minimum.

### Simple shell scripts

Creating a shell script is the simplest form of automation and arguably also the most effective with immediate productivity gain. After some experimentation, I devised and follow a simple rule: if I need to type more 3 parameters to invoke a complicated command on the shell, I will write a shell script. This simple stratgey saves me time and also gives me a place to document various parameters.

As a concrete example, I have been writing `build_container.sh` and `run_container.sh` to help streamline my Docker workflow.

```
# build_container.sh
#!/bin/sh -xe

docker build -t $1 .
# removes <none> images
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
```

```
# run_container.sh
#!/bin/sh -xe

docker run \
    -p 9000:9000 \
    -v REPO_PATH:/CONTAINER_ROOT/REPO_PATH \
    sample_image \
    bash
```

As an added bonus, I have been learning more about shell programming (and all its quirks!) as I am writing more of these scripts.

### Swiss army knife

While automating with one off shell scripts for each specialized task is effective, the effort tend to be duplicated across repos and boilerplates start to add up, leading to increased tech debts and overall increase in complexity.

To overcome this, I stole the idea of `s`, a Swiss army knife command line tool, from Smyte. Succinctly, `s` is a collection of scripts that automates various developer tasks, including deployment, remote server automation, running tests, compilation, and myraids of other things. More than a collection of scripts, `s` provides a common framework to centralize tool development and minimizes boilerplates.

Some sample `s` invocation
```
# running tests
s test.run ABC

# deploying code
s deploy.roll --commit ABC
```

I called my own tool `m`. To bootstrap `m`, I use [python-fire](https://github.com/google/python-fire) from Google. `python-fire` is an amazing python library that will turn any python script into a command line program with minimum fuzz and handles command line arguments in a intuitive manner.

One of the major downside of `s` as implemented at Smyte is speed - importing modules in python is not free and these add up as more and more scripts gets added. In `m`, I address this by loading dependencies only at invocation of each subcommand. Doing this has allowed to me to keep top level `m` invocation at ~250ms on my 2013 Mac Air.

You can checkout `m` at https://github.com/moomou/dotfiles/tree/master/m.


### Conclusion
Developer experience , while effective, tend to bogged down by boilerplates and sometimes complex workflow as easy as possible to perform has not only increased my personal productivity, it has also made me enjoy progrmaming more.

It takes a huge mental effort to do anything that is not easy.

In order to deal with any of this
