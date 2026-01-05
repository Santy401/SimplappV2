import { Client } from "../../Client.entity";

export interface ClientesProps {
    onSelect?: (view: string) => void;
    onSelectClient?: (client: Client) => void;
    onDeleteSuccess?: () => void;
}
