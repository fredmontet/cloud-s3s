

# Using Python virtual environnement cheat sheet

## Why is it nice?
virtualenv is a tool to create closed python environnement. Because in a virtualenv you won't alter your computer python environnement, it is therefore really usefull for dev purposes.

## Install virtualenv

    pip install virtualenv


## Create a python virtualenv

    cd my_project_folder
    virtualenv <myvirtualenvname>

Or you can use the interpreter you like:

    virtualenv -p /usr/bin/python2.7 <myvirtualenvname>


## Activate python virtuelenv

    source env/bin/activate

When working within a virtual environment, python will automatically refer to the correct version so you can use python instead of python3.

your cli will be prefixed this way:

    (<myvirtualenvname>)Your-Computer:your_project UserName$)


## Installing packages in the virtualenv

    pip install <package>


## Deactivate python virtualenv

    deactivate


## Share virtualenv setup

Write all the virtual environnement packages in requirements.txt

    pip freeze > requirements.txt

This command will install all the same packages

    pip install -r requirements.txt










