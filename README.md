# django-react-starter

bash init_venv.sh

# backend
python manage.py makemigrations

python manage.py migrate

# frontend

npm install --legacy-peer-deps

# backend

python manage.py runserver

# frontend

npm run dev


# Build
npm run build

    # then copy /home/huan1531/django-react-starter/frontend/dist to /home/huan1531/django-react-starter/backend/frontend/dist

rm -rf /home/huan1531/django-react-starter/backend/frontend/dist

cp -r /home/huan1531/django-react-starter/frontend/dist /home/huan1531/django-react-starter/backend/frontend/dist

start backend with : python manage.py runserver 0.0.0.0:8000

tmux new -d -s django "python manage.py runserver 0.0.0.0:8000"

nohup python -u manage.py runserver 0.0.0.0:8000 > ../output.txt &

pgrep -a python

62932 python manage.py runserver 0.0.0.0:8000

kill 62932

# TODO
Deny request with large API calls
