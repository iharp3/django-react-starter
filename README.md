# django-react-starter

bash init_venv.sh 

# backend
python backend/manage.py makemigrations

python backend/manage.py migrate

# frontend

npm install --legacy-peer-deps

# backend

python backend/manage.py runserver

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

1. Default radio button: "day", "mean"
2. Larger font for radio button and region input
3. Remove unused query parameter from formData
4. A file for "RASTER DATA" tab, add download button to the tab
5. Time series need second aggregation
6. Heatmap need second aggregation
7. [api.views-INFO]: values