export const VARIABLE_ERA5 = [
  "2m_temperature", "total_precipitation", "surface_pressure",
  "sea_surface_temperature",
  "snow_depth", "snowfall", "snowmelt", "temperature_of_snow_layer",
  "ice_temperature_layer_1", "ice_temperature_layer_2",
  "ice_temperature_layer_3", "ice_temperature_layer_4",
];

export const VARABLE_CARRA = [
  "temperature", "pressure", "relative_humidity",
  "specific_cloud_ice_water_content", "specific_cloud_liquid_water_content",
  "wind_direction", "wind_speed",
];

export const VARIABLES = [
  "2m_temperature", "total_precipitation", "surface_pressure",
  "sea_surface_temperature",
  "snow_depth", "snowfall", "snowmelt", "temperature_of_snow_layer",
  "ice_temperature_layer_1", "ice_temperature_layer_2",
  "ice_temperature_layer_3", "ice_temperature_layer_4",
  "temperature", "pressure", "relative_humidity",
  "specific_cloud_ice_water_content", "specific_cloud_liquid_water_content",
  "wind_direction", "wind_speed",
]

export const VARIABLES_BY_DATASET = {
  ERA5: ["2m_temperature", "total_precipitation", "surface_pressure",
  "sea_surface_temperature",
  "snow_depth", "snowfall", "snowmelt", "temperature_of_snow_layer",
  "ice_temperature_layer_1", "ice_temperature_layer_2",
  "ice_temperature_layer_3", "ice_temperature_layer_4",],

  CARRA: ["temperature", "pressure", "relative_humidity",
  "specific_cloud_ice_water_content", "specific_cloud_liquid_water_content",
  "wind_direction", "wind_speed",],
};

export const DATASETS = [
  "ERA5", "CARRA",
]

export const DOMAINS = [
  "east_domain", "west_domain",
]

export const HEIGHTS = [
  "15_m", "30_m"
]

export const REGIONS = {
  Greenland: { North: 84, South: 58, West: -75, East: -10 },
  Alaska: { North: 72, South: 50, West: -170, East: -130 },
  Antarctica: { North: -60, South: -90, West: -180, East: 180 },
};

export const ADMINVARIABLES = [
  "2m temperature", "2m dewpoint temperature", "sea surface temperature", 
  "cloud base height", "total cloud cover",  "low cloud cover", "medium cloud cover", "high cloud cover", 
  "precipitation type", "large-scale precipitation fraction", "convective rain rate", "large scale rain rate",
  "snow depth", "snow albedo", "snow density", "snow evaporation", "snowmelt", "snowfall",
  "ice temperature layer 1", "ice temperature layer 2", "ice temperature layer 3", "ice temperature layer 4", 
  "inst. 10m wind gust", "neutral wind at 10m u-component", "neutral wind at 10m v-component", 
  "10m U wind component", "10m V wind component", "100m U wind component", "100m V wind component",   
  "surface solar radiation downwards", "surface latent heat flux", "surface net solar radiation", "surface net thermal radiation", "surface pressure",
  "volumetric soil water layer 1", "volumetric soil water layer 2", "volumetric soil water layer 3", "volumetric soil water layer 4", 
  "soil temperature level 1", "soil temperature level 2", "soil temperature level 3", "soil temperature level 4", 
  "leaf area index, low vegetation", "leaf area index high vegetation", 
];