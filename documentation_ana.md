# Setting up the project

### Clone the repository

        git clone https://github.com/iharp3/django-react-starter.git

### Create and activate a virtual environment

        cd django-react-starter
        bash init_venv.sh
        source venv/bin/activate

### Set up frontend and backend

[Backend]

        cd backend
        python manage.py makemigrations
        python manage.py migrate

[Frontend]

        cd ../frontend
        npm install --legacy-peer-deps

This next code will start a development server, which you can quit with CONTROL-C. Thus, you can run the code segment in a `tmux` session to keep your terminal window usable. If you start a `tmux` session, make sure you activate the virtual environment with `source venv/bin/activate`.

[Backend]

        cd ../backend
        python manage.py runserver
    
Coming back to your terminal from your `tmux` session or in a dufferent terminal:

[Frontend]

        cd frontend
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

<!-- # Editing the interface

Need to change for dropdown menu 

* App.jsx is the parent
* components are the children that pass information to the parent


Adding different plots to the tabs:
In three_plots.jsx
* import `NewPlot` (the name of the new plot) from the file you define it it: `./NewPlot`.
* add functions `handleNewPlot`, and `newPlotImage` inside `const Tabs = ({})`.

Inside each of the three panels: 
*  add a new tab inside the `<TabMui> </TabMui>` object.

                <Tab label="Plot Name" />

* add a custom tab panel that displays the plot inside the `</Box> </Box>` object.

                <CustomTabPanel value={tabNum[panel number]} index={[unique index=j]} {...a11yProps(j)}>
                <NewPlot
                    handleNewPlot={handleNewPlot} 
                    newPlotImage={newPlotImage} 
                    handleChange={setSecondAggMethod} <-- only if necessary
                    formData={formData} />
              </CustomTabPanel>

* add a property type for the `handleNewPlot` and `NewPlotImage` you added.

                handleNewPlot: PropTypes.func,
                newPlotImage: PropTypes.object, -->


# Thoughts on changing interface

* move the setSecondAggMethod, setComparisonVal, setPredicate objects to sidebar
* in App.jsx, change `formData.secondAgg = secondAgg;` to `handleChange={setSecondAggMethod} `(?) maybe???
* plot scripts (e.g. `FindArea.jsx`) have the inputs that need to be in the sidebar instead
* need to add the buttons to the sidebar and send them to App, then send the info to the bottom panel that will then send it to FindArea?

* need to change the variable names to the actual names
* nedd to change the temporal resolution names to the lower case names
* need to change the aggregation names to min mean max
* need to change the temporalAggregation and spatialAggregation component names in App etc. to tsAggregation


* figure out how to make each panel have a different starting default
* add CDS variable descriptions

