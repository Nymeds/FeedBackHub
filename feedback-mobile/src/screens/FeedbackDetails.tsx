import AppPicker from "../components/AppPicker"
import { CATEGORIAS, STATUS } from "../utils/enums"



export default function FeedbackDetails() {
    return 
    <AppPicker
        control={control}
        name="status"
        label="Status"
        enumValues={STATUS}
        />
    
}