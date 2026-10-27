import { StyleProp, ViewStyle } from "react-native";
import SelectField from "./SelectField";

interface props {
    onChange: (value: any) => void,
    value: string | null,
    semesters: string[],
    style?: StyleProp<ViewStyle>
}

export default function SemesterPicker({ onChange, value, semesters, style }: props) {
    return (
        <SelectField
            value={value ?? ''}
            options={semesters.map(semester => ({ label: semester, value: semester }))}
            onChange={onChange}
            placeholder="Semestre"
            style={style}
        />
    );
}
