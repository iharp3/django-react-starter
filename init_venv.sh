rm -rf venv

python3.12 -m venv venv

source venv/bin/activate

pip install --upgrade pip

##### Needed to run these lines once on Mac for venv to work #####
# brew install hdf5
# brew install netcdf
# export NETCDF4_DIR=$(brew --prefix netcdf)
# export C_INCLUDE_PATH=$NETCDF4_DIR/include:$C_INCLUDE_PATH
# export LIBRARY_PATH=$NETCDF4_DIR/lib:$LIBRARY_PATH
# export LD_LIBRARY_PATH=$NETCDF4_DIR/lib:$LD_LIBRARY_PATH
# brew install proj
# export PROJ_DIR=$(brew --prefix proj)
# export C_INCLUDE_PATH=$PROJ_DIR/include:$C_INCLUDE_PATH
# export LIBRARY_PATH=$PROJ_DIR/lib:$LIBRARY_PATH
# export LD_LIBRARY_PATH=$PROJ_DIR/lib:$LD_LIBRARY_PATH
# pip install --no-cache-dir pyproj
# pip install --no-cache-dir netcdf4


pip install --upgrade setuptools

pip install wheel

pip install -r requirements.txt
