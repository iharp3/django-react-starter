# django-react-starter

## Initialize

Starting in the django-react-starter directory:

If virtual environment does not exist:
```bash 
bash init_venv.sh  
```

To activate virtual environment:
``` bash
source venv/bin/activate
```
To initiate a development server:
``` bash
cd backend
python manage.py makemigrations
python manage.py migrate

cd ../frontend
npm install --legacy-peer-deps

cd ../backend
python manage.py runserver
```
In a new terminal window, run:

``` bash
source venv/bin/activate

cd frontend
npm run dev
```
This will give you a local host link to view the current frontend.

**Quit the server with CONTROL-C**

<!-- ## Build
``` bash
npm run build

cp /home/huan1531/django-react-starter/frontend/dist /home/huan1531/django-react-starter/backend/frontend/dist

rm -rf /home/huan1531/django-react-starter/backend/frontend/dist

cp -r /home/huan1531/django-react-starter/frontend/dist /home/huan1531/django-react-starter/backend/frontend/dist

start backend with : python manage.py runserver 0.0.0.0:8000

tmux new -d -s django "python manage.py runserver 0.0.0.0:8000"

nohup python -u manage.py runserver 0.0.0.0:8000 > ../output.txt &

pgrep -a python

62932 python manage.py runserver 0.0.0.0:8000

kill 62932
``` -->

## TODO
1. Deny request with large API calls
   * calculate total time slices
   * calculate total spatial region size
   * deny if greater than some value, and give notice if you are going to download it in smaller chunks

2. Fix the warning that occurs when running `python manage.py makemigrations`:

        <!-- System check identified some issues:

        WARNINGS:
        ?: (staticfiles.W004) The directory '~/django-react-starter/backend/frontend/dist/assets' in the STATICFILES_DIRS setting does not exist.
        Migrations for 'api':
        api/migrations/0001_initial.py
            + Create model FindAreaModel
            + Create model FindTimeModel
            + Create model GetRasterQueryModel
            + Create model HeatmapQueryModel
            + Create model TimeseriesQueryModel -->

3. Fix the warning that occurs when running `npm install --legacy-peer-deps`:

        <!-- Redundant dependency in your project.

        added 599 packages, and audited 600 packages in 37s

        129 packages are looking for funding
        run `npm fund` for details

        12 vulnerabilities (2 low, 7 moderate, 3 high)

        To address all issues, run:
        npm audit fix

        Run `npm audit` for details. -->
