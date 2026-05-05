import { useState } from "react";
import Input from "../input";
import DataInfoDisplay from "./DataInfoDisplay";
import SpatialPredicateControls from "./SpatialPredicateControls";
import DomainControls from "./DomainControls";
import HeightControls from "./HeightControls";
import TemporalPredicateControls from "./TemporalPredicateControls";
import AggregationControls from "./AggregationControls";
import FiltersControls from "./FilterControls";
import SidebarButtons from "./SidebarButtons";
import QueryLogDisplay from "./QueryLogDisplay";
import { VARIABLES_BY_DATASET, DATASETS, HEIGHTS} from "../../constants/data";
import "../../styles/sidebar.css";
import "../../styles/loading.css";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect } from "react";

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
  useEffect(() => {
    setVariable(""); // or null
  }, [dataset]);

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
            options={VARIABLES_BY_DATASET[dataset] || []}
            varLabel="variable"
          />
        </AccordionDetails>
      </Accordion>

      {dataset === "ERA5" && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="accordion-title">Coordinates</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SpatialPredicateControls formData={formData} handleChange={handleChange} />
          </AccordionDetails>
        </Accordion>
      )}

      {dataset === "CARRA" && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="accordion-title">Domain</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DomainControls formData={formData} handleChange={handleChange} />
          </AccordionDetails>
        </Accordion>
      )}

      {dataset === "CARRA" && (
        <Accordion>
          <AccordionSummary >
            <Typography className="accordion-title">Height</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <HeightControls formData={formData} handleChange={handleChange} />
          </AccordionDetails>
        </Accordion>
      )}

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
