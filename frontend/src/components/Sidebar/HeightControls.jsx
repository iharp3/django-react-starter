import RadioButtonsRow from "../RadioRow";

const HeightControls = ({ formData, handleChange }) => (
  <div className="control_section">
    <RadioButtonsRow
      options={["15_m", "30_m"]}
      var={formData.height}
      setVal={handleChange}
      subLabel="height"
      defaultValue="15_m"
    />
  </div>
);

export default HeightControls;