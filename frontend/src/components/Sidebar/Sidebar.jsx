import { useState } from "react";
import Input from "../input";
import DataInfoDisplay from "./DataInfoDisplay";
import SpatialPredicateControls from "./SpatialPredicateControls";
import TemporalPredicateControls from "./TemporalPredicateControls";
import AggregationControls from "./AggregationControls";
import FiltersControls from "./FilterControls";
import SidebarButtons from "./SidebarButtons";
import QueryLogDisplay from "./QueryLogDisplay";
import { VARIABLES, DATASETS} from "../../constants/data";
import "../../styles/sidebar.css";
import "../../styles/loading.css";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const Sidebar = ({
  setComparisonVal,
  setPredicate,
  dataset,
  setDataset,
  variable,
  setVariable,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  formData,
  handleChange,
  queryData,
  isLoading,
  queryLog,
  showQueryLog,
  setShowQueryLog,

  sidebarCollapsed,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  if (sidebarCollapsed) {
    return null;
  }

  return (
    <>
      <div className="title_container">
        <p>POLARIS</p>
      </div>

      <div className="subtitle_container">
        Interactive and Scalable Interface for Polar Science
      </div>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="accordion-title">Dataset</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Input
          val={dataset}
          setVal={setDataset}
          options={DATASETS}
          varLabel="dataset"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="accordion-title">Variable</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Input
            val={variable}
            setVal={setVariable}
            options={VARIABLES}
            varLabel="variable"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="accordion-title">Spatial Predicate</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SpatialPredicateControls formData={formData} handleChange={handleChange} />
        </AccordionDetails>
      </Accordion>

      <Accordion >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="accordion-title">Temporal Predicate</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TemporalPredicateControls
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            formData={formData}
            handleChange={handleChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="accordion-title">Aggregation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AggregationControls formData={formData} handleChange={handleChange} />
        </AccordionDetails>
      </Accordion>

      <Accordion >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="accordion-title">Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FiltersControls
            formData={formData}
            setPredicate={setPredicate}
            setComparisonVal={setComparisonVal}
          />
        </AccordionDetails>
      </Accordion>

      <SidebarButtons
        isLoading={isLoading}
        queryData={queryData}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        showQueryLog={showQueryLog}
        setShowQueryLog={setShowQueryLog}
      />

      {/* Render Query Log overlay inside Sidebar */}
      <QueryLogDisplay
        showLog={showQueryLog}
        setShowLog={setShowQueryLog}
        queryLog={queryLog}
      />

      <DataInfoDisplay showInfo={showInfo} setShowInfo={setShowInfo} />
    </>
  );
};

export default Sidebar;
