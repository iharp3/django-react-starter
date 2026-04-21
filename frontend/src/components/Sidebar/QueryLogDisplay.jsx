import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const QueryLogDisplay = ({ showLog, setShowLog, queryLog }) => {
  if (!showLog) return null;

  // Helper function to convert predicates or filters to readable strings
  const formatPredicateArray = (arr) => {
    if (!arr || arr.length === 0) return "-";
    return arr
      .map(p => {
        if (typeof p === "string") return p;              // simple string
        if (p.label) return p.label;                      // if object has a label property
        return JSON.stringify(p);                         // fallback for objects
      })
      .join(", ");
  };

  return (
    <div className="data-info-overlay">
      <div className="data-info-content">
        <div className="data-info-header">
          <h2>Query Log</h2>
          <Button onClick={() => setShowLog(false)}>Close</Button>
        </div>
        <TableContainer component={Paper} style={{ maxHeight: "70vh", overflow: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Dataset</TableCell>
                <TableCell>Variable</TableCell>
                <TableCell>Spatial Predicates</TableCell>
                <TableCell>Temporal Predicates</TableCell>
                <TableCell>Aggregation</TableCell>
                <TableCell>Filters</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queryLog.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.timestamp}</TableCell>
                  <TableCell>{entry.dataset}</TableCell>
                  <TableCell>{entry.variable}</TableCell>
                  <TableCell>{entry.spatialPredicates.join(", ")}</TableCell>
                  <TableCell>{entry.temporalPredicates.join(", ")}</TableCell>
                  <TableCell>{entry.aggregation || "-"}</TableCell>
                  <TableCell>{entry.filters.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default QueryLogDisplay;


// // src/components/Sidebar/QueryLogDisplay.jsx
// import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// const QueryLogDisplay = ({ showLog, setShowLog, queryLog }) => {
//   if (!showLog) return null;

//   return (
//     <div className="data-info-overlay">
//       <div className="data-info-content">
//         <div className="data-info-header">
//           <h2>Query Log</h2>
//           <Button onClick={() => setShowLog(false)}>Close</Button>
//         </div>
//         <TableContainer component={Paper} style={{ maxHeight: "70vh", overflow: "auto" }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Time</TableCell>
//                 <TableCell>Variable</TableCell>
//                 <TableCell>Spatial Predicates</TableCell>
//                 <TableCell>Temporal Predicates</TableCell>
//                 <TableCell>Aggregation</TableCell>
//                 <TableCell>Filters</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {queryLog.map((entry, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{entry.timestamp}</TableCell>
//                   <TableCell>{entry.variable}</TableCell>
//                   <TableCell>{entry.spatialPredicates.join(", ")}</TableCell>
//                   <TableCell>{entry.temporalPredicates.join(", ")}</TableCell>
//                   <TableCell>{entry.aggregation}</TableCell>
//                   <TableCell>{entry.filters.join(", ")}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     </div>
//   );
// };

// export default QueryLogDisplay;
