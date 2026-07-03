import api from './api';

const alertService = {
    getAlerts: async (inventoryId = null) => {
        const params = inventoryId ? { inventory_id: inventoryId } : {};
        const response = await api.get('/alerts/', { params });
        return response.data;
    }
};

export default alertService;
