import {formatDate} from "./utils";

export const forMatMixin = {
    filters: {
        format(value) {
            const date = new Date(value * 1000);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        }
    }
};
