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

copy /home/huan1531/django-react-starter/frontend/dist to /home/huan1531/django-react-starter/backend/frontend/dist

rm -rf /home/huan1531/django-react-starter/backend/frontend/dist

cp -r /home/huan1531/django-react-starter/frontend/dist /home/huan1531/django-react-starter/backend/frontend/dist

start backend with : python manage.py runserver 0.0.0.0:8000

tmux new -d -s django "python manage.py runserver 0.0.0.0:8000"

# TODO

1. Time series need second aggregation
2. Heatmap need second aggregation
3. Find time need second aggregation, predicate and input value
4. Find area need second aggregation, predicate and input value
5. Default radio button: "day", "mean"
6. Larger font for radio button and region input
7. Remove unused query parameter from formData
8. [api.views-INFO]: values