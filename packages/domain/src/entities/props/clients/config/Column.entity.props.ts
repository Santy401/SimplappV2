import { Client } from "../../../Client.entity";

export interface ColumnsProps {
    onSelect?: (view: string) => void;
    onSelectClient?: (client: Client) => void;
}