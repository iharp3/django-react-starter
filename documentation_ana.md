# Setting up the project

### Clone the repository

        git clone https://github.com/iharp3/django-react-starter.git

### Create and activate a virtual environment

        cd django-react-starter
        bash init_venv.sh
        source venv/bin/activate

### Set up frontend and backend

[Backend]

        cd django-react-starter/backend
        python manage.py makemigrations
        python manage.py migrate

[Frontend]

        cd django-react-starter/frontend
        npm install --legacy-peer-deps

This next code will start a development server, which you can quit with CONTROL-C. Thus, you can run the code segment in a `tmux` session to keep your terminal window usable. If you start a `tmux` session, make sure you activate the virtual environment with `source venv/bin/activate`.

[Backend]

        cd django-react-starter/backend
        python manage.py runserver
    
Coming back to your terminal from your `tmux` session or in a dufferent terminal:

[Frontend]

        cd django-react-starter/frontend
        npm run dev
    
This will give you a localhost domain/url that you can use to see the current website.

# Running the interface

The next time you need to initialize the localhost interface, use these commands:

Terminal 1:

        source venv/bin/activate
        cd django-react-starter/backend
        python manage.py runserver

Terminal 2:

        source venv/bin/activate
        cd django-react-starter/frontend
        npm run dev