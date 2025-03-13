rm -rf venv

python3.12 -m venv venv

source venv/bin/activate

pip install --upgrade pip

##### Needed to run these lines once on Mac for venv to work #####
# brew install hdf5                                                                         ### trying to get hdf5 to work
# brew install netcdf
# export NETCDF4_DIR=$(brew --prefix netcdf)
# export C_INCLUDE_PATH=$NETCDF4_DIR/include:$C_INCLUDE_PATH
# export LIBRARY_PATH=$NETCDF4_DIR/lib:$LIBRARY_PATH
# export LD_LIBRARY_PATH=$NETCDF4_DIR/lib:$LD_LIBRARY_PATH
# brew install proj                                                                         ### trying to get proj to work    
# export PROJ_DIR=$(brew --prefix proj)
# export C_INCLUDE_PATH=$PROJ_DIR/include:$C_INCLUDE_PATH
# export LIBRARY_PATH=$PROJ_DIR/lib:$LIBRARY_PATH
# export LD_LIBRARY_PATH=$PROJ_DIR/lib:$LD_LIBRARY_PATH
# pip install --no-cache-dir pyproj
# pip install --no-cache-dir netcdf4
# curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash         ### trying to get npm to work
# source ~/.zshrc
# nvm install --lts
# export PATH=$HOME/.npm-global/bin:$PATH
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# nvm use --lts

pip install --upgrade setuptools

pip install wheel

pip install -r requirements.txt
