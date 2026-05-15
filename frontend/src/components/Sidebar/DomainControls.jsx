import RadioButtonsRow from "../RadioRow";

const DomainControls = ({ formData, handleChange }) => (
  <div className="control_section">
    <RadioButtonsRow
      options={["west_domain", "east_domain"]}
      var={formData.domain}
      setVal={handleChange}
      subLabel="domain"
      defaultValue="east_domain"
    />
  </div>
);

export default DomainControls;