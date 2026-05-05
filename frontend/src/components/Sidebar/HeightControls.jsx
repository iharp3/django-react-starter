import RadioButtonsRow from "../RadioRow";

const HeightControls = ({ formData, handleChange }) => (
  <div className="control_section">
    <RadioButtonsRow
      options={["15 meters", "30 meters"]}
      var={formData.height}
      setVal={handleChange}
      subLabel="height"
      defaultValue="15 meters"
    />
  </div>
);

export default HeightControls;