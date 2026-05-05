import RadioButtonsRow from "../RadioRow";

const DomainControls = ({ formData, handleChange }) => (
  <div className="control_section">
    <RadioButtonsRow
      options={["West", "East"]}
      var={formData.domain}
      setVal={handleChange}
      subLabel="domain"
      defaultValue="East"
    />
  </div>
);

export default DomainControls;